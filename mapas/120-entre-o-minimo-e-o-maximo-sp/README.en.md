---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Between the low and the high"
subtitulo: "Same state, same residues: changing the assumptions multiplies the potential by eight"

contexto: >-
  The four previous plates use CP2B’s reference scenario. But every factor in the method, from residue generation to collection, competing uses and logistics, has a range in the literature, and the method also computes one scenario with all of them at the low end and another with all at the high end. São Paulo’s accessible methane (N4) goes from 1.9 billion m³ a year in the low scenario to 15.6 billion in the high, 8.3 times more; at the theoretical level (N1) the range is 3.7 times, because each step’s losses also change. In the low scenario, 145 municipalities have nothing accessible, mostly in the east and south; in the high, none. For livestock, the high is 26 times the low, because the manure that can be collected and the plant’s radius vary a lot; for cane, 6.7 times. The scenarios are extremes, not confidence intervals. Last of five plates in “The biomethane funnel”.

imagem: ./mapa_preview.en.png
imagem_alt: "Three choropleth maps of São Paulo municipalities with the same seven classes of the viridis palette, from grey to purple, by accessible methane in each CP2B scenario. In the low scenario, with 1.9 billion m³, yellow and light green prevail, and the east of the state, the Ribeira Valley and the Paraíba Valley are grey, with nothing accessible. In the reference, with 6.0 billion, the interior turns green and blue, with purple in the cane-growing north. In the high scenario, with 15.6 billion, blue and purple cover almost the whole interior, and even the Paraíba Valley turns green. In the fourth frame, bars show the range by group, from low to high, with a tick at the reference: sugarcane residues from 1.77 to 11.81 billion m³, other crops from 0.02 to 1.17, livestock from 0.07 to 1.72 and waste, prunings and sewage from 0.02 to 0.88. In the panel, a table gives the four levels in the three scenarios."

recorte: "São Paulo State (SP)"
metodo: "For each municipality, the sum of CP2B v5.1’s 17 residues at the accessible level (N4), in normal m³ of methane a year, in the method’s three scenarios: low, with every factor at the low end of the literature range; reference; and high, with every factor at the high end. The three maps use the same classes. The width of the range is (high − low) ÷ reference."
---

# São Paulo’s accessible methane between the low and the high

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 120, the last of five in the collection **The biomethane funnel**: the same accessible level
(N4) in CP2B’s three scenarios, to show how much the result depends on the assumptions.

## What the files contain

- `dados/sp_funil_municipios.csv`: one row per municipality. This plate uses `n4_min_m3`, `n4_m3`
  (reference) and `n4_max_m3`, `n3_min_m3` and `n3_max_m3`, and `faixa_n4_rel`, the width of the range,
  (high − low) ÷ reference.
- `dados/sp_funil_substratos.csv`: the four levels of each of the 17 residues for the whole state, in the
  three scenarios (column `cenario`: `min`, `med`, `max`).
- `sp_funil_biometano.gpkg.zip` (in the `funil-sp-2026` release): in the `municipios` layer, the `n4_min`,
  `n4_ref` and `n4_max` styles reproduce the three maps, with the same classes.

## Method

1. CP2B v5.1 computes each level in three scenarios. In the low one, every factor of the method (residue
   generation, solids, biochemical methane potential, collection, competing uses, storage and logistics)
   sits at the low end of the literature range; in the high one, at the high end; the reference lies
   between them.
2. The three maps use the same N4 classes, in normal m³ of methane a year, so that a difference in colour
   is a difference in potential.
3. The fourth frame’s bars sum N4 by residue group (cane; other crops; livestock; waste, prunings and
   sewage) in the three scenarios.

## Limitations

- The scenarios are extremes, not confidence intervals: all factors are unlikely to sit at the low or the
  high end at the same time. The real value tends to fall within the range, but the range carries no
  probability.
- Where the low value is zero or nearly so, the ratio of high to low says nothing; that is why the table
  uses the width relative to the reference.
- The method is CP2B version 5.1 (24/09/2026); the figures may change in later versions.
