---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Competing for residue"
subtitulo: "Where plants share a collection radius, and where the gas has no plant"

contexto: >-
  Where would existing plants compete for the same residue, and where is there gas with no plant? Taking as plants the 28 municipalities with an ANP-authorised biomethane plant (9) or ANEEL-registered biogas distributed generation (24) and a 30 km collection radius, 71% of the state’s potential has none of them nearby, and only 8.4% is within reach of two or more. Competition concentrates between Campinas, Piracicaba and the capital: Elias Fausto has six other municipalities with plants within 60 km and shares 99% of its radius; Paulínia and Caieiras, about 90%. Out of reach lies precisely the state’s largest potential: Sertãozinho, with 1.06 million m³ a day within 30 km, followed by Pindorama and Morro Agudo. ANP plants add up to 558,000 m³ a day, 3.3% of the potential. Last plate of the collection “Supply catchments”.

imagem: ./mapa_preview.en.png
imagem_alt: "Map of São Paulo state where points with no plant within 30 km appear in beiges and browns, darker where there is more biomethane within 30 km, with the strongest brown in the north, around Sertãozinho; points within reach of one, two or three plants appear in increasingly dark blues, in discs that overlap mostly between Campinas, Piracicaba and the capital. Dark blue circles mark ANP biomethane plants and clay-red rings biogas distributed generation. A callout points to Sertãozinho, with 1.06 million m³ a day and no plant nearby; another to Elias Fausto, with 99% of its radius shared. In the panel, bars set each ANP plant’s capacity against the potential within 30 km."

recorte: "São Paulo State (SP)"
metodo: "Municipalities with an ANP biomethane plant (April 2026) or ANEEL biogas distributed generation (October 2026), at the municipality’s interior point; for each cell of about 1 km, the number of these municipalities within 30 km in a straight line, over the CP2B biomethane potential (v5.1, level N4, reference scenario) within 30 km."
---

# Competing for residue in São Paulo

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 088, the last of four in the collection **Supply catchments**. The plants and
distributed generation are those of [plate 059](../059-biogas-em-operacao-sp/README.en.md); here
they get a collection radius, over the 30 km catchment of
[plate 085](../085-biometano-ao-alcance-sp/README.en.md).

## What the files contain

The CSV holds the 28 municipalities with plants: `plantas_anp`, `empresas_anp`,
`capacidade_biometano_m3d`, `gd_unidades`, `gd_potencia_kw`, biomethane within 30 km in total and
by source (`alcance30_…`), `pct_raio_disputado` (share of that potential that another municipality
with plants also reaches), `municipios_com_usina_60km` and the interior point’s coordinates. In the
GPKG the same table is in the `usinas` layer, and the `grade` layer holds
`municipios_com_usina_30km` for each cell.

## Method

1. ANP: SP biomethane plants in the latest month reported (April 2026), with authorised capacity.
   ANEEL: SP biogas distributed generation units (October 2026), summed by municipality. Together
   they give 28 municipalities: 9 with an ANP plant, 24 with DG and 5 with both.
2. Each municipality with plants becomes a point, at the municipality’s interior point, with a
   30 km straight-line collection radius, the same as plate 085.
3. For each cell of about 1 km, the number of these points within 30 km is counted; the cell’s
   potential goes into the matching class. In cells with none, the colour follows the biomethane
   within 30 km, with cuts at 60,000 m³/day (the median ANP plant) and 300,000.
4. Each plant’s shared radius is the part of the potential within 30 km of it that lies in cells
   reached by more than one municipality with plants.

## Limitations

- The point is the municipality’s, not the plant’s address: within a large municipality, the real
  position may change the count.
- A 75 kW DG unit and a 130,000 m³/day plant count the same as a plant; competition is by radius,
  not by the volume each one uses.
- Biogas power stations outside distributed generation and the MapBiomas biogas plant inventory, on
  [plate 028](../028-usinas-de-biogas-sp/README.en.md), are not included: “no plant” means no ANP
  plant or ANEEL DG within 30 km. Sugar and ethanol mills that burn or use biogas without a record in
  these two databases may lie in areas shown as free.
- The potential is CP2B level N4, which already discounts existing uses of the residue; the overlap
  shows possible competition, not supply contracts.
