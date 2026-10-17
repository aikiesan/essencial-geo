---
numero: 2
titulo: "Hipsometria e curvas de nível"
subtitulo: "Patamares de altitude de uma serra imaginária"
data: 2026-10-12
categoria: altimetria-relevo
tags: [relevo, curvas-de-nivel, hipsometria, mde, prancha-modelo]
exemplo: true

contexto: >-
  Curvas de nível são a forma mais antiga de desenhar uma terceira dimensão numa
  folha plana, e continuam sendo a mais útil para quem projeta: é sobre elas que
  se traça um corte, se mede uma declividade, se decide por onde uma rua pode
  subir. Aqui, uma serra imaginária — gerada por ruído fractal, não por satélite —
  testa a convenção que as pranchas de relevo do atlas vão seguir: tintas
  hipsométricas em tons de terra, curvas mestras a cada 250 m e um DXF com a cota
  gravada em cada polilinha, pronto para virar maquete.

imagem: ./mapa_preview.png
imagem_alt: "Mapa hipsométrico de uma serra que atravessa a prancha na diagonal: vales em verde, encostas em ocre e argila, cumes em rosa-acinzentado, tudo desenhado por curvas de nível finas."

recorte: "Serra fictícia (dados sintéticos)"
fontes:
  - nome: "Dados sintéticos — Essencial Geo (scripts/gerar-exemplos.mjs)"
    url: https://github.com/aikiesan/essencial-geo/blob/main/scripts/gerar-exemplos.mjs
    ano: 2026
  - nome: "Modelo de referência: MDE Copernicus GLO-30 / INPE Topodata"
crs: "SIRGAS 2000 / UTM zona 23S"
epsg: 31983
escala: "1:50.000"
software: ["Node.js", "d3-contour"]
metodo: "Ruído fractal + crista ao longo de um eixo sinuoso; isolinhas por marching squares a cada 50 m."

downloads:
  - formato: dxf
    arquivo: dados/curvas_nivel_sinteticas.dxf
    rotulo: "Curvas com cota (Z)"
    tamanho: "1,8 MB"
  - formato: png
    arquivo: mapa_preview.png
    rotulo: "Prancha (PNG 2400 px)"
    tamanho: "1,6 MB"

versao: "0.1.0"
discussoes: []
---

# Hipsometria e curvas de nível

> **Prancha-modelo.** O relevo é sintético e não representa nenhum lugar real.

## Método

1. Um campo de altitude é gerado por ruído fractal (6 oitavas) somado a uma crista
   do tipo *ridged* concentrada ao longo de um eixo sinuoso.
2. Os valores são reescalados para 620–2.380 m.
3. As isolinhas são extraídas a cada 50 m com *marching squares* (`d3-contour`).
4. As faixas recebem tintas hipsométricas em tons de terra — verde-mata nos vales,
   ocre e argila nas encostas, cinza-rosado nos cumes.

## Convenções da série de relevo

- Curva **mestra** a cada 250 m (traço 1,5 px), **intermediária** a cada 50 m (0,7 px).
- O DXF separa as curvas nas camadas `CURVAS_MESTRAS_250M` e `CURVAS_INTERMEDIARIAS_50M`,
  com a altitude gravada como elevação de cada polilinha — no AutoCAD ou no Rhino,
  as curvas já chegam na cota certa.

## Versão com dados reais

```bash
# curvas a cada 5 m a partir de um MDE recortado e reprojetado
gdalwarp -t_srs EPSG:31983 -r bilinear mde.tif mde_utm.tif
gdal_contour -a cota -i 5 mde_utm.tif curvas.gpkg
ogr2ogr -f DXF curvas.dxf curvas.gpkg
```
