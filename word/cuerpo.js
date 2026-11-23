// Introducción, capítulos, conclusiones, referencias y anexos
const fs = require("fs");
const path = require("path");
const { d, FIG, CM, PX, TEXT_W, runs, P, H, STY, F, CAP_NUM, SEQ, REF, caption, fuente, NONE, NO_BORDERS, line, item, bullet } = require("./base");
const { relleno } = require("./relleno");

const FIGURA = FIG("figura_ejemplo.png");
const R = (text, o = {}) => new d.MathRun({ text, ...o });
const sub = (b, s) => new d.MathSubScript({ children: [R(b)], subScript: [R(s)] });
const T = (s) => new d.TextRun(s);

// Ecuación numerada: tabla sin bordes de tres columnas (vacía | ecuación | número)
function ecuacion(cap, n, bm, math) {
  const side = Math.round(1.6 * CM), mid = TEXT_W - 2 * side;
  const cell = (w, children) => new d.TableCell({ width: { size: w, type: d.WidthType.DXA }, verticalAlign: d.VerticalAlign.CENTER, children });
  const num = [CAP_NUM(cap), T("."), SEQ("Ecuación", n)];
  return new d.Table({
    width: { size: TEXT_W, type: d.WidthType.DXA }, columnWidths: [side, mid, side], borders: NO_BORDERS,
    rows: [new d.TableRow({ cantSplit: true, children: [
      cell(side, [new d.Paragraph({ style: "Ecuacion" })]),
      cell(mid, [new d.Paragraph({ style: "Ecuacion", children: math })]),
      cell(side, [new d.Paragraph({ style: "Ecuacion", alignment: d.AlignmentType.RIGHT,
        children: [T("("), bm ? new d.Bookmark({ id: bm, children: num }) : num, T(")")].flat() })]),
    ] })],
  });
}

function figura(widthCm) {
  const h = widthCm * 1080 / 1650;
  return new d.Paragraph({ alignment: d.AlignmentType.CENTER, keepNext: true, spacing: { before: 120, after: 0, line: 240 },
    children: [new d.ImageRun({ type: "png", data: FIGURA, transformation: { width: widthCm * PX, height: h * PX },
      altText: { title: "Figura de ejemplo", description: "Diagrama de dispersión de ejemplo", name: "figura_ejemplo" } })] });
}

// Tabla con estilo de tres líneas (como booktabs)
function tabla(cols, filas, aligns) {
  const w = cols.map((x) => Math.round(x * CM));
  const n = filas.length;
  const cel = (t, j, i) => new d.TableCell({
    width: { size: w[j], type: d.WidthType.DXA },
    borders: {
      top: i === 0 ? line(12) : NONE,
      bottom: i === 0 ? line(6) : i === n - 1 ? line(12) : NONE,
      left: NONE, right: NONE,
    },
    children: [new d.Paragraph({ style: "TextoTabla", alignment: aligns[j], children: runs(t) })],
  });
  return new d.Table({
    alignment: d.AlignmentType.CENTER, width: { size: w.reduce((a, b) => a + b, 0), type: d.WidthType.DXA },
    columnWidths: w, borders: NO_BORDERS,
    rows: filas.map((f, i) => new d.TableRow({ tableHeader: i === 0, cantSplit: true, children: f.map((t, j) => cel(t, j, i)) })),
  });
}
const Lf = d.AlignmentType.LEFT, Rt = d.AlignmentType.RIGHT;

const introduccion = () => [
  STY("TituloSinNumero", "Introducción"),
  P("*Contenido sugerido: planteamiento del problema, justificación, pregunta de investigación, objetivos, hipótesis y organización del documento. Use el estilo «Subtítulo sin número» para las secciones.*"),
  STY("SubtituloSinNumero", "Planteamiento del problema"),
  P(relleno(0, 6)),
  STY("SubtituloSinNumero", "Objetivos"),
  P("**Objetivo general.** " + relleno(1, 3)),
  P("**Objetivos específicos:**", { keepNext: true }),
  item("Primer objetivo específico.", 2), item("Segundo objetivo específico.", 2), item("Tercer objetivo específico.", 2),
  STY("SubtituloSinNumero", "Hipótesis"),
  P(relleno(2, 4)),
  STY("SubtituloSinNumero", "Estructura de la tesis"),
  new d.Paragraph({ children: [
    T("La tesis se organiza en cuatro capítulos. El capítulo "), REF("_RefCap1", "1", "\\r \\t \\h"),
    T(" …; el capítulo "), REF("_RefCap2", "2", "\\r \\t \\h"),
    T(" …; el capítulo "), REF("_RefCap3", "3", "\\r \\t \\h"),
    T(" … y el capítulo "), REF("_RefCap4", "4", "\\r \\t \\h"),
    T(" …. Finalmente se presentan las conclusiones y recomendaciones."),
  ] }),
];

const capTitulo = (n) => new d.Paragraph({ heading: d.HeadingLevel.HEADING_1,
  children: [new d.Bookmark({ id: `_RefCap${n}`, children: [T(`Título del capítulo ${n}`)] })] });

const capitulo1 = () => [
  capTitulo(1),
  H(2, "Introducción del capítulo"),
  new d.Paragraph({ children: [
    T("La economía regional estudia la dimensión territorial de los procesos económicos (Capello, 2015). Krugman (1991) muestra que los rendimientos crecientes pueden generar patrones de concentración núcleo-periferia."),
    new d.FootnoteReferenceRun(1),
    T(" " + relleno(3, 4)),
  ] }),
  H(2, "Revisión de la literatura"),
  H(3, "Primer enfoque"),
  P(relleno(4, 6)),
  new d.Paragraph({ children: [
    new d.TextRun({ text: "Definición ", bold: true }), CAP_NUM("1"), new d.TextRun({ text: ".", bold: true }),
    F("SEQ Definición \\* ARABIC \\s 1", "1"), new d.TextRun({ text: ". ", bold: true }),
    T("Texto de la definición. Los términos en otro idioma se marcan en cursiva: "),
    new d.TextRun({ text: "spillovers", italics: true, language: { value: "en-US" } }),
    T(". Una ecuación en una línea: "),
    new d.Math({ children: [R("y=mx+b")] }), T("."),
  ] }),
  P("Y esta es una ecuación en un bloque:", { keepNext: true }),
  ecuacion("1", 1, null, [new d.Math({ children: [R("x="), new d.MathFraction({ numerator: [R("y−b")], denominator: [R("m")] })] })]),
  H(3, "Segundo enfoque"),
  P("Para el caso mexicano, Esquivel (1999) documenta convergencia regional, en línea con Barro y Sala-i-Martin (1992). " + relleno(5, 4)),
  H(2, "Consideraciones finales del capítulo"),
  P(relleno(6, 6)),
];

const capitulo2 = () => [
  capTitulo(2),
  H(2, "Introducción del capítulo"),
  P(relleno(7, 6)),
  H(2, "Modelo teórico"),
  P("Siguiendo a Mankiw et al. (1992), la función de producción es", { keepNext: true }),
  ecuacion("2", 1, "_RefEqProduccion", [new d.Math({ children: [
    sub("Y", "t"), R("="),
    new d.MathSubSuperScript({ children: [R("K")], subScript: [R("t")], superScript: [R("α")] }),
    new d.MathSubSuperScript({ children: [R("H")], subScript: [R("t")], superScript: [R("β")] }),
    new d.MathSuperScript({ children: [new d.MathRoundBrackets({ children: [sub("A", "t"), sub("L", "t")] })], superScript: [R("1−α−β")] }),
    R(",  α+β<1."),
  ] })]),
  P("El problema del hogar y su lagrangiano son:", { keepNext: true }),
  ecuacion("2", 2, null, [new d.Math({ children: [
    new d.MathLimitLower({ children: [R("max", { style: "plain" })], limit: [R("c,ℓ")] }),
    R(" u(c,ℓ)"), R(" s.a. ", { normalText: true }), R("c=w(1−ℓ)+y,"),
  ] })]),
  ecuacion("2", 3, null, [new d.Math({ children: [
    R("L", { script: "script" }), R("=u(c,ℓ)+λ"),
    new d.MathSquareBrackets({ children: [R("w(1−ℓ)+y−c")] }), R("."),
  ] })]),
  H(2, "Estrategia empírica"),
  P("El modelo econométrico es", { keepNext: true }),
  ecuacion("2", 4, "_RefEqModelo", [new d.Math({ children: [
    sub("y", "i"), R("="), sub("β", "0"), R("+"), sub("β", "1"), sub("x", "i"), R("+"),
    new d.MathSubSuperScript({ children: [R("z", { style: "bold" })], subScript: [R("i")], superScript: [R("⊤")] }),
    R("γ", { style: "bold" }), R("+"), sub("ε", "i"), R(",  "),
    R("E", { script: "doubleStruck" }),
    new d.MathSquareBrackets({ children: [sub("ε", "i"), R("∣"), sub("x", "i"), R(","),
      new d.MathSubScript({ children: [R("z", { style: "bold" })], subScript: [R("i")] })] }),
    R("=0,"),
  ] })]),
  new d.Paragraph({ children: [
    T("que se estima por mínimos cuadrados ordinarios (MCO) (Angrist y Pischke, 2009; Wooldridge, 2010). La ecuación ("),
    REF("_RefEqModelo", "2.4"), T(") se deriva de la ecuación ("), REF("_RefEqProduccion", "2.1"),
    T("); los resultados se presentan en el capítulo "), REF("_RefCap3", "3", "\\r \\t \\h"), T("."),
  ] }),
  H(2, "Datos"),
  P("Los datos del producto interno bruto (PIB) estatal provienen del Instituto Nacional de Estadística y Geografía (INEGI), y los de pobreza, del Consejo Nacional de Evaluación de la Política de Desarrollo Social (CONEVAL). A partir de aquí basta escribir INEGI. " + relleno(0, 4)),
];

const capitulo3 = () => [
  capTitulo(3),
  H(2, "Estadísticas descriptivas"),
  new d.Paragraph({ children: [T("La tabla "), REF("_RefTabDescriptivas", "3.1"), T(" resume las variables principales.")] }),
  caption("Tabla", "3", 1, "_RefTabDescriptivas", "Estadísticas descriptivas"),
  tabla([4.4, 2, 2.4, 2, 2], [
    ["Variable", "Media", "Desv. est.", "Mínimo", "Máximo"],
    ["Variable 1 (%)", "37.92", "14.42", "8.40", "65.90"],
    ["Variable 2 (años)", "9.70", "1.13", "7.40", "12.70"],
    ["Variable 3", "0.77", "0.14", "0.53", "0.98"],
  ], [Lf, Rt, Rt, Rt, Rt]),
  fuente("elaboración propia con datos de …"),
  H(2, "Resultados principales"),
  new d.Paragraph({ children: [T("La figura "), REF("_RefFigEjemplo", "3.1"), T(" muestra …")] }),
  figura(13.2),
  caption("Figura", "3", 1, "_RefFigEjemplo", "Título de la figura"),
  fuente("elaboración propia."),
  P(relleno(1, 6)),
  P(relleno(2, 5)),
];

function paneles() {
  const half = Math.round(TEXT_W / 2);
  const cel = (letra) => new d.TableCell({ width: { size: half, type: d.WidthType.DXA }, children: [
    figura(8.2),
    new d.Paragraph({ style: "NotaFuente", spacing: { before: 60, after: 60 }, children: [T(`(${letra}) Panel ${letra.toUpperCase()}`)] }),
  ] });
  return new d.Table({ width: { size: TEXT_W, type: d.WidthType.DXA }, columnWidths: [half, TEXT_W - half], borders: NO_BORDERS,
    rows: [new d.TableRow({ cantSplit: true, children: [cel("a"), cel("b")] })] });
}

const capitulo4 = () => [
  capTitulo(4),
  H(2, "Introducción del capítulo"),
  P(relleno(3, 6)),
  H(2, "Análisis"),
  new d.Paragraph({ children: [T("La figura "), REF("_RefFigPaneles", "4.1"), T(" compara …: el panel (a) … y el panel (b) …")] }),
  paneles(),
  caption("Figura", "4", 1, "_RefFigPaneles", "Figura con dos paneles"),
  H(2, "Discusión"),
  P("Los hallazgos principales son:", { keepNext: true }),
  bullet(relleno(4, 2)), bullet(relleno(5, 2)), bullet(relleno(6, 2)),
  P(relleno(7, 5), { spacing: { before: 170, after: 170, line: 312 } }),
];

const conclusiones = () => [
  STY("TituloSinNumero", "Conclusiones y recomendaciones"),
  STY("SubtituloSinNumero", "Conclusiones"),
  P(relleno(0, 6)), P(relleno(1, 5)),
  STY("SubtituloSinNumero", "Recomendaciones de política"),
  item(relleno(2, 2), 3), item(relleno(3, 2), 3),
  STY("SubtituloSinNumero", "Limitaciones y agenda de investigación"),
  P(relleno(4, 5)),
];

const REFS = [
  "Angrist, J. D., & Pischke, J.-S. (2009). *Mostly harmless econometrics: An empiricist’s companion*. Princeton University Press.",
  "Barro, R. J., & Sala-i-Martin, X. (1992). Convergence. *Journal of Political Economy, 100*(2), 223–251.",
  "Capello, R. (2015). *Regional economics* (2.a ed.). Routledge.",
  "Esquivel, G. (1999). Convergencia regional en México, 1940–1995. *El Trimestre Económico, 66*(264), 725–761.",
  "Krugman, P. (1991). Increasing returns and economic geography. *Journal of Political Economy, 99*(3), 483–499.",
  "Mankiw, N. G., Romer, D., & Weil, D. N. (1992). A contribution to the empirics of economic growth. *The Quarterly Journal of Economics, 107*(2), 407–437.",
  "Wooldridge, J. M. (2010). *Econometric analysis of cross section and panel data* (2.a ed.). MIT Press.",
];
const referencias = () => [
  STY("TituloSinNumero", "Referencias"),
  ...REFS.map((r) => STY("Bibliografia", r)),
];

const anexoTitulo = (t) => new d.Paragraph({ heading: d.HeadingLevel.HEADING_1, numbering: { reference: "anexos", level: 0 }, children: [T(t)] });
const anexos = () => [
  anexoTitulo("Definición de variables"),
  caption("Tabla", "A", 1, null, "Definición y fuente de las variables"),
  tabla([3, 8.6, 3.6], [
    ["Variable", "Definición", "Fuente"],
    ["Variable 1", "Descripción de la variable 1", "INEGI"],
    ["Variable 2", "Descripción de la variable 2", "CONEVAL"],
    ["Variable 3", "Descripción de la variable 3", "Elaboración propia"],
  ], [Lf, Lf, Lf]),
  anexoTitulo("Resultados complementarios"),
  P(relleno(5, 6)),
];

const footnotes = { 1: { children: [new d.Paragraph({ style: "FootnoteText", children: [T("Las notas al pie se numeran automáticamente.")] })] } };

module.exports = { introduccion, capitulo1, capitulo2, capitulo3, capitulo4, conclusiones, referencias, anexos, footnotes };
