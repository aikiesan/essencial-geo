"""
Coleção «A safra de cada estado» (Brasil) — converte os relatórios mensais do SAPCana (MAPA) de .xls para um CSV longo.

    "C:/Program Files (x86)/PYTHON/python.exe" -I -X utf8 scripts/colecoes/sapcana-br/converter_xls.py

O .venv-geo não tem leitor de .xls antigo (BIFF); este passo roda no Python do sistema, que tem o xlrd.
Lê dados-brutos/mapa-sapcana/<safra>/<AAAA-MM-01>.xls (só leitura) e grava
scripts/colecoes/cache/sapcana-br-acumulado.csv: uma linha por relatório × UF, com os acumulados da safra
(cana, açúcar, etanol total, anidro e hidratado) de «Período inicial» a «Período final».
"""

from __future__ import annotations

import csv
import re
from pathlib import Path

import xlrd

RAIZ = Path(__file__).resolve().parents[3]
BRUTOS = RAIZ / "dados-brutos" / "mapa-sapcana"
SAIDA = RAIZ / "scripts" / "colecoes" / "cache" / "sapcana-br-acumulado.csv"
DATA = re.compile(r"(\d{2})/(\d{2})/(\d{4})")


def iso(texto: str) -> str:
    d, m, a = DATA.search(texto).groups()
    return f"{a}-{m}-{d}"


def main() -> None:
    linhas = []
    for arq in sorted(BRUTOS.glob("*/*.xls")):
        s = xlrd.open_workbook(str(arq)).sheet_by_index(0)
        bloco = None
        for r in range(s.nrows):
            v = s.row_values(r)
            c0 = str(v[0]).strip()
            if c0.startswith("Safra:"):
                bloco = {"safra": c0.split(":")[1].strip(), "regiao": str(v[6]).split(":")[1].strip(),
                         "inicio": iso(str(v[10])), "fim": iso(str(v[15]))}
                continue
            if bloco and c0 != "UF" and re.fullmatch(r"[A-Z]{2}", c0):
                linhas.append({"relatorio": arq.stem, **bloco, "uf": c0,
                               "cana_t": v[1], "acucar_t": v[2], "etanol_m3": v[5], "anidro_m3": v[6], "hidratado_m3": v[13]})
            if c0 == "Tot.":
                bloco = None
    SAIDA.parent.mkdir(parents=True, exist_ok=True)
    with SAIDA.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(linhas[0]))
        w.writeheader()
        w.writerows(linhas)
    print(len(linhas), "linhas →", SAIDA)


if __name__ == "__main__":
    main()
