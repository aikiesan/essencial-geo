---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "The federal slaughterhouses"
subtitulo: "Chicken and pork are slaughtered in the South; cattle in the Centre-West and on the Amazon’s edge"
contexto: >-
  Brazil has 3,143 active plants under the Federal Inspection Service, and 411 of them are slaughterhouses, in 329 municipalities: 173 for cattle, 122 for poultry, 54 for pigs and the rest for several or other species. Chicken and pork are slaughtered in the South, home to 69 of the 122 poultry plants and 38 of the 54 pig plants; cattle in the Centre-West and on the Amazon’s edge, led by Mato Grosso (30 slaughterhouses), then Mato Grosso do Sul (22), Pará and São Paulo (18 each). In 2025, 30.4 million cattle, 48.5 million pigs and 5.72 billion chickens went through federal inspection. Each kill leaves blood, offal, rumen contents, feathers and wash water in a single spot; 196 inedible by-products plants turn part of it into tallow and meal. First plate in the collection «Where livestock becomes residue».
imagem_alt: "Map of Brazil in Albers conic projection with the plants under federal inspection: slaughterhouses as discs coloured by species (cattle in brick red, poultry in ochre, pigs in pink, several species in purple, others in grey), grouped around their municipality, inedible by-products plants as black rings and the rest of the chain as grey dots. The poultry and pig discs crowd into Paraná, Santa Catarina and Rio Grande do Sul; the cattle discs spread across Mato Grosso, Mato Grosso do Sul, Rondônia and southern Pará. One callout points to the South, with 69 of the 122 poultry plants, and another to Mato Grosso, with 30 cattle plants. In the panel, stacked bars of slaughterhouses by state and species, the animals slaughtered under federal inspection in 2025 and a note on slaughter residue."
metodo: "SIGSIF establishment registry (10/2026) reduced to one row per SIF number and sorted into one group by category and class (slaughterhouse by species, inedible by-products plant, milk, processed meat, eggs, fish, honey); each plant is placed at the interior point of its municipality. Head slaughtered under federal inspection in 2025 summed from the slaughter report by state of origin."
---

# The federal slaughterhouses: where inspected slaughter happens

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 162, the first in the collection **Where livestock becomes residue**. A slaughterhouse is
a point source: the blood, offal, rumen contents, feathers and wash water an animal leaves behind
gather at one address. Here, where those addresses are under federal inspection.

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `estabelecimentos` | point | 3,143 plants: `NR_SIF`, `razao_social`, `CD_MUN`, `NM_MUN`, `SIGLA_UF`, `regiao`, `grupo`, `especies_abate` (SIGSIF class codes), `areas`, `registro`, `lon`, `lat` |
| `ufs` | polygon | 27 states: `abatedouros`, `estabelecimentos` and one column per group |
| `limite_nacional` | polygon | national outline |

The **GPKG** is zipped and attached to the
[`abate-br-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/abate-br-2026),
with **QGIS styles** stored inside (points coloured by group). The **CSVs** sit in this folder, in
UTF-8: the plants with no geometry, and the animals slaughtered under federal inspection in 2025 by
state of origin.

## Method

1. SIGSIF open data (MAPA/DIPOA), downloaded on 01/11/2026:
   `sigsifestabelecimentosregistradosnosif.csv` (resource dated 02/10/2026, 36,639 rows, one per
   category, class and occurrence) and `sigsifrelatorioabatesporanouf.csv` (head slaughtered under
   federal inspection by month, state of origin and category).
2. The registry was reduced to one row per SIF number (3,143, all active). Each plant falls into a
   single group, in this order: cattle, poultry, pig, multi-species, or other or unlisted species
   slaughterhouse (by slaughterhouse class), inedible by-products plant, processed meat, milk, eggs,
   fish and honey.
3. Registry municipalities are matched to the 2025 Municipal Mesh by name and state; seven spellings
   were fixed by hand. Each plant sits at its municipality’s interior point; slaughterhouses in the
   same municipality are arranged around that point.
4. Phone numbers, e-mails and tax numbers are not published; the company name is left blank for the
   262 plants registered under a personal tax number (CPF).
5. Slaughtered under federal inspection in 2025: sum of the 2025 months in the report by state of
   origin, for cattle, pigs and chickens.

## Reading

- 411 slaughterhouses in 329 municipalities: 173 for cattle, 122 for poultry, 54 for pigs, 26 for
  more than one species and 36 for other species or with no species in the registry.
- Paraná has the most (63, of which 35 for poultry), followed by Rio Grande do Sul (47), Minas
  Gerais and São Paulo (42 each), Santa Catarina and Mato Grosso (40 each).
- The South holds 69 of the 122 poultry slaughterhouses (57%) and 38 of the 54 pig slaughterhouses
  (70%).
- Cattle slaughterhouses are in Mato Grosso (30), Mato Grosso do Sul (22), Pará and São Paulo (18
  each), Goiás (17) and Rondônia (14). Várzea Grande (MT) has 5; Chapecó (SC), Xinguara (PA) and
  Araguaína (TO) 4 each.
- The 196 inedible by-products plants (rendering: tallow and meat, bone, blood and feather meal)
  follow the slaughterhouses: São Paulo 32, Paraná 23, Goiás and Rio Grande do Sul 20 each.
- In 2025, 30.4 million cattle, 48.5 million pigs and 5.72 billion chickens went through federal
  inspection.

## Limitations

- Federal inspection only. Slaughterhouses under state (SIE) or municipal (SIM) inspection are not
  in the SIGSIF registry.
- The registry gives neither capacity nor volume slaughtered per plant: one disc is one
  slaughterhouse, whatever its size. 28 slaughterhouses have no species in the registry.
- Position is the municipality’s, not the street address.
- MAPA’s data dictionary does not make clear whether the slaughter report’s «UF de procedência» is
  the animal’s state of origin or the plant’s; the check in plate 163 reads it as origin.
- Slaughter residue is described only in qualitative terms; the plate estimates neither volumes nor
  energy use.

## Data licence

MAPA and IBGE open data, free to use with attribution.
