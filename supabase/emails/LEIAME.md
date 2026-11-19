# E-mails do login da Escola

O Supabase só deixa editar os modelos depois de ligar um SMTP próprio (Authentication → Emails → SMTP Settings).
No piloto, o envio sai pelo Brevo (`smtp-relay.brevo.com`, porta 587, login e chave SMTP do Brevo; remetente
"Dropp Liquid Experience"). Sem domínio próprio, o Brevo troca um remetente de Gmail por um endereço dele:
para o lançamento, verificar um domínio no Brevo (DKIM e DMARC).

`acesso.html` está colado nos dois modelos que o login usa:

| Modelo no painel | Quando sai |
| --- | --- |
| Confirm sign up | primeira entrada de um e-mail novo |
| Magic link or OTP | as entradas seguintes |

Assunto dos dois:

```
{{ if eq .Data.lang "pt" }}Seu código de acesso · Escola DROPP{{ else }}Tu código de acceso · Escuela DROPP{{ end }}
```

A língua vem de `{{ .Data.lang }}`, gravada no cadastro a partir do idioma do app (`pt`; qualquer outra coisa sai em espanhol).
O código é `{{ .Token }}` (8 dígitos, vale 1 hora, em Sign In / Providers → Email); o link é `{{ .ConfirmationURL }}`
e volta para o Atlas, aba Escola. O campo do código aparece no app com `VITE_LOGIN_POR_CODIGO=1` (`.env.local` e Vercel).
