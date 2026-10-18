---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Biomethane at the grid’s door"
subtitulo: "The catchments of gas delivery points and substations"

contexto: >-
  Which door of the grid would biomethane reach? Assigning each 1 km cell to the nearest gas delivery point, 43 points get a catchment in São Paulo, but the potential concentrates in a few: the five largest, all on the Bolivia–Brazil pipeline in the centre and west of the state, add up to 65% of it. Boa Esperança do Sul alone has 3.44 million m³ a day in its catchment, 20% of the potential, at 104 km on average. Leaving cane out, the order changes: Itapetininga leads with 566,000, from crops and manure in the south-west, followed by Bilac and Guaiçara. On the power grid, 111 basic-grid substations split the state into smaller catchments; the largest is Morro Agudo’s, with 1.99 million m³ a day at 38 km on average. Third plate of the collection “Supply catchments”.

imagem: ./mapa_preview.en.png
imagem_alt: "Three maps of São Paulo state split into catchments, in greens by the biomethane of each. In the first, gas delivery point catchments are long strips across the west and centre, because the points lie in a row on the Bolivia–Brazil pipeline; the darkest, Boa Esperança do Sul’s, has 3.44 million m³ a day. In the second, substation catchments are smaller, more regular polygons, led by Morro Agudo’s in the north. In the third, gas catchments leaving cane out, with Itapetininga’s, in the south-west, highlighted. In the fourth frame, bars show the largest power catchments."

recorte: "São Paulo State (SP)"
metodo: "Voronoi catchments of gas delivery points and basic-grid substations (EPE, via MapBiomas), in SP and around it, clipped to the state boundary; each catchment adds up the CP2B biomethane potential (v5.1, level N4, reference scenario) of the cells of about 1 km nearest to that point."
---

# Biomethane at the grid’s door in São Paulo

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 087, the third of four in the collection **Supply catchments**.
[Plate 086](../086-curva-de-oferta-do-biometano-sp/README.en.md) measures how much potential lies
at each distance from the grid; this one asks which grid point it would reach first and which
points would have the most biomethane at their door.

## What the files contain

The CSV holds one row per catchment with area in SP (`rede` = `ponto_entrega` delivery point or
`subestacao` substation): name, municipality and state of the point, operator, voltage
(substations), `em_sp`, coordinates, `area_km2`, `biometano_m3d` and by source,
`fora_da_cana_m3d` (outside cane), `km_medio` (potential-weighted mean distance from the
catchment’s cells to the point) and `pct_estado` (share of the state). In the GPKG of
[plate 085](../085-biometano-ao-alcance-sp/README.en.md), the `bacias_pontos_entrega` and
`bacias_subestacoes` layers hold the polygons, with a graduated style by biomethane.

## Method

1. EPE gas delivery points and basic-grid substations (in the MapBiomas version), in SP and around
   it; points less than 100 m apart become one (55 delivery points and 183 substations).
2. Voronoi polygons on a local plane (longitude scaled by the cosine of the mean latitude),
   clipped to the SP boundary. The polygons’ area matches the grid’s (247,300 km²).
3. Each cell of about 1 km of the distributed potential (plate 085) goes to the nearest point in a
   straight line; the catchment adds up the potential and the weighted mean distance.

## Limitations

- The catchment is geometric: it knows nothing of roads, delivery point capacity or contracts. A
  point with a large catchment is not, for that reason, able to take all that gas.
- Delivery points lie in a row along the pipelines, so gas catchments become long strips and the
  mean distance reaches 100 km.
- Points across the border get catchments in SP, but potential on their side is left out.
