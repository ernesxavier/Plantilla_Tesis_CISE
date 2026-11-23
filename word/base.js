// Utilidades, medidas y estilos de la plantilla Word del CISE
const d = require("docx");
const fs = require("fs");
const path = require("path");

const REPO = process.env.REPO || path.resolve(__dirname, "..");
const FIG = (f) => fs.readFileSync(path.join(REPO, "figuras", f));

const CM = 567;                 // twips por cm
const PX = 37.795;              // píxeles (96 dpi) por cm
const FONT = "Palatino Linotype";
const TEXT_W = Math.round(17.59 * CM); // ancho de texto: 21.59 - 2 - 2 cm

// --- Texto con marcas simples: **negrita** y *cursiva* -----------------
function runs(s, base = {}) {
  if (Array.isArray(s)) return s;
  const out = [];
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let last = 0, m;
  while ((m = re.exec(s))) {
    if (m.index > last) out.push(new d.TextRun({ text: s.slice(last, m.index), ...base }));
    const tok = m[0];
    if (tok.startsWith("**")) out.push(new d.TextRun({ text: tok.slice(2, -2), bold: true, ...base }));
    else out.push(new d.TextRun({ text: tok.slice(1, -1), italics: true, ...base }));
    last = m.index + tok.length;
  }
  if (last < s.length) out.push(new d.TextRun({ text: s.slice(last), ...base }));
  return out;
}
const P = (s, opts = {}) => new d.Paragraph({ children: runs(s, opts.run || {}), ...opts, run: undefined });
const H = (lvl, text, opts = {}) => new d.Paragraph({ heading: [null, d.HeadingLevel.HEADING_1, d.HeadingLevel.HEADING_2, d.HeadingLevel.HEADING_3][lvl], children: runs(text), ...opts });
const STY = (style, s, opts = {}) => new d.Paragraph({ style, children: runs(s), ...opts });

// --- Campos -------------------------------------------------------------
const F = (instr, cached) => new d.SimpleField(instr, cached);
const CAP_NUM = (cap) => F("STYLEREF 1 \\n \\t", cap);         // número del capítulo
const SEQ = (label, n) => F(`SEQ ${label} \\* ARABIC \\s 1`, String(n));
const REF = (bm, cached, sw = "\\h") => F(`REF ${bm} ${sw}`, cached);

// Etiqueta numerada "Tabla 3.1" con marcador para referencias cruzadas
function numLabel(label, cap, n, bm) {
  const inner = [CAP_NUM(cap), new d.TextRun("."), SEQ(label, n)];
  return [new d.TextRun(label + " "), bm ? new d.Bookmark({ id: bm, children: inner }) : inner].flat();
}
function caption(label, cap, n, bm, title) {
  return new d.Paragraph({
    style: "Caption",
    children: [...numLabel(label, cap, n, bm), new d.TextRun({ text: ": " + title, bold: false })],
  });
}
const fuente = (s) => STY("NotaFuente", "*Fuente:* " + s);

// --- Bordes ---------------------------------------------------------------
const NONE = { style: d.BorderStyle.NONE, size: 0, color: "auto" };
const NO_BORDERS = { top: NONE, bottom: NONE, left: NONE, right: NONE, insideHorizontal: NONE, insideVertical: NONE };
const line = (sz) => ({ style: d.BorderStyle.SINGLE, size: sz, color: "000000" });

// --- Estilos -------------------------------------------------------------
const SPACING = { after: 170, line: 312, lineRule: d.LineRuleType.AUTO }; // 0.3 cm, interlineado 1.3

const headingBase = { font: FONT, color: "000000", bold: true };
const styles = {
  default: {
    document: {
      run: { font: FONT, size: 24, language: { value: "es-MX" } },
      paragraph: { spacing: SPACING },
    },
    heading1: {
      run: { ...headingBase, size: 32, allCaps: true },
      paragraph: {
        spacing: { before: 960, after: 600, line: 276 }, keepNext: true, keepLines: true,
        pageBreakBefore: true, alignment: d.AlignmentType.LEFT, outlineLevel: 0,
        border: { bottom: { ...line(8), space: 6 } },
        numbering: { reference: "capitulos", level: 0 },
      },
    },
    heading2: {
      run: { ...headingBase, size: 28 },
      paragraph: {
        spacing: { before: 420, after: 200, line: 276 }, keepNext: true, keepLines: true,
        alignment: d.AlignmentType.LEFT, outlineLevel: 1,
        numbering: { reference: "capitulos", level: 1 },
      },
    },
    heading3: {
      run: { ...headingBase, size: 24 },
      paragraph: {
        spacing: { before: 300, after: 140, line: 276 }, keepNext: true, keepLines: true,
        alignment: d.AlignmentType.LEFT, outlineLevel: 2,
        numbering: { reference: "capitulos", level: 2 },
      },
    },
  },
  paragraphStyles: [
    {
      id: "Normal", name: "Normal", quickFormat: true,
      run: { font: FONT, size: 24 },
      paragraph: { spacing: SPACING, alignment: d.AlignmentType.JUSTIFIED },
    },
    { // Resumen, Introducción, Conclusiones, Referencias...: aparece en el índice
      id: "TituloSinNumero", name: "Título sin número", basedOn: "Normal", next: "Normal", quickFormat: true,
      run: { ...headingBase, size: 32, allCaps: true },
      paragraph: {
        spacing: { before: 960, after: 600, line: 276 }, keepNext: true, keepLines: true,
        pageBreakBefore: true, alignment: d.AlignmentType.LEFT, outlineLevel: 0,
        border: { bottom: { ...line(8), space: 6 } },
      },
    },
    { // Índice general, de figuras y de tablas: no aparece en el índice
      id: "TituloIndice", name: "Título de índice", basedOn: "TituloSinNumero", next: "Normal", quickFormat: true,
      paragraph: { outlineLevel: 9 },
    },
    { // Secciones sin número (Introducción, Conclusiones)
      id: "SubtituloSinNumero", name: "Subtítulo sin número", basedOn: "Normal", next: "Normal", quickFormat: true,
      run: { ...headingBase, size: 28 },
      paragraph: { spacing: { before: 420, after: 200, line: 276 }, keepNext: true, keepLines: true, alignment: d.AlignmentType.LEFT, outlineLevel: 1 },
    },
    { // Títulos de las declaraciones (centrados)
      id: "TituloDeclaracion", name: "Título de declaración", basedOn: "Normal", next: "Normal", quickFormat: true,
      run: { ...headingBase, size: 28, allCaps: true },
      paragraph: { spacing: { before: 0, after: 400, line: 276 }, keepNext: true, pageBreakBefore: true, alignment: d.AlignmentType.CENTER, outlineLevel: 0 },
    },
    {
      id: "Caption", name: "caption", basedOn: "Normal", next: "Normal", quickFormat: true,
      run: { font: FONT, size: 22, bold: true },
      paragraph: { spacing: { before: 120, after: 120, line: 240 }, alignment: d.AlignmentType.CENTER, keepNext: true },
    },
    {
      id: "NotaFuente", name: "Nota de tabla o figura", basedOn: "Normal", next: "Normal", quickFormat: true,
      run: { size: 20 },
      paragraph: { spacing: { before: 60, after: 240, line: 240 }, alignment: d.AlignmentType.CENTER },
    },
    {
      id: "TextoTabla", name: "Texto de tabla", basedOn: "Normal", quickFormat: true,
      run: { size: 22 },
      paragraph: { spacing: { before: 40, after: 40, line: 240 }, alignment: d.AlignmentType.LEFT },
    },
    {
      id: "Ecuacion", name: "Ecuación", basedOn: "Normal", quickFormat: true,
      paragraph: { spacing: { before: 60, after: 60, line: 240 }, alignment: d.AlignmentType.CENTER },
    },
    {
      id: "Bibliografia", name: "Bibliografía", basedOn: "Normal", quickFormat: true,
      paragraph: { alignment: d.AlignmentType.LEFT, indent: { left: 720, hanging: 720 }, spacing: { after: 120, line: 276 } },
    },
    {
      id: "FootnoteText", name: "footnote text", basedOn: "Normal",
      run: { size: 18 }, paragraph: { spacing: { after: 0, line: 240 } },
    },
    { id: "TOC1", name: "toc 1", basedOn: "Normal", next: "Normal", run: { bold: true },
      paragraph: { spacing: { before: 160, after: 40, line: 240 }, alignment: d.AlignmentType.LEFT } },
    { id: "TOC2", name: "toc 2", basedOn: "Normal", next: "Normal",
      paragraph: { indent: { left: 400 }, spacing: { before: 0, after: 40, line: 240 }, alignment: d.AlignmentType.LEFT } },
    { id: "TOC3", name: "toc 3", basedOn: "Normal", next: "Normal",
      paragraph: { indent: { left: 800 }, spacing: { before: 0, after: 40, line: 240 }, alignment: d.AlignmentType.LEFT } },
    { id: "TableofFigures", name: "table of figures", basedOn: "Normal", next: "Normal",
      paragraph: { spacing: { before: 0, after: 80, line: 240 }, alignment: d.AlignmentType.LEFT } },
  ],
};

// --- Numeración ------------------------------------------------------------
const lvl = (level, format, text, indent, style) => ({
  level, format, text, style: { paragraph: { indent } },
  alignment: d.AlignmentType.LEFT, suffix: d.LevelSuffix.TAB,
});
const numbering = {
  config: [
    {
      reference: "capitulos",
      levels: [
        lvl(0, d.LevelFormat.DECIMAL, "Capítulo %1", { left: Math.round(4.6 * CM), hanging: Math.round(4.6 * CM) }),
        lvl(1, d.LevelFormat.DECIMAL, "%1.%2.", { left: Math.round(1.6 * CM), hanging: Math.round(1.6 * CM) }),
        lvl(2, d.LevelFormat.DECIMAL, "%1.%2.%3.", { left: Math.round(1.9 * CM), hanging: Math.round(1.9 * CM) }),
      ],
    },
    {
      reference: "anexos",
      levels: [lvl(0, d.LevelFormat.UPPER_LETTER, "Anexo %1", { left: Math.round(4.6 * CM), hanging: Math.round(4.6 * CM) })],
    },
    {
      reference: "lista-num",
      levels: [{ level: 0, format: d.LevelFormat.DECIMAL, text: "%1.", alignment: d.AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 620, hanging: 360 } } } }],
    },
    {
      reference: "vinetas",
      levels: [{ level: 0, format: d.LevelFormat.BULLET, text: "•", alignment: d.AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 620, hanging: 360 } } } }],
    },
  ],
};
const item = (s, inst) => new d.Paragraph({ children: runs(s), numbering: { reference: "lista-num", level: 0, instance: inst }, spacing: { after: 60, line: 312 } });
const bullet = (s) => new d.Paragraph({ children: runs(s), numbering: { reference: "vinetas", level: 0 }, spacing: { after: 60, line: 312 } });

module.exports = { d, FIG, CM, PX, FONT, TEXT_W, runs, P, H, STY, F, CAP_NUM, SEQ, REF, numLabel, caption, fuente, NONE, NO_BORDERS, line, styles, numbering, item, bullet };
