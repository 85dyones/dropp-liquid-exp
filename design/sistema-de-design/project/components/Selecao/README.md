# Selecao

Escolha entre poucas opções fixas: botões de segmento (3 ou 4 por linha) e chips de filtro com contagem.

- Segmento (`.dp-seg` em `.dp-seg-row`): opções de uma conta, como 6 kg · 7 kg · 8 kg ou Batch · Custo · Cachê · Evento. O escolhido fica cheio (`aria-pressed="true"`). Uma linha `small` em `medida` explica o valor ("metrô", "Barback").
- Chip (`.dp-chip`): filtro de lista, com a contagem antes do nome entre parênteses: "(2) técnicas". A contagem é o que a estante tem, nunca um número inventado.
- No máximo quatro opções por linha; acima disso a tela pede outro desenho.
