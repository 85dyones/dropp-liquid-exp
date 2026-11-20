-- Dados de exemplo da Escola DROPP, iguais aos dos protótipos (hoje = sexta, 20/11/2026).
-- Pessoas e marcas são fictícias. Quem ensina entra com instrutor_nome; o instrutor_id liga depois à conta real.
insert into public.turmas (codigo, titulo, oficio, descricao, instrutor_nome, inicio, vagas, patrocinador, aberta_a_todos, so_maiores)
values
  ('ESC-07', '{"es": "Hielo claro en la práctica", "pt": "Gelo claro na prática"}', 'gelo-diluicao',
   '{"es": "Hielo en bloque transparente, corte y dilución medida contra la ficha. Tres encuentros y una práctica evaluada con dos firmas.", "pt": "Gelo em bloco transparente, corte e diluição medida contra a ficha. Três encontros e uma prática avaliada com duas assinaturas."}',
   'Irene Soler', '2026-12-01', 12, null, false, false),
  ('ESC-14', '{"es": "Coste por dosis y carta que paga", "pt": "Custo por dose e carta que paga"}', 'custo-gestao',
   '{"es": "Coste de cada cóctel, la meta de la casa y el precio que cierra la cuenta, con tus propias fichas.", "pt": "Custo de cada drink, a meta da casa e o preço que fecha a conta, com as suas fichas."}',
   'Pablo Ferrer', '2027-01-12', 12, null, false, false),
  ('ESC-11', '{"es": "Carta sin alcohol que vende", "pt": "Carta sem álcool que vende"}', 'sem-alcool',
   '{"es": "Curso patrocinado, abierto a todos. La práctica la evalúa Irene Soler, como en cualquier curso.", "pt": "Curso patrocinado, aberto a todos. A prática é avaliada por Irene Soler, como em qualquer turma."}',
   'Irene Soler', '2026-12-03', 20, 'Aperitivos Exemplo', true, true);

insert into public.encontros (turma_id, ordem, tipo, titulo, descricao, quando, lugar)
select t.id, e.ordem, e.tipo, e.titulo::jsonb, e.descricao::jsonb, e.quando::timestamptz, e.lugar
from public.turmas t
join (values
  ('ESC-07', 1, 'aula_app', '{"es": "Clase 1 · Cuánto diluye tu hielo", "pt": "Aula 1 · Quanto o seu gelo dilui"}', '{"es": "En la app, cuando quieras. Cambias el hielo y el tiempo hasta que el agua llega al 22% de la ficha.", "pt": "No app, quando quiser. Você troca o gelo e o tempo até a água chegar aos 22% da ficha."}', null, null),
  ('ESC-07', 2, 'aula_ao_vivo', '{"es": "Clase 2 · Corte del bloque", "pt": "Aula 2 · Corte do bloco"}', '{"es": "En directo, en línea.", "pt": "Ao vivo, online."}', '2026-12-04 11:00:00+01', null),
  ('ESC-07', 3, 'pratica', '{"es": "Práctica evaluada", "pt": "Prática avaliada"}', '{"es": "Presencial, con dos firmas: Irene Soler y un colega del curso.", "pt": "Presencial, com duas assinaturas: Irene Soler e um colega da turma."}', '2026-12-08 16:00:00+01', 'Bar Salitre, Valencia'),
  ('ESC-14', 1, 'aula_app', '{"es": "Clase 1 · El coste de una dosis", "pt": "Aula 1 · O custo de uma dose"}', '{"es": "En la app, con tu ficha del Negroni.", "pt": "No app, com a sua ficha do Negroni."}', null, null),
  ('ESC-14', 2, 'pratica', '{"es": "Práctica · Una carta con coste cerrado", "pt": "Prática · Uma carta com custo fechado"}', '{"es": "Presencial, con dos firmas.", "pt": "Presencial, com duas assinaturas."}', '2027-01-26 16:00:00+01', 'Valencia'),
  ('ESC-11', 1, 'aula_app', '{"es": "Clase 1 · Dulzor, acidez y cuerpo sin alcohol", "pt": "Aula 1 · Doçura, acidez e corpo sem álcool"}', '{"es": "En la app, cuando quieras.", "pt": "No app, quando quiser."}', null, null),
  ('ESC-11', 2, 'pratica', '{"es": "Práctica evaluada", "pt": "Prática avaliada"}', '{"es": "Presencial, evaluada por Irene Soler.", "pt": "Presencial, avaliada por Irene Soler."}', '2026-12-15 16:00:00+01', 'Ruzafa, Valencia')
) as e(codigo, ordem, tipo, titulo, descricao, quando, lugar) on e.codigo = t.codigo;

insert into public.materiais (titulo, tipo, oficio, resumo)
values
  ('{"es": "Hielo claro: congelación direccional", "pt": "Gelo claro: congelamento direcional"}', 'monografia', 'gelo-diluicao',
   '{"es": "Sin tapa, el frío entra solo por arriba y el hielo crece hacia abajo. 18 páginas, de Irene Soler.", "pt": "Sem tampa, o frio entra só por cima e o gelo cresce para baixo. 18 páginas, de Irene Soler."}'),
  ('{"es": "Cordial de lima: procedimiento", "pt": "Cordial de limão: procedimento de preparo"}', 'procedimento', 'preparo-fermentacao',
   '{"es": "El lote de 3 L: pesos, orden de los pasos, caducidad y la etiqueta lista para el Cuaderno.", "pt": "O lote de 3 L: pesos, ordem dos passos, validade e a etiqueta pronta para o Caderno."}'),
  ('{"es": "Coste de la carta de invierno", "pt": "Custo da carta de inverno"}', 'ficha', 'custo-gestao',
   '{"es": "Coste por dosis de cada cóctel, la meta de la casa y el precio que cierra la cuenta. De Pablo Ferrer.", "pt": "Custo por dose de cada drink, a meta da casa e o preço que fecha a conta. De Pablo Ferrer."}');

insert into public.eventos (titulo, tipo, quando, so_socios)
values
  ('{"es": "Clase en directo · Carta de invierno: qué entra y por qué", "pt": "Aula ao vivo · Carta de inverno: o que entra e por quê"}', 'aula_ao_vivo', '2026-12-10 18:00:00+01', true),
  ('{"es": "Crítica del mes: envío hasta el día 25", "pt": "Crítica do mês: envio até o dia 25"}', 'critica', '2026-11-25 23:59:00+01', true);

-- Plano grátis (migração 20261120090000_gratis): dois cursos básicos abertos a quem tem conta,
-- uma aula ao vivo aberta por mês e o material do mês da biblioteca.
insert into public.turmas (codigo, titulo, oficio, descricao, instrutor_nome, inicio, vagas, patrocinador, aberta_a_todos, so_maiores)
values
  ('ESC-02', '{"es": "Medida y dilución: lo básico", "pt": "Medida e diluição: o básico"}', 'gelo-diluicao',
   '{"es": "Curso básico, gratis con tu cuenta. El jigger, la cuchara y cuánta agua entra al remover o agitar. Dos clases en la app y una práctica en tu barra.", "pt": "Curso básico, grátis com a sua conta. O jigger, a colher e quanta água entra ao mexer ou bater. Duas aulas no app e uma prática no seu balcão."}',
   'Irene Soler', '2026-11-30', 40, null, true, false),
  ('ESC-03', '{"es": "Barra lista: mise en place", "pt": "Bancada pronta: mise en place"}', 'preparo-fermentacao',
   '{"es": "Curso básico, gratis con tu cuenta. Qué preparar antes del servicio, en qué orden y cómo etiquetar los lotes en el Cuaderno.", "pt": "Curso básico, grátis com a sua conta. O que preparar antes do serviço, em que ordem e como etiquetar os lotes no Caderno."}',
   'Pablo Ferrer', '2026-12-07', 40, null, true, false);

insert into public.encontros (turma_id, ordem, tipo, titulo, descricao, quando, lugar)
select t.id, e.ordem, e.tipo, e.titulo::jsonb, e.descricao::jsonb, e.quando::timestamptz, e.lugar
from public.turmas t
join (values
  ('ESC-02', 1, 'aula_app', '{"es": "Clase 1 · El jigger y la dosis exacta", "pt": "Aula 1 · O jigger e a dose certa"}', '{"es": "En la app, cuando quieras.", "pt": "No app, quando quiser."}', null, null),
  ('ESC-02', 2, 'aula_app', '{"es": "Clase 2 · Remover o agitar: cuánta agua entra", "pt": "Aula 2 · Mexer ou bater: quanta água entra"}', '{"es": "En la app, con tu ficha del Negroni.", "pt": "No app, com a sua ficha do Negroni."}', null, null),
  ('ESC-02', 3, 'pratica', '{"es": "Práctica en tu barra", "pt": "Prática no seu balcão"}', '{"es": "En tu bar, con dos firmas: quien enseña, por vídeo, y un compañero del curso.", "pt": "No seu bar, com duas assinaturas: quem ensina, pelo vídeo, e um colega da turma."}', '2026-12-11 18:00:00+01', null),
  ('ESC-03', 1, 'aula_app', '{"es": "Clase 1 · La lista de preparación", "pt": "Aula 1 · A lista de preparo"}', '{"es": "En la app: de las reservas del día a la lista del Cuaderno.", "pt": "No app: das reservas do dia à lista do Caderno."}', null, null),
  ('ESC-03', 2, 'aula_app', '{"es": "Clase 2 · Lotes con etiqueta", "pt": "Aula 2 · Lotes com etiqueta"}', '{"es": "En la app: caducidad, alérgenos y el QR.", "pt": "No app: validade, alérgenos e o QR."}', null, null),
  ('ESC-03', 3, 'pratica', '{"es": "Práctica en tu barra", "pt": "Prática no seu balcão"}', '{"es": "En tu bar, con dos firmas: quien enseña, por vídeo, y un compañero del curso.", "pt": "No seu bar, com duas assinaturas: quem ensina, pelo vídeo, e um colega da turma."}', '2026-12-18 18:00:00+01', null)
) as e(codigo, ordem, tipo, titulo, descricao, quando, lugar) on e.codigo = t.codigo;

insert into public.eventos (titulo, tipo, quando, so_socios)
values ('{"es": "Clase abierta del mes · Hielo claro sin máquina", "pt": "Aula aberta do mês · Gelo claro sem máquina"}', 'aula_ao_vivo', '2026-12-02 19:00:00+01', false);

-- Material do mês: novembro, o procedimento do cordial; dezembro, a monografia do gelo claro.
update public.materiais set livre_em = '2026-11-01' where titulo ->> 'pt' = 'Cordial de limão: procedimento de preparo';
update public.materiais set livre_em = '2026-12-01' where titulo ->> 'pt' = 'Gelo claro: congelamento direcional';
