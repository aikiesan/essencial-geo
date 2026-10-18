---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Power plants by source"
subtitulo: "Water, wind, sun and fire"

contexto: >-
  Belo Monte, on the Xingu, has 11,233 MW of licensed capacity: it is the largest of the 16,118 power plants registered with ANEEL, operating or under construction. Water still dominates: large and small hydro add up to 58.8% of the 184 GW in operation. In the smaller circles, the map tells other stories. The wind lines up 89% of the 993 wind farms in the North-East; sugarcane bagasse fires 427 of the 627 biomass power stations, 237 of them in São Paulo; and Angra 3 is still being built beside the other two. Of the 11,391 solar plants, 10,941 are under 5 kW: individual systems registered one by one by the distribution companies, nearly all in Pará and in the Pantanal of Mato Grosso do Sul. Second plate of the collection “Electricity in Brazil”.

imagem: ./mapa_preview.en.png
imagem_alt: "Map of Brazil in Albers conic projection, with thousands of circles sized by capacity and coloured by source: deep blue for large hydro, light blue for small hydro, forest green for wind, ochre for solar, olive for biomass, graphite for fossil thermal and plum for nuclear. The largest blue circles are in Pará, Rondônia, Paraná and on the São Francisco river; wind farms form a green necklace along the coast and inland in the North-East; biomass clusters in São Paulo. Two patches of tiny ochre dots appear in Pará and in the Pantanal. Arrowed callouts point to Belo Monte, 11,233 MW, and the 1,622 solar points of the Pantanal. In the panel, a ribbon shows the operating mix, split by each source’s capacity."

recorte: "Brazil"
metodo: "SIGA power plants operating and under construction, grouped into seven sources, with circles whose area is proportional to licensed capacity."
---

# Brazil’s power plants by source

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 043, the second of three in the collection **Electricity in Brazil**: after the wires,
where power is made, and from what.

## What the files contain

| Layer (GPKG) | Geometry | Contents |
| --- | --- | --- |
| `usinas` | point | 16,118 plants: `nome`, `ceg` (ANEEL code), `fonte_mapa`, `fonte_rotulo`, `tipo`, `combustivel`, `fase`, `operacao`, `potencia_kw` (licensed), `potencia_fiscalizada_kw`, `inicio_operacao`, `proprietario`, `municipio_siga`, `uf` (as declared in SIGA), `uf_mapa` (from the polygon the point falls in) |
| `ufs` | polygon | 27 states, with their region |
| `limite_nacional` | polygon | outline of the country |

The **GPKG** is zipped and attached to the
[`energia-eletrica-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/energia-eletrica-2026).
Its **QGIS styles** match the plate: each source in its colour, circles growing with the square
root of capacity, and the largest plants drawn underneath.

The **CSV**, also in the release, holds the table of the 16,118 plants in UTF-8, with longitude and
latitude.

## Method

1. Plants registered in ANEEL’s SIGA, in the copy published by the MapBiomas infrastructure
   database: large and small hydro, wind, solar, thermal and nuclear, operating or under
   construction. The most recent start-ups in the database are from June 2022.
2. Seven sources on the map: UHE, PCH, wind, solar photovoltaic, biomass thermal (bagasse, forestry
   residues, biogas, black liquor…), fossil thermal (diesel, natural gas, coal, fuel oil) and
   nuclear.
3. Each circle’s area is proportional to licensed capacity; plants under construction with 50 MW or
   more are drawn hollow.
4. The operating mix adds up the licensed capacity of each source’s operating plants: 184.3 GW in
   all, or 202.9 GW including those under construction.
5. State totals use the state declared in SIGA, not the polygon the point falls in: border plants
   such as Ilha Solteira count in the state they are registered in.

## Limitations

- The database is a snapshot of 2022, and SIGA changes every month: solar and wind have grown a
  great deal since.
- The 10,941 solar “plants” under 5 kW (0.26 to 4.32 kW, 11.7 MW in all) are individual systems:
  9,227 from Pará’s distribution company, 1,621 from Mato Grosso do Sul’s and 78 from Amazonas’s.
  They swell the count of solar plants but weigh little in capacity.
- Mini hydro stations (CGH), up to 5 MW, are not in the database.
- Rooftop distributed generation (micro- and mini-generation) is a separate register and is left
  for the next plate.
- 24 plants fall outside the state polygons, nearly all along the coast or on the water, such as the
  powerships in Sepetiba Bay; they stay in the GPKG with an empty `uf_mapa`.
- Itaipu enters with its Brazilian share only, 7,000 MW.
