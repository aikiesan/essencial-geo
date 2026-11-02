---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Made here, used elsewhere"
subtitulo: "41% of biogas capacity offsets other units’ bills; for solar, 33%"
contexto: >-
  In distributed generation, energy does not have to be used where it is generated: under remote self-consumption and shared generation, it becomes credit on the bills of other consumer units of the same distributor. Biogas takes this route more than solar does. Of the 529 biogas plants, 160 credit other units and add up to 61.3 MW, 41% of biogas capacity; for solar, the share is 33%. Shared generation, in which consortia and cooperatives split the energy among their members, holds 18% of biogas and only 6.3% of solar. In all, 25,619 units receive credit from biogas plants, and half of them, 12,971, from five consortia in Cariacica (ES). The register says how many units receive the credit, but not where they are.
imagem_alt: "Map of Brazil in Albers conic projection with the states shaded in five blues by the share of biogas distributed-generation capacity credited to other units, from ice blue (none) to night blue (75% or more); states without biogas are white. Maranhão, Espírito Santo and Paraná are in the darkest shade; Mato Grosso, Rondônia, Paraíba, Pernambuco and Tocantins in the lightest. On top, for each municipality with a plant, a black ring proportional to total biogas capacity and, inside it, a blue disc proportional to the part credited to other units. Two callouts: Cariacica (ES), with 12,971 units credited by five consortia, and São Paulo, with 4,133 units credited by two commercial plants. The panel holds bars comparing the modalities of biogas and solar, the list of municipalities whose plants credit most units and a note that the register does not say where the credited units are."
metodo: "Biogas plants in distributed generation split by the modality in ANEEL’s register; capacity under remote self-consumption and shared generation was summed by the plant’s municipality and by state and compared with solar."
---

# Made here, used elsewhere: remote credit from biogas in distributed generation

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 148, the second in the **Biogas in distributed generation** collection. A biogas plant
does not always offset the bill of whoever hosts it: for four in every ten kilowatts, the energy
becomes credit at other units, sometimes hundreds of them, belonging to one company or to the
members of a consortium.

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `municipios` | point | 260 municipalities: `n_usinas`, `kw_total`, `kw_propria`, `kw_remoto`, `kw_compartilhada`, `kw_fora` (remote + shared), `pct_fora`, `uc_credito_fora` (units receiving credit from remote and shared plants) |
| `usinas` | point | 529 plants, with the same fields as plate 147 (`modalidade`, `uc_credito`, `titular`…) |
| `ufs` | polygon | 27 states: `usinas_biogas`, `kw_biogas`, `kw_fora`, `pct_fora`, `uc_credito_fora`, `classe` |
| `limite_nacional` | polygon | national boundary |

The **GPKG** is zipped and attached to the
[`gd-biogas-br-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/gd-biogas-br-2026),
with the plate’s **QGIS style** on the `ufs` and `municipios` layers (disc for the capacity credited
elsewhere; the total-capacity ring is an alternative style). The **CSV** sits in this folder, in
UTF-8, with the municipal table without geometry.

## Method

1. The 529 biogas plants of plate 147, from ANEEL’s distributed generation register (reference
   10/2026).
2. The modality is the register’s (`DscModalidadeHabilitado`): «Geracao na propria UC» (on site),
   «Auto consumo remoto» (remote self-consumption) and «Compartilhada» (shared). «Condomínio»
   (multiple units) only appears in solar plants.
3. «Credited to other units» adds remote self-consumption and shared generation. The share is of
   installed capacity, not of energy.
4. The comparison with solar uses all 4,665,874 photovoltaic plants in the same register (53.8 GW).
   507 of them, 16 MW, have no modality and stay in the denominator.
5. Units receiving credit are the `QtdUCRecebeCredito` field. For on-site plants it equals 1 and is
   left out.
6. States fall into five classes by the share of biogas capacity credited elsewhere: none, up to
   25%, 25 to 50%, 50 to 75% and 75% or more.

## Limitations

- The register does not give the location of the units receiving the credit, only how many there
  are. The rules require them to be in the same distributor’s concession area, but the real
  distance between plant and consumption cannot be measured with these data.
- The consumer class is that of the unit the plant connects to: among the 160 remote and shared
  plants, commercial ones hold 33.8 MW, 55% of the capacity, but the credited units may be of
  another class.
- Installed capacity is not energy generated; the share of energy credited elsewhere may differ.
- With few plants, one plant moves a state’s share a lot: Maranhão has four, all shared.

## Data licence

Open data from ANEEL and IBGE, free to use with attribution.
