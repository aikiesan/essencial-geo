"""
Coleção «O ritmo da biomassa» (Brasil) — resume a geração horária do ONS por usina e mês (uso interno).

    .venv-geo/Scripts/python -I -X utf8 scripts/colecoes/ritmo-biomassa-br/extrair_ons.py < /dev/null

Lê dados-brutos/ons-geracao-usina/GERACAO_USINA-2_*.parquet («Geração por usina em base horária», 2015–2025;
baixado por animacoes/safra-e-seca/baixar.sh) e grava em scripts/colecoes/cache/:
  ritmo-biomassa-br-ons-usinas.csv   uma linha por usina × mês, para os combustíveis em que há biomassa no ONS
                                     («Biomassa»; «Resíduos Industriais», onde estão as fábricas de celulose;
                                     «Outras Multi-Combustível», as pequenas térmicas somadas por estado):
                                     MWh, horas com dado, horas com geração > 0, maior valor horário
  ritmo-biomassa-br-ons-fontes.csv   todas as fontes, uma linha por subsistema × combustível × mês: MWh
Os parquet levam uns 15 minutos para ler; preparar.py só usa estes dois resumos.
"""
from __future__ import annotations

import sys
from pathlib import Path

import pandas as pd
import pyarrow.parquet as pq

RAIZ = Path(__file__).resolve().parents[3]
BRUTO = RAIZ / "dados-brutos" / "ons-geracao-usina"
CACHE = RAIZ / "scripts" / "colecoes" / "cache"
COMBUSTIVEIS = ["Biomassa", "Resíduos Industriais", "Outras Multi-Combustível"]
CHAVE = ["nom_tipocombustivel", "ceg", "id_ons", "nom_usina", "cod_modalidadeoperacao", "id_estado", "id_subsistema"]

arquivos = sorted(BRUTO.glob("GERACAO_USINA-2_*.parquet"))
if len(arquivos) != 7 + 48:
    sys.exit(f"esperava 55 arquivos em {BRUTO}, achei {len(arquivos)}")
usinas, fontes = [], []
for arq in arquivos:
    t = pq.read_table(arq, columns=["din_instante", "id_subsistema", "id_estado", "cod_modalidadeoperacao",
                                    "nom_tipocombustivel", "nom_usina", "id_ons", "ceg", "val_geracao"]).to_pandas()
    t["v"] = pd.to_numeric(t["val_geracao"], errors="coerce")  # MW médios na hora = MWh
    t["mes"] = t["din_instante"].dt.strftime("%Y-%m")
    t["id_subsistema"] = t["id_subsistema"].str.strip()
    fontes.append(t.groupby(["mes", "id_subsistema", "nom_tipocombustivel"], as_index=False)["v"].sum())
    b = t[t["nom_tipocombustivel"].isin(COMBUSTIVEIS)].copy()
    for c in ["id_estado", "ceg", "id_ons", "nom_usina", "cod_modalidadeoperacao"]:
        b[c] = b[c].astype(str).str.strip()
    b["com_dado"] = b["v"].notna().astype(int)
    b["positiva"] = (b["v"] > 0).astype(int)
    usinas.append(b.groupby(CHAVE + ["mes"], as_index=False).agg(
        mwh=("v", "sum"), horas=("com_dado", "sum"), horas_pos=("positiva", "sum"), mw_max=("v", "max")))
    print(arq.name, len(t), len(b), flush=True)

u = pd.concat(usinas).groupby(CHAVE + ["mes"], as_index=False).agg(
    mwh=("mwh", "sum"), horas=("horas", "sum"), horas_pos=("horas_pos", "sum"), mw_max=("mw_max", "max"))
u.to_csv(CACHE / "ritmo-biomassa-br-ons-usinas.csv", index=False, encoding="utf-8")
f = pd.concat(fontes).groupby(["mes", "id_subsistema", "nom_tipocombustivel"], as_index=False)["v"].sum().rename(columns={"v": "mwh"})
f.to_csv(CACHE / "ritmo-biomassa-br-ons-fontes.csv", index=False, encoding="utf-8")
print(len(u), "usina × mês ·", u["nom_usina"].nunique(), "usinas ·", len(f), "subsistema × combustível × mês")
