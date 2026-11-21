# Carimbo

El sello del Pasaporte: la prueba de un hito, con tipo, título, línea y la tinta de quien firmó.

- Siete tipos, cada uno con su tinta y su forma: Casa (violeta, redondo), Jornada (cian, rectángulo), Carta (naranja, ovalado), Escuela (verde, rectángulo), Archivo (rojo, redondo), Mentor (magenta, ovalado), Brindis (amarillo, rectángulo).
- `.dp-carimbo--pendente` es discontinuo: falta una firma. Un sello pendiente no se comparte.
- La tinta es la versión oscura del color del pétalo (`tinta-*`), legible sobre papel; en Barra pasa a la versión clara. El filtro `tinta-gasta` (feTurbulence, definido en la página) da el borde de goma.
- Nunca una nota, nunca un número que compare personas. El sello se estampa una vez (220 ms) y se puede volver a ver con "Repetir la tinta".
