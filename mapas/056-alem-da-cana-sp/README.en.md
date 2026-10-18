---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Beyond sugarcane"
subtitulo: "Without the cane, maize, poultry and the city appear"

contexto: >-
  Sugarcane is the largest biomethane source in 370 of São Paulo’s municipalities and accounts for 82% of the state’s potential. The other 18%, 3.09 million m³ a day, draw a different map. With cane removed, maize and soy straw leads in 192 municipalities, scattered across the west and unbroken in the south and south-west, from Itapeva to Itapetininga; organic waste and tree pruning lead in 174, from Greater São Paulo to the Paraíba Valley and the interior’s mid-sized towns; poultry farms lead in 170, mostly in the centre and north of the state, from Bastos to Mococa. Dairy and feedlot cattle lead in 48 municipalities, coffee in 16, oranges in 13. The capital has the largest non-cane potential, 144,000 m³ a day, from waste and sewage; in the interior, the largest is Bastos, with 73,000, from its poultry farms. Second plate of the collection “Biogas on the ground”.

imagem: ./mapa_preview.en.png
imagem_alt: "Map of São Paulo state with municipalities coloured by their largest biomethane source leaving out sugarcane: golden yellow for maize and soy straw, which dominates the south and south-west; dark blue for organic waste and pruning, covering Greater São Paulo, the coast and the Paraíba Valley and dotted across the west; clay red for poultry, in the centre and north; plum for cattle; brown for coffee, in the north-east; orange for orange bagasse, in the centre; pink for pigs; and light blue for sewage sludge, in Taubaté only. Callouts point to Bastos, with 73,000 m³ a day from poultry farms, and Itapeva, with 72,000 from maize and soy straw. In the panel, the legend gives how many municipalities each source leads and how much biomethane it adds up to in the state, and bars show the six municipalities with the most biomethane outside cane."

recorte: "São Paulo State (SP)"
metodo: "Biomethane potential by municipality and residue (CP2B method v5.1, level N4, reference scenario), without the four sugarcane residues, summed into eight sources; each municipality gets its largest source."
---

# Beyond sugarcane: the largest biomethane source outside the cane field

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 056, the second of five in the collection **Biogas on the ground**.
[Plate 050](../050-biometano-sp/README.en.md) shows that cane leads in 370 municipalities; this one
takes cane out of the count and asks what comes next.

## What the files contain

The GPKG and CSV are those of [plate 055](../055-densidade-do-biometano-sp/README.en.md). In the
`municipios` layer, the `lider_fora_da_cana` field holds the leading source (`graos` maize and soy,
`citros` orange, `cafe` coffee, `aves` poultry, `bovinos` cattle, `suinos` pigs, `lixo` waste,
`esgoto` sewage), and the `*_m3d` fields hold each one’s potential. This plate’s QGIS style is
`fora_da_cana`.

## Method

1. Potential by residue: CP2B (Unicamp), method v5.1, level N4 (accessible), reference scenario,
   in m³ of biomethane per day.
2. Outside cane: everything except straw, bagasse, filter cake and vinasse.
3. Eight sources: maize and soy straw; orange bagasse; coffee husk; broilers and layers; dairy,
   feedlot and mixed-pasture cattle; pigs; organic waste and tree pruning; sewage sludge.
4. Each municipality gets its largest source. The 28 municipalities with cane only or no potential
   are light grey.

## Limitations

- Leading does not mean large: in many municipalities, the leading non-cane source is small next
  to cane.
- At the accessible level, pasture cattle yield zero in the state; the cattle shown are dairy and
  feedlot.
- Orange bagasse is allocated to juice factories, not orchards (see plate No. 047).
