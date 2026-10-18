---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Where people live"
subtitulo: "Half of São Paulo’s people fit in half a per cent of the state"

contexto: >-
  São Paulo has 44.4 million people on 248,000 km², 179 per km² on average. But the average misleads. Half the population lives in census tracts that together cover 1,238 km², 0.5% of the state; 90% live on 2.1%. At the other end, 81% of the area has fewer than 10 residents per km² and holds 1.3% of the people. The map is almost all cream, with dark dots for the towns and one continuous patch in Greater São Paulo, reaching towards Campinas, Sorocaba and the Paraíba Valley. The densest municipality is Taboão da Serra, with 13,428 residents per km², followed by Diadema and Carapicuíba; the capital has 7,521. The least dense is Iporanga, in the Ribeira Valley, with 3.5. First plate of the collection “People across the land”.

imagem: ./mapa_preview.en.png
imagem_alt: "Map of São Paulo state with census tracts in six shades, from cream to near-black olive green, by residents per km². The state is almost all cream; towns show as dark dots, and Greater São Paulo as one continuous dark patch reaching towards Campinas, Sorocaba and the Paraíba Valley. Callouts point to Taboão da Serra, with 13,428 residents per km², and Iporanga, with 3.5. In the panel, the share of population and the share of area in each class, and the five densest municipalities."

recorte: "São Paulo State (SP)"
metodo: "Residents per km² of each 2022 Census tract (the tract’s own area), in six classes; share of the state’s population and area in each class; cumulative area of tracts from densest to least dense until they hold half and 90% of the population."
---

# Population density by census tract in São Paulo

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 063, the first of four in the collection **People across the land**: where São Paulo’s
people live, age and sex by municipality, those aged 60 or over tract by tract, and the countryside.

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `setores` | polygon | 103,319 tracts: `CD_SETOR`, `CD_MUN`, `NM_MUN`, `situacao` (urban/rural), `area_km2`, `pessoas` (people), `hab_km2` (per km²), people by age group (`idade_0_a_4` … `idade_70_ou_mais`), `classe_densidade` (1 to 6) and `classe_60_mais` (1 to 6, from plate 065) |
| `regioes_intermediarias`, `limite_estadual` | polygon | reference |

The **GPKG** is zipped in the assets of the
[`gente-sp-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/gente-sp-2026),
with two **QGIS styles**: `densidade` (this plate’s) and `60_anos_ou_mais` (that of
[plate 065](../065-idosos-sp/README.en.md)). Age groups are empty where IBGE applied confidentiality.

## Method

1. 2022 Census tract aggregates: resident people and tract area (km²), from the tract mesh.
2. Residents per km² in six classes, closed on the right: up to 10, 10 to 100, 100 to 1,000, 1,000
   to 5,000, 5,000 to 15,000 and over 15,000. Tracts with no residents (2,391) are grey.
3. Share of population and area in each class. For the area holding half and 90% of the people,
   tracts are sorted from densest to least dense and their area summed until the cumulative
   population reaches the fraction.
4. Municipalities: people in their tracts over the area in the 2025 Municipal Mesh.
5. On the plate, tracts become a grid of about 200 m so the whole state can be drawn; the GPKG has
   the polygons.

## Limitations

- Density is the tract’s, which mixes blocks, squares, rivers and vacant land; in the small tracts
  of central São Paulo it exceeds a million per km², as they are little more than one building.
- The area holding half the population depends on tract size: with smaller units it would be
  smaller still.
- Population means residents: people who work or study in one place and live in another count
  where they live.
