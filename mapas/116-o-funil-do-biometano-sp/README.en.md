---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "The biomethane funnel"
subtitulo: "Of every four theoretical cubic metres, only one comes within reach of a plant"

contexto: >-
  Adding up the residues of sugarcane, crops, herds and towns, São Paulo’s theoretical methane exceeds 23.6 billion m³ a year in the CP2B reference scenario (level N1). Then comes the method’s funnel: 8.4 billion stay in the field because they cannot be collected; 8.2 billion already have another use, almost all of it bagasse for the boilers; and 1.0 billion is lost in storage and on the road. At the accessible level (N4), 6.0 billion remain, 25% of the theoretical, or 16.9 million m³ of biomethane a day. Retention varies widely: 71% in Bastos, where poultry litter and manure are collected almost whole; 24% in Guaíra, the state’s largest theoretical potential; 3% in Guariba, where cane residues already feed a digester; and zero in 27 municipalities of the Ribeira Valley and the upper Paraíba Valley. It is a model, not a measurement. First plate of “The biomethane funnel”.

imagem: ./mapa_preview.en.png
imagem_alt: "Choropleth map of São Paulo municipalities in six shades of the viridis palette, from yellow to purple, by the share of the theoretical methane potential that reaches the accessible potential. Purple, over 35%, appears in patches around Campinas, Sorocaba and Rio Claro and in Bastos; green and blue, 20 to 35%, cover most of the interior; yellow, up to 10%, dominates the Pontal do Paranapanema and the Paraíba Valley; the Ribeira Valley and the upper Paraíba Valley are grey, with nothing at the accessible level. Callouts point to Guaíra at 24%, Bastos at 71% and Guariba at 3%. In the panel, four centred bars draw the funnel: 23.6 billion m³ at N1, 15.2 at N2, 7.0 at N3 and 6.0 at N4, with what is lost at each step."

recorte: "São Paulo State (SP)"
metodo: "For each municipality, the sum of CP2B v5.1’s 17 residues at each level (normal m³ of methane a year, reference scenario): N1 theoretical, N2 technical (after collection), N3 mobilisable (after competing uses and what already becomes biogas) and N4 accessible (after storage and the logistic factor). Retention is N4 ÷ N1."
---

# The biomethane funnel in São Paulo

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 116, the first of five in the collection **The biomethane funnel**: how much of each
municipality’s theoretical methane potential is left after each step of the CP2B method.

## What the files contain

- `dados/sp_funil_municipios.csv`: one row per municipality, with all the collection’s fields. This plate
  uses `n1_m3`, `n2_m3`, `n3_m3`, `n4_m3` (normal m³ of methane a year), `retencao_pct` (N4 ÷ N1) and
  `n4_biometano_m3_dia`.
- `dados/sp_funil_substratos.csv`: the levels of each of the 17 residues for the whole state, in the three
  scenarios, with `ja_em_uso_m3` (what already becomes biogas and drops out).
- `sp_funil_biometano.gpkg.zip` (in the `funil-sp-2026` release): in the `municipios` layer, the
  `retencao` style reproduces the map’s classes; the other styles are those of plates 118 to 120.

## Method

CP2B (Unicamp) computes the potential at four levels, always in normal m³ of methane a year:

1. **N1, theoretical**: the herd or harvest (IBGE and GEDAVE) times each residue’s generation rate, total
   and volatile solids, and biochemical methane potential (BMP).
2. **N2, technical**: N1 times the collection factor (FC), what can be gathered. Plate 117.
3. **N3, mobilisable**: N2 times the available fraction (FCo), what is left after uses that exclude the
   digester, less what already becomes biogas today. Plate 118.
4. **N4, accessible**: N3 times storage losses (FS) and the logistic factor (FL), computed on the road
   network. Plate 119.

Each residue’s factors, with their sources, are in CP2B’s parameter table. This plate uses the reference
scenario; plate 120 shows the lowest and the highest. Biomethane per day is the equivalent the method
itself computes for N4 (1% upgrading loss and a 96% methane product).

## Limitations

- It is a model, not a measurement: each level depends on factors taken from the literature, and N4 does
  not say a plant would be viable, only that the residue is within reach of one.
- Retention is a ratio. In municipalities with a small potential, a few m³ change the colour a lot; read
  the map alongside the losses in m³ on plates 117 to 119.
- The method is CP2B version 5.1 (24/09/2026); the figures may change in later versions.
