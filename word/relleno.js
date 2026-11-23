// Texto de relleno propio, en español. Bórrelo al escribir la tesis.
const FRASES = [
  "Este párrafo es texto de relleno y debe sustituirse por el contenido de la tesis.",
  "Su único propósito es mostrar cómo se ven el tipo de letra, el interlineado y los márgenes de la plantilla.",
  "Un párrafo típico desarrolla una sola idea, la sustenta con evidencia o con literatura y la conecta con la siguiente.",
  "Conviene que cada afirmación relevante tenga una cita a su fuente original.",
  "Las cifras deben indicar su unidad de medida, su periodo y la fuente de los datos.",
  "Al revisar el texto, procure frases cortas, verbos en voz activa y términos definidos una sola vez.",
  "Los resultados se interpretan en relación con la pregunta de investigación y con los trabajos previos.",
  "Si un término técnico se usa en inglés, escríbalo en cursiva la primera vez que aparece.",
];
function relleno(i, n = 5) {
  const out = [];
  for (let k = 0; k < n; k++) out.push(FRASES[(i * 3 + k) % FRASES.length]);
  return out.join(" ");
}
module.exports = { relleno };
