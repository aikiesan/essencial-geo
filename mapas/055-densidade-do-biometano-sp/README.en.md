---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Biomethane per km² and per person"
subtitulo: "The gas is where the people are not"

contexto: >-
  São Paulo’s residues could yield 16.9 million m³ of biomethane a day at the accessible level of the CP2B method. Divided by the population, that is 0.38 m³ per person per day. But the gas does not live where people live. Per km², the potential is densest in the sugarcane north: Ariranha reaches 1,326 m³ a day for each km². Per inhabitant, the leaders are small municipalities full of cane, such as Borá, with 41 m³ per person per day, while the capital, with the largest urban potential, stands at 0.013. The potential is also concentrated: 25 municipalities hold a quarter of the total, 68 hold half and 148 three quarters. Plate 050 shows how much each municipality has; this one shows how much that weighs on the ground and per person. First plate of the collection “Biogas on the ground”.

imagem: ./mapa_preview.en.png
imagem_alt: "Plate with three municipal maps of São Paulo and a chart. The first shows biomethane per km² in greens, darker in the north and centre of the state. The second shows biomethane per inhabitant, from cream to dark brown: the interior is dark and Greater São Paulo, the coast and the Ribeira Valley are pale; a callout shows the capital at 0.013 m³ per inhabitant per day. The third shows municipalities in four shades of green by the quarter of the state’s potential they belong to: 25 municipalities in the first quarter, 43 in the second, 80 in the third and 470 in the last. The chart is the concentration curve of the potential, with points at 25, 68 and 148 municipalities. In the panel, bars show the six municipalities with the highest potential per km², led by Ariranha."

recorte: "São Paulo State (SP)"
metodo: "Biomethane potential from 17 residues by municipality (CP2B method v5.1, level N4, reference scenario), divided by the 2025 Municipal Mesh area and the 2022 Census population; municipalities ranked by potential and grouped by the quarter of the state total they belong to."
---

# Biomethane per km² and per person in São Paulo’s municipalities

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 055, the first of five in the collection **Biogas on the ground**, which takes the
biomethane potential of plates [049](../049-lixo-e-esgoto-sp/README.en.md) and
050 down to the ground: how much it weighs per km² and per
person, which source leads outside sugarcane, how far it lies from gas pipelines and the power grid
and how much has already become a plant.

## What the files contain

A single GeoPackage serves the collection’s five plates.

| Layer (GPKG) | Geometry | Contents |
| --- | --- | --- |
| `municipios` | polygon | 645 municipalities: `pessoas` (people), `area_km2`, `biometano_m3d` and the groups (`cana_m3d` cane, `lavouras_m3d` crops, `pecuaria_m3d` livestock, `urbano_m3d` urban), the non-cane sources (`graos_m3d` maize and soy, `citros_m3d` orange, `cafe_m3d` coffee, `aves_m3d` poultry, `bovinos_m3d` cattle, `suinos_m3d` pigs, `lixo_m3d` waste, `esgoto_m3d` sewage), `m3d_por_km2`, `m3d_por_hab`, `concentracao` (1 to 4), `pct_cana`, `lider_fora_da_cana`, distances in km (`km_gasoduto_transporte`, `km_gasoduto_distribuicao`, `km_gasoduto`, `km_ponto_entrega`, `km_subestacao`, `km_linha_transmissao`), `anp_capacidade_m3d` and `gd_biogas_kw` |
| `gasodutos_transporte`, `gasodutos_distribuicao` | line | existing pipelines in SP and up to about 60 km beyond its border; `em_sp` = 1 when they enter the state |
| `pontos_entrega` | point | existing gas delivery points |
| `linhas_transmissao`, `subestacoes` | line, point | existing basic grid, with voltage and year in service |
| `plantas_biometano` | point | ANP biomethane plants: authorised capacity, biogas processed and use in the month |
| `gd_biogas` | point | biogas distributed generation summed by municipality, by residue type |
| `regioes_intermediarias`, `limite_estadual` | polygon | reference |

The `municipios` layer carries seven **QGIS styles** (`por_km2` is the default). The **CSV** has
the same table, without geometry. Points in `plantas_biometano` and `gd_biogas` sit at an interior
point of the municipality, not at the plant’s address.

## Method

1. Potential: CP2B (Unicamp), method v5.1, level N4 (accessible), reference scenario, in m³ of
   biomethane equivalent per day, summed over the model’s 17 residues.
2. Per km²: over the official area of the 2025 Municipal Mesh. Per inhabitant: over the 2022
   Census population, summed from census tracts.
3. Concentration: municipalities from largest to smallest potential; each gets the quarter of the
   state total in which it starts (25 municipalities in the first, 43 in the second, 80 in the
   third, 470 in the last).
4. Classes of the first two maps: quantiles of the 618 municipalities with potential.

## Limitations

- Per inhabitant does not mean the gas would be used there: a small cane municipality has a lot of
  gas per person and few people to use it.
- The potential is technical and modelled: it says how much gas the residues could yield, not how
  much is produced.
