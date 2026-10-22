---
# English version (EN-UK). Numbers, files and layers come from README.md.
titulo: "Manure far from who spreads it"
subtitulo: "Where there are more cattle per km², fewer farms use organic fertiliser"

contexto: >-
  Where there are more cattle per km², fewer farm holdings use organic fertiliser. Across the 617 São Paulo municipalities with data, the rank correlation between the 2024 cattle herd and the share of holdings that applied organic fertiliser in the 2017 Agricultural Census is −0.41, and −0.32 net of urbanisation, density and income. In the quarter of municipalities with fewest cattle, the median is 32%; in the quarter with most, 18%. Grazing cattle leave their manure on pasture, and organic fertiliser includes compost from market gardens near towns: Ferraz de Vasconcelos, with 2.2 cattle per km², has 81%; Presidente Bernardes, with 202, 16%. Fourth plate of the collection “Bioenergy, crossed”.

imagem: ./mapa_preview.en.png
imagem_alt: "Bivariate map of São Paulo’s municipalities in nine colours, crossing thirds of cattle per km² (light to ochre) with thirds of the share of holdings using organic fertiliser (light to lilac). The ochre of many cattle and little fertiliser covers the west and north-west, from the Pontal to São José do Rio Preto; the lilac of few cattle and much fertiliser, the capital’s surroundings, the Ribeira Valley and the Upper Tietê; the brown of much of both, the Paraíba Valley. The 28 municipalities without data, nearly all in Greater São Paulo and on the coast, are hatched. Callouts point to Ferraz de Vasconcelos, with 81% of holdings using organic fertiliser, and Presidente Bernardes, with 202 cattle per km² and 16%. In the panel, the 3 × 3 grid and the table of correlations."

recorte: "São Paulo State (SP)"
metodo: "Cattle per km² (IBGE, PPM 2024) and share of farm holdings that applied organic fertiliser, alone or with chemical (IBGE, 2017 Agricultural Census), each in thirds of municipalities, crossed in a 3 × 3 bivariate map; Spearman rank correlations, raw and partial, and bivariate LISA."
---

# Cattle per km² and holdings using organic fertiliser across São Paulo’s municipalities

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 114, the fourth of five in the collection **Bioenergy, crossed**; the previous one is [plate 113](../113-eucalipto-encostado-na-mata-sp/README.en.md); the next, [plate 115](../115-pequenos-longe-do-gas-sp/README.en.md).

The collection crosses São Paulo’s bioenergy with what filling stations sell, with the countryside
and with town halls, across the state’s 645 municipalities. The pairs came from a correlation screen
between CP2B biomethane potential, fuel sales in the SEMIL Yearbook, plantation forestry, the cattle
herd, the Agricultural Census, the vehicle fleet and MUNIC. Each pair went through raw and partial
rank correlation (net of urbanisation, density and income), an effective sample corrected for
spatial autocorrelation, Benjamini–Hochberg q values and bivariate LISA. The last plate is
descriptive, with no test, and the text says so.

The map’s callouts point to Ferraz de Vasconcelos, in the metropolitan market-garden belt, where 81%
of holdings used organic fertiliser with 2.2 cattle per km², and Presidente Bernardes, in the
Pontal, with 202 cattle per km² and 16%: one of the 136 municipalities with little fertiliser
surrounded by many cattle.

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `municipios` | polygon | 645 municipalities with cane and ethanol, biomethane and diesel, the fleet, native cover and pulpwood, cattle and organic fertiliser, distances to the pipeline, piped gas and the MUNIC answers on waste; classes `b111`, `b113`, `b114`, `arranjo115` and clusters `lisa111`, `lisa113`, `lisa114` |
| `gasodutos` | line | transmission pipelines and distribution network (`tipo`) |
| `regioes_intermediarias`, `limite_estadual` | polygon | reference |

The **GPKG** is the same for all five plates and carries a QGIS style for each. The **CSV** has the
municipal table, without geometry. Empty fields are missing data, not zero. LISA clusters come as
`AA` (high-high), `BB` (low-low), `AB`, `BA` and `ns` (not significant); the first letter is the
municipality’s variable, the second its neighbours’.

## Method

1. `bovinos_km2`: cattle herd on 31/12/2024 (IBGE, PPM, table 3939) over municipal area.
2. `estab_agro`, `estab_adubo_organico` and `pct_estab_adubo_organico`: farm holdings, those that
   applied organic or chemical-and-organic fertiliser, and the share, in % (IBGE, 2017 Agricultural
   Census, SIDRA 6847).
3. Thirds of cattle: up to 22.0, 22.0 to 59.7 and over 59.7 head per km²; of organic fertiliser: up
   to 20.1%, 20.1% to 33.3% and over 33.3%. `b114`: bivariate class, tens = third of cattle (1 to 3),
   units = third of organic fertiliser (1 to 3). From bottom to top and left to right, the nine cells
   hold 37, 54, 114; 70, 77, 58; 98, 75, 34 municipalities. Statewide, 28.7% of holdings used organic
   fertiliser; 28 municipalities have no data, nearly all in Greater São Paulo and on the coast: PPM
   publishes no cattle herd for them, and for some the Agricultural Census has no data either. Missing
   data is not zero.
4. `n_kg_ha_agro`: nitrogen in livestock manure per hectare of farmland (plate 081). By quarters of
   nitrogen, the median share of organic fertiliser falls from 30.8% to 21.6%.
5. Organic fertiliser × cattle per km² (log): Spearman rank correlation −0.41 (617 municipalities),
   partial −0.32, effective sample 351, p < 0.001, q < 0.001. `lisa114`: bivariate LISA clusters
   (organic fertiliser in the municipality × cattle in its neighbours): 46 high-high, 62 low-low, 113
   high-low and 136 low-high; bivariate Moran’s I −0.39. Low-high by intermediate region: São José do
   Rio Preto (50), Presidente Prudente (36) and Araçatuba (26).
6. Partial correlation: the correlation between the residuals of each variable’s ranks regressed on
   the ranks of the controls, which are urbanisation (residents in urban areas), log of population
   density and log of income per head (2022 Census). Effective sample under spatial autocorrelation:
   n·(1 − Iₓ·Iᵧ)/(1 + Iₓ·Iᵧ), where Iₓ and Iᵧ are the Moran’s I of the residuals over a
   6-nearest-neighbour neighbourhood; Benjamini–Hochberg q values across all pairs in the screen.
   Bivariate LISA: the municipality’s value against the mean of its 6 neighbours on the other variable,
   999 permutations, seed 20261019, p < 0.05.

## Limitations

- The Agricultural Census dates from 2017 and the herd from 2024: seven years separate the two
  measures.
- Organic fertiliser is not only manure: it includes compost and other residues, and the Census
  counts holdings, not tonnes or hectares. Pasture is rarely fertilised, and manure from grazing
  cattle stays in the field, uncollected; the map shows where manure exists and where it is used as
  fertiliser, not how much of it is lost.
- Ecological reading: the map compares municipalities, not people or farms. A correlation between
  municipalities does not say that the same farms or drivers have both traits, nor that one causes the
  other.
