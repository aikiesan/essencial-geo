---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Biogas plants"
subtitulo: "Where rubbish and manure become light"

contexto: >-
  On top of a landfill in Caieiras, in Greater São Paulo, the gas rising from the rubbish drives the state’s largest biogas power station: 29.5 MW of licensed capacity. It is one of 13 biogas power stations registered with ANEEL in São Paulo, which together add up to 108.2 MW. MapBiomas maps other ways of using the same gas: 51 plants across the state, 44 of them in operation, burning manure from farms, industrial effluent and what comes out of landfills and sewage works to make electricity, heat or biomethane. On the map they gather around the capital and along the agro-industrial hubs of the interior. First plate of the collection “Bioenergy in São Paulo”, which follows waste all the way to energy.

imagem: ./mapa_preview.en.png
imagem_alt: "Map of São Paulo state, with municipalities in light grey and the intermediate-region boundaries. Coloured dots mark 51 biogas plants: forest green for farming, plum for industry and deep blue for landfills and sewage, sized by scale and hollow when not in operation. Clay-coloured rings, proportional to capacity, mark the 13 biogas power stations registered with ANEEL; the largest, Termoverde Caieiras, gets an arrowed callout. The plants cluster around the city of São Paulo and in the north-centre of the state."

recorte: "São Paulo state (SP)"
metodo: "MapBiomas biogas plants and SIGA biogas power stations clipped to São Paulo state and assigned to municipalities by spatial join."
---

# Biogas plants in São Paulo state

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 028, the first of four in the collection **Bioenergy in São Paulo**: where biogas is
already put to use. The next plates show where the feedstock comes from — livestock and cane —
and where bagasse becomes electricity.

## What the files contain

| Layer (GPKG) | Geometry | Contents |
| --- | --- | --- |
| `usinas_biogas` | point | 51 MapBiomas plants: `categoria` (farming, industry, landfill or sewage), `uso_principal`, energy uses (`energia_eletrica`, `energia_termica`, `energia_mecanica`, `biometano`), `situacao`, `porte`, `inicio_operacao`, municipality |
| `ute_biogas` | point | 13 SIGA biogas power stations: `nome`, `ceg`, `combustivel`, `fase`, `potencia_kw` (licensed), `potencia_fiscalizada_kw`, `inicio_operacao`, `proprietario`, municipality |
| `municipios` | polygon | 645 municipalities: `usinas_biogas` (count) and `ute_biogas_kw` (total capacity) |
| `regioes_intermediarias` | polygon | 11 intermediate geographic regions |
| `limite_estadual` | polygon | outline of the state |

The **GPKG** is zipped and attached to the
[`bioenergia-sp-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/bioenergia-sp-2026).
It carries **QGIS styles**: plants coloured by category and sized by scale (hollow when not in
operation), and power stations as rings proportional to capacity, with their names.

The **CSV** combines both point layers (column `camada`), with longitude and latitude in decimal
degrees, in UTF-8.

## Method

1. Biogas plants from the MapBiomas infrastructure database, filtered by the state field (SP).
   The layer does not report biogas output (the field is zero for every plant), so dot size follows
   the declared **scale**.
2. SIGA (ANEEL) power stations fuelled by biogas — *Biogás – RU*, *Biogás-AGR* and
   *Biogás – Floresta* — in the version published by MapBiomas. Capacity is the licensed figure, in kW.
3. Each point receives the code of the municipality it falls in, by spatial join with IBGE’s 2025
   Municipal Mesh.
4. On the plate, ring area is proportional to capacity; both layers appear together because the
   same plant may be in both databases.

## Limitations

- The two databases share no common identifier: it is not possible to say which MapBiomas plants
  match which ANEEL power stations, and adding the two counts would double-count some of them.
- The MapBiomas layer records operations starting up to October 2019; the SIGA layer, up to June
  2022. Newer plants are missing. The current SIGA release, on ANEEL’s open data portal, can be used
  to update the `ute_biogas` layer.
- Plants that only flare their biogas, without using the energy, are in neither database.
