---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "One map per fuel"
subtitulo: "Beyond cane and pulp, nearly eight megawatts in ten still burn wood"
contexto: >-
  Take away sugarcane bagasse and the pulp mills’ black liquor, and Brazil is left with 202 operating biomass plants and 1.89 GW. Nearly eight in ten of those megawatts (78%) burn wood: chips and forest residue, firewood, charcoal and the gas from charcoal blast furnaces. Some of the new firewood goes into corn ethanol: Inpasa alone runs six plants with 315 MW in the Centre-West, Bahia and Maranhão. Rice husk belongs to the South: 11 of its 16 plants and 90% of its capacity are in Rio Grande do Sul. Roraima has 80 MW in seven plants burning elephant grass, palm oil and wood chips, six of them from 2022 and 2023. Rubbish and sewage add 243 MW, almost all landfill biogas, with the largest plant in Caieiras (SP). Second plate in the collection «What else the plant burns».
imagem_alt: "Three maps of Brazil in Albers conic projection with circles proportional to the capacity of biomass plants that burn neither cane bagasse nor black liquor, one map per fuel family. In the first, wood: chips and forest residue in green, firewood in ochre and charcoal in dark grey, spread from the South to Mato Grosso, with a callout for Inpasa’s six plants. In the second, field and farm: rice husk in yellow clustered in Rio Grande do Sul, elephant grass and palm in Roraima and Pará, farm biogas in the South and São Paulo, with callouts for Rio Grande do Sul and Roraima. In the third, rubbish and sewage: landfill biogas in blue in coastal capitals and São Paulo, with a callout for Caieiras. The fourth panel has one capacity bar per fuel; the side panel lists the largest plant of each."
metodo: "SIGA biomass plants whose fuel is neither cane bagasse nor black liquor (224, 202 operating), with the registry’s 14 fuels grouped into nine groups and three families (wood, field and farm, rubbish and sewage), by licensed capacity and registry coordinates."
---

# One map per fuel: the biomass plants that burn neither cane nor black liquor

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 166, the second in the collection **What else the plant burns**. After plate 165’s black
liquor, the rest: everything Brazil’s biomass power plants burn besides bagasse and pulp.

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `usinas` | point | 224 plants: `nome`, `ceg`, `uf`, `municipio`, `fase`, `combustivel` (as in SIGA), `grupo`, `familia`, `potencia_kw` (licensed), `ano_inicio`, `proprietario`, `regime`, `posicao` |
| `ufs` | polygon | 27 states |
| `limite_nacional` | polygon | national outline |

The **GPKG** is zipped and attached to the
[`combustivel-biomassa-br-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/combustivel-biomassa-br-2026),
with **QGIS styles** stored inside (circles by group, sized by capacity). The **CSV** sits in this
folder, in UTF-8, with the plant table and no geometry.

## Method

1. ANEEL’s register of generation projects (SIGA, open data generated on 01/10/2026, downloaded on
   01/11/2026): plants with `DscOrigemCombustivel` = «Biomassa», minus those burning cane bagasse or
   black liquor. That leaves 224, of which 202 are operating and 22 are being or yet to be built.
2. SIGA’s 14 fuels become nine groups: chips and forest residue («Resíduos Florestais»); firewood;
   charcoal and blast-furnace gas («Carvão Vegetal», «Gás de Alto Forno - Biomassa»); rice husk;
   elephant grass; palm oil and ethanol («Óleos vegetais», «Etanol»); farm and agro-industry biogas
   («Biogás-AGR», «Biogás - RA», «Biogás - Floresta»); landfill and sewage biogas («Biogás - RU»);
   burnt or carbonised waste («Resíduos Sólidos Urbanos - RU», «Carvão - RU»).
3. Three families, one map each: wood (the first three groups), field and farm (the next four) and
   rubbish and sewage (the last two). All three maps share the same circle scale.
4. Capacity is licensed capacity; position is the registry coordinate or, where missing, the centre
   of the municipality.

## Reading

- The 202 operating plants add up to 1.89 GW: wood 1,475 MW (78%), rubbish and sewage 243 MW (13%),
  field and farm 172 MW (9%).
- Chips and forest residue: 77 plants, 967 MW, the largest in Jacareí (SP), 108 MW, at a Suzano pulp
  and paper mill. Firewood: 17 plants, 354 MW, the largest at Inpasa’s corn-ethanol plant in Sinop
  (MT), 83 MW. Inpasa’s six plants add up to 315 MW on firewood and chips.
- Charcoal and blast-furnace gas: 18 plants, 154 MW; 12 of them, with 120 MW, in Minas Gerais, mostly
  at steelworks. The largest is Usiminas in Ipatinga, 63 MW.
- Rice husk: 16 plants, 89 MW; 11 of them, with 80 MW, in Rio Grande do Sul.
- Roraima has seven plants and 80 MW: one on elephant grass (BBF Baliza, 18 MW), one on palm oil
  (Palmaplan, 12 MW) and five on wood chips; six came online in 2022 and 2023.
- Landfill and sewage biogas: 27 plants, 210 MW, the largest in Caieiras (SP), 30 MW. Farm and
  agro-industry biogas: 28 plants, 42 MW, the largest in Guariba (SP), 21 MW, Raízen’s, running on
  cane residues.

## Limitations

- Licensed capacity is not generation; this plate shows what is installed, not what is actually
  burnt each month.
- The fuel is the one SIGA records as main; plants that mix fuels appear under one.
- «Gás de Alto Forno - Biomassa» is ANEEL’s class for gas from charcoal-fired blast furnaces; the
  plate follows the register.
- None of these figures is a potential estimate: only registered plants.

## Data licence

ANEEL and IBGE open data, free to use with attribution.
