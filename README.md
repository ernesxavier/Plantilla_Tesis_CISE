# Plantilla de tesis — CISE, UAdeC

Plantilla en LaTeX para tesis del Centro de Investigaciones Socioeconómicas (CISE) de la Universidad Autónoma de Coahuila. Reproduce el formato de la portada institucional (con las alturas ajustadas al recuadro de la tapa para el empastado). También incluye ejemplos listos para usar de citas, ecuaciones, tablas, figuras, subfiguras y anexos.

Autor: Ernesto X. Vera Gómez

Vista previa: [`main.pdf`](main.pdf)

## Uso en Overleaf

1. Abra la plantilla en Overleaf (enlace de la galería: *pendiente*) y pulse **Open as Template**.
   - Otra opción: descargue este repositorio como ZIP y en Overleaf use **New Project → Upload Project**.
2. Compile. Overleaf usa pdfLaTeX y ejecuta Biber automáticamente.

## Uso local

Requiere una distribución de LaTeX reciente (TeX Live o MiKTeX) con Biber.

```bash
latexmk -pdf main.tex
```

O bien, paso a paso: `pdflatex main` → `biber main` → `pdflatex main` → `pdflatex main`.

## Estructura

```
main.tex                  Archivo principal (el único que se compila)
referencias.bib           Bibliografía (p. ej., exportada de Zotero)
codigo/
  configuracion.tex       Paquetes, márgenes, interlineado y estilos
  portada.tex             Portada y datos de la tesis
  introduccion.tex
  capitulo_1.tex … capitulo_4.tex
  conclusiones.tex
  anexos.tex
figuras/                  Logos e imágenes (PDF, PNG o JPG)
```

## Qué editar

| Quiero…                                  | Archivo                                  |
|------------------------------------------|------------------------------------------|
| Poner título, autor, programa y comité   | `codigo/portada.tex` (solo los datos entre llaves) |
| Escribir los capítulos                   | `codigo/*.tex`                           |
| Agregar o quitar capítulos               | `main.tex` (`\include{...}`)             |
| Agregar referencias                      | `referencias.bib`                        |
| Cambiar el estilo de citas (por defecto APA 7) | `codigo/configuracion.tex` (`style=...`) |
| Marca de agua de borrador                | `codigo/configuracion.tex` (descomentar) |

Las citas siguen el formato APA 7 (paquete `biblatex-apa`). En `referencias.bib`, escriba los títulos de artículos y libros como pide APA: en minúscula salvo la primera palabra, la palabra tras dos puntos y los nombres propios. Proteja los nombres propios con llaves, por ejemplo `{México}`. Los nombres de revistas sí van con mayúsculas.

Al terminar, borre los `\lipsum` y la línea `\usepackage{lipsum}` de `configuracion.tex`.

No modifique los `\vspace` ni los tamaños de letra de la portada: están calibrados para que coincidan con el recuadro de la tapa.

## Licencia

El código de la plantilla se distribuye bajo la [licencia MIT](LICENSE).

**Los logotipos de `figuras/` no están cubiertos por esa licencia.** `uadec_marca_institucional*.png` y `cise.png` son marcas de la Universidad Autónoma de Coahuila y del CISE. Su uso se rige por el Manual de Marca de la UAdeC.
