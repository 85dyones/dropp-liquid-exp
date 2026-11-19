# DROPP Liquid Experience

Redesign e protótipos da plataforma de trabalho do bartender, em quatro áreas: Turno, Caderno, Passaporte do ofício e Atlas. Tudo em português e em espanhol da Espanha.

## O que tem aqui

| Pasta | O quê |
| --- | --- |
| `design/sistema-de-design/` | O sistema de design: tokens com os temas Papel e Balcão, 16 componentes (`bundle.css`, `bundle.js`, `index.d.ts`), a gota, os ícones e as fontes |
| `design/DESIGN.md` | O livro da marca: regras de uso, voz, tipos, modo balcão e contraste |
| `design/prototipo-*/` | Protótipos navegáveis de Turno, Caderno, Passaporte, Atlas e Escola. Cada um tem a versão em espanhol na pasta terminada em `-es` |
| `design/etiquetas/` | A página que imprime as etiquetas de lote com QR, e os PDFs prontos (térmica de 100 × 50 mm e A4) |
| `design/passaporte-da-gota.html` | A direção visual escolhida para o Passaporte: a gota e o rótulo |
| `design/passaporte-em-barril.html` | Uma direção descartada, mantida como registro |
| `app/` | As telas principais das quatro áreas em versão responsiva: celular, tablet de balcão e desktop, em português e espanhol, nos modos dia e balcão |

## Como abrir

- O app: `cd app`, `npm install` e `npm run dev`, depois abra http://localhost:5173. Ele lê os tokens, o CSS e as fontes direto de `design/sistema-de-design/`; para mudar uma cor, edite o `tokens.json` de lá. Abaixo de 760 px de largura vale o layout de celular, de 760 px a 1199 px o de tablet de balcão (trilho à esquerda e duas colunas), e a partir de 1200 px o de desktop (três colunas).
- Cada protótipo é um canvas de Design: `project/canvas.json` descreve a prancheta de 390 × 844 e `project/Main.dc.html` tem a tela e a lógica. Ele roda no editor de canvas que o gerou.
- A página de etiquetas abre direto no navegador: `design/etiquetas/etiquetas-lote.html?lang=pt&formato=termica`. Troque para `lang=es` ou `formato=a4`; com `&check=1`, ela lê de volta todos os QR impressos.

## Regras que valem em tudo

- Abaixo de "DROPP" vai só "Liquid Experience". Títulos de seção ficam numa linha separada.
- Nenhuma nota, nível numérico ou ranking de pessoas. A prova é o carimbo assinado.
- Em português, "perda" e "€9,00"; em espanhol, "merma", "Botella #" e "9,00 €".
- Bares, pessoas, marcas, preços e números das telas são fictícios e ilustrativos.

## Licenças

As fontes Anton, Archivo e Courier Prime usam a SIL Open Font License 1.1. Os textos das licenças estão em `design/sistema-de-design/licencas/`.
