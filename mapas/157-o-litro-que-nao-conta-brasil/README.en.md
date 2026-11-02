---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "The litre that doesn’t count"
subtitulo: "In biodiesel, less than half of certified volume earns carbon credits"
contexto: >-
  A RenovaBio-certified plant does not earn CBIOs on every litre it sells: only on the share made from eligible biomass, which meets the programme’s rules. Applied to the capacity authorised by the ANP, that share comes to 81.5% across the 327 ethanol and biodiesel plants with known capacity: 234 of 287 thousand m³ a day. Cane ethanol reaches 89.2%; corn ethanol, 73.6%; biodiesel, just 44.6%, with 29 of its 45 plants below half. So the map splits: São Paulo, almost all cane, is 93% eligible; Mato Grosso, with corn and biodiesel, 72%; Rio Grande do Sul, almost all biodiesel, 40%. Among biodiesel plants with similar shares, the score matters: those scoring above 70 issue 0.42 CBIO per m³ sold, those below 50, 0.24. Second plate in the collection «Each plant’s score».
imagem_alt: "Map of Brazil in Albers conic projection with states shaded by capacity-weighted eligible volume, in five classes from below 60% (terracotta) to 92% or more (green), and each certified ethanol and biodiesel plant drawn at its municipal seat as a ring proportional to authorised capacity with an inner disc proportional to the eligible share, coloured by route; diamonds mark the biomethane plants, which have no capacity data. São Paulo is the only state in the top class; Rio Grande do Sul, Santa Catarina, Tocantins, Piauí, Rio Grande do Norte and Sergipe sit in the lowest. One callout points to São Paulo, at 93%, and another to Rio Grande do Sul, at 40%. In the panel, bars of capacity and eligible share by route, with 89% for cane and 45% for biodiesel, and bars of the eligible percentage in the 14 states with most capacity."
metodo: "Eligible volume (%) from each plant’s valid certificate on 27/10/2026 multiplied by the plant’s authorised capacity in the last month of the ANP panels (ethanol: the larger of anhydrous and hydrous); state and route percentage = eligible capacity ÷ authorised capacity."
---

# The litre that doesn’t count: eligible volume of RenovaBio-certified plants, by route and by state

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 157, the second in the collection **Each plant’s score**. The score (No. 156) says how much
carbon each litre avoids; the eligible volume says how many litres count. The CBIOs a plant may issue are
volume sold × eligible share × the certificate’s factor, which comes from the score.

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `usinas` | point | 327 ethanol and biodiesel plants: the fields of No. 156 plus `cap_elegivel_m3d` and `cap_fora_m3d` (capacity × eligible share and the remainder, m³/day) |
| `biometano` | point | 10 biomethane plants, with no capacity |
| `ufs` | polygon | 27 states: `usinas`, `cap_m3d`, `cap_elegivel_m3d`, `eleg_ponderado_pct` |
| `limite_nacional` | polygon | national outline |

The **GPKG** is zipped and attached to the
[`renovabio-br-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/renovabio-br-2026),
with **QGIS styles** stored inside (states by eligible percentage; capacity ring and eligible disc). The
**CSV** sits in this folder, in UTF-8, with the plant table and no geometry.

## Method

1. Eligible volume (%) from each plant’s valid certificate, in the ANP spreadsheet of 27/10/2026: the share
   of output made from biomass that meets RenovaBio’s eligibility criteria, proven supplier by supplier.
   The rest is sold as usual but earns no CBIOs.
2. Authorised capacity (m³/day) by CNPJ, in the plant’s last month in the ANP panels (ethanol: 08/2026, the
   larger of anhydrous and hydrous, as in the ethanol collection; biodiesel: 09/2026). One plant appears
   only in an earlier month and enters with its last published capacity.
3. Eligible capacity = capacity × eligible volume. A state’s or route’s percentage is total eligible
   capacity over total capacity: an average weighted by plant size.
4. The 10 biomethane plants and one ethanol plant missing from the panels (no capacity) are left out of
   the sums; the biomethane plants appear as diamonds, unsized.
5. CBIO per m³ = the certificate’s emission factor (tCO₂eq per litre) × 1,000 × eligible volume.

## Reading

- 81.5% of certified capacity is eligible: 234.2 of 287.4 thousand m³/day. Ethanol, 86.9% (217.8 of
  250.6 thousand); biodiesel, 44.6% (16.4 of 36.9 thousand).
- By route: cane ethanol 89.2% (plant median 93.0%), corn ethanol 73.6%, cane and corn 73.6%, biodiesel
  44.6% (median 39.7%). 29 of the 45 biodiesel plants and 8 of the 265 cane mills are below 50%.
- By state, among those with most capacity: São Paulo 93.0%, Minas Gerais 88.4%, Paraná 85.1%, Mato Grosso
  do Sul 79.9%, Goiás 78.8%, Mato Grosso 72.4%, Bahia 62.1%, Rio Grande do Sul 39.7%, Santa Catarina 29.8%.
- The 21 biodiesel plants scoring above 70 and the 21 scoring below 50 have almost the same median eligible
  share (39.7% and 39.2%), yet issue 0.42 and 0.24 CBIO per m³ sold (medians).

## Limitations

- Authorised capacity is not output: the percentage shows what would happen if every plant ran at the same
  share of its capacity. The ANP does not publish output by plant.
- The eligible share is that of the current certificate; plants can update it between certifications.
- The spreadsheet does not say why volume is not eligible (supplier without registration, cleared land,
  untraced purchases); the plate does not separate the reasons.
- There are no open data on CBIOs issued by plant (only the ANP’s Power BI panel); CBIO per m³ is what the
  certificate allows, not what was actually issued.

## Data licence

Open data from the ANP and the IBGE, free to use with attribution.
