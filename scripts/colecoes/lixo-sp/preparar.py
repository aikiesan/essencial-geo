"""
Coleção «Para onde vai o lixo» (SP) — prepara os dados de uma prancha (uso interno).

    .venv-geo/Scripts/python -I -X utf8 scripts/colecoes/lixo-sp/preparar.py conferir|fluxos|distancia|aterros

Saídas: mapas/<pasta>/dados/<base>.gpkg.zip (com estilos do QGIS), <base>.csv
e scripts/colecoes/cache/lixo-sp-<tema>.json (para a prancha e a ficha).

A tabela vem do anexo do «Inventário Estadual de Resíduos Sólidos Urbanos 2023» da CETESB (enquadramento
dos municípios em ordem alfabética: agência, UGRHI, RSU em t/dia, IQR 2022 e 2023, «dispõe em»), lida com o
pdftotext do xpdf no modo -table. As sedes municipais são as localidades do IBGE (2022).
"""

from __future__ import annotations

import argparse
import json
import re
import shutil
import subprocess
import sys
import tempfile
import unicodedata
from pathlib import Path
from xml.sax.saxutils import quoteattr

import geopandas as gpd
import numpy as np
import pandas as pd
from pyproj import Geod
from shapely.geometry import LineString

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from comum import (  # noqa: E402
    GEO, RAIZ, TINTA, estilo_contorno, estilo_regras, gravar_cache, gravar_estilos, igual, malha_uf, marcador,
    zipar,
)
from estilos import preenchimento, props, rgba  # noqa: E402

SERIE = {s["tema"]: s for s in json.loads((Path(__file__).parent / "serie.json").read_text(encoding="utf-8"))}
PDF = RAIZ / "dados-brutos" / "cetesb" / "inventario-rsu-2023.pdf"
LOCALIDADES = RAIZ / "dados-brutos" / "ibge-localidades" / "Localidades_Brasil_gpkg.zip"
SIGA_CSV = RAIZ / "scripts" / "colecoes" / "cache" / "downloads" / "aneel_siga" / "siga-empreendimentos-geracao.csv"
GEOD = Geod(ellps="GRS80")

# Totais impressos no relatório (p. 13 e 16), para conferir a leitura do anexo.
TOTAL_T_DIA = 39_038.08       # t/dia dispostas em SP (sem os municípios que dispõem em outros estados)
ADEQUADO_T_DIA = 38_402.69
INADEQUADO_T_DIA = 635.39
MUNICIPIOS_ADEQUADOS, MUNICIPIOS_INADEQUADOS = 604, 32
FORA_DO_ESTADO = {"Andradina", "Aramina", "Arapeí", "Bananal", "Buritizal", "Ituverava", "Jeriquara", "Mirandópolis", "Ribeira"}
LIMITE_IQR = 7.0  # 0 a 7,0 inadequado; 7,1 a 10 adequado

# Nomes da CETESB que não batem com a Malha Municipal (grafia antiga ou abreviada).
APELIDOS = {
    "EMBUDASARTESSANTANAPARNA": "EMBUDASARTES",
    "SAOLUISDOPARAITINGA": "SAOLUIZDOPARAITINGA",
}


def chave(s: str) -> str:
    """Nome sem acento, caixa, espaço e pontuação: «Rio das Pedras» e «RiodasPedras» dão a mesma chave."""
    s = unicodedata.normalize("NFD", s)
    s = "".join(c for c in s if not unicodedata.combining(c))
    k = re.sub(r"[^A-Z0-9]", "", s.upper())
    return APELIDOS.get(k, k)


def _num(s: str | None) -> float | None:
    return None if s is None else float(s.replace(".", "").replace(",", "."))


# ------------------------------------------------------------------ leitura do anexo
_PRIV = re.compile("[-]")  # marcas de licença do transbordo (fonte de símbolos)
_LINHA = re.compile(
    r"^\s{5,}(?P<nome>[A-ZÀ-Ý][A-ZÀ-Ý' \-\.]*?)\s{2,}(?P<agencia>\S.*?)\s{2,}(?P<ugrhi>\d{1,2})\s+"
    r"(?P<rsu>\d+(?:\.\d{3})*,\d+)(?P<resto>.*)$"
)
_IQR = re.compile(r"(?<![\d,])\d{1,2},\d{1,2}(?![\d,])")
_DESTINO = re.compile(r"^(?P<mun>.+?)\s*-\s*(?P<suf>A\.?\s*P\.?|CDR|MS|MG|RJ|SC|PR)$")


def anexo() -> pd.DataFrame:
    """Uma linha por registro do anexo (alguns municípios dividem o lixo entre dois destinos e têm duas)."""
    exe = shutil.which("pdftotext")
    assert exe, "pdftotext (xpdf 4) não encontrado no PATH"
    with tempfile.TemporaryDirectory() as tmp:
        saida = Path(tmp) / "inventario.txt"
        subprocess.run([exe, "-table", "-enc", "UTF-8", "-eol", "unix", str(PDF), str(saida)], check=True)
        texto = saida.read_text(encoding="utf-8")
    ini = texto.index("EM ORDEM ALFABÉTICA, QUANTO ÀS CONDIÇÕES\n\nAMBIENTAIS DOS ATERROS DE DESTINO")
    fim = texto.index("AMBIENTAIS DAS USINAS DE COMPOSTAGEM - IQC", ini)
    linhas = []
    for pagina in texto[ini:fim].split("\f"):
        regs = []
        for l in pagina.split("\n"):
            m = _LINHA.match(l)
            if not m:
                continue
            resto = _PRIV.sub(" ", m["resto"])
            notas = [(x.group(), m.start("resto") + x.start()) for x in _IQR.finditer(resto) if x.start() < 30]
            depois = resto[resto.index(notas[-1][0], notas[-1][1] - m.start("resto")) + len(notas[-1][0]):] if notas else resto
            # O que sobra é o destino seguido das marcas de licença do transbordo («-»).
            toks = depois.split()
            while toks and len(toks[-1]) == 1:  # «-» e letras soltas das colunas LI e LO
                toks.pop()
            destino = " ".join(toks).strip()
            regs.append({"nome_cetesb": m["nome"].strip(), "agencia": m["agencia"].strip(), "ugrhi": int(m["ugrhi"]),
                         "rsu_t_dia": _num(m["rsu"]), "notas": notas, "dispoe_em": destino})
        # Com uma nota só (quem dispôs fora do estado num dos anos), a coluna é a mais próxima das duas
        # posições médias da página.
        duplas = [r["notas"] for r in regs if len(r["notas"]) == 2]
        if duplas:
            c22 = np.mean([d[0][1] for d in duplas])
            c23 = np.mean([d[1][1] for d in duplas])
        for r in regs:
            n = r.pop("notas")
            r["iqr_2022"] = r["iqr_2023"] = None
            if len(n) == 2:
                r["iqr_2022"], r["iqr_2023"] = _num(n[0][0]), _num(n[1][0])
            elif len(n) == 1:
                col = "iqr_2022" if abs(n[0][1] - c22) < abs(n[0][1] - c23) else "iqr_2023"
                r[col] = _num(n[0][0])
            linhas.append(r)
    return pd.DataFrame(linhas)


# ------------------------------------------------------------------ municípios e sedes
def sedes() -> gpd.GeoDataFrame:
    """Sedes municipais (localidades do IBGE, 2022), de todo o país."""
    g = gpd.read_file(f"zip://{LOCALIDADES}!BR_localidades_2022.gpkg", engine="pyogrio",
                      where="SCT_LOCALIDADE = 'Sede Municipal'")
    return g[["CD_MUN", "NM_MUN", "SIGLA_UF", "geometry"]].to_crs(GEO).set_index("CD_MUN")


def base() -> tuple[pd.DataFrame, gpd.GeoDataFrame, gpd.GeoDataFrame]:
    """(registros com origem e destino codificados, municípios de SP, sedes do país)."""
    r = anexo()
    m = malha_uf("SP")
    sd = sedes()
    porchave = {chave(n): cd for cd, n in zip(m["CD_MUN"], m["NM_MUN"])}
    r["cd_mun"] = r["nome_cetesb"].map(lambda n: porchave.get(chave(n)))
    faltam = r.loc[r["cd_mun"].isna(), "nome_cetesb"].tolist()
    assert not faltam, f"sem código IBGE: {faltam}"

    fora = {(chave(n), uf): cd for cd, n, uf in zip(sd.index, sd["NM_MUN"], sd["SIGLA_UF"])}

    nomes = dict(zip(m["CD_MUN"], m["NM_MUN"]))

    def destino(linha_) -> tuple[str, str, str]:
        """(código IBGE do município de destino, tipo, local de destino com o nome do IBGE e o sufixo da CETESB)."""
        d = linha_.dispoe_em
        if not d:
            return linha_.cd_mun, "proprio", ""
        m_ = _DESTINO.match(d)
        mun, suf = (m_["mun"], m_["suf"].replace(" ", "")) if m_ else (d, "")
        if suf in ("MS", "MG", "RJ", "SC", "PR"):
            cd = fora[(chave(mun), suf)]
            return cd, "outro_estado", f"{sd.at[cd, 'NM_MUN']} - {suf}"
        cd = porchave.get(chave(mun))
        assert cd, f"destino sem código: {d!r}"
        suf = {"AP": "A.P."}.get(suf, suf)
        return cd, "particular" if suf else "publico", f"{nomes[cd]} - {suf}" if suf else nomes[cd]

    dd = [destino(x) for x in r.itertuples()]
    r["cd_destino"] = [d[0] for d in dd]
    r["tipo_destino"] = [d[1] for d in dd]
    r["local_destino"] = [d[2] for d in dd]
    r["local"] = r["cd_destino"] == r["cd_mun"]
    o = sd.loc[r["cd_mun"]].geometry.values
    d = sd.loc[r["cd_destino"]].geometry.values
    _, _, dist = GEOD.inv([p.x for p in o], [p.y for p in o], [p.x for p in d], [p.y for p in d])
    r["km_reta"] = np.round(np.asarray(dist) / 1000, 1)
    r["t_km_dia"] = (r["rsu_t_dia"] * r["km_reta"]).round(1)
    r["nm_mun"] = r["cd_mun"].map(dict(zip(m["CD_MUN"], m["NM_MUN"])))
    r["nm_destino"] = r["cd_destino"].map(sd["NM_MUN"])
    r["uf_destino"] = r["cd_destino"].map(sd["SIGLA_UF"])
    return r, m, sd


def conferir(r: pd.DataFrame) -> dict:
    """Confere a leitura com os totais impressos no relatório; devolve os totais para o cache."""
    sp = r[r["iqr_2023"].notna()]
    tot = sp["rsu_t_dia"].sum()
    ade = sp.loc[sp["iqr_2023"] > LIMITE_IQR, "rsu_t_dia"].sum()
    ina = sp.loc[sp["iqr_2023"] <= LIMITE_IQR, "rsu_t_dia"].sum()
    pior = sp.groupby("cd_mun")["iqr_2023"].min()
    fora = set(r.loc[r["tipo_destino"] == "outro_estado", "nm_mun"])
    print(f"registros {len(r)} · municípios {r['cd_mun'].nunique()} · fora do estado {sorted(fora)}")
    print(f"t/dia em SP {tot:.2f} (relatório {TOTAL_T_DIA}) · adequado {ade:.2f} ({ADEQUADO_T_DIA}) · "
          f"inadequado {ina:.2f} ({INADEQUADO_T_DIA})")
    print(f"municípios adequados {(pior > LIMITE_IQR).sum()} ({MUNICIPIOS_ADEQUADOS}) · inadequados "
          f"{(pior <= LIMITE_IQR).sum()} ({MUNICIPIOS_INADEQUADOS})")
    assert r["cd_mun"].nunique() == 645
    assert fora == FORA_DO_ESTADO, fora
    assert abs(tot - TOTAL_T_DIA) < 0.05 and abs(ade - ADEQUADO_T_DIA) < 0.05 and abs(ina - INADEQUADO_T_DIA) < 0.05
    assert (pior > LIMITE_IQR).sum() == MUNICIPIOS_ADEQUADOS and (pior <= LIMITE_IQR).sum() == MUNICIPIOS_INADEQUADOS
    # A nota é do aterro: todos os municípios que levam o lixo ao mesmo local têm a mesma.
    dif = sp[sp["local_destino"] != ""].groupby("local_destino")["iqr_2023"].nunique()
    print("locais com mais de uma nota:", dif[dif > 1].to_dict())
    return {"t_dia_sp": round(float(tot), 2), "t_dia_adequado": round(float(ade), 2), "t_dia_inadequado": round(float(ina), 2),
            "t_dia_total": round(float(r["rsu_t_dia"].sum()), 2), "t_dia_fora": round(float(r.loc[r["tipo_destino"] == "outro_estado", "rsu_t_dia"].sum()), 2),
            "municipios_adequados": int((pior > LIMITE_IQR).sum()), "municipios_inadequados": int((pior <= LIMITE_IQR).sum()),
            "municipios_fora": sorted(fora)}




# ------------------------------------------------------------------ peças comuns
def gravar(tema: str, camadas: dict[str, gpd.GeoDataFrame], estilos: dict, csv: pd.DataFrame) -> dict:
    s = SERIE[tema]
    destino = RAIZ / "mapas" / s["pasta"] / "dados"
    destino.mkdir(parents=True, exist_ok=True)
    gpkg = destino / f"{s['base']}.gpkg"
    gpkg.unlink(missing_ok=True)
    for camada, gdf in camadas.items():
        gdf.to_file(gpkg, layer=camada, driver="GPKG", engine="pyogrio")
    gravar_estilos(gpkg, estilos)
    z = zipar(gpkg)
    arq_csv = destino / f"{s['base']}.csv"
    csv.to_csv(arq_csv, index=False, encoding="utf-8")
    return {z.name: z.stat().st_size, arq_csv.name: arq_csv.stat().st_size}


def linha_expr(cor: str, largura: float, expr: str, alfa: float = 0.6) -> str:
    """SimpleLine com a largura (mm) dada por expressão do QGIS (fluxos proporcionais)."""
    d = {"line_color": rgba(cor, alfa), "line_width": largura, "line_width_unit": "MM", "line_style": "solid",
         "capstyle": "round", "joinstyle": "round", "use_custom_dash": 0}
    dd = ('<data_defined_properties><Option type="Map"><Option name="name" value="" type="QString"/>'
          '<Option name="properties" type="Map"><Option name="outlineWidth" type="Map">'
          '<Option name="active" value="true" type="bool"/>'
          f'<Option name="expression" value={quoteattr(expr)} type="QString"/>'
          '<Option name="type" value="3" type="int"/></Option></Option>'
          '<Option name="type" value="collection" type="QString"/></Option></data_defined_properties>')
    return f'<layer class="SimpleLine" enabled="1" locked="0" pass="0">{props(d)}{dd}</layer>'


def limite_estadual(m: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    return m.assign(uf="SP").dissolve(by="uf", as_index=False)[["uf", "geometry"]]


def coord(p) -> list[float]:
    return [round(p.x, 4), round(p.y, 4)]


def por_municipio(r: pd.DataFrame) -> pd.DataFrame:
    """Uma linha por município: lixo gerado, destinos, distância média por tonelada, t·km e a nota do aterro.

    Nos quatro municípios com dois destinos, a nota é a pior das duas (é assim que a CETESB conta os 604
    adequados e os 32 inadequados) e a distância é a média ponderada pelas toneladas.
    """
    g = r.groupby("cd_mun")
    mu = pd.DataFrame({
        "NM_MUN": g["nm_mun"].first(), "agencia": g["agencia"].first(), "ugrhi": g["ugrhi"].first(),
        "rsu_t_dia": g["rsu_t_dia"].sum().round(2),
        "destinos": g["local_destino"].apply(lambda x: " + ".join(v if v else "próprio município" for v in x)),
        "n_destinos": g.size(),
        "t_fora_dia": r[~r["local"]].groupby("cd_mun")["rsu_t_dia"].sum().round(2),
        "t_km_dia": g["t_km_dia"].sum().round(1),
        "iqr_2022": g["iqr_2022"].min(), "iqr_2023": g["iqr_2023"].min(),
        "outro_estado": g["tipo_destino"].apply(lambda x: bool((x == "outro_estado").any())),
    })
    mu["t_fora_dia"] = mu["t_fora_dia"].fillna(0.0)
    mu["exporta"] = mu["t_fora_dia"] > 0
    mu["km_medio"] = (mu["t_km_dia"] / mu["rsu_t_dia"]).round(1)
    mu["enquadramento"] = np.where(mu["iqr_2023"].isna(), "fora do estado",
                                   np.where(mu["iqr_2023"] > LIMITE_IQR, "adequado", "inadequado"))
    return mu.rename_axis("CD_MUN").reset_index()


def por_destino(r: pd.DataFrame, sd: gpd.GeoDataFrame) -> pd.DataFrame:
    """Uma linha por município de destino: o que recebe, de quantos municípios, e quanto é dele mesmo."""
    g = r.groupby("cd_destino")
    d = pd.DataFrame({
        "nome": g["nm_destino"].first(), "uf": g["uf_destino"].first(),
        "t_recebida": g["rsu_t_dia"].sum().round(2),
        "municipios": g["cd_mun"].nunique(),
        "t_propria": r[r["local"]].groupby("cd_destino")["rsu_t_dia"].sum().round(2),
        "locais": g["local_destino"].apply(lambda x: " + ".join(sorted({v if v else "próprio município" for v in x}))),
        "iqr_2023": g["iqr_2023"].max(),
    })
    d["t_propria"] = d["t_propria"].fillna(0.0)
    d["t_de_outros"] = (d["t_recebida"] - d["t_propria"]).round(2)
    d["de_outros"] = d["municipios"] - (d["t_propria"] > 0).astype(int)
    gerado = r.groupby("cd_mun")["rsu_t_dia"].sum()
    d["t_gerada"] = d.index.map(gerado)
    d["vezes_o_que_gera"] = (d["t_recebida"] / d["t_gerada"]).round(1)
    d["geometry"] = d.index.map(sd.geometry)
    return d.rename_axis("cd_mun").sort_values("t_recebida", ascending=False)


# ------------------------------------------------------------------ 1 para onde vai o lixo
COR_FLUXO = "#234e70"       # azul-profundo
COR_FORA = "#9c4a32"        # argila: lixo que sai do estado
COR_POLO = "#c08a2e"        # ocre: município que recebe lixo de outros
COR_PROPRIO = "#4a4e52"     # grafite: aterro só do próprio município
FUNDO_EXPORTA = "#ece3d0"   # município que manda (parte d)o lixo para outro
FUNDO_PROPRIO = "#f1f2f3"   # município que aterra em casa


def fluxos() -> None:
    r, m, sd = base()
    tot = conferir(r)
    mu = por_municipio(r)
    de = por_destino(r, sd)

    mm = m[["CD_MUN", "NM_MUN", "geometry"]].merge(mu.drop(columns="NM_MUN"), on="CD_MUN", how="left")
    mm = mm[["CD_MUN", "NM_MUN", "agencia", "ugrhi", "rsu_t_dia", "destinos", "exporta", "t_fora_dia", "km_medio",
             "iqr_2023", "enquadramento", "geometry"]]
    sai = r[~r["local"]].copy()
    sai["geometry"] = [LineString([sd.geometry[a], sd.geometry[b]]) for a, b in zip(sai["cd_mun"], sai["cd_destino"])]
    linhas_ = gpd.GeoDataFrame(sai[["cd_mun", "nm_mun", "cd_destino", "nm_destino", "uf_destino", "local_destino", "tipo_destino",
                                    "rsu_t_dia", "km_reta", "iqr_2023", "geometry"]], geometry="geometry", crs=GEO)
    linhas_ = linhas_.sort_values("rsu_t_dia", ascending=False).reset_index(drop=True)
    pts = gpd.GeoDataFrame(de.reset_index()[["cd_mun", "nome", "uf", "t_recebida", "municipios", "de_outros", "t_propria",
                                            "t_de_outros", "t_gerada", "vezes_o_que_gera", "locais", "iqr_2023", "geometry"]],
                           geometry="geometry", crs=GEO)
    pts["recebe_de_outros"] = pts["de_outros"] > 0
    lim = limite_estadual(m)

    raio = '0.6 + 0.16 * sqrt("t_recebida")'
    estilos = {
        "municipios": [("exporta", "Manda o lixo para outro município?", estilo_regras("poligono", [
            (igual("exporta", 1), "manda (parte d)o lixo para outro município", preenchimento(FUNDO_EXPORTA, "#ffffff", 0.1)),
            (igual("exporta", 0), "aterra o lixo no próprio município", preenchimento(FUNDO_PROPRIO, "#ffffff", 0.1)),
        ]), True)],
        "fluxos": [("rsu_t_dia", "Lixo levado a outro município (t/dia)", estilo_regras("linha", [
            (igual("tipo_destino", "outro_estado"), "para outro estado", linha_expr(COR_FORA, 0.2, '0.15 + "rsu_t_dia" / 700')),
            ("ELSE", "para outro município paulista", linha_expr(COR_FLUXO, 0.2, '0.15 + "rsu_t_dia" / 700')),
        ], ordem='"rsu_t_dia" DESC'), True)],
        "destinos": [("t_recebida", "Lixo recebido por município de destino (t/dia)", estilo_regras("ponto", [
            (igual("recebe_de_outros", 1), "recebe lixo de outros municípios", marcador(COR_POLO, 1.5, tamanho_expr=raio, alfa=0.85)),
            ("ELSE", "aterra só o próprio lixo", marcador(COR_PROPRIO, 1.5, tamanho_expr=raio, alfa=0.75)),
        ], ordem='"t_recebida" DESC'), True)],
        "limite_estadual": [("limite", "Limite estadual", estilo_contorno(TINTA, 0.6), True)],
    }
    csv = r[["cd_mun", "nm_mun", "nome_cetesb", "agencia", "ugrhi", "rsu_t_dia", "iqr_2022", "iqr_2023", "dispoe_em", "cd_destino",
             "nm_destino", "uf_destino", "local_destino", "tipo_destino", "local", "km_reta", "t_km_dia"]].sort_values(["nm_mun", "rsu_t_dia"])
    tam = gravar("fluxos", {"municipios": mm, "fluxos": linhas_, "destinos": pts, "limite_estadual": lim}, estilos, csv)

    total = tot["t_dia_total"]
    sp_de = de[de["uf"] == "SP"]
    gerado = r.groupby("cd_mun")["rsu_t_dia"].sum()
    suf = r["local_destino"].str.extract(r" - (A\.P\.|CDR)$")[0].fillna("")
    n_locais = int(len(r.assign(suf=suf)[r["uf_destino"] == "SP"].drop_duplicates(["cd_destino", "suf"])))

    def reg(cd) -> dict:
        x = de.loc[cd]
        return {"cd": cd, "nome": x["nome"], "uf": x["uf"], "coord": coord(sd.geometry[cd]), "t": float(x["t_recebida"]),
                "municipios": int(x["municipios"]), "de_outros": int(x["de_outros"]), "t_propria": float(x["t_propria"]),
                "t_gerada": None if pd.isna(x["t_gerada"]) else float(x["t_gerada"]),
                "vezes": None if pd.isna(x["vezes_o_que_gera"]) else float(x["vezes_o_que_gera"]), "locais": x["locais"],
                "iqr": None if pd.isna(x["iqr_2023"]) else float(x["iqr_2023"])}

    maior = linhas_.iloc[0]
    capital = "3550308"
    fora = r[r["tipo_destino"] == "outro_estado"]
    gravar_cache("lixo-sp-fluxos", {
        "totais": tot,
        "fluxos": [[*coord(sd.geometry[a]), *coord(sd.geometry[b]), float(t), tp]
                   for a, b, t, tp in zip(linhas_["cd_mun"], linhas_["cd_destino"], linhas_["rsu_t_dia"], linhas_["tipo_destino"])],
        "destinos": [reg(cd) for cd in de.index],
        "exporta": sorted(mu.loc[mu["exporta"], "CD_MUN"].tolist()),
        "n_exportam": int(mu["exporta"].sum()), "n_aterram_em_casa": int((~mu["exporta"]).sum()),
        "t_exportada": round(float(mu["t_fora_dia"].sum()), 1),
        "pct_exportada": round(float(mu["t_fora_dia"].sum() / total * 100), 1),
        "n_destinos": int(len(de)), "n_destinos_sp": int(len(sp_de)), "n_locais_sp": n_locais,
        "n_polos": int((sp_de["de_outros"] > 0).sum()),
        "t_particular": round(float(r.loc[r["tipo_destino"] == "particular", "rsu_t_dia"].sum()), 1),
        "top5_pct": round(float(de["t_recebida"].head(5).sum() / total * 100), 1),
        "top10_pct": round(float(de["t_recebida"].head(10).sum() / total * 100), 1),
        "maior_fluxo": {"de": maior["nm_mun"], "para": maior["nm_destino"], "t": float(maior["rsu_t_dia"]), "km": float(maior["km_reta"])},
        "capital": {"t": float(gerado[capital]),
                    "t_para_caieiras": float(r.loc[(r["cd_mun"] == capital) & (r["cd_destino"] == "3509007"), "rsu_t_dia"].sum())},
        "fora_do_estado": [{"de": a, "para": b, "uf": u, "t": float(t), "km": float(k),
                            "coord_de": coord(sd.geometry[ca]), "coord_para": coord(sd.geometry[cb])}
                           for a, b, u, t, k, ca, cb in fora[["nm_mun", "nm_destino", "uf_destino", "rsu_t_dia", "km_reta",
                                                              "cd_mun", "cd_destino"]].itertuples(index=False)],
        "tamanhos": tam,
    })
    print(tam)
    print(f"exportam {mu['exporta'].sum()} · em casa {(~mu['exporta']).sum()} · destinos {len(de)} (SP {len(sp_de)}) · locais SP {n_locais} · "
          f"polos {(sp_de['de_outros'] > 0).sum()} · top5 {de['t_recebida'].head(5).sum() / total:.4f} · "
          f"particular {r.loc[r['tipo_destino'] == 'particular', 'rsu_t_dia'].sum():.0f} · exportada {mu['t_fora_dia'].sum():.0f}")
    print(de.head(12)[["nome", "t_recebida", "municipios", "de_outros", "t_propria", "t_gerada", "vezes_o_que_gera"]].to_string())
    print(de[de["de_outros"] > 0].sort_values("vezes_o_que_gera", ascending=False).head(6)[["nome", "t_recebida", "t_gerada", "vezes_o_que_gera"]].to_string())
    print(de.sort_values("municipios", ascending=False).head(6)[["nome", "municipios", "t_recebida"]].to_string())


# ------------------------------------------------------------------ 2 quilômetros do lixo
# Mapa bivariado: a distância (em linha reta, sede a sede, média por tonelada) escurece;
# a nota do aterro de destino (IQR 2023) dá o matiz.
LIMITE_KM = 40  # 0 = no próprio município; até 40 km; mais de 40 km
LIMITES_IQR = [7.0, 9.0]  # até 7,0 inadequado; 7,1 a 9,0; 9,1 a 10
CORES_BIV = [  # [classe do IQR][classe da distância]
    ["#dd9a80", "#b45a3c", "#7c2e17"],
    ["#eedfb3", "#d6b05e", "#9c7a2a"],
    ["#cddde9", "#7aa0bf", "#24507a"],
]
ROTULOS_KM = [("no próprio município", "in the town itself"), ("até 40 km", "up to 40 km"), ("mais de 40 km", "over 40 km")]
ROTULOS_IQR = [("até 7,0 (inadequado)", "up to 7.0 (inadequate)"), ("7,1 a 9,0", "7.1 to 9.0"), ("9,1 a 10", "9.1 to 10")]
COR_FORA_SP = "#c9ced3"


def distancia() -> None:
    r, m, sd = base()
    tot = conferir(r)
    mu = por_municipio(r)
    mu["classe_km"] = np.where(mu["km_medio"] == 0, 0, np.where(mu["km_medio"] <= LIMITE_KM, 1, 2))
    mu["classe_iqr"] = np.where(mu["iqr_2023"].isna(), -1, np.digitize(mu["iqr_2023"].fillna(0), LIMITES_IQR, right=True))
    mu["cor"] = [CORES_BIV[i][k] if i >= 0 else COR_FORA_SP for i, k in zip(mu["classe_iqr"], mu["classe_km"])]
    mu["faixa_km"] = [ROTULOS_KM[k][0] for k in mu["classe_km"]]
    mu["faixa_iqr"] = [ROTULOS_IQR[i][0] if i >= 0 else "outro estado (sem IQR)" for i in mu["classe_iqr"]]
    cols = ["CD_MUN", "NM_MUN", "agencia", "ugrhi", "rsu_t_dia", "destinos", "t_fora_dia", "km_medio", "t_km_dia", "iqr_2022",
            "iqr_2023", "enquadramento", "classe_km", "classe_iqr", "faixa_km", "faixa_iqr"]
    mm = m[["CD_MUN", "geometry"]].merge(mu[cols], on="CD_MUN")
    mm = gpd.GeoDataFrame(mm[cols + ["geometry"]], geometry="geometry", crs=GEO).sort_values("CD_MUN").reset_index(drop=True)
    lim = limite_estadual(m)
    regras = [(f"{igual('classe_iqr', i)} AND {igual('classe_km', k)}", f"IQR {ROTULOS_IQR[i][0]} · {ROTULOS_KM[k][0]}",
               preenchimento(CORES_BIV[i][k], "#ffffff", 0.1)) for i in range(3) for k in range(3)]
    regras.append((igual("classe_iqr", -1), "dispõe em outro estado (sem IQR)", preenchimento(COR_FORA_SP, "#ffffff", 0.1)))
    sedes_ = gpd.GeoDataFrame(mu[["CD_MUN", "NM_MUN", "rsu_t_dia", "km_medio", "t_km_dia"]].copy(),
                              geometry=mu["CD_MUN"].map(sd.geometry).values, crs=GEO)
    sedes_ = sedes_[sedes_["t_km_dia"] > 0].sort_values("t_km_dia", ascending=False).reset_index(drop=True)
    estilos = {
        "municipios": [("bivariado", "Distância até o aterro × nota do aterro (IQR 2023)", estilo_regras("poligono", regras), True)],
        "toneladas_km": [("t_km_dia", "Toneladas-quilômetro por dia", estilo_regras("ponto", [
            ("ELSE", "t·km por dia", marcador(TINTA, 1.0, tamanho_expr='0.04 * sqrt("t_km_dia")', vazado=True))],
            ordem='"t_km_dia" DESC'), True)],
        "limite_estadual": [("limite", "Limite estadual", estilo_contorno(TINTA, 0.6), True)],
    }
    tam = gravar("distancia", {"municipios": mm, "toneladas_km": sedes_, "limite_estadual": lim}, estilos, mm.drop(columns="geometry"))

    total = tot["t_dia_total"]
    em_sp = mu[mu["classe_iqr"] >= 0]
    grade = [[{"municipios": int(((em_sp["classe_iqr"] == i) & (em_sp["classe_km"] == k)).sum()),
               "t": round(float(em_sp.loc[(em_sp["classe_iqr"] == i) & (em_sp["classe_km"] == k), "rsu_t_dia"].sum()), 1)}
              for k in range(3)] for i in range(3)]
    t_longe = float(mu.loc[mu["classe_km"] == 2, "rsu_t_dia"].sum())  # mesma regra das cores: distância média > 40 km
    ina = mu[mu["enquadramento"] == "inadequado"]

    def reg(x) -> dict:
        return {"cd": x.CD_MUN, "nome": x.NM_MUN, "t": float(x.rsu_t_dia), "km": float(x.km_medio), "tkm": float(x.t_km_dia),
                "destinos": x.destinos, "iqr": None if pd.isna(x.iqr_2023) else float(x.iqr_2023), "coord": coord(sd.geometry[x.CD_MUN])}

    longe = r[r["uf_destino"] == "SP"].sort_values("km_reta", ascending=False)
    gravar_cache("lixo-sp-distancia", {
        "totais": tot,
        "cores": CORES_BIV, "rotulos_km": ROTULOS_KM, "rotulos_iqr": ROTULOS_IQR, "cor_fora": COR_FORA_SP, "limite_km": LIMITE_KM,
        "cor_por_cd": dict(zip(mu["CD_MUN"], mu["cor"])),
        "grade": grade,
        "tkm": round(float(mu["t_km_dia"].sum())), "km_por_t": round(float(mu["t_km_dia"].sum() / total), 1),
        "pct_longe": round(t_longe / total * 100, 1), "t_longe": round(t_longe, 1),
        "n_longe": int((mu["classe_km"] == 2).sum()),
        "inadequados": int(len(ina)), "inadequados_em_casa": int((~ina["exporta"]).sum()),
        "aneis": [[*coord(sd.geometry[x.CD_MUN]), float(x.t_km_dia)] for x in sedes_.itertuples()],
        "maior_tkm": [reg(x) for x in mu.sort_values("t_km_dia", ascending=False).head(10).itertuples()],
        "mais_longe": [{"de": x.nm_mun, "para": x.nm_destino, "km": float(x.km_reta), "t": float(x.rsu_t_dia),
                        "coord": coord(sd.geometry[x.cd_mun])} for x in longe.head(5).itertuples()],
        "pior_iqr": [reg(x) for x in mu.sort_values(["iqr_2023", "rsu_t_dia"], ascending=[True, False]).head(5).itertuples()],
        # O que a capital manda para fora (o resto fica nos aterros da própria cidade, a 0 km).
        "capital_fora": [{"para": x.nm_destino, "t": float(x.rsu_t_dia), "km": float(x.km_reta)}
                         for x in r[(r["cd_mun"] == "3550308") & (r["km_reta"] > 0)].itertuples()],
        "inadequados_lista": [{**reg(x), "em_casa": not bool(x.exporta)} for x in ina.sort_values("rsu_t_dia", ascending=False).itertuples()],
        "tamanhos": tam,
    })
    print(tam)
    print("t·km", round(mu["t_km_dia"].sum()), "km/t", round(mu["t_km_dia"].sum() / total, 2), "> 40 km %", round(t_longe / total * 100, 1),
          "municípios > 40", (mu["classe_km"] == 2).sum(), "inadequados", len(ina), "em casa", (~ina["exporta"]).sum(), "anéis", len(sedes_))
    print(pd.DataFrame([[c["municipios"] for c in linha_] for linha_ in grade], index=["≤7", "7.1-9", "9.1-10"], columns=["0", "≤40", ">40"]))
    print(pd.DataFrame([[c["t"] for c in linha_] for linha_ in grade], index=["≤7", "7.1-9", "9.1-10"], columns=["0", "≤40", ">40"]))
    print(mu.sort_values("t_km_dia", ascending=False).head(8)[["NM_MUN", "rsu_t_dia", "km_medio", "t_km_dia", "destinos"]].to_string())
    print(longe.head(6)[["nm_mun", "nm_destino", "km_reta", "rsu_t_dia"]].to_string())
    print(mu.sort_values("iqr_2023").head(6)[["NM_MUN", "rsu_t_dia", "iqr_2023", "destinos"]].to_string())


# ------------------------------------------------------------------ 3 os aterros que já acendem a luz
# Só o que existe: usinas do SIGA em operação e o lixo que os aterros recebem hoje. Nada de potencial.
COR_BIOGAS = "#234e70"   # azul-profundo
COR_RSU = "#4a4e52"      # grafite: outras usinas a lixo no SIGA
COR_ATERRO = "#9aa3ab"
FONTES_LIXO = ["Biogás - RU", "Resíduos Sólidos Urbanos - RU", "Carvão - RU"]


def aterros() -> None:
    r, m, sd = base()
    tot = conferir(r)
    de = por_destino(r, sd)
    de = de[de["uf"] == "SP"].copy()
    d = pd.read_csv(SIGA_CSV, sep=";", dtype=str, encoding="utf-8")
    referencia = d["DatGeracaoConjuntoDados"].iloc[0]
    num = lambda s: pd.to_numeric(s.str.replace(".", "", regex=False).str.replace(",", ".", regex=False), errors="coerce")  # noqa: E731
    u = d[(d["SigUFPrincipal"] == "SP") & (d["DscFaseUsina"] == "Operação") & d["NomFonteCombustivel"].isin(FONTES_LIXO)].copy()
    u["kw"] = num(u["MdaPotenciaOutorgadaKw"])
    u["lat"], u["lon"] = num(u["NumCoordNEmpreendimento"]), num(u["NumCoordEEmpreendimento"])
    u["posicao"] = "coordenada do SIGA"
    sem = u["lat"].isna() | u["lon"].isna() | ((u["lat"] == 0) & (u["lon"] == 0))
    porchave = {chave(n): cd for cd, n in zip(m["CD_MUN"], m["NM_MUN"])}
    primeiro = u["DscMuninicpios"].str.split(",").str[0].str.replace(" - SP", "", regex=False).str.strip()
    u.loc[sem, "lon"] = primeiro[sem].map(lambda n: sd.geometry[porchave[chave(n)]].x)
    u.loc[sem, "lat"] = primeiro[sem].map(lambda n: sd.geometry[porchave[chave(n)]].y)
    u.loc[sem, "posicao"] = "sede do município (sem coordenada no SIGA)"
    us = gpd.GeoDataFrame({
        "nome": u["NomEmpreendimento"].str.strip(), "ceg": u["CodCEG"], "combustivel": u["NomFonteCombustivel"],
        "grupo": np.where(u["NomFonteCombustivel"] == "Biogás - RU", "biogas", "rsu"), "potencia_kw": u["kw"],
        "inicio_operacao": pd.to_datetime(u["DatEntradaOperacao"], errors="coerce").dt.strftime("%Y-%m-%d"),
        "municipio_siga": u["DscMuninicpios"], "proprietario": u["DscPropriRegimePariticipacao"], "posicao": u["posicao"],
    }, geometry=gpd.points_from_xy(u["lon"], u["lat"]), crs=GEO)
    us = gpd.sjoin(us, m[["CD_MUN", "NM_MUN", "geometry"]], how="left", predicate="within").drop(columns="index_right")
    assert us["CD_MUN"].notna().all()
    us = us.sort_values("potencia_kw", ascending=False).reset_index(drop=True)
    us["aterro_no_municipio"] = us["CD_MUN"].isin(de.index)

    bio = us[us["grupo"] == "biogas"]
    rsu = us[us["grupo"] == "rsu"]
    de["mw_biogas"] = (de.index.map(bio.groupby("CD_MUN")["potencia_kw"].sum()) / 1000).fillna(0).round(3)
    de["mw_rsu"] = (de.index.map(rsu.groupby("CD_MUN")["potencia_kw"].sum()) / 1000).fillna(0).round(3)
    de["usinas"] = de.index.map(us.groupby("CD_MUN")["nome"].apply(lambda x: " + ".join(x))).fillna("")
    de["usina_biogas"] = de["mw_biogas"] > 0
    pts = gpd.GeoDataFrame(de.reset_index()[["cd_mun", "nome", "t_recebida", "municipios", "de_outros", "t_propria", "locais",
                                             "iqr_2023", "mw_biogas", "mw_rsu", "usinas", "usina_biogas", "geometry"]],
                           geometry="geometry", crs=GEO)
    lim = limite_estadual(m)
    raio = '0.6 + 0.16 * sqrt("t_recebida")'
    estilos = {
        "aterros": [("t_recebida", "Municípios com aterro: lixo recebido (t/dia)", estilo_regras("ponto", [
            (igual("usina_biogas", 1), "com usina a biogás de lixo em operação", marcador(COR_BIOGAS, 1.5, tamanho_expr=raio, alfa=0.85)),
            ("ELSE", "sem usina a biogás de lixo", marcador(COR_ATERRO, 1.5, tamanho_expr=raio, alfa=0.6)),
        ], ordem='"t_recebida" DESC'), True)],
        "usinas": [("grupo", "Usinas a lixo em operação (SIGA)", estilo_regras("ponto", [
            (igual("grupo", "biogas"), "biogás de resíduos urbanos", marcador(COR_BIOGAS, 2.4, vazado=True)),
            (igual("grupo", "rsu"), "resíduos sólidos urbanos ou carvão de RSU", marcador(COR_RSU, 2.4, vazado=True)),
        ]), True)],
        "limite_estadual": [("limite", "Limite estadual", estilo_contorno(TINTA, 0.6), True)],
    }
    tam = gravar("aterros", {"aterros": pts, "usinas": us, "limite_estadual": lim}, estilos, pts.drop(columns="geometry"))

    total = tot["t_dia_total"]
    com = de[de["usina_biogas"]].sort_values("t_recebida", ascending=False)
    sem_usina = de[~de["usina_biogas"] & (de["mw_rsu"] == 0)].head(6)

    def reg(cd) -> dict:
        x = de.loc[cd]
        return {"cd": cd, "nome": x["nome"], "coord": coord(sd.geometry[cd]), "t": float(x["t_recebida"]), "municipios": int(x["municipios"]),
                "mw_biogas": float(x["mw_biogas"]), "mw_rsu": float(x["mw_rsu"]), "usinas": x["usinas"]}

    gravar_cache("lixo-sp-aterros", {
        "totais": tot, "referencia_siga": referencia,
        "aterros": [[*coord(sd.geometry[cd]), float(x["t_recebida"]), bool(x["usina_biogas"]), bool(x["de_outros"] > 0)] for cd, x in de.iterrows()],
        "usinas": [{"nome": x.nome, "grupo": x.grupo, "kw": float(x.potencia_kw), "municipio": x.NM_MUN, "cd": x.CD_MUN, "coord": coord(x.geometry),
                    "aterro_no_municipio": bool(x.aterro_no_municipio), "inicio": x.inicio_operacao, "posicao": x.posicao} for x in us.itertuples()],
        "com_usina": [reg(cd) for cd in com.index],
        "com_rsu": [reg(cd) for cd in de[de["mw_rsu"] > 0].index],
        "sem_usina": [reg(cd) for cd in sem_usina.index],
        "n_aterros": int(len(de)), "n_com_usina": int(len(com)),
        "t_com_usina": round(float(com["t_recebida"].sum()), 1), "pct_com_usina": round(float(com["t_recebida"].sum() / total * 100), 1),
        "mw_biogas": round(float(bio["potencia_kw"].sum() / 1000), 2), "n_biogas": int(len(bio)),
        "mw_biogas_em_aterro": round(float(bio.loc[bio["aterro_no_municipio"], "potencia_kw"].sum() / 1000), 2),
        "n_biogas_em_aterro": int(bio["aterro_no_municipio"].sum()),
        "fora_de_aterro": [{"nome": x.nome, "municipio": x.NM_MUN, "kw": float(x.potencia_kw)} for x in bio[~bio["aterro_no_municipio"]].itertuples()],
        "mw_rsu": round(float(rsu["potencia_kw"].sum() / 1000), 2), "n_rsu": int(len(rsu)),
        "tamanhos": tam,
    })
    print(tam, referencia)
    print(us[["nome", "grupo", "potencia_kw", "NM_MUN", "aterro_no_municipio", "posicao", "inicio_operacao"]].to_string())
    print(com[["nome", "t_recebida", "municipios", "mw_biogas", "mw_rsu", "usinas"]].to_string())
    print("sem usina:\n", sem_usina[["nome", "t_recebida", "municipios"]].to_string())
    print("pct com usina", com["t_recebida"].sum() / total, "aterros", len(de))


if __name__ == "__main__":
    temas = {"fluxos": fluxos, "distancia": distancia, "aterros": aterros}
    ap = argparse.ArgumentParser()
    ap.add_argument("tema", choices=["conferir", *temas])
    tema = ap.parse_args().tema
    if tema == "conferir":
        r_, *_ = base()
        conferir(r_)
    else:
        temas[tema]()
