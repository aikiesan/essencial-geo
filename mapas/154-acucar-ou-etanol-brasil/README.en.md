---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Sugar or ethanol"
subtitulo: "São Paulo gets 76 kg of sugar from each tonne of cane; Goiás 39; Tocantins none"
contexto: >-
  In the 2025/26 harvest, Brazil made 43.4 million tonnes of sugar from 663.8 million tonnes of cane: 65 kg a tonne. But the sum changes from state to state. Alagoas, Paraná, São Paulo, Piauí and Minas Gerais get 72 to 81 kg of sugar from each tonne; Goiás, Mato Grosso do Sul and Mato Grosso 32 to 40, sending the rest to ethanol; Tocantins makes no sugar at all. São Paulo, with 52% of the cane crushed, made 60% of Brazil’s sugar. In Mato Grosso and Maranhão, the mills that crush cane declared 387 and 422 litres of ethanol per tonne, four times what cane can yield: corn is going into the same mills. Over two harvests, sugar fell 5.3%, less than cane (−6.8%). State-level data from the monthly SAPCana reports of the Ministry of Agriculture. Second plate in the collection «Each state’s cane harvest».
imagem_alt: "Map of Brazil in Albers conic projection with states coloured by kilograms of sugar per tonne of cane crushed in the 2025/26 harvest, in five classes from beige to dark brown (no sugar, up to 30, 30 to 50, 50 to 70 and 70 kg or more) and white for states with no cane. São Paulo, Minas Gerais, Paraná, Alagoas and Piauí are in the darkest shade; Goiás, Mato Grosso, Mato Grosso do Sul, Paraíba, Rio Grande do Norte and Sergipe in the middle shade; Bahia, Maranhão and Rio de Janeiro in the light one; Tocantins in the no-sugar beige. Mato Grosso, Mato Grosso do Sul and Maranhão are hatched for declaring over 90 litres of ethanol per tonne of cane. One callout points to São Paulo, with 76 kg a tonne and 60% of Brazil’s sugar; another to Mato Grosso, with 32 kg of sugar and 387 litres of ethanol per tonne. In the panel, a dumbbell chart of kg of sugar and litres of ethanol per tonne in each state, from 2023/24 to 2025/26, and a table for Brazil in the three harvests."
metodo: "Sugar (t) and anhydrous + hydrated ethanol (m³) divided by cane crushed (t) in each state at the close of the 2023/24 and 2025/26 harvests (SAPCana/MAPA, 1 April to 31 March totals), in kg and litres per tonne; hatching where ethanol exceeds 90 L/t, above what cane can yield."
---

# Sugar or ethanol: how much sugar each state gets from a tonne of cane

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 154, the second in the collection **Each state’s cane harvest**. The same tonne of cane
can become sugar or ethanol; the map shows which way each state leans.

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `ufs` | polygon | 27 states: `cana_2023_24`, `acucar_2023_24`, `etanol_2023_24`, `kg_acucar_t_2023_24`, `l_etanol_t_2023_24` and the same for `2025_26` (t, t, m³, kg/t, L/t), `parte_acucar_br_pct`, `parte_cana_br_pct`, `etanol_alem_da_cana` (over 90 L/t), `classe` (−1 = no cane) |
| `limite_nacional` | polygon | national outline |

The **GPKG** is zipped and attached to the
[`sapcana-br-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/sapcana-br-2026),
with **QGIS styles** stored inside. The **CSV** sits in this folder, in UTF-8, with the 19 states
that crush cane and no geometry.

## Method

1. Monthly SAPCana reports (MAPA), downloaded on 01/11/2026; each harvest closes with the report
   totalling 1 April to 31 March (see plate 153).
2. Sugar per tonne = sugar (t) ÷ cane crushed (t) × 1,000; ethanol per tonne = anhydrous + hydrated
   ethanol (m³) ÷ cane crushed (t) × 1,000. These are ratios between declared figures, with no
   conversion factor.
3. Sugar classes: none, up to 30, 30 to 50, 50 to 70 and 70 kg/t or more.
4. Hatching: states with over 90 L of ethanol per tonne of cane. Cane yields at most about that
   (some 150 kg of TRS per tonne, all into hydrated ethanol at 1.69 kg of TRS per litre); above it,
   the declared ethanol comes from another feedstock in the same mills, usually corn.

## Reading

- Brazil made 45.9 million t of sugar in 2023/24 and 43.4 million in 2025/26 (−5.3%), while cane
  fell 6.8%: sugar per tonne rose from 64.4 to 65.4 kg.
- São Paulo crushed 52.0% of the cane and made 60.4% of the sugar (26.2 million t), at 76.0 kg a
  tonne (73.6 in 2023/24).
- In the darkest shade: Alagoas (80.5 kg/t), Paraná (79.7), São Paulo (76.0), Piauí (73.1) and Minas
  Gerais (72.3, up from 68.9). Goiás gets 39.0 kg/t (35.4 in 2023/24), Mato Grosso do Sul 39.7 (43.2)
  and Mato Grosso 32.3. Tocantins made no sugar in any of the three harvests.
- Ethanol per tonne of cane went from 75 to 95 L in Mato Grosso do Sul, from 322 to 387 L in Mato
  Grosso and from 77 to 422 L in Maranhão, where corn came in during 2025/26.
- Pernambuco (73.4 → 68.0 kg/t), Rio Grande do Norte (56.2 → 47.1) and Sergipe (48.1 → 44.0) put
  less of their cane into sugar in 2025/26.

## Limitations

- SAPCana ethanol is what the cane-crushing mills declare, and includes the corn ethanol they make;
  corn-only distilleries are left out. Feedstock by state is on plate 133.
- Kilograms of sugar per tonne also depend on the cane’s sugar content (TRS), which varies with
  weather and region; the ratio shows the product «mix» and the cane’s richness together, not only
  the mill’s choice.
- The reports are by state; sugar mills and distilleries sit side by side within a state.
- The 1 April–31 March window cuts the north-eastern coast’s harvest (September to August) in two.

## Data licence

Public data from MAPA and IBGE, free to use with attribution.
