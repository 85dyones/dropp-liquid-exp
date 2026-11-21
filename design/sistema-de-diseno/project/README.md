El turno, el cuaderno, el pasaporte y el atlas de quien trabaja detrás de la barra.

Usa este sistema para cualquier pantalla de las cuatro áreas (Turno, Cuaderno, Pasaporte, Atlas), en español y en portugués. Dos temas: **Papel** para el día y **Barra** para el turno de noche.

La idea que lo sostiene todo: DROPP parece **papel de trabajo de bar**. Etiqueta térmica, cuaderno de fichas, sello de pasaporte, regla de medida. Nada de cristal, neón ni cartas de videojuego.

## La marca

**La gota.** Siete pétalos, siete oficios, siete colores. El dibujo es el oficial de DROPP y no se altera: no lo redibujes, no lo recolorees, no separes los pétalos, no cambies el orden.

| Pétalo | Color | Oficio |
|---|---|---|
| arriba | amarillo #FACC15 | Creación |
| izquierda alta | verde #10B981 | Preparación y fermentación |
| izquierda baja | cian #06B6D4 | Hielo y dilución |
| derecha alta | naranja #F97316 | Clásicos |
| derecha baja | rojo #EF4444 | Sin alcohol |
| centro | magenta #D946EF | Hospitalidad |
| base | violeta #8B5CF6 | Coste y gestión |

En el Pasaporte, cada pétalo muestra el grado de ese oficio con la técnica de impresión: **Gota** en contorno discontinuo, **Infusión** en trama, **Reserva** en tinta plana, **Solera** en tinta plana con contorno. Los grados piden tiempo (Infusión 6 meses, Reserva 2 años, Solera 5 años y 3 personas formadas), nunca puntos.

**El nombre.** Debajo de "DROPP" va solo "Liquid Experience", que es parte de la marca. Los títulos de sección ("Pasaporte del oficio", "Cuaderno") van en una línea aparte, fuera del arco de la marca, entre filetes. Vale para la etiqueta del pasaporte, la parte superior de las pantallas y cualquier pieza nueva.

**El bar primero.** En todo lo que sale de la app (etiqueta, story, currículum), la casa aparece antes que DROPP. En la etiqueta, el nombre del bar abre la pieza y "DROPP · Liquid Experience" va al pie, pequeño. *El bar primero.*

Archivos: `assets/Marca/gota.svg` (en color) y `assets/Marca/gota-contorno.svg` (una tinta, para la térmica).

## Voz

- **Frases cortas, con el número dentro.** "Extra de evento el sábado: cobra 180 €, no 120 €." No "¿Y si revisas tu precio?".
- **Medidas, no notas.** Años de barra, casas, fichas, personas formadas. Ningún OVR, ranking ni nota que compare personas.
- **Cada cuenta enseña la fórmula.** La base de datos calcula, la IA explica. Ningún número del Barback aparece sin la fuente ("Tus registros de septiembre a noviembre").
- **El botón dice lo que pasa.** "Imprimir etiqueta", "Registrar merma", "Pedir la firma de Irene". Nunca "OK" o "Enviar" sueltos.
- **Una simulación se dice como simulación.** Cuando el prototipo finge algo del producto, el aviso empieza por "En la app, ...". Nunca decir que se envió un mensaje si no se envió.
- **Sin emoji.** Los iconos son de trazo; el color viene de la gota y de los estados.
- **Dos idiomas, con las palabras del oficio.** Español de España: merma, botella, "9,00 €", TPV, coste. Portugués: perda, garrafa, "€9,00". En español el recipiente es "Botella #"; en portugués nunca se dice "merma". Fechas dd/mm/aaaa y coma decimal en los dos.

## Fundamentos visuales

- **Papel crema con grano.** El fondo es `papel` (#EFE8D8) con puntos de 1px en una retícula de 4px; las tarjetas son `cartao` (#FAF6EC), retícula de 5px. Nunca el verde botella plano de la propuesta original.
- **La línea es de tinta.** Bordes de 1,5px en `tinta`, esquinas rectas (`raio-0`) en botones, sellos y campos, como una etiqueta cortada. Las tarjetas tienen 4px de radio.
- **Marcas de corte** en las esquinas de las piezas de trabajo (lote, recado, registro del archivo), fuera de la tarjeta, a medio tono.
- **Color solo con función.** Los siete colores de la gota marcan oficio; verde, amarillo y rojo marcan estado (hecho, atención, merma). El texto de color sobre papel usa la versión oscura (`tinta-*`), nunca el color puro de la gota.
- **Sombra solo en objetos físicos.** La etiqueta térmica, la vista previa de una story y el aviso que sube. Lo demás es plano.
- **La etiqueta es solo negra.** `termico` y `termico-tinta`, en los dos temas: es papel que sale de la impresora.

## Tipografías

| Papel | Familia | Uso |
|---|---|---|
| Display | Anton, siempre en mayúsculas | títulos, el tiempo de un lote ("CADUCA EL DOMINGO"), la medida de la regla (−18 °C), números de las esquinas de la etiqueta del pasaporte |
| Texto | Archivo, eje de anchura variable | cuerpo y botones en anchura 100; rótulos en mayúsculas con anchura 125 y 0,22em de espaciado; nombres de la etiqueta en anchura 70 |
| Medida | Courier Prime | todo lo que mide: ml, °C, °Bx, %, fechas, lotes, precios dentro de una fórmula, sellos |

Las tres tienen licencia libre (SIL OFL 1.1) y vienen en `fonts/`, en el subconjunto latino: español, portugués, €, ° y − están dentro. La regla práctica: si es un número que alguien va a comprobar, va en Courier Prime.

## Modo barra

El mismo sistema en oscuro, para el turno de noche, cuando la pantalla clara deslumbra detrás de la barra. Es un tema de tokens (`data-theme="balcao"`), no otra pantalla.

- El papel pasa a carbón (#171410), la tinta pasa a crema (#EFE8D8) y las tarjetas quedan un tono por encima (#221E18).
- Las tintas de sello y de texto de color se aclaran para mantener el contraste (`tinta-verde` #0B7654 → #6DCEA5, y así con todas: son los colores de la gota aclarados con el crema del papel).
- No cambian: los siete colores de la gota, la etiqueta térmica y el visor de la cámara.
- Se activa solo a la hora del turno de noche y la persona puede fijarlo.

Contraste (WCAG 2) en los dos temas: `tinta` 13:1 o más sobre `papel`, `cartao` y `regua-fundo`; `tinta-suave` 4,7:1 o más sobre `papel` y `regua-fundo`; `tinta-cartao` 7:1 sobre `cartao`; toda `tinta-*` 4,6:1 o más sobre `papel` y `cartao`; texto `sobre-estado` 4,6:1 o más en los tres sellos. El anillo de `foco` tiene 5:1 en Papel y 7,5:1 en Barra. Un sello nunca es solo color: siempre lleva la palabra.

## Toque y movimiento

- **Zonas táctiles para la mano mojada:** 44px como mínimo (`alvo-toque`), 46px en botones y pestañas, 62px en la navegación de las cuatro áreas.
- **Movimiento corto y físico:** el sello se estampa en 220 ms; la etiqueta sale de la impresora en 600 a 700 ms; la regla de lectura corre hasta el paso en 260 ms.
- **Movimiento reducido:** con `prefers-reduced-motion`, todo aparece en su sitio, sin animación.
- **Foco visible** en todos los controles: contorno de 2px en `foco`, separado 2px.

## Iconos

Trazo de 1,8px en una retícula de 24px, extremos redondeados, sin relleno, en el color del texto de al lado. Turno es un reloj, Cuaderno una hoja con líneas, Atlas un libro abierto, Comprobar el marco de lectura de QR. El Pasaporte usa la propia gota en color. Archivos en `assets/Icones/`.

## Dónde aparece cada pieza

| Componente | Área |
|---|---|
| Botón, Selección, Sello, Pestañas, Navegación, Aviso, Papel | todas las áreas |
| Etiqueta (con QR real) | Cuaderno: lotes, comprobación de la estación |
| Regla del lote, Ficha, Fórmula | Cuaderno: lotes, fichas y cuentas |
| Recado | Turno: el Barback, con sus tres frentes |
| Sello del pasaporte, Etiqueta del pasaporte | Pasaporte del oficio |
| Regla de lectura | Atlas: técnicas |
| Modo barra | todas las áreas, de noche |

**Añadido a propósito:** el Modo barra. La propuesta preveía trabajo nocturno detrás de la barra y ninguna pantalla tenía un tema oscuro; son solo tokens, sin componente nuevo.

Las clases están en `components/bundle.css`, con el prefijo `dp-`, y solo leen tokens. Los componentes React están en `window.Dropp` (`components/bundle.js`), con las props en `components/index.d.ts`. Los nombres de componentes, props y tokens siguen en portugués porque son el código que comparten las dos versiones del producto. Para usarlo, carga `tokens.css`, que ya declara las tres fuentes de `fonts/`, y `bundle.css`.

## Qué no hacer

- No usar el fondo verde botella plano, degradados ni brillos.
- No poner notas, niveles numéricos ni rankings a las personas. Pruebas, sí; marcadores, no.
- No escribir texto en el color puro de la gota sobre papel: usa la `tinta-*` correspondiente.
- No crear un quinto menú. Una función nueva entra en una de las cuatro áreas, usa datos que ya existen y ahorra tiempo, se convierte en dinero o en prueba.
