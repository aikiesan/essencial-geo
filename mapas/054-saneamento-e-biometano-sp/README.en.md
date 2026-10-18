---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Sewage, mains and biomethane"
subtitulo: "Sludge gas exists only where sewage reaches the plant"

contexto: >-
  Sludge from sewage plants becomes biomethane, but only where sewage is collected and treated at a plant suited to digestion. Under the CP2B method, that gives São Paulo 121,000 m³ of biomethane a day, in only 128 of its 645 municipalities, and the capital accounts for 51%. Beside it, the 2022 Census: 349 municipalities still have fewer than 90% of households on the mains, the target of the sanitation legal framework for 2033. The crossing separates four groups. 77 municipalities, with 28.2 million people, already pass the target and have sludge; 297, with 4.36 million, are below the target and have no sludge at all, and add up to 437,000 households off the mains. Bringing the mains to those places is the condition for their sewage to count towards the gas. Last plate of the collection “Sanitation and biomethane”.

imagem: ./mapa_preview.en.png
imagem_alt: "Plate with three municipal maps of São Paulo. The first shows the share of households off the sewage mains in 2022, from grey (zero) to dark brown (over 50%): the Ribeira Valley, the coast and the surroundings of the capital are dark; the north of the state is pale. The second shows biomethane from sewage sludge in m³ per day, in shades of teal, present in only 128 municipalities, with the capital adding up to 51%. The third shows four groups: dark blue for mains above 90% with sludge, light blue for mains above 90% without sludge, ochre for mains below 90% with sludge and clay red for mains below 90% without sludge, which covers the south and the west. In the panel, bars show the six municipalities with the most sludge biomethane and the population of each group."

recorte: "São Paulo State (SP)"
metodo: "Share of households off the sewage mains (SIDRA 6805) and biomethane from sewage sludge under the CP2B v5.1 method, level N4 (accessible), reference scenario, by municipality; municipalities are crossed by the 90% mains target and by whether the potential includes sludge."
---

# Sewage, mains and biomethane in São Paulo’s municipalities

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 054, the last of four in the collection **Sanitation and biomethane**: the first three show
where sewage and rubbish escape; this one asks what that takes away from the biomethane potential.

## What the files contain

| Layer (GPKG) | Geometry | Contents |
| --- | --- | --- |
| `municipios` | polygon | 645 municipalities: `CD_MUN`, `NM_MUN`, `pessoas` (people), `dppo` (occupied permanent private households), `esgoto_rede` (on mains), `esgoto_fora` (off mains), `pct_esgoto_rede`, `pct_esgoto_fora`, `lixo_fora` (uncollected rubbish), `pct_lixo_fora`, `biometano_lodo_m3d` (sludge), `biometano_lixo_m3d` (rubbish) and `grupo` (`rede_lodo`, `rede_sem_lodo`, `falta_lodo`, `falta_sem_lodo`) |
| `regioes_intermediarias` | polygon | 11 intermediate geographic regions |
| `limite_estadual` | polygon | state outline |

The `municipios` layer carries three **QGIS styles**, one per map (`rede_e_lodo` is the default).
The **CSV** has the same fields, without geometry.

## Method

1. Sewage: SIDRA table 6805. On the mains means mains or storm drain, or a tank linked to the
   mains, as on plates 051 and 052.
2. Biomethane: CP2B (Unicamp) potential, method v5.1, level N4 (accessible), reference scenario,
   converted from m³ per year to m³ per day. Sewage sludge counts only where there is collection,
   treatment and a plant suited to anaerobic digestion: hence the 517 municipalities with zero. The
   `biometano_lixo_m3d` field also holds the organic fraction of rubbish (434,000 m³/day in the
   state), which is not mapped.
3. Groups: mains at 90% of households or more (the target of Law 14,026/2020 for 2033) or below,
   crossed with sludge above zero or zero.
4. Uncollected rubbish (`lixo_fora`): SIDRA table 6892, as on plate 053.

## Limitations

- The Census measures connection to the mains, not treatment; CP2B starts from treatment rates,
  so a municipality can have high mains coverage and zero sludge.
- The potential is technical: it says how much gas the sludge could yield, not how much is
  produced today.
- Large municipalities below the target that do have sludge include Cotia (65% on the mains),
  Atibaia (61%), Itapecerica da Serra (64%) and Itanhaém (63%).
