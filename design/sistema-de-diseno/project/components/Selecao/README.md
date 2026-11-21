# Selecao

Elegir entre pocas opciones fijas: botones de segmento (3 o 4 por fila) y chips de filtro con recuento.

- Segmento (`.dp-seg` en `.dp-seg-row`): opciones de una cuenta, como 6 kg · 7 kg · 8 kg o Batch · Coste · Caché · Evento. El elegido queda lleno (`aria-pressed="true"`). Una línea `small` en `medida` explica el valor ("oferta", "Barback").
- Chip (`.dp-chip`): filtro de lista, con el recuento antes del nombre entre paréntesis: "(2) técnicas". El recuento es lo que tiene el estante, nunca un número inventado.
- Como máximo cuatro opciones por fila; si hay más, la pantalla pide otro diseño.
