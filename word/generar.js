// Genera la plantilla de Word.  Uso (desde word/): npm install && node generar.js
const fs = require("fs");
const { d, CM, styles, numbering } = require("./base");
const DATOS = require("./datos");
const portada = require("./portada");
const pre = require("./preliminares");
const cuerpo = require("./cuerpo");

const page = {
  size: { width: 12240, height: 15840 }, // carta
  margin: { top: 2 * CM, bottom: Math.round(2.5 * CM), left: 2 * CM, right: 2 * CM, header: 0, footer: Math.round(1.25 * CM) },
};
const pie = new d.Footer({ children: [new d.Paragraph({ alignment: d.AlignmentType.RIGHT, spacing: { after: 0 }, children: [new d.TextRun({ children: [d.PageNumber.CURRENT] })] })] });

const doc = new d.Document({
  creator: DATOS.autor, title: DATOS.titulo,
  subject: `Tesis de ${DATOS.programa}, CISE, Universidad Autónoma de Coahuila`,
  keywords: DATOS.palabrasClave,
  styles, numbering, footnotes: cuerpo.footnotes,
  features: { updateFields: true },
  sections: [
    { properties: { page }, children: portada() },
    {
      properties: { page: { ...page, pageNumbers: { start: 1, formatType: d.NumberFormat.LOWER_ROMAN } } },
      footers: { default: pie },
      children: [...pre.declaraciones(), ...pre.dedicatoria(), ...pre.agradecimientos(), ...pre.resumen(), ...pre.indices(), ...pre.siglas()],
    },
    {
      properties: { page: { ...page, pageNumbers: { start: 1, formatType: d.NumberFormat.DECIMAL } } },
      footers: { default: pie },
      children: [
        ...cuerpo.introduccion(), ...cuerpo.capitulo1(), ...cuerpo.capitulo2(), ...cuerpo.capitulo3(),
        ...cuerpo.capitulo4(), ...cuerpo.conclusiones(), ...cuerpo.referencias(), ...cuerpo.anexos(),
      ],
    },
  ],
});

const out = process.argv[2] || require("path").join(__dirname, "..", "Plantilla_Tesis_CISE.docx");
d.Packer.toBuffer(doc).then((b) => { fs.writeFileSync(out, b); console.log("Escrito:", out); });
