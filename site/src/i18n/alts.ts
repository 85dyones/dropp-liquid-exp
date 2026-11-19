// Descrição das telas reais usadas no site, para quem não vê a imagem.
import type { Lang } from './textos';

export const ALTS: Record<string, Record<Lang, string>> = {
  turno: { es: 'Pantalla del Turno a las 17:00: viernes con 140 reservas y el primer recado del Barback, hacer 3 L de cordial de lima', pt: 'Tela do Turno às 17:00: sexta com 140 reservas e o primeiro recado do Barback, fazer 3 L de cordial de limão' },
  lote: { es: 'Pantalla del Cuaderno con el lote LIM-022 y su etiqueta térmica: caducidad, alérgenos y QR', pt: 'Tela do Caderno com o lote LIM-022 e a etiqueta térmica: validade, alérgenos e QR' },
  voz: { es: 'Pantalla del Turno durante el servicio: preguntas por voz y las respuestas del Barback con la ficha de origen', pt: 'Tela do Turno durante o serviço: perguntas por voz e as respostas do Barback com a ficha de origem' },
  passaporte: { es: 'Etiqueta del Pasaporte del Oficio con la gota de DROPP, el nombre del bartender y sus años de barra', pt: 'Rótulo do Passaporte do Ofício com a gota da DROPP, o nome do bartender e os anos de balcão' },
  atlas: { es: 'Pantalla del Atlas: el estante con técnicas y clásicos, cada uno con el motivo de estar ahí', pt: 'Tela do Atlas: a estante com técnicas e clássicos, cada um com o motivo de estar ali' },
  escola: { es: 'Pantalla de la Escuela DROPP: la suscripción de socio y el itinerario de cursos', pt: 'Tela da Escola DROPP: a assinatura de sócio e a trilha de cursos' }
};
