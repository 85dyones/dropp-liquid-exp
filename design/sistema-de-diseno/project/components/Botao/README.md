# Botao

Botón de acción con borde de tinta y esquinas rectas; el lleno es la acción principal de la pantalla.

- Una acción llena por pantalla (`.dp-btn--cheio`), las demás con contorno (`.dp-btn`). `.dp-btn--largo` ocupa todo el ancho; `.dp-btn--peq` va dentro de listas.
- La etiqueta es el verbo de lo que pasa: "Imprimir etiqueta", "Pedir la firma de Irene", "Cerrar la comprobación". Nunca "OK" o "Enviar" sueltos.
- Altura mínima `alvo-botao` (46px). Desactivado solo cuando falta un dato, y la pantalla dice cuál.
- Quien lo usa aporta el `<button type="button">` y el texto.
