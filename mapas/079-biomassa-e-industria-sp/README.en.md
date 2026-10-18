---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Where biomass meets the factory"
subtitulo: "The hubs that already have both residue and industry, and those with only one"

contexto: >-
  A bioeconomy hub needs two things in the same place: biomass and someone who knows how to convert it. This plate crosses the biomethane potential of residues (CP2B, accessible level, reference scenario) with formal jobs in bio-based industry (food, drink, wood, paper, fibres and biofuels), each split into thirds of the municipalities. In 115 municipalities both are in the top third: these are the hubs, with 61% of the state’s biomethane and 55% of those jobs, nearly all in the cane-growing north and centre. In 28, biomass is plentiful and industry scarce: Brejo Alegre has 77,000 m³ of biomethane a day and 4 industrial jobs. In 43, industry is strong and biomass is scarce, mostly in the metropolis: Barueri has 4,554 jobs and little residue of its own. Fourth plate of the collection “The bioeconomy at work”.

imagem: ./mapa_preview.en.png
imagem_alt: "Bivariate map of São Paulo’s municipalities in nine colours from a three-by-three grid: green grows with biomethane potential and ochre with jobs in bio-based industry; dark brown marks municipalities in the top third of both. Dark brown covers much of the north and centre; pure green appears in the north-west and west; pure ochre in Greater São Paulo. Callouts point to Brejo Alegre, with 77,000 m³ of biomethane a day and 4 industry jobs, and Barueri, with 4,554 jobs and little biomass. In the panel, the grid with the number of municipalities in each cell, the tercile limits and two lists: municipalities with plenty of biomass and little industry, and those with plenty of industry and little biomass."

recorte: "São Paulo State (SP)"
metodo: "Biomethane potential by municipality (CP2B v5.1, level N4, reference scenario) and active jobs on 31/12/2025 in bio-based industry (RAIS 2025), each split into thirds of the municipalities with a value; the cross gives nine classes."
---

# Biomass and bio-based industry across São Paulo’s municipalities

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 079, the fourth of five in the collection **The bioeconomy at work**. Who treats urban
waste is on [plate 080](../080-quem-trata-o-residuo-sp/README.en.md).

In Europe, studies of bioeconomy regions (the JRC’s BioRegEU and the S2Biom supply maps) cross the
available biomass with the industry able to use it, to find the hubs and the regions where one of
the two is missing. This plate makes that cross with the CP2B potential and RAIS.

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `municipios` | polygon | 645 municipalities: `biometano`, `biometano_cana`, `biometano_pecuaria`, `biometano_urbano` (m³/day) and the segments `alimentos`, `madeira`, `fibras`, `biocombustiveis` |
| `regioes_intermediarias`, `limite_estadual` | polygon | reference |

It is the **GPKG** of [plate 076](../076-bioeconomia-no-emprego-sp/README.en.md). The bivariate class
comes from the fields above; the **CSV** has the municipal table, without geometry.

## Method

1. Biomass: biomethane potential of CP2B’s 17 residues, method v5.1, level N4 (accessible),
   reference scenario, in m³ per day.
2. Bio-based industry: active jobs on 31/12/2025 (RAIS 2025) in the food, wood, fibre and biofuel
   segments of plate 077, without farming.
3. Thirds of the municipalities with a value, closed on the right: biomethane up to 5,300,
   5,300 to 20,800 and over 20,800 m³/day; industry up to 87, 88 to 886 and over 886 jobs. The 27
   municipalities with no potential and the 38 with no industry jobs go in the bottom third.
4. Nine classes from the cross; the hubs’ share adds up the biomethane and jobs of the 115
   municipalities in the top third of both.

## Limitations

- The cross is one of proximity on the map, not of supply chain: a mill may be in one municipality
  and the residue it uses in the next. Real hubs extend beyond municipal boundaries.
- Industry is measured by formal employment, which does not say whether the factory uses, or could
  use, local biomass.
- The thirds are relative to the state: the top third starts at 20,800 m³/day of biomethane, which
  is already a lot compared with other states.
