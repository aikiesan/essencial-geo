---
# English version (EN-UK). Numbers, files and layers come from README.md.
titulo: "On the same street"
subtitulo: "Next door to a man’s home, a home with a woman responsible has the same water, sewerage and refuse collection"

contexto: >-
  Compared, within each census tract, with homes with a man responsible, homes with a woman responsible have almost the same coverage: +0.15 point in mains water, +0.07 in sewerage and +0.03 in refuse collection, statewide. In 595 of the 645 municipalities, the mean of the three lies between −1 and +1 point. The advantage of women’s homes on plates 106 and 107 comes from address: they live more in urban tracts, where the network has already arrived. An exclusive bathroom and piped water indoors barely vary. Taquarivaí has the widest within-tract gap (+3.9). The tract is the smallest published area; within it, the Census does not say which home stands where. Eighth and last plate of the collection “Women heading households”.

imagem: ./mapa_preview.en.png
imagem_alt: "Choropleth map of São Paulo’s 645 municipalities by the within-tract gap between homes with a woman and with a man responsible, averaged over mains water, sewerage and refuse collection. Almost the whole state is grey (between −1 and +1 point, 595 municipalities); 48 appear in light lilac (+1 to +5) and 2 in ochre (women 1 point lower or more). Callouts point to Taquarivaí, at +3.9, and Cunha, at −0.4 within the tract and +23 for the whole town. In the panel, bars break each service’s state gap into address and within the tract."

recorte: "São Paulo State (SP)"
metodo: "Gap between homes with a woman and with a man responsible in the same census tract, in percentage points, averaged over mains water, mains sewerage and refuse collection, by municipality (2022 Census tracts, full count); six classes; the state gap broken down into address and within the tract."
---

# Service gap between homes with women and men responsible within the same census tract, São Paulo

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 110, the eighth of eight in the collection **Women heading households**; the previous one is [plate 109](../109-renda-e-responsaveis-mulheres-sp/README.en.md).

The collection crosses the share of households with a woman responsible with home and street
services and with income, across São Paulo’s 645 municipalities. The tests came before the maps: raw
and partial rank correlation (net of urbanisation, density and income), effective sample corrected
for spatial autocorrelation, Benjamini–Hochberg q values, Moran’s I, LISA, and a comparison between
municipalities and weighting areas. Most relationships with services vanish once urbanisation is
netted out: women responsible are more common in towns, and towns have more network. Weak
relationships also become maps, as descriptive portraits, and the text says they are weak.

The map’s callouts point to Taquarivaí, with the widest within-tract gap (+3.9 points; +5.9 before
netting out address), and Cunha, with −0.4 on the same street and +23 for the whole town, the widest
gap on plates 106 and 107.

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `municipios` | polygon | 645 municipalities with the variables of all eight plates: share of women responsible in 2010 and 2022, household make-up, water, sewerage, refuse, bathroom and indoor piped water by sex of the responsible person, street lighting, income by sex, `b109`, `lisa103` and `lisa109` |
| `apond` | polygon | 2,520 weighting areas with the share of women responsible, urbanisation, income of the responsible person and the water and sewerage gaps |
| `regioes_intermediarias`, `limite_estadual` | polygon | reference |

The **GPKG** is the same for all eight plates and carries a QGIS style for each. The **CSV** has the
municipal table, without geometry. In the columns, `_lo` and `_hi` are the confidentiality limits;
LISA clusters come as `AA` (high-high), `BB` (low-low), `AB`, `BA` and `ns` (not significant).

## Method

1. `dif_setor_media`: simple mean of `agua_rede_dif_setor`, `esgoto_rede_dif_setor` and
   `lixo_coletado_dif_setor`; `dif_media`, the same mean of the total gaps.
2. Decomposition of the gap between women and men: the “address” part (where they live) is the
   coverage women’s homes would have if, in each census tract, they had the same rate as men’s homes in
   that tract, minus men’s coverage; the “within the tract” part is the rest. The tract is the smallest
   published area; within it, the Census does not say which home stands where.
3. Statewide, by service: mains water: 96.9% in women’s homes and 94.5% in men’s (+2.41 points;
   address +2.26, within the tract +0.15); mains sewerage: 92.4% in women’s homes and 90.1% in men’s
   (+2.24 points; address +2.17, within the tract +0.07); refuse collection: 99.4% in women’s homes and
   98.6% in men’s (+0.72 point; address +0.69, within the tract +0.03); exclusive bathroom: 99.9% in
   women’s homes and 99.9% in men’s (+0.05 point; address +0.00, within the tract +0.05); piped water
   indoors: 99.6% in women’s homes and 99.5% in men’s (+0.12 point; address +0.07, within the tract
   +0.06).
4. Classes: women 1 point lower or more (2 municipalities); −1 to +1 (595); +1 to +5 (48); +5 to
   +10, +10 to +20 and +20 or more (none).
5. Exclusive bathroom: `banheiro_*` (homes with a bathroom for their sole use); piped water indoors:
   `agua_dentro_*` (piped into the dwelling). Refuse collected: `lixo_coletado_*` (collected at the
   door by a cleaning service or left in a skip). All with the same columns `_homem`, `_mulher`,
   `_dif`, `_dif_lo`, `_dif_hi`, `_dif_composicao` and `_dif_setor`.

## Limitations

- A within-tract gap near zero does not prove there is no inequality: a tract holds a few hundred
  homes on average, and streets within it may divide. It shows that, at the smallest published scale,
  a woman’s home and a man’s barely differ in network services.
- In census tracts, IBGE replaces cells of 1 or 2 households with X (in the rare categories, the
  values 1 and 2 never appear in print). Here an X counts as 1.5, and every rate and gap carries the
  worst-case limits with X = 1 and X = 2 (columns `_lo` and `_hi`); tracts that are wholly X are left
  out. Summed tracts reproduce the share of women responsible in table 9882 for every municipality
  within 0.45 point (median 0.01).
- The responsible person is whoever the residents name as such to the enumerator. It does not mean
  the breadwinner, nor a lone mother: of São Paulo homes with a woman responsible, 44% include a
  spouse.
- Ecological reading: the map compares places, not people. A correlation between municipalities does
  not say that the same homes have both traits, nor that one causes the other; urbanisation, income
  and age may lie behind both.
