"""
Coleção «Quarenta anos de biomassa» (Brasil) — extrai da planilha de estatísticas do MapBiomas (coleção 11)
a área de cada classe por município e ano, 1985–2025, somando os biomas (uso interno).

    .venv-geo/Scripts/python -I -X utf8 scripts/colecoes/quarenta-anos-de-biomassa-br/extrair.py < /dev/null

Entrada: dados-brutos/mapbiomas/estatisticas_municipios/MAPBIOMAS_BRAZIL-COL.11-BIOME_STATE_MUNICIPALITY.xlsx
(aba COVERAGE_11, área em hectares). Saída: scripts/colecoes/cache/quarenta-anos-de-biomassa-br-cobertura.csv.gz,
uma linha por município e classe (todas as classes de nível 4), colunas y1985…y2025.
"""

from pathlib import Path

import pandas as pd

RAIZ = Path(__file__).resolve().parents[3]
XLSX = RAIZ / "dados-brutos" / "mapbiomas" / "estatisticas_municipios" / "MAPBIOMAS_BRAZIL-COL.11-BIOME_STATE_MUNICIPALITY.xlsx"
SAIDA = RAIZ / "scripts" / "colecoes" / "cache" / "quarenta-anos-de-biomassa-br-cobertura.csv.gz"

d = pd.read_excel(XLSX, sheet_name="COVERAGE_11", dtype={"geocode": str}, engine="openpyxl")
anos = [c for c in d.columns if str(c).startswith("y")]
print(len(d), "linhas;", anos[0], "a", anos[-1])
print(d[["class", "class_level_4"]].drop_duplicates().sort_values("class").to_string())
g = d.groupby(["geocode", "class"], as_index=False)[anos].sum()
n = d.groupby(["geocode", "class"]).size()
print("municípios:", g["geocode"].nunique(), "· pares município-classe em mais de um bioma:", int((n > 1).sum()))
SAIDA.parent.mkdir(parents=True, exist_ok=True)
g.to_csv(SAIDA, index=False, compression="gzip", float_format="%.2f")
legenda = d[["class", "class_level_4"]].drop_duplicates().sort_values("class")
legenda.to_csv(SAIDA.with_name("quarenta-anos-de-biomassa-br-legenda.csv"), index=False)
nomes = d[["geocode", "municipality", "state"]].drop_duplicates("geocode")
nomes.to_csv(SAIDA.with_name("quarenta-anos-de-biomassa-br-nomes.csv"), index=False)
print(SAIDA, SAIDA.stat().st_size)
