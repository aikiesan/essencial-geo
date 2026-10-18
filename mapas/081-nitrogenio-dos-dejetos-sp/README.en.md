---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "The nitrogen in manure"
subtitulo: "Half a million tonnes a year; in Bastos, three times the European cap"

contexto: >-
  São Paulo’s herds excrete about 535,000 tonnes of nitrogen a year, by a calculation using the 2024 PPM head counts and IPCC coefficients. Over the 16.9 million hectares of MapBiomas farmland, that is 31.5 kg of N per hectare; the municipal median is 29 kg. Nearly two thirds (65%) comes from beef cattle, spread across the pastures; poultry gives 18%, dairy cows 11% and pigs 4%. The EU Nitrates Directive caps manure applied in vulnerable zones at 170 kg of N per hectare. Four São Paulo municipalities exceed it: Bastos, the egg capital, with 579 kg/ha, and Cerquilho (232), Jumirim (219) and Porangaba (171), with broiler farms. Presidente Bernardes, in the Pontal, has the largest total after Bastos: 5,600 tonnes, nearly all from grazing cattle. First plate of the collection “Manure that feeds the soil”.

imagem: ./mapa_preview.en.png
imagem_alt: "Map of São Paulo’s municipalities in six shades from beige to dark brown, by the nitrogen in herd manure per hectare of farmland. The west and the Paraíba Valley, with pastures, are mid-toned; the sugarcane centre-north is pale; Greater São Paulo and the coast, with no livestock data, are hatched. Callouts point to Bastos, with 579 kg of N per hectare, 91% from poultry; Presidente Bernardes, with the largest total after Bastos, nearly all from grazing cattle; and Cerquilho, Jumirim and Porangaba, also above 170 kg/ha. In the panel, the share of nitrogen in each class and the nitrogen by herd."

recorte: "São Paulo State (SP)"
metodo: "Head counts of each herd in the 2024 PPM times the nitrogen excreted per head per year (IPCC 2019, Latin American means), summed by municipality and divided by the 2024 MapBiomas farmland (pasture, temporary and perennial crops, sugarcane, citrus and mixed use), in six classes; the last starts at the Nitrates Directive cap of 170 kg of N per hectare."
---

# The nitrogen in São Paulo’s herd manure

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 081, the first of four in the collection **Manure that feeds the soil**, in the manner of
the Eurostat and OECD gross nutrient balance and the European Environment Agency’s livestock density
maps. Phosphorus is on [plate 082](../082-fosforo-dos-dejetos-sp/README.en.md); the comparison with
harvests on [083](../083-dejetos-e-colheitas-sp/README.en.md); biogas digestate on
[084](../084-digestato-do-biogas-sp/README.en.md).

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `municipios` | polygon | 645 municipalities. 2024 PPM herds (`bovinos` without milked cows, `vacas_ordenhadas`, `bubalinos`, `equinos`, `suinos` without sows, `matrizes`, `galinhas`, `frangos` = all chickens minus hens, `ovinos`, `caprinos`, `codornas`); `area_agro_ha` (MapBiomas) and `area_lavoura_ha` (PAM); `n_dejetos_t` and each herd’s part (`n_bovinos_t`, `n_leite_t`, `n_aves_t`, `n_suinos_t`, `n_outros_t`); `n_kg_ha_agro`; the fields of plates 082 to 084; `sem_info_ppm` |
| `regioes_intermediarias`, `limite_estadual` | polygon | reference |

The **GPKG** is shared by all four plates, with each one’s **QGIS styles** (`n_kg_ha_agro`,
`p2o5_kg_ha_agro`, `cob_n_pct`, `cob_p2o5_pct`, `cob_k2o_pct`, `dig_cob_p2o5_pct`). The **CSV** has
the municipal table without geometry; the **coefficients** CSV lists every number used, with its
source.

## Method

1. **Herds.** Head counts on 31/12/2024 from the PPM (table 3939) by municipality; milked cows from
   table 94, retrieved through the SIDRA API on 18/10/2026. Milked cows are taken out of all cattle,
   sows out of all pigs and hens out of all chickens (the rest are broilers). Where IBGE does not
   publish milked cows (42 municipalities), the whole herd counts as beef cattle.
2. **Nitrogen per head.** Excretion rate (kg of N per 1,000 kg of live weight per day, table 10.19)
   times typical mass (table 10A.5), IPCC 2019 Latin American means, times 365. Per head per year:
   milked cow 72.3 kg; beef animal 34.3; buffalo 47.1; horse 40.0; sow 18.3; pig 13.6; hen 0.60;
   broiler 0.40; sheep 3.6; goat 3.0. The coefficients are in the CSV.
3. **Per hectare.** Sum over the herds divided by the 2024 MapBiomas farmland (pasture, temporary and
   perennial crops, sugarcane, citrus and mixed use), the same as plate 045. Six classes, closed on
   the right: up to 10, 10 to 25, 25 to 50, 50 to 100, 100 to 170 and over 170 kg of N per hectare.
4. **The European cap.** The Nitrates Directive (91/676/EEC) limits manure applied in vulnerable zones
   to 170 kg of N per hectare per year. Here it is only a yardstick: the cap applies to spread manure,
   not to what is excreted on pasture, and Brazil has no equivalent rule.

## Limitations

- **These are estimates.** Nitrogen comes from mean per-head coefficients, not from farm measurements;
  diet, breed, weight and productivity change excretion. The numbers show the order of magnitude and
  where the load concentrates.
- Excreted nitrogen is not what reaches the soil: part is lost as ammonia and nitrous oxide in the
  shed, the manure store and the field. An account of available nitrogen would need loss factors for
  each management system.
- Beef cattle leave their manure on the pasture, spread out; their load per hectare does not compare
  with that of a poultry farm, which concentrates its manure in one place.
- 28 municipalities in Greater São Paulo and on the coast have no PPM data and are hatched as no data,
  never as zero.
- The PPM counts animals on a single day (31/12); broiler farms raise several flocks a year, and the
  per-head coefficient already assumes an animal present all year.
