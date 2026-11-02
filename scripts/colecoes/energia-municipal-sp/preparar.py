"""
Coleção «A energia de cada município» (SP) — prepara os dados de uma prancha (uso interno).

    .venv-geo/Scripts/python -I -X utf8 scripts/colecoes/energia-municipal-sp/preparar.py conferir|roca|tanque|bio|todos < /dev/null

Fonte: SEMIL/SP, «Anuário de Energéticos por Município no Estado de São Paulo 2025, ano-base 2024» (2ª edição),
dados-brutos/semil/Anuario-Energeticos-Municipios-SP-2025-ab2024.pdf. As tabelas municipais são lidas do
pdftotext do xpdf no modo -table (dados-brutos/semil-energia-municipal/anuario-table.txt), que guarda a posição
das colunas: o .txt simples ao lado do PDF perde as células vazias (Anhumas, na tabela de derivados, fica com
nove números em vez de dez). Cada número vai para a coluna mais perto da sua posição na página.

Conferências (comando conferir): eletricidade — a soma das classes bate com o total de cada município e o total
em kWh bate com a eletricidade em toe da tabela de consumo total; gás — idem; derivados — o etanol soma os
10,3 bilhões de litros do estado e a energia dos derivados, com os fatores implícitos estimados das próprias
tabelas, bate com a coluna «derivados de petróleo» em toe.

Saídas: mapas/<pasta>/dados/<base>.gpkg.zip (com estilos do QGIS), <base>.csv
e scripts/colecoes/cache/energia-municipal-sp-<tema>.json (para a prancha e a ficha).
"""

from __future__ import annotations

import argparse
import json
import re
import shutil
import subprocess
import sys
import unicodedata
from pathlib import Path

import geopandas as gpd
import numpy as np
import pandas as pd

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from comum import (  # noqa: E402
    CACHE, DADOS, RAIZ, TINTA, estilo_contorno, estilo_regras, gravar_cache, gravar_estilos, malha_uf, zipar,
)
from estilos import preenchimento  # noqa: E402

COL = "energia-municipal-sp"
SERIE = {s["tema"]: s for s in json.loads((Path(__file__).parent / "serie.json").read_text(encoding="utf-8"))}
PDF = RAIZ / "dados-brutos" / "semil" / "Anuario-Energeticos-Municipios-SP-2025-ab2024.pdf"
TXT = RAIZ / "dados-brutos" / "semil-energia-municipal" / "anuario-table.txt"
P42 = RAIZ / "dados-brutos" / "semil-energia-municipal" / "eletricidade-p42-uchoa-a-zacarias.csv"
CENSO = DADOS / "raw" / "ibge_censo2022" / "Agregados_por_municipios_basico_BR.csv"
MB_KM2 = CACHE / "downloads" / "mapbiomas" / "sp_coverage_2024_mun_km2.csv"  # km² por município e classe (30 m)

# Totais do estado impressos no Anuário, para conferir a leitura.
TOTAL_TOE = 46_048_310          # tabela de consumo total (toe)
TOTAL_ELETR_TOE = 12_631_024
TOTAL_GN_TOE = 4_746_353
TOTAL_ETANOL_TOE = 5_254_634
TOTAL_DERIV_TOE = 23_416_299
TOTAL_ETANOL_L = 10_303_204_467
TOTAL_GN_M3 = 4_783_114_531     # tabela de gás, total do estado (m³)
TOTAL_GN_NC = 2_827_193
# Linha «ESTADO SÃO PAULO» da tabela de eletricidade (p. 42): consumidores e kWh por classe.
TOTAL_ELETR = {
    "residencial": (19_496_072, 46_970_465_612), "comercial": (1_293_672, 31_887_155_562),
    "rural": (252_414, 3_949_043_810), "industrial": (90_001, 52_370_653_659),
    "iluminacao": (23_034, 2_619_360_326), "poder_publico": (100_262, 3_219_046_573),
    "servico_publico": (16_323, 5_745_423_278), "consumo_proprio": (3_194, 111_218_146),
    "total": (21_274_972, 146_872_366_965),
}

ELETR = ["residencial", "comercial", "rural", "industrial", "iluminacao", "poder_publico", "servico_publico",
         "consumo_proprio", "total"]
GAS = ["residencial", "comercial", "industrial", "automotivo", "cogeracao", "termogeracao", "total"]
DERIV = ["gasolina_l", "gasolina_aviacao_l", "diesel_l", "oleo_combustivel_kg", "qav_l", "querosene_l", "glp_kg",
         "coque_kg", "etanol_l", "asfalto_kg"]
TEP = ["eletricidade_toe", "gn_toe", "gnc_toe", "etanol_toe", "derivados_toe", "total_toe", "co2_kt"]

APELIDOS = {"MOJIMIRIM": "MOGIMIRIM", "EMBU": "EMBUDASARTES", "SAOLUISDOPARAITINGA": "SAOLUIZDOPARAITINGA",
            "FLORINIA": "FLORINEA", "MOJIGUACU": "MOGIGUACU", "MOJIDASCRUZES": "MOGIDASCRUZES",
            "EUCLIDESDACUNHA": "EUCLIDESDACUNHAPAULISTA", "LUIZANTONIO": "LUISANTONIO", "SUDMENUCCI": "SUDMENNUCCI",
            "BRODOSQUI": "BRODOWSKI", "TRABIJU": "TRABIJU"}


def chave(s: str) -> str:
    s = unicodedata.normalize("NFD", s)
    s = "".join(c for c in s if not unicodedata.combining(c))
    k = re.sub(r"[^A-Z0-9]", "", s.upper())
    return APELIDOS.get(k, k)


# ------------------------------------------------------------------ leitura do Anuário
_NUM = re.compile(r"(?<![\w.,])(-?\d{1,3}(?:\.\d{3})*(?:,\d+)?|-)(?![\w.,])")


def _num(s: str) -> float:
    return 0.0 if s == "-" else float(s.replace(".", "").replace(",", "."))


def _texto() -> list[str]:
    if not TXT.exists():
        exe = shutil.which("pdftotext")
        assert exe, "pdftotext (xpdf 4) não encontrado no PATH"
        TXT.parent.mkdir(parents=True, exist_ok=True)
        subprocess.run([exe, "-enc", "UTF-8", "-table", str(PDF), str(TXT)], check=True)
    return TXT.read_text(encoding="utf-8").split("\f")


def _tipo(pag: str) -> str | None:
    if "TABELA" in pag or "15 MAIORES" in pag:
        return None
    if "N.C." in pag and "kWh" in pag:
        return "eletricidade"
    if "COGERA" in pag and "Municipios" in pag:
        return "gas"
    if "ASFALTO" in pag and "GASOLINA" in pag:
        return "derivados"
    if "ELETRICIDADE" in pag and "Emiss" in pag:
        return "tep"
    return None


NCOL = {"eletricidade": 18, "gas": 14, "derivados": 10, "tep": 7}


def _linhas(pag: str, ncol: int) -> list[tuple[str, list[tuple[float, str]]]]:
    """Linhas de dados da página: (nome, [(centro da célula, número)]). Junta nomes quebrados em duas linhas."""
    out = []
    antes = None  # última linha só com texto (começo de nome quebrado)
    for l in pag.split("\n"):
        if not l.strip():
            continue
        nums = list(_NUM.finditer(l))
        if not nums:
            t = l.strip()
            antes = t if re.match(r"^[A-ZÀ-Ý][\wÀ-ÿ' \-]*$", t) and len(t) < 40 else None
            continue
        nome = l[: nums[0].start()].strip()
        if not nome or not re.match(r"^[A-ZÀ-Ýa-zà-ÿ]", nome) or len(nums) < 3:
            antes = None
            continue
        cel = [((m.start() + m.end()) / 2, m.group(1)) for m in nums]
        out.append((nome, antes, cel))
        antes = None
    return out


def ler_anuario() -> dict[str, pd.DataFrame]:
    """As quatro tabelas municipais, indexadas por CD_MUN (cache em energia-municipal-sp-anuario.json)."""
    mun = malha_uf("SP")
    por_chave = {chave(n): cd for cd, n in zip(mun["CD_MUN"], mun["NM_MUN"])}
    tabelas: dict[str, dict[str, list[float]]] = {k: {} for k in NCOL}
    sem: list[str] = []
    for pag in _texto():
        tipo = _tipo(pag)
        if not tipo:
            continue
        n = NCOL[tipo]
        linhas = _linhas(pag, n)
        cheias = [c for _, _, c in linhas if len(c) == n]
        assert cheias, f"página de {tipo} sem linha completa"
        centros = np.median(np.array([[x for x, _ in c] for c in cheias]), axis=0)
        for nome, antes, cel in linhas:
            cd = None
            if antes:
                cd = por_chave.get(chave(f"{antes} {nome}"))
            cd = cd or por_chave.get(chave(nome))
            if cd is None:
                if not re.match(r"^(Total|Estado|ESTADO)", nome):
                    sem.append(f"{tipo}: {antes or ''} {nome}".strip())
                continue
            vals = [0.0] * n
            if len(cel) == n:
                vals = [_num(v) for _, v in cel]
            else:
                # Células vazias: cada número vai para a coluna mais perto, em ordem.
                livres = list(range(n))
                for x, v in cel:
                    j = min(livres, key=lambda k: abs(centros[k] - x))
                    vals[j] = _num(v)
                    livres = [k for k in livres if k > j]
            assert cd not in tabelas[tipo], f"{tipo}: {nome} repetido"
            tabelas[tipo][cd] = vals
    assert not sem, f"nomes sem código: {sem}"
    # A última página da eletricidade (Uchôa a Zacarias) é imagem: vem da transcrição (FONTE.md ao lado).
    p42 = pd.read_csv(P42, sep=";", encoding="utf-8")
    for r in p42.itertuples(index=False):
        cd = por_chave[chave(r[0])]
        assert cd not in tabelas["eletricidade"], f"{r[0]} já lido"
        tabelas["eletricidade"][cd] = [float(v) for v in r[1:]]
    cols = {
        "eletricidade": [f"{k}_{u}" for k in ELETR for u in ("nc", "kwh")],
        "gas": [f"{k}_{u}" for k in GAS for u in ("nc", "m3")],
        "derivados": DERIV,
        "tep": TEP,
    }
    out = {}
    for tipo, d in tabelas.items():
        df = pd.DataFrame.from_dict(d, orient="index", columns=cols[tipo])
        df.index.name = "CD_MUN"
        out[tipo] = df.sort_index()
    return out


def conferir() -> dict[str, pd.DataFrame]:
    t = ler_anuario()
    el, gas, der, tep = t["eletricidade"], t["gas"], t["derivados"], t["tep"]
    print(f"  municípios lidos: eletricidade {len(el)}, gás {len(gas)}, derivados {len(der)}, toe {len(tep)}")
    assert len(el) == 645 and len(tep) == 645, "faltam municípios"
    # Eletricidade: classes somam o total; kWh × 0,086/1000 = toe da tabela de consumo total.
    for u in ("nc", "kwh"):
        soma = el[[f"{k}_{u}" for k in ELETR[:-1]]].sum(axis=1)
        dif = (soma - el[f"total_{u}"]).abs()
        ruins = dif[dif > 2]
        print(f"  eletricidade {u}: soma das classes ≠ total em {len(ruins)} municípios" + (f" ({', '.join(ruins.index[:8])})" if len(ruins) else ""))
    for k, (nc, kwh) in TOTAL_ELETR.items():
        a, b = el[f"{k}_nc"].sum(), el[f"{k}_kwh"].sum()
        print(f"    {k}: {a:,.0f} consumidores (Anuário {nc:,}) · {b:,.0f} kWh (Anuário {kwh:,})" + ("" if (a, b) == (nc, kwh) else "  ← difere"))
    toe = el["total_kwh"] * 0.086 / 1000
    rel = (toe / tep["eletricidade_toe"] - 1).abs()
    print(f"  eletricidade kWh → toe: desvio máximo {rel.max() * 100:.3f} % · estado {el['total_kwh'].sum() / 1e9:.3f} TWh"
          f" ({el['total_kwh'].sum() * 0.086 / 1000:,.0f} toe; Anuário {TOTAL_ELETR_TOE:,})")
    # Gás.
    soma = gas[[f"{k}_m3" for k in GAS[:-1]]].sum(axis=1)
    print(f"  gás: {len(gas)} municípios com linha; soma das classes ≠ total em {int(((soma - gas['total_m3']).abs() > 2).sum())};"
          f" estado {gas['total_m3'].sum():,.0f} m³ (Anuário {TOTAL_GN_M3:,}) · {gas['total_nc'].sum():,.0f} consumidores (Anuário {TOTAL_GN_NC:,})")
    # Derivados: etanol e fatores implícitos.
    print(f"  derivados: {len(der)} municípios; etanol {der['etanol_l'].sum():,.0f} L (Anuário {TOTAL_ETANOL_L:,})")
    f_et = (tep["etanol_toe"].sum()) / der["etanol_l"].sum()
    print(f"  etanol: {f_et * 1000:.4f} toe/m³ (estado)")
    fat = fatores(der, tep)
    print("  fatores implícitos (toe por 1000 L ou t): " + ", ".join(f"{k} {v * 1000:.4f}" for k, v in fat.items()))
    calc = sum(der[k] * v for k, v in fat.items())
    dif = (calc - tep["derivados_toe"].reindex(der.index)).abs()
    print(f"  derivados toe recalculados: |dif| mediana {dif.median():.1f} toe, máx {dif.max():.0f} ({dif.idxmax()});"
          f" estado {calc.sum():,.0f} (Anuário {TOTAL_DERIV_TOE:,})")
    print(f"  toe do estado: soma dos municípios {tep['total_toe'].sum():,.0f} (Anuário {TOTAL_TOE:,});"
          f" eletricidade {tep['eletricidade_toe'].sum():,.0f}; gn {tep['gn_toe'].sum():,.0f} (Anuário {TOTAL_GN_TOE:,});"
          f" etanol {tep['etanol_toe'].sum():,.0f} (Anuário {TOTAL_ETANOL_TOE:,}); derivados {tep['derivados_toe'].sum():,.0f}")
    gravar_cache(f"{COL}-anuario", {k: {cd: list(r) for cd, r in v.iterrows()} for k, v in t.items()}
                 | {"colunas": {k: list(v.columns) for k, v in t.items()}})
    return t


def fatores(der: pd.DataFrame, tep: pd.DataFrame) -> dict[str, float]:
    """Fatores de conversão (toe por L ou kg) que o Anuário usou nos derivados: mínimos quadrados sobre os municípios."""
    cols = [c for c in DERIV if c != "etanol_l"]
    y = tep["derivados_toe"].reindex(der.index).to_numpy(float)
    X = der[cols].to_numpy(float)
    coef, *_ = np.linalg.lstsq(X, y, rcond=None)
    return dict(zip(cols, coef))


# ------------------------------------------------------------------ peças comuns
TEP_GJ = 41.868  # 1 toe = 10 Gcal = 41,868 GJ


def tabelas() -> dict[str, pd.DataFrame]:
    arq = CACHE / f"{COL}-anuario.json"
    if not arq.exists():
        conferir()
    c = json.loads(arq.read_text(encoding="utf-8"))
    return {k: pd.DataFrame.from_dict(c[k], orient="index", columns=c["colunas"][k]) for k in NCOL}


def municipios() -> gpd.GeoDataFrame:
    """Malha 2025 com a população do Censo 2022 (v0001)."""
    m = malha_uf("SP")
    censo = pd.read_csv(CENSO, sep=";", encoding="latin1", dtype=str)
    censo = censo[censo["CD_UF"] == "35"].set_index("CD_MUN")
    m["populacao_2022"] = m["CD_MUN"].map(censo["v0001"].astype(int))
    assert m["populacao_2022"].notna().all() and len(m) == 645
    m["area_km2"] = m["area_km2"].round(2)
    return m


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
    tam = {z.name: z.stat().st_size, arq_csv.name: arq_csv.stat().st_size}
    print(f"  {s['pasta']}: " + " · ".join(f"{k} {v / 1e6:.2f} MB" for k, v in tam.items()))
    return tam


def limite(m: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    return m.assign(uf="SP").dissolve(by="uf", as_index=False)[["uf", "geometry"]]


def rgint(m: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    return m.dissolve(by=["CD_RGINT", "NM_RGINT"], as_index=False)[["CD_RGINT", "NM_RGINT", "geometry"]]


def posicao(m: gpd.GeoDataFrame) -> pd.Series:
    """Ponto interno de cada município (para chamadas), em SIRGAS 2000."""
    return m.set_index("CD_MUN").geometry.to_crs("EPSG:31983").representative_point().to_crs("EPSG:4674")


def coord(p) -> list[float]:
    return [round(p.x, 4), round(p.y, 4)]


def regras_classes(campo: str, cores: list[str], rotulos: list[str], sem: str | None = None) -> str:
    itens = [(f"&quot;{campo}&quot; = {i}", r, preenchimento(c, "#ffffff", 0.05)) for i, (c, r) in enumerate(zip(cores, rotulos))]
    if sem:
        itens.append((f"&quot;{campo}&quot; IS NULL", sem, preenchimento("#d5d9dd", "#ffffff", 0.05)))
    return estilo_regras("poligono", itens)


ESTILOS_REF = {
    "regioes_intermediarias": [("rgint", "Regiões intermediárias", estilo_contorno("#1a211a", 0.35, "NM_RGINT"), True)],
    "limite_estadual": [("limite", "Limite estadual", estilo_contorno(TINTA, 0.6), True)],
}


# ------------------------------------------------------------------ 144 a luz da roça
LIM_RURAL = [0.5, 0.75, 1, 1.5, 2, 4]   # razão para a média do estado
CORES_RURAL = ["#3d6f8e", "#86abc0", "#c9d9e2", "#efdcae", "#dcaa5e", "#b06a2a", "#6b3518"]
ROTULOS_RURAL = ["menos da metade da média", "0,5 a 0,75 × a média", "0,75 a 1 × a média", "1 a 1,5 × a média",
                 "1,5 a 2 × a média", "2 a 4 × a média", "4 × a média ou mais"]
ROTULOS_RURAL_EN = ["less than half the mean", "0.5 to 0.75 × the mean", "0.75 to 1 × the mean", "1 to 1.5 × the mean",
                    "1.5 to 2 × the mean", "2 to 4 × the mean", "4 × the mean or more"]


def roca() -> None:
    t = tabelas()
    el = t["eletricidade"]
    m = municipios()
    m = m.join(el[["rural_nc", "rural_kwh", "residencial_nc", "residencial_kwh", "total_kwh"]], on="CD_MUN")
    # Erros de cópia no Anuário: o kWh rural repete, dígito por dígito, outra célula de kWh da tabela
    # (Ribeirão Preto, Rifaina e Rincão trazem os 233.962.584 kWh industriais de Ribeirão Preto).
    kwh = el[[c for c in el.columns if c.endswith("_kwh") and c != "total_kwh"]]
    contagem = pd.Series(kwh.to_numpy().ravel()).value_counts()
    m["repetido"] = m["rural_kwh"].map(lambda v: v >= 1e6 and contagem.get(v, 0) > 1)
    print("  kWh rural repetido de outra célula: " + ", ".join(m.loc[m["repetido"], "NM_MUN"]))
    ok = m[~m["repetido"] & (m["rural_nc"] > 0)]
    media = ok["rural_kwh"].sum() / ok["rural_nc"].sum()
    media_todos = m["rural_kwh"].sum() / m["rural_nc"].sum()
    res = m["residencial_kwh"].sum() / m["residencial_nc"].sum()
    m["kwh_por_ligacao_rural"] = (m["rural_kwh"] / m["rural_nc"].replace(0, np.nan)).round(0)
    m["razao_media"] = (m["kwh_por_ligacao_rural"] / media).round(3)
    m["pct_rural_na_eletricidade"] = (100 * m["rural_kwh"] / m["total_kwh"]).round(2)
    m.loc[m["repetido"], ["kwh_por_ligacao_rural", "razao_media", "pct_rural_na_eletricidade"]] = np.nan
    m["classe"] = [None if pd.isna(v) else int(np.digitize(v, LIM_RURAL)) for v in m["razao_media"]]
    m["aviso"] = np.where(m["repetido"], "kWh rural repete outra célula da tabela no Anuário (erro de cópia)",
                          np.where(m["rural_nc"] == 0, "sem consumidor rural no Anuário", ""))
    cont = [int((m["classe"] == i).sum()) for i in range(len(CORES_RURAL))]
    print(f"  média do estado {media:,.0f} kWh por ligação rural (com os repetidos: {media_todos:,.0f}); residencial {res:,.0f}")
    print(f"  classes: {cont}; sem informação: {int(m['classe'].isna().sum())}")

    # Por região intermediária (sem os repetidos).
    reg = ok.groupby("NM_RGINT").agg(nc=("rural_nc", "sum"), kwh=("rural_kwh", "sum"), tot=("total_kwh", "sum"))
    reg["kwh_nc"] = reg["kwh"] / reg["nc"]
    reg["pct"] = 100 * reg["kwh"] / reg["tot"]
    reg = reg.sort_values("kwh_nc", ascending=False)
    pos = posicao(m)
    idx = m.set_index("CD_MUN")

    def mun(cd: str) -> dict:
        r = idx.loc[cd]
        return {"cd": cd, "nome": r["NM_MUN"], "nc": int(r["rural_nc"]), "kwh": float(r["rural_kwh"]),
                "kwh_nc": float(r["kwh_por_ligacao_rural"]), "razao": float(r["razao_media"]),
                "pct": float(r["pct_rural_na_eletricidade"]), "coord": coord(pos[cd])}

    validos = m[m["classe"].notna()]
    maiores = validos.sort_values("kwh_por_ligacao_rural", ascending=False)
    mais_lig = validos.sort_values("rural_nc", ascending=False)
    mais_kwh = validos.sort_values("rural_kwh", ascending=False)
    acima2 = validos[validos["razao_media"] >= 2]
    print(f"  ≥ 2 × a média: {len(acima2)} municípios, {acima2['rural_nc'].sum():,.0f} ligações ({100 * acima2['rural_nc'].sum() / ok['rural_nc'].sum():.1f}%),"
          f" {100 * acima2['rural_kwh'].sum() / ok['rural_kwh'].sum():.1f}% do kWh rural")
    for r in maiores.head(10).itertuples():
        print(f"    {r.NM_MUN}: {r.rural_nc:.0f} ligações, {r.kwh_por_ligacao_rural:,.0f} kWh cada ({r.pct_rural_na_eletricidade:.0f}% da eletricidade)")

    cols = ["CD_MUN", "NM_MUN", "CD_RGINT", "NM_RGINT", "populacao_2022", "rural_nc", "rural_kwh", "total_kwh",
            "kwh_por_ligacao_rural", "razao_media", "pct_rural_na_eletricidade", "classe", "aviso"]
    mm = m[cols + ["geometry"]].copy()
    mm["classe"] = mm["classe"].astype("Int64")
    estilos = {"municipios": [("razao", "kWh por ligação rural, em relação à média do estado",
                               regras_classes("classe", CORES_RURAL, ROTULOS_RURAL, "sem informação"), True),
                              ("pct_rural", "Parte da classe rural na eletricidade do município (%)",
                               estilo_regras("poligono", [
                                   (f"&quot;pct_rural_na_eletricidade&quot; &gt;= {a} AND &quot;pct_rural_na_eletricidade&quot; &lt; {b}",
                                    f"{a} a {b} %", preenchimento(c, "#ffffff", 0.05))
                                   for a, b, c in [(0, 2, "#f2ecdf"), (2, 5, "#e3cf9f"), (5, 10, "#cfa45c"), (10, 25, "#a8692c"), (25, 101, "#6b3518")]]),
                               False)]} | ESTILOS_REF
    tam = gravar("roca", {"municipios": mm, "regioes_intermediarias": rgint(m), "limite_estadual": limite(m)},
                 estilos, mm.drop(columns="geometry"))
    gravar_cache(f"{COL}-roca", {
        "media": round(media), "media_com_repetidos": round(media_todos), "residencial": round(res),
        "ligacoes": int(ok["rural_nc"].sum()), "kwh_rural": float(ok["rural_kwh"].sum()),
        "pct_rural_estado": round(100 * ok["rural_kwh"].sum() / ok["total_kwh"].sum(), 2),
        "mediana_municipios": round(float(validos["kwh_por_ligacao_rural"].median())),
        "lim": LIM_RURAL, "cores": CORES_RURAL, "rotulos": ROTULOS_RURAL, "rotulos_en": ROTULOS_RURAL_EN,
        "contagem": cont, "sem_info": int(m["classe"].isna().sum()),
        "repetidos": list(m.loc[m["repetido"], "NM_MUN"]), "sem_rural": list(m.loc[m["rural_nc"] == 0, "NM_MUN"]),
        "acima2": {"n": len(acima2), "ligacoes": int(acima2["rural_nc"].sum()),
                   "pct_ligacoes": round(100 * acima2["rural_nc"].sum() / ok["rural_nc"].sum(), 1),
                   "pct_kwh": round(100 * acima2["rural_kwh"].sum() / ok["rural_kwh"].sum(), 1)},
        "abaixo_media": int((validos["razao_media"] < 1).sum()),
        "municipios": {r.CD_MUN: (None if pd.isna(r.classe) else int(r.classe)) for r in m.itertuples()},
        "maiores": [mun(cd) for cd in maiores["CD_MUN"].head(10)],
        "mais_ligacoes": [mun(cd) for cd in mais_lig["CD_MUN"].head(5)],
        "mais_kwh": [mun(cd) for cd in mais_kwh["CD_MUN"].head(5)],
        "regioes": [{"nome": k, "nc": int(r.nc), "kwh": float(r.kwh), "kwh_nc": round(float(r.kwh_nc)), "pct": round(float(r.pct), 2)}
                    for k, r in reg.iterrows()],
        "arquivos": tam,
    })


# ------------------------------------------------------------------ 145 o tanque de cada cidade
# Fatores implícitos do Anuário (toe por 1000 L), conferidos em conferir(): gasolina C 0,770, etanol hidratado
# 0,510, óleo diesel 0,848; gás natural 0,993 toe por 1000 m³.
F_GASOLINA, F_ETANOL, F_DIESEL, F_GN, F_GLP = 0.770, 0.510, 0.848, 0.993, 0.611
COMPONENTES = ["etanol", "gasolina", "diesel"]
H_ANG = 230.0      # matiz OKLCh = H_ANG − ângulo no triângulo: etanol (90°) → 140 verde, gasolina (210°) → 20, diesel (330°) → 260
L0, L1, C1 = 0.91, 0.36, 0.115
VERT = {"etanol": (0.5, 3 ** 0.5 / 2), "gasolina": (0.0, 0.0), "diesel": (1.0, 0.0)}
CENTRO = (0.5, 3 ** 0.5 / 6)


def _oklch_hex(L: float, C: float, h: float) -> str:
    """OKLCh → sRGB, baixando o croma até caber na gama."""
    for _ in range(40):
        a, b = C * np.cos(np.radians(h)), C * np.sin(np.radians(h))
        l_ = L + 0.3963377774 * a + 0.2158037573 * b
        m_ = L - 0.1055613458 * a - 0.0638541728 * b
        s_ = L - 0.0894841775 * a - 1.2914855480 * b
        l, m, s = l_ ** 3, m_ ** 3, s_ ** 3
        rgb = [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
               -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
               -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s]
        if all(-1e-4 <= v <= 1.0001 for v in rgb):
            break
        C *= 0.93
    g = [12.92 * v if v <= 0.0031308 else 1.055 * max(v, 0) ** (1 / 2.4) - 0.055 for v in rgb]
    return "#" + "".join(f"{min(255, max(0, round(v * 255))):02x}" for v in g)


def centrar(x: np.ndarray, centro: np.ndarray) -> np.ndarray:
    """Perturbação pelo inverso do centro (Schöley, 2021): a composição do estado vai para o meio do triângulo."""
    y = x / centro
    return y / y.sum(axis=-1, keepdims=True)


def xy(p: np.ndarray) -> np.ndarray:
    v = np.array([VERT[k] for k in COMPONENTES])
    return p @ v


def cor_ternaria(p: np.ndarray, raio: float) -> str:
    vx, vy = xy(p) - np.array(CENTRO)
    t = min(1.0, float(np.hypot(vx, vy)) / raio)
    ang = np.degrees(np.arctan2(vy, vx))
    return _oklch_hex(L0 - L1 * t, C1 * t, (H_ANG - ang) % 360)


def tanque() -> None:
    t = tabelas()
    der, gas = t["derivados"], t["gas"]
    m = municipios()
    m = m.join(der[["gasolina_l", "etanol_l", "diesel_l"]], on="CD_MUN")
    m["gnv_m3"] = m["CD_MUN"].map(gas["automotivo_m3"]).fillna(0)
    m["etanol_toe"] = m["etanol_l"] * F_ETANOL / 1000
    m["gasolina_toe"] = m["gasolina_l"] * F_GASOLINA / 1000
    m["diesel_toe"] = m["diesel_l"] * F_DIESEL / 1000
    m["gnv_toe"] = m["gnv_m3"] * F_GN / 1000
    x = m[[f"{k}_toe" for k in COMPONENTES]].to_numpy(float)
    tot = x.sum(axis=1)
    sem = tot <= 0
    est = x.sum(axis=0)
    centro = est / est.sum()
    p = np.where(sem[:, None], np.nan, x / np.where(sem, 1, tot)[:, None])
    pc = np.where(sem[:, None], np.nan, centrar(np.nan_to_num(p, nan=1 / 3), centro))
    d = np.hypot(*(xy(np.nan_to_num(pc, nan=1 / 3)) - np.array(CENTRO)).T)
    raio = float(np.nanpercentile(d[~sem], 95))
    for i, k in enumerate(COMPONENTES):
        m[f"pct_{k}"] = np.round(100 * p[:, i], 1)
    m["gj_hab"] = np.round((tot + m["gnv_toe"]) * TEP_GJ / m["populacao_2022"], 2)
    m["pct_gnv"] = np.round(100 * m["gnv_toe"] / (tot + m["gnv_toe"]).replace(0, np.nan), 2)
    m["cor"] = [None if s else cor_ternaria(q, raio) for s, q in zip(sem, pc)]
    print(f"  composição do estado (energia): etanol {100 * centro[0]:.1f}%, gasolina C {100 * centro[1]:.1f}%, diesel {100 * centro[2]:.1f}%;"
          f" GNV {100 * m['gnv_toe'].sum() / (est.sum() + m['gnv_toe'].sum()):.2f}% · raio {raio:.3f} · sem venda: {', '.join(m.loc[sem, 'NM_MUN'])}")
    gj_est = (est.sum() + m["gnv_toe"].sum()) * TEP_GJ / m["populacao_2022"].sum()
    print(f"  {gj_est:.1f} GJ por habitante no estado; mediana dos municípios {m['gj_hab'].median():.1f}")
    pos = posicao(m)
    idx = m.set_index("CD_MUN")

    def mun(cd: str) -> dict:
        r = idx.loc[cd]
        return {"cd": cd, "nome": r["NM_MUN"], "pop": int(r["populacao_2022"]), "etanol": float(r["pct_etanol"]),
                "gasolina": float(r["pct_gasolina"]), "diesel": float(r["pct_diesel"]), "gj_hab": float(r["gj_hab"]),
                "cor": r["cor"], "coord": coord(pos[cd])}

    v = m[~sem & (m["populacao_2022"] >= 20000)]
    dominante = pd.Series(np.array(COMPONENTES)[np.nanargmax(np.nan_to_num(p, nan=-1), axis=1)], index=m.index)[~sem]
    acima = {k: int((p[~sem, i] > centro[i]).sum()) for i, k in enumerate(COMPONENTES)}
    print(f"  maior parte: {dominante.value_counts().to_dict()} · acima do estado: {acima}")
    for k in COMPONENTES:
        r = v.sort_values(f"pct_{k}", ascending=False).iloc[0]
        print(f"    mais {k} (≥ 20 mil hab.): {r.NM_MUN} {r[f'pct_{k}']}%")
    cols = ["CD_MUN", "NM_MUN", "CD_RGINT", "NM_RGINT", "populacao_2022", "etanol_l", "gasolina_l", "diesel_l", "gnv_m3",
            "etanol_toe", "gasolina_toe", "diesel_toe", "gnv_toe", "pct_etanol", "pct_gasolina", "pct_diesel", "pct_gnv",
            "gj_hab", "cor"]
    mm = m[cols + ["geometry"]].copy()
    for k in ["etanol_toe", "gasolina_toe", "diesel_toe", "gnv_toe"]:
        mm[k] = mm[k].round(1)
    # Estilo do QGIS: preenchimento pela cor gravada no campo «cor» (a mesma da prancha).
    dd = ('<data_defined_properties><Option type="Map"><Option name="name" value="" type="QString"/>'
          '<Option name="properties" type="Map"><Option name="fillColor" type="Map">'
          '<Option name="active" value="true" type="bool"/>'
          '<Option name="expression" value="coalesce(&quot;cor&quot;, \'#d5d9dd\')" type="QString"/>'
          '<Option name="type" value="3" type="int"/></Option></Option>'
          '<Option name="type" value="collection" type="QString"/></Option></data_defined_properties>')
    sym = preenchimento("#d5d9dd", "#ffffff", 0.05).replace("</layer>", dd + "</layer>")
    estilo_cor = estilo_regras("poligono", [("TRUE", "composição centrada (campo cor)", sym)])
    estilo_dom = estilo_regras("poligono", [
        (f"&quot;pct_{k}&quot; &gt;= max(&quot;pct_etanol&quot;, &quot;pct_gasolina&quot;, &quot;pct_diesel&quot;)", r,
         preenchimento(c, "#ffffff", 0.05))
        for k, r, c in [("etanol", "etanol hidratado é a maior parte", "#4f8a5b"), ("gasolina", "gasolina C é a maior parte", "#c0613a"),
                        ("diesel", "óleo diesel é a maior parte", "#3f6aa0")]])
    estilos = {"municipios": [("composicao", "Combustíveis rodoviários: composição em energia, centrada na do estado", estilo_cor, True),
                              ("dominante", "Combustível com a maior parte da energia", estilo_dom, False)]} | ESTILOS_REF
    tam = gravar("tanque", {"municipios": mm, "regioes_intermediarias": rgint(m), "limite_estadual": limite(m)},
                 estilos, mm.drop(columns="geometry"))
    # Pontos do triângulo (composição centrada) para a legenda.
    pts = [[round(float(a), 4) for a in q] + [c] for q, c, s in zip(pc, m["cor"], sem) if not s]
    reg = m[~sem].groupby("NM_RGINT")[[f"{k}_toe" for k in COMPONENTES]].sum()
    gravar_cache(f"{COL}-tanque", {
        "centro": [round(float(v_), 5) for v_ in centro], "raio": round(raio, 5),
        "cor": {"h_ang": H_ANG, "L0": L0, "L1": L1, "C1": C1},
        "toe": {k: round(float(est[i])) for i, k in enumerate(COMPONENTES)} | {"gnv": round(float(m["gnv_toe"].sum()))},
        "gj_hab_estado": round(gj_est, 2), "gj_hab_mediana": round(float(m["gj_hab"].median()), 2),
        "gnv_municipios": int((m["gnv_m3"] > 0).sum()),
        "dominante": dominante.value_counts().to_dict(), "acima": acima,
        "sem_venda": list(m.loc[sem, "NM_MUN"]),
        "municipios": {cd: c_ for cd, c_ in zip(m["CD_MUN"], m["cor"])},
        "pontos": pts,
        "mais": {k: [mun(cd) for cd in v.sort_values(f"pct_{k}", ascending=False)["CD_MUN"].head(5)] for k in COMPONENTES},
        "capital": mun("3550308"),
        "regioes": [{"nome": k, **{c: round(100 * float(r[f"{c}_toe"]) / float(r.sum()), 1) for c in COMPONENTES}} for k, r in reg.iterrows()],
        "arquivos": tam,
    })


# ------------------------------------------------------------------ 146 gás de cano, gás de botijão
CORES_BIV = [  # [gás canalizado 0, 1, 2][GLP terço 0, 1, 2]
    ["#e9e9e6", "#ecd3a5", "#d9a053"],
    ["#c3d1de", "#c6b8a2", "#b98a55"],
    ["#7b9cc0", "#7f879a", "#6b5546"],
]


def gas() -> None:
    t = tabelas()
    g, der = t["gas"], t["derivados"]
    m = municipios()
    for k in GAS:
        m[f"gn_{k}_m3"] = m["CD_MUN"].map(g[f"{k}_m3"]).fillna(0)
    m["gn_consumidores"] = m["CD_MUN"].map(g["total_nc"]).fillna(0).astype(int)
    m["gn_residencial_nc"] = m["CD_MUN"].map(g["residencial_nc"]).fillna(0).astype(int)
    # Gás canalizado de uso fixo: tudo menos o automotivo (GNV) e a termogeração (usinas elétricas).
    m["gn_fixo_m3"] = m["gn_total_m3"] - m["gn_automotivo_m3"] - m["gn_termogeracao_m3"]
    m["glp_kg"] = m["CD_MUN"].map(der["glp_kg"]).clip(lower=0)
    m["gn_fixo_gj_hab"] = (m["gn_fixo_m3"] * F_GN / 1000 * TEP_GJ / m["populacao_2022"]).round(3)
    m["glp_kg_hab"] = (m["glp_kg"] / m["populacao_2022"]).round(2)
    m["glp_gj_hab"] = (m["glp_kg"] * F_GLP / 1000 * TEP_GJ / m["populacao_2022"]).round(3)
    pos_gn = m.loc[m["gn_fixo_m3"] > 0, "gn_fixo_gj_hab"]
    med_gn = float(pos_gn.median())
    t1, t2 = (float(v) for v in m["glp_kg_hab"].quantile([1 / 3, 2 / 3]))
    m["classe_gn"] = np.where(m["gn_fixo_m3"] <= 0, 0, np.where(m["gn_fixo_gj_hab"] <= med_gn, 1, 2))
    m["classe_glp"] = np.digitize(m["glp_kg_hab"], [t1, t2], right=True)
    m["classe"] = m["classe_gn"] * 3 + m["classe_glp"]
    m["cor"] = [CORES_BIV[a][b] for a, b in zip(m["classe_gn"], m["classe_glp"])]
    grade = [[int(((m["classe_gn"] == a) & (m["classe_glp"] == b)).sum()) for b in range(3)] for a in range(3)]
    pop = m["populacao_2022"].sum()
    com = m[m["gn_fixo_m3"] > 0]
    sem = m[m["gn_fixo_m3"] <= 0]
    gn_tot = float(m["gn_fixo_m3"].sum() * F_GN / 1000)
    glp_tot = float(m["glp_kg"].sum() * F_GLP / 1000)
    print(f"  gás canalizado de uso fixo em {len(com)} municípios ({100 * com['populacao_2022'].sum() / pop:.1f}% da população); mediana {med_gn:.2f} GJ/hab")
    print(f"  GLP: terços em {t1:.1f} e {t2:.1f} kg/hab; estado {m['glp_kg'].sum() / pop:.1f} kg/hab; {100 * sem['glp_kg'].sum() / m['glp_kg'].sum():.1f}% do GLP nos sem gás de cano")
    print(f"  energia: gás canalizado fixo {gn_tot:,.0f} toe, GLP {glp_tot:,.0f} toe; grade {grade}")
    alto_sem = sem[sem["classe_glp"] == 2]
    print(f"  sem gás de cano e GLP no terço de cima: {len(alto_sem)} municípios, {100 * alto_sem['glp_kg'].sum() / m['glp_kg'].sum():.1f}% do GLP")
    pos = posicao(m)
    idx = m.set_index("CD_MUN")

    def mun(cd: str) -> dict:
        r = idx.loc[cd]
        return {"cd": cd, "nome": r["NM_MUN"], "pop": int(r["populacao_2022"]), "glp_kg_hab": float(r["glp_kg_hab"]),
                "glp_t": round(float(r["glp_kg"]) / 1000), "gn_gj_hab": float(r["gn_fixo_gj_hab"]),
                "gn_m3": float(r["gn_fixo_m3"]), "classe_gn": int(r["classe_gn"]), "coord": coord(pos[cd])}

    for r in m.sort_values("glp_kg_hab", ascending=False).head(12).itertuples():
        print(f"    {r.NM_MUN}: {r.glp_kg_hab:.0f} kg/hab, {r.glp_kg / 1000:,.0f} t, gás de cano {r.gn_fixo_gj_hab:.2f} GJ/hab")
    classes_gn = {"industrial": float(m["gn_industrial_m3"].sum()), "cogeracao": float(m["gn_cogeracao_m3"].sum()),
                  "residencial": float(m["gn_residencial_m3"].sum()), "comercial": float(m["gn_comercial_m3"].sum())}
    cols = ["CD_MUN", "NM_MUN", "CD_RGINT", "NM_RGINT", "populacao_2022", "gn_consumidores", "gn_residencial_nc"] + \
        [f"gn_{k}_m3" for k in GAS] + ["gn_fixo_m3", "gn_fixo_gj_hab", "glp_kg", "glp_kg_hab", "glp_gj_hab",
                                       "classe_gn", "classe_glp", "classe", "cor"]
    mm = m[cols + ["geometry"]].copy()
    rot_gn = ["sem gás canalizado", "gás canalizado até a mediana", "gás canalizado acima da mediana"]
    rot_glp = [f"GLP até {t1:.0f} kg/hab".replace(".", ","), f"GLP de {t1:.0f} a {t2:.0f} kg/hab", f"GLP acima de {t2:.0f} kg/hab"]
    estilo = estilo_regras("poligono", [(f"&quot;classe&quot; = {a * 3 + b}", f"{rot_gn[a]} · {rot_glp[b]}", preenchimento(CORES_BIV[a][b], "#ffffff", 0.05))
                                        for a in range(3) for b in range(3)])
    estilos = {"municipios": [("bivariado", "Gás canalizado de uso fixo × GLP, por habitante", estilo, True)]} | ESTILOS_REF
    tam = gravar("gas", {"municipios": mm, "regioes_intermediarias": rgint(m), "limite_estadual": limite(m)},
                 estilos, mm.drop(columns="geometry"))
    gravar_cache(f"{COL}-gas", {
        "cores": CORES_BIV, "grade": grade, "mediana_gn_gj_hab": round(med_gn, 3), "terco_glp": [round(t1, 1), round(t2, 1)],
        "com_gn": len(com), "pct_pop_com_gn": round(100 * com["populacao_2022"].sum() / pop, 1),
        "pct_glp_sem_gn": round(100 * sem["glp_kg"].sum() / m["glp_kg"].sum(), 1),
        "pct_pop_sem_gn": round(100 * sem["populacao_2022"].sum() / pop, 1),
        "glp_kg_hab_estado": round(float(m["glp_kg"].sum() / pop), 1), "glp_kg_hab_mediana": round(float(m["glp_kg_hab"].median()), 1),
        "glp_kt": round(float(m["glp_kg"].sum()) / 1e6), "gn_fixo_mm3": round(float(m["gn_fixo_m3"].sum()) / 1e6),
        "toe_gn_fixo": round(gn_tot), "toe_glp": round(glp_tot),
        "glp_toe_sem_gn": round(float(sem["glp_kg"].sum() * F_GLP / 1000)), "gn_classes_m3": classes_gn,
        "alto_sem": {"n": len(alto_sem), "pct_glp": round(100 * alto_sem["glp_kg"].sum() / m["glp_kg"].sum(), 1)},
        "gn_residencial_municipios": int((m["gn_residencial_nc"] > 0).sum()),
        "municipios": {cd: c_ for cd, c_ in zip(m["CD_MUN"], m["cor"])},
        "mais_glp": [mun(cd) for cd in m.sort_values("glp_kg_hab", ascending=False)["CD_MUN"].head(10)],
        "mais_glp_sem_gn_20mil": [mun(cd) for cd in sem[sem["populacao_2022"] >= 20000].sort_values("glp_kg_hab", ascending=False)["CD_MUN"].head(5)],
        "mais_gn": [mun(cd) for cd in com.sort_values("gn_fixo_gj_hab", ascending=False)["CD_MUN"].head(5)],
        "capital": mun("3550308"),
        "arquivos": tam,
    })


TEMAS = {"conferir": conferir, "roca": roca, "tanque": tanque, "gas": gas}

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("tema", choices=[*TEMAS, "todos"])
    a = ap.parse_args()
    for nome, fn in TEMAS.items():
        if a.tema in (nome, "todos"):
            print(f"· {nome}", flush=True)
            fn()
