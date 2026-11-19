# Vídeo de lançamento: «Una noche en la barra»

Vertical 9:16 (1080 × 1920), 30 s, MP4 H.264, legendas em espanhol da Espanha, sem narração. Só telas reais dos protótipos em espanhol; cada hora e cada número da legenda aparece numa tela.

| Tempo | Tela | Legenda |
| --- | --- | --- |
| 0–2,6 s | Abertura: a gota, DROPP, Liquid Experience | Una noche en la barra. |
| 17:00 | Turno, os três recados | Tres recados antes del servicio. Cada uno con la cuenta a la vista. |
| 18:10 | Cuaderno, lote LIM-022 com a etiqueta térmica | El cordial sale con etiqueta: caducidad, alérgenos y QR. |
| 21:30 | Turno, serviço por voz (Penicillin, 22,5 ml) | En el servicio, solo voz. Sin ficha, no hay respuesta. |
| 01:30 | Turno, fechamento: «Lo que entendí» | Sesenta segundos hablando y el turno queda en el libro. |
| — | Pasaporte, a etiqueta de Teo Aranda | Y lo que haces en la barra queda firmado en tu Pasaporte. |
| 25–30 s | Fechamento: a gota, a marca e, numa linha à parte, o lema | El bar primero. |

## Como refazer

Precisa do Microsoft Edge instalado (o script usa o modo headless) e do app rodando em http://localhost:5173 (`npm --prefix app run dev`).

1. `node design/video/capturar.mjs`: captura as telas a 3× em `telas/`.
2. `node design/video/gravar.mjs quadros <pasta> 4.5 9 13.5`: salva quadros parados para conferir.
3. `node design/video/gravar.mjs`: grava `dropp-lanzamiento-es.mp4` (30 s em tempo real, no próprio Edge).

`video.html` tem a linha do tempo (`CENAS`); abra com `?t=12` para ver um quadro. `explorar.mjs` lista os botões de cada estado de um protótipo.
