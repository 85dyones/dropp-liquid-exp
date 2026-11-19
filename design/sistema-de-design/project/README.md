O turno, o caderno, o passaporte e o atlas de quem trabalha atrás do balcão.

Use este sistema para qualquer tela das quatro áreas (Turno, Caderno, Passaporte, Atlas), em português e em espanhol. Dois temas: **Papel** para o dia e **Balcão** para o turno da noite.

A ideia que segura tudo: o DROPP parece **papel de trabalho de bar**. Etiqueta térmica, caderno de fichas, carimbo de passaporte, régua de medida. Nada de vidro, neon ou carta de videogame.

## A marca

**A gota.** Sete pétalas, sete ofícios, sete cores. O desenho é o oficial do cliente e não se altera: não redesenhe, não recolora, não separe as pétalas, não troque a ordem.

| Pétala | Cor | Ofício |
|---|---|---|
| topo | amarelo #FACC15 | Criação |
| esquerda alta | verde #10B981 | Preparo e fermentação |
| esquerda baixa | ciano #06B6D4 | Gelo e diluição |
| direita alta | laranja #F97316 | Clássicos |
| direita baixa | vermelho #EF4444 | Sem álcool |
| centro | magenta #D946EF | Hospitalidade |
| base | violeta #8B5CF6 | Custo e gestão |

No Passaporte, cada pétala mostra o grau daquele ofício pela técnica de impressão: **Gota** em contorno tracejado, **Infusão** em retícula, **Reserva** chapada, **Solera** chapada com contorno. Os graus pedem tempo (Infusão 6 meses, Reserva 2 anos, Solera 5 anos e 3 pessoas formadas), nunca pontos.

**O nome.** Abaixo de "DROPP" vai só "Liquid Experience", que é parte da marca. Títulos de seção ("Passaporte do ofício", "Caderno") ficam numa linha separada, fora do arco da marca, entre fios. Vale para o rótulo, o topo das telas e qualquer peça nova.

**O bar primeiro.** Em tudo o que sai do app (etiqueta, story, currículo), a casa aparece antes do DROPP. Na etiqueta, o nome do bar abre a peça e "DROPP · Liquid Experience" fica no pé, pequeno. *El bar primero.*

Arquivos: `assets/Marca/gota.svg` (colorida) e `assets/Marca/gota-contorno.svg` (uma tinta, para a térmica).

## Voz

- **Frases curtas, com o número dentro.** "Freela de evento no sábado: cobre €180, não €120." Não "Que tal rever o seu preço?".
- **Medidas, não notas.** Anos de balcão, casas, fichas, pessoas formadas. Nenhum OVR, ranking ou nota que compare pessoas.
- **Toda conta mostra a fórmula.** O banco calcula, a IA explica. Nenhum número do Barback aparece sem a fonte ("Seus registros de setembro a novembro").
- **O botão diz o que acontece.** "Imprimir etiqueta", "Registrar perda", "Pedir a assinatura da Irene". Nunca "OK" ou "Enviar" solto.
- **Simulação dita como simulação.** Quando o protótipo finge algo do produto, o aviso começa com "No app, ...". Nunca dizer que uma mensagem foi enviada se não foi.
- **Sem emoji.** Os ícones são de traço; a cor vem da gota e dos estados.
- **Duas línguas, com as palavras do ofício.** Português: perda, garrafa, "€9,00". Espanhol da Espanha: merma, botella, "9,00 €", TPV, coste. Em português nunca "merma"; em espanhol o recipiente é "Botella #". Datas dd/mm/aaaa, vírgula decimal nas duas.

## Fundamentos visuais

- **Papel creme com grão.** O fundo é `papel` (#EFE8D8) com pontos de 1px numa grade de 4px; os cartões são `cartao` (#FAF6EC), grade de 5px. Nunca o verde-garrafa chapado da proposta original.
- **A linha é de tinta.** Bordas de 1,5px em `tinta`, cantos retos (`raio-0`) em botões, selos e campos, como etiqueta cortada. Cartões têm 4px de raio.
- **Marcas de corte** nos cantos das peças de trabalho (lote, recado, registro do arquivo), fora do cartão, a meio tom.
- **Cor só com função.** As sete cores da gota marcam ofício; verde, amarelo e vermelho marcam estado (feito, atenção, perda). Texto colorido sobre papel usa a versão escura (`tinta-*`), nunca a cor da gota pura.
- **Sombra só em objeto físico.** A etiqueta térmica, a prévia de story e o aviso que sobe. O resto é chapado.
- **A etiqueta é só preto.** `termico` e `termico-tinta`, nos dois temas: é papel que sai da impressora.

## Tipos

| Papel | Família | Uso |
|---|---|---|
| Display | Anton, sempre em caixa alta | títulos, o tempo de um lote ("VENCE DOMINGO"), a medida da régua (−18 °C), números dos cantos do rótulo |
| Texto | Archivo, eixo de largura variável | corpo e botões em largura 100; rótulos em caixa alta com largura 125 e 0,22em de espaço; nomes da etiqueta em largura 70 |
| Medida | Courier Prime | tudo o que mede: ml, °C, °Bx, %, datas, lotes, preços dentro de fórmula, selos |

As três são de licença livre (SIL OFL 1.1) e vêm em `fonts/`, no recorte latino: português, espanhol, €, ° e − estão dentro. A regra prática: se é um número que alguém vai conferir, vai em Courier Prime.

## Modo balcão

O mesmo sistema no escuro, para o turno da noite, quando a tela clara ofusca atrás do balcão. É um tema de tokens (`data-theme="balcao"`), não outra tela.

- O papel vira carvão (#171410), a tinta vira creme (#EFE8D8), os cartões ficam um tom acima (#221E18).
- As tintas de carimbo e de texto colorido clareiam para manter o contraste (`tinta-verde` #0B7654 → #34D399, e assim por diante).
- Não mudam: as sete cores da gota, a etiqueta térmica e o visor da câmera.
- Liga sozinho na hora do turno da noite e pode ser fixado pela pessoa.

Contraste (WCAG 2) nos dois temas: `tinta` 13:1 ou mais sobre `papel`, `cartao` e `regua-fundo`; `tinta-suave` 4,7:1 ou mais sobre `papel` e `regua-fundo`; `tinta-cartao` 7:1 sobre `cartao`; toda `tinta-*` 4,6:1 ou mais sobre `papel` e `cartao`; texto `sobre-estado` 4,6:1 ou mais nos três selos. O anel de `foco` tem 5:1 no Papel e 7,5:1 no Balcão. Selo nunca é só cor: sempre leva a palavra.

## Toque e movimento

- **Alvos para mão molhada:** 44px no mínimo (`alvo-toque`), 46px em botões e abas, 62px na navegação das quatro áreas.
- **Movimento curto e físico:** o carimbo bate em 220 ms; a etiqueta sai da impressora em 600 a 700 ms; a régua de leitura corre até o passo em 260 ms.
- **Movimento reduzido:** com `prefers-reduced-motion`, tudo aparece no lugar, sem animação.
- **Foco visível** em todo controle: contorno de 2px em `foco`, afastado 2px.

## Ícones

Traço de 1,8px numa grade de 24px, pontas arredondadas, sem preenchimento, na cor do texto ao lado. Turno é um relógio, Caderno uma folha com linhas, Atlas um livro aberto, Conferir a moldura de leitura de QR. O Passaporte usa a própria gota colorida. Arquivos em `assets/Icones/`.

## Onde cada peça aparece

| Componente | Área |
|---|---|
| Botão, Seleção, Selo, Abas, Navegação, Aviso, Papel | todas as áreas |
| Etiqueta (com QR real) | Caderno: lotes, conferência da bancada |
| Régua do lote, Ficha, Fórmula | Caderno: lotes, fichas e contas |
| Recado | Turno: o Barback, com as três cadeiras |
| Carimbo, Rótulo | Passaporte do ofício |
| Régua de leitura | Atlas: técnicas |
| Modo balcão | todas as áreas, à noite |

**Acréscimo intencional:** o Modo balcão. A proposta previa trabalho noturno atrás do balcão e nenhuma tela tinha um tema escuro; ele é só tokens, sem componente novo.

As classes ficam em `components/bundle.css`, com o prefixo `dp-`, e leem só os tokens. Os componentes React estão em `window.Dropp` (`components/bundle.js`), com as props em `components/index.d.ts`. Para usar, carregue `tokens.css`, que já declara as três fontes de `fonts/`, e `bundle.css`.

## O que não fazer

- Não usar o fundo verde-garrafa chapado, gradiente ou brilho.
- Não pôr nota, nível numérico ou ranking em pessoas. Prova, sim; placar, não.
- Não escrever texto na cor pura da gota sobre papel: use a `tinta-*` correspondente.
- Não criar um quinto menu. Função nova entra numa das quatro áreas, usa dados que já existem e poupa tempo ou vira dinheiro ou prova.
