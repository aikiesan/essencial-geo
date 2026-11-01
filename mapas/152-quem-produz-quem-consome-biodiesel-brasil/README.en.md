---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Who makes it, who burns it"
subtitulo: "Biodiesel is born in the Centre-West and the South and travels to the Southeast"
contexto: >-
  Pump diesel has carried 15% biodiesel since August 2025. In the twelve months to September 2026, Brazil sold 70 million m³ of diesel and 10.2 million m³ of biodiesel, 14.6% of the total. Only 6 states make more biodiesel than their diesel calls for: Mato Grosso and Rio Grande do Sul each have a surplus of over 1.7 million m³, and Goiás 0.9 million. São Paulo makes 15% of what it needs and falls short by 1.75 million m³; Minas Gerais by 1.18 million. 13 states have no plant. Of biodiesel sales, 44% crossed a regional border: 1.7 million m³ from the South to the Southeast and 1.5 million from the Centre-West to the Southeast. Third and last plate in the collection «Where biodiesel comes from».
imagem_alt: "Map of Brazil in Albers conic projection with the states coloured by biodiesel balance in 10/2025–09/2026, estimated output minus diesel sold × 15%, in seven classes from green (surplus) to brown (shortfall). Mato Grosso and Rio Grande do Sul are in the darkest green; São Paulo and Minas Gerais in the darkest brown. Curved arrows between the regions show biodiesel sales from producer to distributor, the largest from the South and the Centre-West to the Southeast; callouts point to Mato Grosso, which makes 3.7 times what it uses, and São Paulo, which makes 15%. In the panel, a table of the five regions with output, demand, what stays and what leaves, and bars of the balance of the surplus states and the five largest shortfalls."
metodo: "Balance of each state in 10/2025–09/2026 = estimated biodiesel output (the state’s feedstock × the region’s output ÷ feedstock) minus estimated demand (diesel sold in the state × 15%); arrows = biodiesel sales between regions, from producer to distributor (ANP)."
---

# Who makes it, who burns it: each state’s biodiesel balance and the route between regions

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 152, the third and last in the collection **Where biodiesel comes from**. After the
plants and the feedstock, each state’s account: how much biodiesel it makes and how much its diesel
calls for.

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `ufs` | polygon | 27 states: `diesel_m3`, `demanda_m3` (diesel × 15%), `producao_m3` (estimated), `saldo_m3`, `cobertura_pct` (output ÷ demand), `classe` |
| `fluxos` | line | biodiesel sales between regions: `origem`, `destino`, `vendas_m3`, between points chosen in each region |
| `regioes` | polygon | 5 macro-regions: `producao_m3`, `demanda_m3`, `vendas_origem_m3`, `vendas_destino_m3`, `fica_na_regiao_m3` |
| `limite_nacional` | polygon | national outline |

The **GPKG** is zipped and attached to the
[`biodiesel-br-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/biodiesel-br-2026),
with **QGIS styles** stored inside (balance in seven classes and the flow lines). The **CSV** sits
in this folder, in UTF-8, with the state table and no geometry.

## Method

1. Diesel: ANP diesel oil sales by state and month (`vendas-combustiveis-m3-1990-2025.csv`, which
   runs to 09/2026), summed over the twelve months from 10/2025 to 09/2026: 70.0 million m³.
2. Estimated biodiesel demand = diesel sold × 15%, the mandatory blend since 01/08/2025 (CNPE
   Resolution No. 9/2025). The effective national blend, biodiesel sales ÷ diesel sales, was 14.6%
   over those twelve months, between 14.2% and 15.0% from month to month.
3. Output by state: the ANP publishes output by region only. Each state’s output was estimated as
   the feedstock declared in the state (plate 151) times the region’s output ÷ feedstock ratio, which
   is close to 1 (from 0.963 in the South to 1.006 in the North).
4. Balance = estimated output − estimated demand; coverage = output ÷ demand. Seven classes, from
   «short by over 1 million m³» to «surplus of over 1 million m³», with ±100 thousand m³ as balance.
5. Flows: `Biodiesel_DadosAbertos_CSV_Vendas.csv`, biodiesel sales from the producer’s region to the
   distributor’s region, summed over the twelve months. The arrows show flows above 20 thousand m³.

## Reading

- Nationally, 10.2 million m³ of biodiesel were sold and 10.4 million produced over the twelve
  months.
- Mato Grosso makes 2.41 million m³ and its diesel calls for 0.65 million: a surplus of 1.76
  million, 3.7 times what it uses. Rio Grande do Sul has a surplus of 1.71 million; Goiás, 0.86
  million; Paraná, 0.30; Bahia, 0.28; Mato Grosso do Sul, 0.09.
- São Paulo makes 0.32 million m³ and its diesel calls for 2.07 million: it is short by 1.75
  million (15% coverage). Minas Gerais is short by 1.18 million; Rio de Janeiro, 0.30; Maranhão,
  0.27; Pará, 0.26. 13 states have no plant.
- By region, in thousand m³ (output / demand): Centre-West 4,236 / 1,588; South 4,096 / 2,102;
  Northeast 928 / 1,702; Southeast 591 / 4,047; North 536 / 1,060.
- 4.5 million m³, 44% of sales, crossed a regional border: 1.67 million from the South to the
  Southeast, 1.46 million from the Centre-West to the Southeast, 666 thousand from the Centre-West to
  the North, 417 thousand from the Centre-West to the Northeast and 127 thousand from the North to
  the Northeast.

## Limitations

- Output by state is estimated; the ANP publishes output by region only.
- Demand uses the nominal 15% blend; the effective blend was 14.6%, which takes about 2.4% off each
  state’s demand.
- Sales run from producer to distributor: the distributor’s region is not necessarily where the
  diesel is burnt. 6.9 thousand m³ have a destination «not stated».
- Diesel sold in one state may be burnt in another (lorries on the road); demand follows sales, not
  consumption.

## Data licence

ANP and IBGE open data, free to use with attribution.
