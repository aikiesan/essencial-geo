---
# English version (EN-UK). Numbers, files, DOI and layers come from README.md.
titulo: "The CO₂ in biogas"
subtitulo: "To become biomethane, biogas must shed its CO₂, almost half its volume"

contexto: >-
  Biogas leaves the digester as methane and CO₂; the CO₂ takes up 32% to 48% of the volume, depending on the residue. To become biomethane, which can enter the gas grid, biogas goes through upgrading, which separates out this CO₂, a concentrated, biogenic gas. If all the possible biogas in São Paulo were made and upgraded, on the CP2B potential (level N4, reference scenario), about 9.1 million t of CO₂ a year would come out, almost as much as the ethanol vats release in a harvest. 82% would come from cane residues: vinasse, filter cake, bagasse and straw. Guaíra leads with 178,000 t, followed by Morro Agudo with 154,000 and Sertãozinho with 136,000; the capital reaches 72,000 t from organic waste, pruning and sewage sludge. It is a potential, not a current emission, and an estimate. Second plate of the collection “Biogenic carbon”.

imagem: ./mapa_preview.en.png
imagem_alt: "Choropleth map of São Paulo municipalities in six shades of brown, from cream to dark brown, by the CO₂ that upgrading the possible biogas would separate each year. The dark shades cover almost all the cane-growing interior, in the north, west and centre; the light ones lie on the coast, in the Ribeira Valley and in the Paraíba Valley. The capital shows dark among its light neighbours. A callout points to Guaíra, with 178 kt a year, the largest potential in the state; another points to São Paulo, with 72 kt, from organic waste, pruning and sewage sludge. In the panel, bars show that 82% of the CO₂ would come from cane residues and others give the CO₂ share of the biogas from each residue."

recorte: "São Paulo State (SP)"
metodo: "For each municipality and residue, the biogas of the CP2B v5.1 potential (level N4, reference scenario) times the share of the volume that is not methane (1 − the residue’s CH₄ fraction), converted to mass at 1.977 kg of CO₂ per normal m³; summed by municipality and by residue group."
---

# The CO₂ from biogas upgrading in São Paulo

<p class="so-github"><a href="README.md">Português</a> · <strong>English</strong></p>

Plate No. 090, the second of four in the collection **Biogenic carbon**: how much CO₂ would come
out of upgrading the possible biogas in each municipality, if it were made and turned into
biomethane.

## What the files contain

- `dados/sp_carbono_municipios.csv`: one row per municipality, with all the collection’s fields.
  This plate uses `co2_biogas_t` (total), `co2_biogas_cana_t`, `co2_biogas_lavouras_t`,
  `co2_biogas_pecuaria_t`, `co2_biogas_urbano_t` and `biogas_n4_nm3_ano` (biogas of the potential,
  in normal m³ a year).
- `sp_carbono_biogenico.gpkg.zip` (in the `carbono-sp-2026` release): in the `municipios` layer,
  the `co2_biogas` style reproduces the map’s classes.

## Method

1. Biogas: the CP2B potential, method v5.1, level N4 (accessible: the theoretical potential less
   what is unavailable, what cannot be mobilised and the distance to where the gas would be made),
   in the reference scenario, by municipality and residue.
2. CO₂: biogas is taken as methane plus CO₂. The CO₂ volume is the biogas times (1 − the residue’s
   methane fraction), with CP2B’s fractions: from 0.52 methane in organic waste (48% CO₂) to 0.68
   in sewage sludge (32% CO₂); 0.575 in vinasse and 0.55 in bagasse and straw.
3. Mass: 1.977 kg of CO₂ per normal m³ (0 °C and 1 atm), from the NIST density.
4. Groups: cane (vinasse, filter cake, bagasse and straw), other crops, livestock and urban
   (organic waste, pruning and sewage sludge).

## Limitations

- It is a potential, not an emission. The CO₂ exists only if the biogas is produced and upgraded;
  today most of these residues never reach a digester.
- Real biogas also carries water vapour, H₂S, nitrogen and other traces; treating it as methane
  and CO₂ only slightly overstates the CO₂.
- Not every upgrading route delivers usable CO₂: with membranes or water scrubbing, the CO₂ stream
  carries some methane and needs treatment before any use.
- The CO₂ from cane biogas and that from the vats (plate 089) come from the same mill but from
  different processes; adding them, as plate 092 does, assumes both are put to use.
