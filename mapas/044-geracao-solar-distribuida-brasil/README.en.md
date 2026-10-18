---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Distributed solar generation"
subtitulo: "The sun that lives on the rooftops"

contexto: >-
  There are 4.67 million photovoltaic systems in 5,567 municipalities: panels on the roofs of homes, shops and smallholdings, and small plants of up to 5 MW that cut their owners’ electricity bills. They add up to 53.8 GW, 265 W per inhabitant, 52% of it in homes. Rooftop sun is strongest in the Centre-West and western Paraná: Mato Grosso has 872 W per inhabitant, and Foz do Iguaçu, with 1,408 W, leads among towns of more than 100,000 people. São Paulo has the largest capacity, 7.6 GW, but only 170 W per inhabitant; Taboão da Serra stands at 11 W. At the other extreme, the 20.6 MW of Santa Clara d’Oeste give 7,939 W to each of its 2,598 residents. Last plate of the collection “Electricity in Brazil”.

imagem: ./mapa_preview.en.png
imagem_alt: "Choropleth map of Brazil in an Albers conic projection, with its 5,571 municipalities shaded by watts of distributed solar generation per inhabitant, in seven classes from cream to clay brown. Amazonas and most of the North sit almost entirely in the palest cream, below 50 W; Mato Grosso, Mato Grosso do Sul, Rondônia and western Paraná gather the darkest shades; the North-East and South-East form a mosaic of middle tones, paler in the metropolitan areas. State boundaries are drawn in dark grey, with their abbreviations. Two callouts: Santa Clara d’Oeste, in São Paulo, with 7,939 W per inhabitant, the highest in the country, and Taboão da Serra, with 11 W, the lowest among towns of more than 100,000 people. In the panel, the class legend with the number of municipalities in each, and columns with the gigawatts registered per year from 2015 to 2026, peaking in 2024."

recorte: "Brazil"
metodo: "Capacity of photovoltaic micro- and mini-generation systems summed by municipality, divided by the 2022 Census population and grouped into seven classes of watts per inhabitant."
---

# Distributed solar generation in Brazil, by municipality

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 044, the last of three in the collection **Electricity in Brazil**: after the wires and
the large power plants, the energy that is born close to those who use it.

## What the files contain

| Layer (GPKG) | Geometry | Contents |
| --- | --- | --- |
| `municipios` | polygon | 5,571 municipalities: `CD_MUN`, `NM_MUN`, `SIGLA_UF`, `pop_2022`, `n_sistemas`, `kw_total`, `kw_micro` (up to 75 kW), `kw_mini` (above 75 kW), `kw_residencial`, `kw_remoto` (remote self-consumption, shared and condominium schemes), `uc_credito` (consumer units receiving the credits), `w_hab`, `classe`, `faixa_w_hab` |
| `ufs` | polygon | 27 states, with their region |
| `limite_nacional` | polygon | outline of the country |

The **GPKG** is zipped and attached to the
[`energia-eletrica-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/energia-eletrica-2026).
The `municipios` layer carries the plate’s **QGIS style**, with the seven classes of watts per
inhabitant. The **CSV** sits in this folder, in UTF-8, with the same table without geometry.

ANEEL’s dataset has one record per system, with data on individuals and companies; only
municipal totals are used here.

## Method

1. All micro- and mini-generation units in ANEEL’s open dataset, reference October 2026,
   filtered to solar photovoltaic plants (UFV). The other sources (biogas, small hydro, wind) add
   up to 0.3 GW and are left out.
2. Installed capacity summed by the IBGE code of the municipality where the system is connected.
   In remote self-consumption schemes the credit may go to bills elsewhere; the map shows where
   the panels are.
3. **Watts per inhabitant**: the municipality’s capacity divided by its 2022 Census population.
   Class limits at 50, 100, 200, 400, 800 and 1,600 W, doubling at each step.
4. Boa Esperança do Norte (MT), created after the Census, has no population and is shown in grey.
5. The panel’s columns add up capacity by the year of each system’s latest registration update,
   from 2015 to 2026.

## Limitations

- The date used in the columns is that of the latest registration update, which for most systems
  matches the connection but may be later. 2026 runs only to August.
- Watts per inhabitant inflate small municipalities: a single 5 MW plant in a town of 2,000 people
  already exceeds 2,000 W. In large cities, blocks of flats leave little roof area per resident.
- Capacity is the nominal value declared at connection, not the energy generated, which depends on
  the sunshine in each place.
- Population is from 2022, capacity from 2026.

## Data licence

Open data from ANEEL and IBGE, free to use with attribution.
