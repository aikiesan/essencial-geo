---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Soy, tallow and the rest"
subtitulo: "One litre in every hundred of pump diesel comes from cattle fat"
contexto: >-
  In the twelve months to September 2026, Brazil’s plants used 10.6 million m³ of feedstock to make biodiesel: 72.7% soybean oil and 6.9% beef tallow, 733 thousand m³. With 15% biodiesel in pump diesel, about one litre in every hundred comes from cattle fat. Tallow’s share was 14.3% in 2017 and fell to 5.8% in 2023, but its volume has grown 27% since 2017. In Rondônia, 60% of biodiesel comes from tallow; in Minas Gerais, 35%; in Pará, 31%. Bahia is the state that uses the most tallow, with 154 thousand m³. Piauí, Tocantins and Mato Grosso do Sul make biodiesel almost entirely from soy. Second plate in the collection «Where biodiesel comes from».
imagem_alt: "Three maps of Brazil in Albers conic projection, by state, for 10/2025–09/2026: soybean oil’s share of biodiesel feedstock, darkest in Piauí, Tocantins and Mato Grosso do Sul; beef tallow’s share, darkest in Rondônia, Minas Gerais and Pará; and the 2024 cattle herd with circles for the tallow used in each state, the largest in Bahia and Rio Grande do Sul. In the fourth frame, stacked bars of the national feedstock mix from 2017 to the last twelve months, with tallow’s share falling from 14.3% to 6.9%. In the panel, the mix in each of the 14 states that make biodiesel, with tallow’s share and the herd."
metodo: "Feedstock declared by the plants to the ANP, in m³ by state and product, summed over the twelve months from 10/2025 to 09/2026 and grouped into six classes; each class’s share is its volume over the state total. 2024 cattle herd from IBGE’s PPM, summed by state."
---

# Soy, tallow and the rest: biodiesel feedstock by state and the cattle herd

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 151, the second in the collection **Where biodiesel comes from**. After the plants, what
goes into them: how much is soy, how much is beef tallow and how much is the rest.

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `ufs` | polygon | 27 states: `mp_total_m3`; for each class (`soja`, `sebo`, `outras_gorduras`, `outros_oleos`, `fritura`, `outros_materiais`), `_m3` and `_pct`; `bovinos_2024`, `sebo_l_por_boi`, `classe_sebo`, `classe_soja`, `classe_boi` |
| `sebo_volume` | point | 10 states with tallow in their biodiesel: `SIGLA_UF`, `sebo_m3`, `sebo_pct`, `bovinos_2024` |
| `limite_nacional` | polygon | national outline |

The **GPKG** is zipped and attached to the
[`biodiesel-br-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/biodiesel-br-2026),
with three **QGIS styles** on the `ufs` layer (tallow, soy and herd) and the tallow circles. The
**CSV** sits in this folder, in UTF-8, with the state table and no geometry.

## Method

1. Open data from the ANP Biodiesel Producers Dynamic Panel (`pb-da-biodiesel.zip`, downloaded on
   01/11/2026, files dated 27/10/2026): `Biodiesel_DadosAbertos_CSV_MatériaPrima.csv`, feedstock in
   m³ by state, product and month, from 2017 to 09/2026.
2. The ANP products were grouped into six classes: soybean oil (with soy fatty acid); beef tallow
   (beef fat); pork and chicken fat; other vegetable oils (cotton, palm, palm kernel, maize, canola
   and sunflower); used cooking oil; and «other fatty materials» with «other fatty acids», the ANP’s
   own categories with no origin given.
3. Each class’s share is its volume over the state total in the twelve months from 10/2025 to
   09/2026. The fourth frame does the same sum for Brazil in each year from 2017 to 2025 and in
   those twelve months.
4. 2024 cattle herd from the Municipal Livestock Survey (SIDRA table 3939), summed by state. 28
   municipalities with a confidential value («...») are left out of the sum; most are in São Paulo.
5. The phrase «one litre in every hundred» multiplies tallow’s share (6.9%) by the mandatory 15%
   biodiesel blend in diesel, in force since 08/2025: about 1.0%.

## Reading

- Of the 10.6 million m³ of feedstock, 72.7% was soybean oil, 14.5% other fatty materials, 6.9%
  beef tallow, 3.3% other vegetable oils, 1.5% pork and chicken fat and 1.1% used cooking oil.
- Tallow was 14.3% of feedstock in 2017 (577 thousand m³) and fell to 5.8% in 2023; its volume,
  however, grew 27% to the last twelve months (733 thousand m³), because biodiesel grew faster.
- In Rondônia, 60.0% of feedstock is tallow; in Minas Gerais, 35.1%; in Pará, 31.3%; in Bahia,
  18.2%. By volume, Bahia leads (154 thousand m³), followed by Rio Grande do Sul (141 thousand) and
  Mato Grosso (112 thousand).
- Piauí makes biodiesel from soy alone (100%), Tocantins nearly so (98.1%), and Mato Grosso do Sul
  too (95.3%). Rio de Janeiro and Minas Gerais use no soy.
- Brazil had 238 million cattle in 2024; the 14 states that make biodiesel hold 205 million. Mato
  Grosso has the largest herd (32.9 million) but uses 3.4 litres of tallow per head; Rio Grande do
  Sul, 12.2.

## Limitations

- Feedstock is counted in the state of the plant, not the state where the animal was slaughtered;
  tallow travels.
- «Other fatty materials» (14.5% nationally, 65.5% in São Paulo and 58.4% in Santa Catarina) gives
  no origin and may hide more tallow, animal fat or used oil.
- Volumes are as declared to the ANP, in m³ of feedstock, not m³ of biodiesel; the difference is
  small, but real.
- The 2024 herd is a year-end snapshot; it is not the number of cattle slaughtered.

## Data licence

ANP and IBGE open data, free to use with attribution.
