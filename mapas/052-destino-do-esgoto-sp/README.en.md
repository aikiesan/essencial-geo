---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Where the sewage goes"
subtitulo: "Mains in town, pits in the country, rivers at the edge"

contexto: >-
  Off the mains, São Paulo’s sewage goes three ways. In 2022, 569,000 households used a septic tank, 455,000 a rudimentary pit or hole, and 385,000 discharged into a ditch, river, lake, stream, the sea or elsewhere. The map colours each census tract by where most of its households send their sewage. The mains lead in only 11% of the area, but 93% of households live there; rudimentary pits lead in 56% of the area and septic tanks in 33%, in a mosaic that covers the interior. Sewage discharged into rivers, lakes, streams or the sea is urban: of the 307,000 households doing so, 124,000 are in the capital and three quarters of the rest in the São Paulo intermediate region. Second plate of the collection “Sanitation and biomethane”.

imagem: ./mapa_preview.en.png
imagem_alt: "Map of São Paulo state with census tracts coloured by where most households sent their sewage in 2022: dark blue for mains, storm drain or linked tank, olive for septic tank, ochre for rudimentary pit or hole, clay red for ditch, river, lake, stream, sea or other, and plum for no bathroom. Ochre and olive share the interior in a mosaic; blue marks the towns, the largest patch being Greater São Paulo. Tied tracts or tracts with withheld values are hatched. A callout points to the capital: 123,932 households discharge sewage into rivers, streams, lakes or the sea. In the panel, a strip shows each destination’s share of the area, and bars show the six towns with the most households discharging into rivers, lakes, streams or the sea."

recorte: "São Paulo State (SP)"
metodo: "Where the sewage of most occupied permanent private households in each census tract goes, in five groups; a group wins only when its minimum exceeds every other group’s maximum, counting withheld values as 1 or 2."
---

# Where the sewage of São Paulo’s census tracts goes

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 052, the second of four in the collection **Sanitation and biomethane**: what happens to
sewage that does not reach the mains.

## What the files contain

The GPKG is the same as [plate 051](../051-esgoto-na-rede-sp/README.en.md): the `setores` layer
holds the number of households for each destination and the `destino` field (`rede` mains,
`septica` septic tank, `rudimentar` pit, `aberto` open discharge, `sem` no toilet, or empty). This
plate’s QGIS style is `destino_do_esgoto`.

## Method

1. 2022 Census tract aggregates: occupied permanent private households by where the sewage from
   the bathroom or toilet goes.
2. Five groups: mains (mains or storm drain and tank linked to the mains); septic tank not linked;
   rudimentary pit or hole; open discharge (ditch; river, lake, stream or sea; other); and no
   bathroom or toilet.
3. The leading destination is the group with the most households. Withheld values (`X`, which in
   São Paulo’s data hide a 1 or a 2) enter as a range: a group wins only when its minimum exceeds
   every other group’s maximum. The 1,925 tied or undecided tracts are hatched.
4. Panel strip: the area of the tracts in each leading destination (231,000 km² with a defined
   leader). Totals by destination: SIDRA table 6805.

## Limitations

- Leading only means largest: a blue tract may have a third of its households on tanks.
- The difference between septic and rudimentary is as declared to the enumerator.
- A large rural tract weighs a lot on the map and little in the numbers.
