// Declaraciones, dedicatoria, agradecimientos, resumen, índices y siglas
const { d, CM, TEXT_W, runs, P, STY, NONE, NO_BORDERS, line, item, bullet } = require("./base");
const DATOS = require("./datos");
const { relleno } = require("./relleno");

const L = d.AlignmentType.LEFT;

function firma() {
  const lado = Math.round((TEXT_W - 7 * CM) / 2);
  return [
    P("Acepto que la falta de veracidad en esta declaración puede dar lugar a las sanciones previstas en la normativa de la Universidad Autónoma de Coahuila.", { keepNext: true, keepLines: true }),
    P(`${DATOS.lugar}, a ______ de ${DATOS.fecha}.`, { keepNext: true }),
    new d.Paragraph({
      alignment: d.AlignmentType.CENTER, keepNext: true,
      spacing: { before: Math.round(1.6 * CM), after: 0 },
      indent: { left: lado, right: lado },
      border: { top: { ...line(6), space: 2 } },
      children: [new d.TextRun(DATOS.autor)],
    }),
  ];
}

function declaraciones() {
  const box = (checked) => new d.CheckBox({ checked, checkedState: { value: "2612", font: "MS Gothic" }, uncheckedState: { value: "2610", font: "MS Gothic" } });
  const w = [3.8, 7.6, 4].map((x) => Math.round(x * CM));
  const celda = (t, bold, w_, borders) => new d.TableCell({
    width: { size: w_, type: d.WidthType.DXA }, borders,
    children: [new d.Paragraph({ style: "TextoTabla", children: [new d.TextRun({ text: t, bold, size: 20 })] })],
  });
  const top = { top: { ...line(12) }, bottom: { ...line(6) }, left: NONE, right: NONE };
  const mid = { top: NONE, bottom: NONE, left: NONE, right: NONE };
  const bot = { top: NONE, bottom: { ...line(12) }, left: NONE, right: NONE };
  const filas = [
    ["Herramienta y versión", "Uso", "Capítulos o secciones"],
    ["Nombre y versión", "Corrección de estilo y traducción del abstract", "Abstract"],
    ["Nombre y versión", "Depuración de código en R o Stata", "Capítulo 3"],
  ];
  const tablaIA = new d.Table({
    alignment: d.AlignmentType.CENTER, width: { size: w[0] + w[1] + w[2], type: d.WidthType.DXA }, columnWidths: w, borders: NO_BORDERS,
    rows: filas.map((f, i) => new d.TableRow({ tableHeader: i === 0,
      children: f.map((t, j) => celda(t, false, w[j], i === 0 ? top : i === filas.length - 1 ? bot : mid)) })),
  });

  return [
    STY("TituloDeclaracion", "Declaración de originalidad y autoría"),
    P(`Yo, **${DATOS.autor}**, estudiante del programa de ${DATOS.programa} del Centro de Investigaciones Socioeconómicas de la Universidad Autónoma de Coahuila, con matrícula ${DATOS.matricula}, declaro bajo protesta de decir verdad que:`),
    item(`La tesis titulada «${DATOS.titulo}» es de mi autoría y es resultado de mi trabajo de investigación, realizado bajo la dirección de ${DATOS.director} y la codirección de ${DATOS.codirector}.`, 1),
    item("No ha sido presentada, ni total ni parcialmente, para obtener otro grado académico en esta u otra institución.", 1),
    item("Todas las ideas, datos, figuras, tablas y textos tomados de otras fuentes están citados y referenciados según el formato APA 7. Cualquier omisión en este sentido es responsabilidad mía.", 1),
    item("Los datos y resultados que presento son auténticos. No he inventado ni manipulado información.", 1),
    item("Cuando la tesis incluye partes de artículos ya publicados o enviados para publicación, lo indico expresamente en el texto, con la referencia y la participación de los coautores.", 1),
    new d.Paragraph({ spacing: { after: 120 } }),
    ...firma(),

    STY("TituloDeclaracion", "Declaración de uso de inteligencia artificial"),
    P(`Yo, **${DATOS.autor}**, autor(a) de la tesis «${DATOS.titulo}», declaro bajo protesta de decir verdad, respecto del uso de herramientas de inteligencia artificial generativa, que:`),
    new d.Paragraph({ children: [box(false), new d.TextRun("  "), ...runs("**No utilicé** herramientas de inteligencia artificial generativa en la elaboración de esta tesis.")] }),
    new d.Paragraph({ children: [box(true), new d.TextRun("  "), ...runs("**Utilicé** herramientas de inteligencia artificial generativa como se detalla a continuación (si no las utilizó, borre la tabla y la lista):")] }),
    tablaIA,
    P("Asimismo, declaro que:", { spacing: { before: 240 } }),
    bullet("Revisé, verifiqué y edité todo el contenido producido con estas herramientas, y asumo plena responsabilidad por su exactitud."),
    bullet("La inteligencia artificial no aparece como autora ni coautora, y no la utilicé para generar resultados, datos ni conclusiones que se presenten como propios sin verificarlos."),
    bullet("Las referencias bibliográficas citadas fueron consultadas directamente en su fuente original."),
    new d.Paragraph({ spacing: { after: 120 } }),
    ...firma(),
  ];
}

const dedicatoria = () => [
  new d.Paragraph({
    pageBreakBefore: true, alignment: d.AlignmentType.RIGHT, spacing: { before: Math.round(7 * CM) },
    children: [new d.TextRun({ text: "A mi familia…", italics: true })],
  }),
];

const agradecimientos = () => [
  STY("TituloSinNumero", "Agradecimientos"),
  P("Agradezco a la Secretaría de Ciencia, Humanidades, Tecnología e Innovación (SECIHTI) por la beca otorgada para realizar mis estudios de posgrado (CVU: 000000)."),
  P("Al Centro de Investigaciones Socioeconómicas de la Universidad Autónoma de Coahuila…"),
  P("A mi director(a) de tesis, …, y a los miembros del comité evaluador…"),
];

const resumen = () => [
  STY("TituloSinNumero", "Resumen"),
  P("*Contenido sugerido (un párrafo, unas 250-300 palabras): problema, objetivo, datos y método, resultados principales y conclusión.* " + relleno(0)),
  P(`**Palabras clave:** ${DATOS.palabrasClave}.`, { spacing: { before: 200, after: 170, line: 312 } }),
  P(`**Clasificación JEL:** ${DATOS.jel}.`),

  STY("TituloSinNumero", "Abstract"),
  new d.Paragraph({ children: runs("*Translation of the Resumen into English.* This paragraph is placeholder text. Replace it with the abstract of the thesis: research problem, objective, data and method, main results and conclusion.", { language: { value: "en-US" } }) }),
  new d.Paragraph({ spacing: { before: 200, after: 170, line: 312 }, children: runs(`**Keywords:** ${DATOS.keywords}.`, { language: { value: "en-US" } }) }),
  new d.Paragraph({ children: runs(`**JEL classification:** ${DATOS.jel}.`, { language: { value: "en-US" } }) }),
];

const indices = () => [
  STY("TituloIndice", "Índice general"),
  new d.TableOfContents("Índice general", {
    hyperlink: true, headingStyleRange: "1-3",
    stylesWithLevels: [
      new d.StyleLevel("Título sin número", 1),
      new d.StyleLevel("Título de declaración", 1),
      new d.StyleLevel("Subtítulo sin número", 2),
    ],
  }),
  STY("TituloIndice", "Índice de figuras"),
  new d.TableOfContents("Índice de figuras", { hyperlink: true, captionLabelIncludingNumbers: "Figura" }),
  STY("TituloIndice", "Índice de tablas"),
  new d.TableOfContents("Índice de tablas", { hyperlink: true, captionLabelIncludingNumbers: "Tabla" }),
];

function siglas() {
  const a = Math.round(3.2 * CM), b = TEXT_W - a;
  const lista = [
    ["CONEVAL", "Consejo Nacional de Evaluación de la Política de Desarrollo Social"],
    ["INEGI", "Instituto Nacional de Estadística y Geografía"],
    ["MCO", "mínimos cuadrados ordinarios"],
    ["PIB", "producto interno bruto"],
  ];
  const c = (t, bold, w) => new d.TableCell({ width: { size: w, type: d.WidthType.DXA },
    children: [new d.Paragraph({ alignment: L, spacing: { after: 120, line: 276 }, children: [new d.TextRun({ text: t, bold })] })] });
  return [
    STY("TituloSinNumero", "Siglas y abreviaturas"),
    P("*Mantenga la lista en orden alfabético. En el texto, escriba el nombre completo la primera vez, seguido de la sigla entre paréntesis, y después solo la sigla.*"),
    new d.Table({ width: { size: TEXT_W, type: d.WidthType.DXA }, columnWidths: [a, b], borders: NO_BORDERS,
      rows: lista.map(([s, n]) => new d.TableRow({ children: [c(s, true, a), c(n, false, b)] })) }),
  ];
}

module.exports = { declaraciones, dedicatoria, agradecimientos, resumen, indices, siglas };
