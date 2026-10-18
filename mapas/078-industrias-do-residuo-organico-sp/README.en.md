---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "The organic-waste factories"
subtitulo: "Mills, slaughterhouses, dairies, juice plants and breweries: where industry leaves organic waste"

contexto: >-
  Some industries leave organic waste in volume: vinasse, filter cake and bagasse at the mills; blood, rumen contents and fatty effluent at slaughterhouses; whey at dairies; pulp and peel at juice plants; yeast and spent grain at breweries. In São Paulo, 364,647 formal jobs are in these industries, in 3,692 establishments and 531 municipalities. Sugar and ethanol account for 46%; slaughter, 23%. The capital has the most jobs, 16,133, split between dairy, oils, slaughter and drinks. Inland the mill rules: in Guaíra, 87% of the 7,588 jobs are in sugar and ethanol; Sertãozinho and Araras follow close behind. Slaughter leads in 124 municipalities, the mills in 116 and dairies in 89. CP2B already counts cane residues; the effluent of the other industries is left out. Third plate of the collection “The bioeconomy at work”.

imagem: ./mapa_preview.en.png
imagem_alt: "Map of São Paulo with the municipalities in grey and circles proportional to formal jobs in organic-waste-generating industries, coloured by the branch with most jobs: yellow for sugar and ethanol, brick red for slaughter, blue for dairy, orange for fruit and juice, purple for drinks, beige for grain and feed and green for oils. Large yellow circles spread across the north and west; red ones appear in the west and north-west; the capital has the largest circle. Callouts point to Guaíra, with 7,588 jobs, 87% in sugar and ethanol, and the capital, with 16,133. In the panel, the branch legend with each branch’s jobs, the municipalities with most jobs and a note on what CP2B already counts."

recorte: "São Paulo State (SP)"
metodo: "Active jobs on 31/12/2025 in seven industrial branches that generate organic effluent and waste in volume (slaughter, dairy, fruit and juice, sugar and ethanol, oils, drinks, grain and feed), by CNAE class and municipality; circle proportional to the total, coloured by the branch with most jobs."
---

# The industries that generate organic waste across São Paulo’s municipalities

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 078, the third of five in the collection **The bioeconomy at work**. Where these
industries meet farm biomass is on [plate 079](../079-biomassa-e-industria-sp/README.en.md).

European biogas inventories locate agro-industrial effluent by the plant that generates it:
slaughterhouses, dairies, breweries, juice plants. In Brazil, biogas potential is usually estimated
from herds and crops. This plate uses formal employment as a marker of where those factories are.

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `municipios` | polygon | 645 municipalities: `ger` (jobs in generating industries), `estab_ger`, the branches `g_abate`, `g_laticinios`, `g_frutas`, `g_acucar_etanol`, `g_oleos`, `g_bebidas`, `g_graos_racoes` and the `g_dominante` |
| `regioes_intermediarias`, `limite_estadual` | polygon | reference |

It is the **GPKG** of [plate 076](../076-bioeconomia-no-emprego-sp/README.en.md), with the **QGIS
style** `g_dominante`. The **CSV** has the municipal table, without geometry.

## Method

1. Active jobs on 31/12/2025 and establishments with jobs (RAIS 2025), by CNAE class.
2. Seven branches: **abate**, slaughter (10.11, 10.12, 10.13 and 10.20, including fish);
   **laticinios**, dairy (10.51 to 10.53); **frutas**, fruit and juice (10.31 to 10.33);
   **acucar_etanol**, sugar and ethanol (10.71, 10.72 and 19.31); **oleos**, oils (10.41 to 10.43);
   **bebidas**, drinks (11.11 to 11.13, 11.21 and 11.22); **graos_racoes**, grain and feed (10.61 to
   10.66 and 10.69).
3. Circle at the centre of the municipality, with area proportional to the jobs in the seven
   branches and the colour of the branch with most jobs.

## Limitations

- Employment shows where the factory is, not how much waste it generates: an automated mill
  produces far more vinasse per job than a slaughterhouse produces effluent. Estimating the volume
  needs a waste-per-product coefficient for each branch.
- The CP2B potential (plate 050 and plates 055 to 059) already counts vinasse, filter cake and
  bagasse from the mills. Effluent from slaughterhouses, dairies, juice plants and breweries is
  outside it: a potential not yet added up.
- RAIS places the job in the municipality of the reporting establishment; firms reporting through
  their head office move the jobs.
