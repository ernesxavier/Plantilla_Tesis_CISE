// Tapa con triple marco y portada interior
const { d, FIG, CM, PX, TEXT_W, NONE, NO_BORDERS } = require("./base");
const DATOS = require("./datos");

const C = d.AlignmentType.CENTER;
const cl = (text, { size = 24, bold = false, before = 0, after = 0, caps = false } = {}) =>
  new d.Paragraph({
    alignment: C, spacing: { before, after, line: 300 },
    children: [new d.TextRun({ text, size, bold, allCaps: caps })],
  });

function tapa() {
  const triple = { style: d.BorderStyle.THIN_THICK_THIN_SMALL_GAP, size: 24, color: "000000" };
  const doble = { style: d.BorderStyle.THICK_THIN_SMALL_GAP, size: 18, color: "000000" };
  const W = Math.round(10 * CM);
  const recuadro = new d.Table({
    alignment: C,
    width: { size: W, type: d.WidthType.DXA }, columnWidths: [W],
    borders: { top: doble, bottom: doble, left: doble, right: doble, insideHorizontal: NONE, insideVertical: NONE },
    rows: [new d.TableRow({
      height: { value: Math.round(6 * CM), rule: d.HeightRule.EXACT },
      children: [new d.TableCell({
        width: { size: W, type: d.WidthType.DXA },
        margins: { top: 340, left: 200, right: 200 },
        children: [
          cl("TESIS"), cl(DATOS.anio),
          cl(DATOS.autor, { before: 170, caps: true }),
          cl(`“${DATOS.titulo}”`, { before: 170, bold: true }),
        ],
      })],
    })],
  });
  const W2 = Math.round(16.5 * CM);
  return new d.Table({
    alignment: C,
    width: { size: W2, type: d.WidthType.DXA }, columnWidths: [W2],
    borders: { top: triple, bottom: triple, left: triple, right: triple, insideHorizontal: NONE, insideVertical: NONE },
    rows: [new d.TableRow({
      height: { value: Math.round(22.5 * CM), rule: d.HeightRule.EXACT },
      children: [new d.TableCell({
        width: { size: W2, type: d.WidthType.DXA },
        children: [
          cl("UNIVERSIDAD AUTÓNOMA DE COAHUILA", { size: 29, bold: true, before: Math.round(1.03 * CM) }),
          cl("CENTRO DE INVESTIGACIONES SOCIOECONÓMICAS", { size: 29, bold: true }),
          cl("TESIS", { size: 35, bold: true, before: Math.round(2 * CM) }),
          cl("", { after: Math.round(5.4 * CM) }),
          recuadro,
          cl(""),
        ],
      })],
    })],
  });
}

function logos() {
  const half = Math.round(TEXT_W / 2);
  const cell = (img, w, h, align) => new d.TableCell({
    width: { size: half, type: d.WidthType.DXA }, verticalAlign: d.VerticalAlign.CENTER,
    children: [new d.Paragraph({ alignment: align, spacing: { after: 0, line: 240 },
      children: [new d.ImageRun({ type: "png", data: FIG(img), transformation: { width: w * PX, height: h * PX },
        altText: { title: img, description: img, name: img } })] })],
  });
  return new d.Table({
    width: { size: TEXT_W, type: d.WidthType.DXA }, columnWidths: [half, TEXT_W - half], borders: NO_BORDERS,
    rows: [new d.TableRow({ children: [
      cell("uadec_marca_institucional_negro.png", 1.6 * 606 / 255, 1.6, d.AlignmentType.LEFT),
      cell("cise_negro.png", 0.85 * 1428 / 393, 0.85, d.AlignmentType.RIGHT),
    ] })],
  });
}

function comite() {
  const a = Math.round(4.2 * CM), b = Math.round(10.6 * CM);
  const c = (t, al, w) => new d.TableCell({ width: { size: w, type: d.WidthType.DXA },
    children: [new d.Paragraph({ alignment: al, spacing: { after: 0, line: 276 }, children: [new d.TextRun({ text: t, size: 29 })] })] });
  return new d.Table({
    alignment: C, width: { size: a + b, type: d.WidthType.DXA }, columnWidths: [a, b], borders: NO_BORDERS,
    rows: DATOS.comite.map(([rol, nombre]) => new d.TableRow({ children: [c(rol, d.AlignmentType.RIGHT, a), c(nombre, d.AlignmentType.LEFT, b)] })),
  });
}

function portadaInterior() {
  return [
    new d.Paragraph({ children: [new d.PageBreak()], spacing: { after: 0 } }),
    logos(),
    cl("CENTRO DE INVESTIGACIONES SOCIOECONÓMICAS", { size: 29, bold: true, before: 120 }),
    cl(DATOS.programa, { size: 29, bold: true, caps: true }),
    cl("TESIS", { size: 35, before: 120 }),
    cl(DATOS.titulo, { size: 35, bold: true, before: Math.round(1 * CM) }),
    cl("que presenta como requisito parcial para obtener", { size: 35, before: Math.round(0.74 * CM) }),
    cl(`el grado de ${DATOS.grado}`, { size: 35 }),
    cl(DATOS.autor, { size: 35, bold: true, caps: true, before: Math.round(1.24 * CM) }),
    cl("Comité Evaluador:", { size: 35, bold: true, before: Math.round(1.25 * CM) }),
    comite(),
    cl(DATOS.lugar, { size: 29, before: Math.round(1.24 * CM) }),
    cl(DATOS.fecha, { size: 29 }),
  ];
}

module.exports = () => [tapa(), ...portadaInterior()];
