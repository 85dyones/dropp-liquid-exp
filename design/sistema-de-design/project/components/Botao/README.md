# Botao

Botão de ação com borda de tinta e cantos retos; o cheio é a ação principal da tela.

- Uma ação cheia por tela (`.dp-btn--cheio`), as outras vazadas (`.dp-btn`). `.dp-btn--largo` ocupa a largura toda; `.dp-btn--peq` vai dentro de listas.
- O rótulo é o verbo do que acontece: "Imprimir etiqueta", "Pedir a assinatura da Irene", "Fechar a conferência". Nunca "OK" ou "Enviar" solto.
- Altura mínima `alvo-botao` (46px). Desabilitado só quando falta um dado, e a tela diz qual.
- O consumidor fornece o `<button type="button">` e o texto.
