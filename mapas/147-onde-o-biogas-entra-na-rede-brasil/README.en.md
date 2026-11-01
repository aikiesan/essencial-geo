---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "Where biogas meets the grid"
subtitulo: "529 small plants, 150.6 MW: 0.28% of Brazil’s distributed generation"
contexto: >-
  Brazil’s distributed generation counts 4.67 million plants and 54.1 GW, and 99.4% of that capacity is solar. Biogas is a small slice of it: 529 plants and 150.6 MW, 0.28% of the total, in 260 municipalities across 16 states. Almost three quarters of these plants, 393, are connected to rural units and are nearly always small; the median is 75 kW. But 85% of the capacity sits in the 212 mini-generation plants, above 75 kW, and the 118 commercial and industrial plants add up to 94.7 MW. Minas Gerais has 209 plants, 40% of the total, and Pará de Minas alone has 30, all rural. The city of São Paulo has the largest municipal capacity, 8.1 MW in two plants.
imagem_alt: "Map of Brazil in Albers conic projection with 260 circles, one per municipality with biogas distributed generation, sized by installed capacity and coloured by the consumer class with most kW in the municipality: olive for rural, blue for commercial, brick red for industrial and pale ochre for public and residential. The small green circles spread across Minas Gerais, western Paraná, Santa Catarina, Goiás and Mato Grosso; the larger blue and red ones sit near the south-eastern state capitals, in Maranhão, Paraíba and Rondônia. The Amazon and almost all of the North-East are empty. Two callouts: Pará de Minas (MG), with 30 rural plants, and São Paulo, with 8.1 MW in two plants. The panel holds capacity and number of plants by consumer class, the six states with most capacity and the biogas fuel as declared in the register."
metodo: "Micro- and mini-generation plants in ANEEL’s distributed generation register whose declared source is biogas, summed by municipality and drawn at the municipality’s interior point, with circles proportional to installed capacity and the colour of the consumer class with most kW."
---

# Where biogas meets the grid: biogas distributed generation in Brazil

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 147, the first in the **Biogas in distributed generation** collection. Distributed
generation means small plants, up to 5 MW, connected to the distributor’s grid to offset the
electricity bill of whoever installs them. Plate 044 showed solar, which is almost all of it; this
one picks out biogas, which is little, but sits elsewhere: on the farms and dairies of the interior
and in a few large company plants.

## What the files contain

| Layer (GPKG) | Geometry | Content |
| --- | --- | --- |
| `municipios` | point | 260 municipalities: `n_usinas`, `kw_total`, `kw_rural`, `kw_comercial`, `kw_industrial`, `kw_outras`, `classe_dominante`, `classes` (how many classes in the municipality), `primeira_atualizacao` (earliest registry update among its plants) |
| `usinas` | point | 529 plants: `cod_empreendimento`, `classe_consumo` (as in the register), `classe`, `subgrupo`, `tipo_titular` (individual PF or company PJ), `titular` (individuals are masked as «***»), `fonte_registro`, `fonte`, `modalidade_registro`, `modalidade`, `porte`, `kw`, `uc_credito`, `data_atualizacao`, `ano` |
| `ufs` | polygon | 27 states, with `usinas_biogas` and `kw_biogas` |
| `limite_nacional` | polygon | national boundary |

The **GPKG** is zipped and attached to the
[`gd-biogas-br-2026` release](https://github.com/aikiesan/essencial-geo/releases/tag/gd-biogas-br-2026).
The `municipios` and `usinas` layers carry the plate’s **QGIS style**, with circles proportional
to capacity. The **CSV** sits in this folder, in UTF-8, with the municipal table without geometry.

## Method

1. ANEEL’s list of distributed generation units (open data, reference 10/2026, generated on
   10/10/2026): 4,666,785 plants and 54.1 GW. The file, in UTF-8 and semicolon-separated, has one
   row per plant, with municipality, consumer class, modality, source, size and installed capacity.
2. Biogas is the declared source (`DscFonteGeracao`) «Biogás - RA» (animal waste), «Biogás - RU»
   (urban waste), «Biogás-AGR» (agro-industrial) and «Biogás - Floresta» (forest): 529 plants.
3. Capacity was summed by municipality (the register’s IBGE code). The register has no plant
   coordinates: the circle sits at the municipality’s interior point.
4. The colour is the consumer class with most kW in the municipality. In 27 of the 260
   municipalities there is more than one class; the `kw_*` columns hold the split.
5. The national share compares with the capacity of all plants in the register (54.1 GW).

## Limitations

- Installed capacity is not energy generated: the register does not say how much each plant
  produces.
- The biogas fuel is the one declared at registration and does not always match the activity: 67
  plants connected to rural units are filed as «urban waste». That is why the plate colours by
  consumer class rather than by fuel.
- The register is a snapshot of the plants registered in 10/2026; disconnected plants do not
  appear.
- The consumer class is that of the unit the plant connects to, not necessarily that of whoever
  receives the credit (see plate 148).
- The plate does not estimate biogas potential: it only shows what is connected to the grid.

## Data licence

Open data from ANEEL and IBGE, free to use with attribution.
