---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "The bioeconomy in jobs"
subtitulo: "One formal job in fifteen comes from biomass"

contexto: >-
  On 31 December 2025, 1.05 million formal jobs in São Paulo were in the bioeconomy: in farming, fishing and forestry, and in the industries that wholly convert biomass, such as food, drink, wood, paper, natural fibres, leather and biofuels. This is the scope the European Commission’s Joint Research Centre (JRC) uses to measure the European Union’s bioeconomy. They are 6.5% of the state’s 16.16 million jobs, below Brazil’s 7.9%, yet SP holds 22% of the country’s formal bioeconomy. The share grows westwards: 20.7% in the Marília region, 1.7% in the São Paulo region. In 146 municipalities over 35% of formal jobs come from biomass; in Planalto, 80%. The capital has the largest number, 66,000 jobs, but only 1.2% of its own. First plate of the collection “The bioeconomy at work”.

imagem: ./mapa_preview.en.png
imagem_alt: "Map of São Paulo’s municipalities in six shades of green, from cream to dark green, by the share of formal jobs in the bioeconomy. The west and north-west are almost all dark green; Greater São Paulo, the Paraíba Valley and the coast are pale. Callouts point to Planalto, with 80% of its jobs in the bioeconomy, and the capital, with 1.2% and 66,000 jobs. In the panel, the bioeconomy jobs in each class and the bioeconomy’s share in each intermediate region, from 20.7% in Marília to 1.7% in São Paulo."

recorte: "São Paulo State (SP)"
metodo: "Active jobs on 31/12/2025 in the bioeconomy’s CNAE subclasses (farming, fishing and forestry; food, drink and tobacco; wood, paper and wooden furniture; natural fibres and leather; biofuels), within the European JRC scope, over all active jobs in each municipality, in six classes."
---

# The bioeconomy in formal employment across São Paulo’s municipalities

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 076, the first of five in the collection **The bioeconomy at work**. Which bioeconomy it is,
municipality by municipality, is on [plate 077](../077-perfil-da-bioeconomia-sp/README.en.md).

In Europe, the JRC and the nova-Institute have measured since 2017 the jobs and value added of the
bioeconomy in each country and each region (NUTS 2), in a public dashboard. Brazil has no such
account, by state or by municipality. This collection applies the same sector scope to RAIS 2025,
which records the formal jobs of every establishment.

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `municipios` | polygon | 645 municipalities: `vinculos`, `estab`, `bio`, `pct_bio`, `ql_bio` (location quotient against Brazil), the segments `agro`, `alimentos`, `madeira`, `fibras`, `biocombustiveis` and the `dominante`; the industries of plate 078 (`ger`, `g_*`, `g_dominante`), the waste of plate 080 (`res_*`, `res_10mil`), the CP2B potential (`biometano`, `biometano_urbano`, `biometano_cana`, `biometano_pecuaria`) and `pessoas` |
| `regioes_intermediarias`, `limite_estadual` | polygon | reference |

The **GPKG** is the same for all five plates, with the **QGIS styles** `pct_bio`, `dominante`,
`g_dominante` and `res_10mil`. The **CSV** has the municipal table, without geometry.

## Method

1. RAIS 2025, establishment file (RAIS ESTAB PUB): active jobs on 31/12/2025 by CNAE 2.0 subclass
   and municipality; establishments filing a nil return count as zero. Brazil’s total, 59,970,945
   jobs, matches the stock in the official RAIS 2025 presentation.
2. Bioeconomy, within the JRC scope: the sectors that produce biomass (CNAE divisions 01 to 03) and
   those that wholly convert it: food, drink and tobacco (10 to 12); wood, paper and wooden furniture
   (16, 17 and 3101-2); natural fibres and leather (13.11, 13.12, 13.21, 13.22 and 15.10); and
   biofuels (19.31 and 19.32).
3. Share = bioeconomy jobs over all active jobs in the municipality, in six classes closed on the
   right: up to 3%, 3 to 6%, 6 to 12%, 12 to 20%, 20 to 35% and over 35%.

## Limitations

- The JRC also counts a fraction of the partly bio-based sectors, such as chemicals, plastics and
  pharmaceuticals, by the biomass share of their inputs. Without those coefficients for Brazil they
  are left out, so the bioeconomy here is a floor.
- RAIS counts formal jobs only. In farming, where informal and family work weigh more, the real
  bioeconomy is larger than the map shows.
- A job sits in the municipality of the reporting establishment: a firm with several sites that
  reports everything through its head office moves the jobs there.
