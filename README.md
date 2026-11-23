# Plantilla de tesis — CISE, UAdeC

[![Abrir en Overleaf](https://img.shields.io/badge/Abrir%20en-Overleaf-47A141?logo=overleaf)](https://www.overleaf.com/docs?snip_uri=https://github.com/ernesxavier/Plantilla_Tesis_CISE/archive/refs/heads/main.zip)

Plantilla en LaTeX para tesis del Centro de Investigaciones Socioeconómicas (CISE) de la Universidad Autónoma de Coahuila. Reproduce las dos páginas de portada de las tesis del CISE con sus mismas medidas: la tapa con triple marco y el recuadro que coincide con la tapa al empastar, y la portada interior con los logos del Manual de Marca de la UAdeC. También incluye ejemplos listos para usar de citas, ecuaciones, tablas, figuras, subfiguras y anexos.

Autor: Ernesto X. Vera Gómez, Centro de Investigaciones Socioeconómicas (CISE), Universidad Autónoma de Coahuila

Vista previa: [`main.pdf`](main.pdf)

## Uso en Overleaf

1. Abra la plantilla en Overleaf (enlace de la galería: *pendiente*) y pulse **Open as Template**.
   - Otra opción: pulse el botón **Abrir en Overleaf** de arriba, que crea un proyecto nuevo con la versión más reciente de este repositorio.
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
  portada.tex             Tapa con marco, portada interior, datos de la tesis, palabras clave y JEL
  originalidad.tex        Declaraciones de originalidad y de uso de IA, una página cada una (opcional)
  dedicatoria.tex         Opcional
  agradecimientos.tex     Opcional (incluye el agradecimiento a la SECIHTI)
  resumen.tex             Resumen y Abstract
  siglas.tex              Siglas y abreviaturas (opcional)
  introduccion.tex
  capitulo_1.tex … capitulo_4.tex
  conclusiones.tex
  anexos.tex
figuras/                  Logos e imágenes (PDF, PNG o JPG)
CITATION.cff              Cómo citar la plantilla
LICENSE                   Licencia MIT (código)
LICENSE-CC-BY-4.0         Licencia CC BY 4.0 (documentación)
```

## Qué editar

| Quiero…                                  | Archivo                                  |
|------------------------------------------|------------------------------------------|
| Poner título, autor, programa, comité y año | `codigo/portada.tex` (solo los datos entre llaves) |
| Quitar la tapa con marco                 | `codigo/portada.tex` (`\tapafalse`)      |
| Poner palabras clave y códigos JEL       | `codigo/portada.tex` (también llenan los metadatos del PDF) |
| Escribir el resumen y el abstract        | `codigo/resumen.tex`                     |
| Declarar si usó inteligencia artificial  | `codigo/originalidad.tex` (`\usoiatrue` o `\usoiafalse` y la tabla) |
| Quitar la declaración, la dedicatoria, los agradecimientos o las siglas | `main.tex` (comentar su `\include`) |
| Agregar siglas (`\ac{INEGI}` en el texto) | `codigo/siglas.tex`                     |
| Escribir los capítulos                   | `codigo/*.tex`                           |
| Agregar o quitar capítulos               | `main.tex` (`\include{...}`)             |
| Agregar referencias                      | `referencias.bib`                        |
| Cambiar el estilo de citas (por defecto APA 7) | `codigo/configuracion.tex` (`style=...`) |
| Marca de agua de borrador                | `codigo/configuracion.tex` (descomentar) |

Las citas siguen el formato APA 7 (paquete `biblatex-apa`). En `referencias.bib`, escriba los títulos de artículos y libros como pide APA: en minúscula salvo la primera palabra, la palabra tras dos puntos y los nombres propios. Proteja los nombres propios con llaves, por ejemplo `{México}`. Los nombres de revistas sí van con mayúsculas.

Al terminar, borre los `\lipsum` y la línea `\usepackage{lipsum}` de `configuracion.tex`.

No modifique los `\vspace`, los tamaños de letra ni las medidas de los marcos de la portada. Están calibrados para que la tapa y la portada interior coincidan con las tesis anteriores del CISE y con el recuadro de la tapa al empastar.

## Versión Word

[`Plantilla_Tesis_CISE.docx`](Plantilla_Tesis_CISE.docx) tiene la misma estructura y formato que la versión LaTeX: tapa, portada, declaraciones, índices, capítulos de ejemplo, referencias y anexos. La fuente es Palatino Linotype, en carta, con márgenes de 2 cm (2.5 cm abajo) e interlineado 1.3.

- **Al abrirla**, Word pregunta si desea actualizar los campos: responda **Sí**. Así se llenan los índices y los números de las tablas, figuras y ecuaciones. Para actualizarlos después, seleccione todo (Ctrl+E en Word en español, Ctrl+A en inglés) y pulse F9.
- **Datos de la portada:** use Buscar y reemplazar (Ctrl+L) para cambiar el título, el nombre y el programa en todo el documento. Para maestría, cambie «Doctorado» por «Maestría» y «Doctor(a)» por «Maestro(a)».
- **Estilos:** use *Título 1*, *Título 2* y *Título 3* para capítulos y secciones numerados; *Título sin número* para Resumen, Introducción, Conclusiones o Referencias; *Subtítulo sin número* para sus secciones; *Descripción* para los títulos de tablas y figuras, y *Bibliografía* para las referencias.
- **Tablas, figuras y ecuaciones:** copie un ejemplo y cambie su contenido. Para citarlas en el texto, use Referencias → Referencia cruzada. Para agregar un anexo, copie el título de un anexo existente.
- **Citas:** las referencias de ejemplo están escritas a mano. Para generarlas solas en APA 7, use el complemento de Zotero para Word.

La carpeta `word/` contiene el script que genera el `.docx` (`cd word && npm install && node generar.js`). Solo hace falta si se quiere regenerar la plantilla; los datos de la portada están en `word/datos.js`.

## Licencia

© 2026 Ernesto X. Vera Gómez, Centro de Investigaciones Socioeconómicas (CISE),
Universidad Autónoma de Coahuila.

- **Código de la plantilla** (`main.tex`, `codigo/` y `referencias.bib`): [MIT](LICENSE).
- **Documentación** (este README, `main.pdf` y `figuras/figura_ejemplo.pdf`):
  [Creative Commons Atribución 4.0 Internacional (CC BY 4.0)](LICENSE-CC-BY-4.0).
  Se puede copiar, adaptar y redistribuir con cualquier fin, siempre que se
  cite al autor y se indique si hubo cambios.
- **Logotipos** (`figuras/uadec_marca_institucional*.png` y `figuras/cise.png`):
  no están cubiertos por ninguna de las dos licencias. Son marcas de la
  Universidad Autónoma de Coahuila y del CISE, y su uso se rige por el Manual
  de Marca de la UAdeC.

El texto de la tesis que escriba con la plantilla es suyo: las licencias solo
cubren la plantilla.

Para citar la plantilla, use el botón *Cite this repository* de GitHub
([`CITATION.cff`](CITATION.cff)).
