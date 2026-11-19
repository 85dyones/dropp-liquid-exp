// Textos e dados das telas, em português e em espanhol da Espanha.
// Os números são os mesmos dos protótipos (Turno, Caderno, Passaporte, Atlas).
import type { Cadeira, Estado, Tinta, TipoCarimbo } from './ds/componentes';

export type Lang = 'pt' | 'es';
export type Area = 'turno' | 'caderno' | 'passaporte' | 'atlas';

export type RecadoDado = {
  id: string; cad: Cadeira; titulo: string;
  linhas: Array<[string, string]>; fonte: string;
  opcoes: Array<{ t: string; efeito: string; feito: string }>;
};
export type LoteDado = { rotulo: string; tempo: string; tinta: Tinta; nome: string; pct: number; feito: string; vence: string; tec: string; descricao: string };
export type GarrafaDado = { recip: string; nome: string; lote: string; estado: Estado; st: string };
export type FichaDado = { nome: string; servico: string; preco: number; custo: number };
export type EventoDado = { d: string; m: string; dia: string; t: string; s: string };
export type OficioDado = { nome: string; cor: string; grau: string; tempo: string };
export type CarimboDado = { tipo: TipoCarimbo; rotulo: string; titulo: string; linha: string; pendente?: boolean; rotacao: number };
export type ItemEstante = { rot: string; nome: string; porque: string; linha: string };

const agendaPt: EventoDado[] = [
  { d: '26', m: 'nov', dia: 'qui', t: 'Guest shift do Bar Brasa', s: 'Sea Bar · 21h' },
  { d: '01', m: 'dez', dia: 'ter', t: 'Gelo claro na prática · aula 1', s: 'Escola DROPP · no app' },
  { d: '13', m: 'dez', dia: 'dom', t: 'Troca de fichas de inverno', s: 'Ruzafa · 17h' }
];
const agendaEs: EventoDado[] = [
  { d: '26', m: 'nov', dia: 'jue', t: 'Guest shift del Bar Brasa', s: 'Sea Bar · 21h' },
  { d: '01', m: 'dic', dia: 'mar', t: 'Hielo claro en la práctica · clase 1', s: 'Escuela DROPP · en la app' },
  { d: '13', m: 'dic', dia: 'dom', t: 'Intercambio de fichas de invierno', s: 'Ruzafa · 17h' }
];

export const TEXTOS = {
  pt: {
    lang: 'pt-BR',
    areas: { turno: 'Turno', caderno: 'Caderno', passaporte: 'Passaporte', atlas: 'Atlas' } as Record<Area, string>,
    navRot: 'Áreas do DROPP',
    idiomaRot: 'Idioma',
    modoBalcao: 'Modo balcão',
    modoDia: 'Modo dia',
    fechar: 'Fechar',
    feito: 'feito',
    turno: {
      quando: 'Quarta, 18/11 · 17:00 · antes do turno',
      titulo: 'Três recados',
      donoRot: 'De quem são os recados',
      casa: 'Casa', meu: 'Meu',
      cadeiras: { op: 'Operação', fin: 'Financeiro', mkt: 'Marketing' } as Record<Cadeira, string>,
      nivel: 'Sugere',
      recadosCasa: [
        { id: 'cordial', cad: 'op', titulo: 'Faça 3 L de cordial de limão, e não 2.',
          linhas: [['por quê', 'Sexta com 140 reservas e 27 °C às 21h.'], ['custa', '+ €4,20 de limão e 25 min de preparo'], ['evita', 'Na sexta 13/11 o cordial acabou às 23:10 e o Gimlet saiu da carta.']],
          fonte: 'Reservas do sistema (140), previsão do tempo para as 21h e livro de turno das últimas 4 sextas: média de 2,6 L.',
          opcoes: [
            { t: 'Fazer 3 L', efeito: '+ €4,20', feito: 'Na lista de preparo: 3 L de cordial de limão.' },
            { t: 'Manter 2 L', efeito: 'pode faltar', feito: 'Mantido em 2 L. Se acabar antes da meia-noite, entra na nota de fechamento.' }
          ] },
        { id: 'negroni', cad: 'fin', titulo: 'O Negroni da casa passou da meta: de 22% para 23% de custo.',
          linhas: [['por quê', 'O Campari subiu 11% na nota de 12/11.'], ['meta', 'A casa trabalha com até 22% de custo.'], ['vende', '312 Negronis em outubro']],
          fonte: 'Nota do fornecedor de 12/11, ficha do Negroni de 02/11 e 312 vendas em outubro no PDV. Valores ilustrativos.',
          opcoes: [
            { t: 'Subir €0,50 no preço', efeito: 'custo 22%', feito: 'Preço atualizado no PDV a partir de hoje: €9,50. Custo volta a 22%. Medindo as vendas por 4 semanas contra outubro.' },
            { t: 'Trocar o vermute da casa', efeito: 'custo 21%', feito: 'Ficha do Negroni atualizada com o vermute B e enviada ao time. Custo 21%.' },
            { t: 'Manter como está', efeito: 'custo 23%', feito: 'Mantido. O Barback avisa se o custo passar de 25%.' }
          ] },
        { id: 'guest', cad: 'mkt', titulo: 'Quinta tem guest shift do Bar Brasa aqui. Convido quem já brindou com a casa?',
          linhas: [['quem', '46 pessoas brindaram com o Sea Bar nos últimos 6 meses'], ['custa', 'nada: 46 mensagens e 1 story']],
          fonte: 'Brindes registrados nos passaportes nos últimos 6 meses. A arte usa o nome dos drinks do evento, nunca a receita.',
          opcoes: [
            { t: 'Convite e story', efeito: '46 + 1', feito: 'Convite enviado a 46 pessoas e story agendado para quinta, 18:00. As respostas entram no livro de turno.' },
            { t: 'Só o story', efeito: '1 story', feito: 'Story agendado para quinta, 18:00. Nenhum convite enviado.' },
            { t: 'Agora não', efeito: '', feito: 'Nada enviado. O Barback não sugere de novo para este evento.' }
          ] }
      ] as RecadoDado[],
      recadosMeu: [
        { id: 'folga', cad: 'op', titulo: 'Você está há 9 noites sem folga. Peço a terça, 24/11?',
          linhas: [['escala', 'Na terça o Sea Bar tem mais 2 pessoas na barra.'], ['freela', 'Nenhum freela marcado para terça.']],
          fonte: 'Sua escala no Sea Bar e a sua agenda de freelas.',
          opcoes: [
            { t: 'Pedir a folga', efeito: '', feito: 'Pedido enviado a Marta Ortega, gerente do bar. A resposta aparece aqui.' },
            { t: 'Agora não', efeito: '', feito: 'Tudo bem. O Barback volta a avisar em 3 noites.' }
          ] },
        { id: 'freela', cad: 'fin', titulo: 'Freela de evento no sábado: cobre €180, não €120.',
          linhas: [['por quê', 'Sua noite no Sea Bar rende €151 em média, com gorjetas.'], ['inclui', '5 horas e 2 drinks autorais']],
          fonte: 'Seus registros de setembro a novembro. Valores ilustrativos.',
          opcoes: [
            { t: 'Responder €180', efeito: '+ €60', feito: 'Resposta enviada ao organizador com €180 e o que está incluído.' },
            { t: 'Aceitar €120', efeito: '', feito: 'Aceite enviado. O freela entrou na sua agenda de sábado.' },
            { t: 'Escrevo eu', efeito: '', feito: 'Rascunho aberto com os números ao lado. Nada enviado.' }
          ] },
        { id: 'residencia', cad: 'mkt', titulo: 'A Casa Ostra abriu uma residência de 2 semanas em Clássicos.',
          linhas: [['pede', 'Grau Infusão em Clássicos'], ['você', 'Infusão, com 3 anos e 2 meses no ofício']],
          fonte: 'Vaga publicada em 17/11 e o seu Passaporte, só com os carimbos públicos.',
          opcoes: [
            { t: 'Candidatar com o passaporte', efeito: '', feito: 'Candidatura enviada com o link dropp.me/teo. Só os carimbos públicos aparecem.' },
            { t: 'Guardar', efeito: '', feito: 'Guardada na sua lista de vagas. Fecha em 30/11.' }
          ] }
      ] as RecadoDado[],
      bancada: 'Na bancada hoje',
      servico: 'Durante o serviço',
      servicoTxt: 'Silêncio, só voz. Pergunte uma medida ou avise o que acabou; o Barback responde pela ficha.',
      falar: 'Falar com o Barback',
      falarAviso: 'No app, o Barback escuta só enquanto você segura o botão.',
      agenda: 'Esta semana',
      agendaItens: agendaPt
    },
    caderno: {
      abas: { lotes: 'Lotes', conferir: 'Conferir', fichas: 'Fichas' },
      lotesTit: 'Lotes contados pelo tempo',
      lotes: [
        { rotulo: 'PF-001 · Garrafa #2', tempo: 'Vence em 2 dias', tinta: 'laranja', nome: 'Cordial de maracujá', pct: 60, feito: 'feito 15/11', vence: 'vence 20/11', tec: 'Brix 52° · pH 3,1 · 700 de 2.500 ml', descricao: 'Feito há 3 dias, vence em 2' },
        { rotulo: 'MEL-005 · Garrafa #5', tempo: 'Acaba hoje', tinta: 'vermelho', nome: 'Xarope de mel 2:1', pct: 21, feito: 'feito 15/11', vence: 'vence 29/11', tec: 'Brix 66° · restam 200 de 1.000 ml · saem 400 ml por noite', descricao: 'Restam 200 ml e saem 400 ml por noite' },
        { rotulo: 'MP-002 · Barril #4', tempo: 'Vence em 22 dias', tinta: 'verde', nome: 'Ponche de leite clarificado', pct: 27, feito: 'feito 10/11', vence: 'vence 10/12', tec: 'clarificado com soro · 19,4% ABV · 3.200 de 5.000 ml', descricao: 'Feito há 8 dias, vence em 22' }
      ] as LoteDado[],
      visorTit: 'Conferir a bancada',
      visorTxt: 'Aponte para o QR da etiqueta. Cada garrafa lida entra na lista do dia.',
      ler: 'Ler uma etiqueta',
      lerAviso: 'No app, a câmera abre aqui e lê o QR em menos de um segundo.',
      diaTit: 'Garrafas do dia',
      garrafas: [
        { recip: 'Garrafa #2', nome: 'Cordial de maracujá', lote: 'PF-001', estado: 'ok', st: 'lida 17:10' },
        { recip: 'Garrafa #5', nome: 'Xarope de mel 2:1', lote: 'MEL-005', estado: 'meio', st: 'lida · vazia' },
        { recip: 'Barril #4', nome: 'Ponche de leite clarificado', lote: 'MP-002', estado: 'ok', st: 'lida 17:12' },
        { recip: 'Garrafa #7', nome: 'Orgeat', lote: 'ORG-011', estado: 'perdido', st: 'não estava · perda de €3,36' },
        { recip: 'Garrafa #3', nome: 'Cordial de limão', lote: 'LIM-022', estado: 'falta', st: 'sem leitura' }
      ] as GarrafaDado[],
      resumo: '5 garrafas hoje: 3 lidas (1 vazia) · 1 não estava · 1 sem leitura',
      fecharConf: 'Fechar a conferência',
      fecharConfAviso: 'Conferência fechada às 17:15. A perda do orgeat foi para o livro de turno, com o custo.',
      fichasTit: 'Fichas e custo por dose',
      meta: 'meta da casa: 22%',
      acima: 'acima da meta',
      fichas: [
        { nome: 'Negroni da casa', servico: 'copo baixo · gelo em bloco · casca de laranja', preco: 9.0, custo: 2.08 },
        { nome: 'Boulevardier', servico: 'copo baixo · gelo em bloco · casca de laranja', preco: 12.0, custo: 2.65 },
        { nome: 'Penicillin', servico: 'copo baixo · gelo em bloco · gengibre cristalizado', preco: 11.0, custo: 2.43 },
        { nome: 'Hanky Panky', servico: 'taça coupe · sem gelo · casca de laranja', preco: 10.0, custo: 1.93 },
        { nome: 'Shrub de gengibre', servico: 'copo alto · gelo em cubos · rodela de limão', preco: 9.0, custo: 1.35 }
      ] as FichaDado[],
      formulaRot: 'Custo por dose · Negroni da casa',
      formulaLinhas: ['gin 30 ml €0,78 + Campari 30 ml €0,73', '+ vermute 30 ml €0,42 + casca €0,05', '+ gelo em bloco €0,10 = €2,08', '€2,08 ÷ €9,00 = 23,1% · meta 22%']
    },
    passaporte: {
      secao: 'Passaporte do ofício',
      cargo: 'head bartender · Sea Bar, Valência',
      cantos: [{ n: '12', r: 'anos de balcão' }, { n: '7', r: 'casas' }, { n: '38', r: 'fichas' }, { n: '9', r: 'formados' }],
      oficiosTit: 'Sete ofícios, em quatro graus',
      oficiosNota: 'O grau pede tempo e prova assinada: Infusão em 6 meses, Reserva em 2 anos, Solera em 5 anos e 3 pessoas formadas.',
      oficios: [
        { nome: 'Hospitalidade', cor: 'magenta', grau: 'Solera', tempo: '9 anos' },
        { nome: 'Criação', cor: 'amarelo', grau: 'Reserva', tempo: '4 anos e 2 meses' },
        { nome: 'Clássicos', cor: 'laranja', grau: 'Infusão', tempo: '3 anos e 2 meses' },
        { nome: 'Custo e gestão', cor: 'violeta', grau: 'Infusão', tempo: '2 anos e 6 meses' },
        { nome: 'Preparo e fermentação', cor: 'verde', grau: 'Infusão', tempo: '1 ano e 8 meses' },
        { nome: 'Gelo e diluição', cor: 'ciano', grau: 'Gota', tempo: '4 meses' },
        { nome: 'Sem álcool', cor: 'vermelho', grau: 'Gota', tempo: '1 mês' }
      ] as OficioDado[],
      carimbosTit: 'Últimos carimbos',
      carimbos: [
        { tipo: 'jornada', rotulo: 'Jornada', titulo: 'Bar Brasa', linha: 'Madri · 14/11/2026', rotacao: -3 },
        { tipo: 'escola', rotulo: 'Escola', titulo: 'Clarificação', linha: 'julho de 2026', rotacao: 2 },
        { tipo: 'arquivo', rotulo: 'Arquivo', titulo: 'Hanky Panky', linha: 'falta 1 colega', pendente: true, rotacao: -2 },
        { tipo: 'mentor', rotulo: 'Mentor', titulo: 'Ana Lima', linha: 'março de 2026', rotacao: 3 }
      ] as CarimboDado[],
      recrutador: 'Ver como um recrutador vê',
      recrutadorAviso: 'No app, abre dropp.me/teo: só os carimbos públicos, com a assinatura de quem viu.'
    },
    atlas: {
      abas: { estante: 'Estante', escola: 'Escola', agenda: 'Agenda' },
      estanteTit: 'Estante da semana',
      estante: [
        { rot: 'Técnica · AT-022 · Gelo e diluição', nome: 'Gelo claro em bloco', porque: 'Negroni, Boulevardier e Penicillin saem com gelo em bloco, hoje comprado pronto a €0,10 por dose.', linha: '10 L · −18 °C · 30 h · rende 7 kg' },
        { rot: 'Técnica · AT-014 · Preparo e fermentação', nome: 'Clarificar sem centrífuga', porque: 'O cordial de maracujá (PF-001) sai toda semana, e o Sea Bar não tem centrífuga.', linha: '1 kg · 2 g de enzima · 4 °C · 12 h' },
        { rot: 'Arquivo · ARQ-031', nome: 'Hanky Panky', porque: 'Seu registro de 12/11 espera um colega: falta Tomás Vidal.', linha: 'Ada Coleman · American Bar do Savoy, Londres' }
      ] as ItemEstante[],
      escolaTit: 'Escola DROPP',
      escolaTxt: 'Cursos em turma, com prática no bar. Quem termina leva o carimbo Escola no Passaporte.',
      escolaProx: 'Próxima turma: Gelo claro na prática · começa 01/12 · 3 vagas livres',
      escolaBtn: 'Ser sócio · 30 dias grátis',
      escolaPreco: '€9,99 por mês, ou €19,99 com o Barback pessoal',
      escolaAviso: 'A assinatura está no protótipo da Escola DROPP.',
      agendaTit: 'Agenda do setor',
      agendaItens: agendaPt
    }
  },
  es: {
    lang: 'es-ES',
    areas: { turno: 'Turno', caderno: 'Cuaderno', passaporte: 'Pasaporte', atlas: 'Atlas' } as Record<Area, string>,
    navRot: 'Áreas de DROPP',
    idiomaRot: 'Idioma',
    modoBalcao: 'Modo barra',
    modoDia: 'Modo día',
    fechar: 'Cerrar',
    feito: 'hecho',
    turno: {
      quando: 'Miércoles, 18/11 · 17:00 · antes del turno',
      titulo: 'Tres recados',
      donoRot: 'De quién son los recados',
      casa: 'Casa', meu: 'Mío',
      cadeiras: { op: 'Operación', fin: 'Finanzas', mkt: 'Marketing' } as Record<Cadeira, string>,
      nivel: 'Sugiere',
      recadosCasa: [
        { id: 'cordial', cad: 'op', titulo: 'Haz 3 L de cordial de lima, no 2.',
          linhas: [['por qué', 'Viernes con 140 reservas y 27 °C a las 21h.'], ['cuesta', '+ 4,20 € de lima y 25 min de preparación'], ['evita', 'El viernes 13/11 el cordial se acabó a las 23:10 y el Gimlet salió de la carta.']],
          fonte: 'Reservas del sistema (140), previsión del tiempo para las 21h y libro de turno de los últimos 4 viernes: media de 2,6 L.',
          opcoes: [
            { t: 'Hacer 3 L', efeito: '+ 4,20 €', feito: 'En la lista de preparación: 3 L de cordial de lima.' },
            { t: 'Mantener 2 L', efeito: 'puede faltar', feito: 'Se mantiene en 2 L. Si se acaba antes de medianoche, entra en la nota de cierre.' }
          ] },
        { id: 'negroni', cad: 'fin', titulo: 'El Negroni de la casa superó la meta: del 22% al 23% de coste.',
          linhas: [['por qué', 'El Campari subió un 11% en la factura del 12/11.'], ['meta', 'La casa trabaja con un coste de hasta el 22%.'], ['vende', '312 Negronis en octubre']],
          fonte: 'Factura del proveedor del 12/11, ficha del Negroni del 02/11 y 312 ventas en octubre en el TPV. Valores ilustrativos.',
          opcoes: [
            { t: 'Subir 0,50 € el precio', efeito: 'coste 22%', feito: 'Precio actualizado en el TPV desde hoy: 9,50 €. El coste vuelve al 22%. Midiendo las ventas 4 semanas frente a octubre.' },
            { t: 'Cambiar el vermut de la casa', efeito: 'coste 21%', feito: 'Ficha del Negroni actualizada con el vermut B y enviada al equipo. Coste 21%.' },
            { t: 'Dejarlo como está', efeito: 'coste 23%', feito: 'Se mantiene. El Barback avisa si el coste pasa del 25%.' }
          ] },
        { id: 'guest', cad: 'mkt', titulo: 'El jueves hay guest shift del Bar Brasa aquí. ¿Invito a quien ya brindó con la casa?',
          linhas: [['quién', '46 personas brindaron con el Sea Bar en los últimos 6 meses'], ['cuesta', 'nada: 46 mensajes y 1 story']],
          fonte: 'Brindis registrados en los pasaportes de los últimos 6 meses. El diseño usa el nombre de los cócteles del evento, nunca la receta.',
          opcoes: [
            { t: 'Invitación y story', efeito: '46 + 1', feito: 'Invitación enviada a 46 personas y story programada para el jueves a las 18:00. Las respuestas entran en el libro de turno.' },
            { t: 'Solo la story', efeito: '1 story', feito: 'Story programada para el jueves a las 18:00. No se envió ninguna invitación.' },
            { t: 'Ahora no', efeito: '', feito: 'No se envió nada. El Barback no vuelve a sugerirlo para este evento.' }
          ] }
      ] as RecadoDado[],
      recadosMeu: [
        { id: 'folga', cad: 'op', titulo: 'Llevas 9 noches sin librar. ¿Pido el martes, 24/11?',
          linhas: [['horario', 'El martes el Sea Bar tiene 2 personas más en la barra.'], ['extras', 'Ningún extra el martes.']],
          fonte: 'Tu horario en el Sea Bar y tu agenda de extras.',
          opcoes: [
            { t: 'Pedir el día libre', efeito: '', feito: 'Petición enviada a Marta Ortega, gerente del bar. La respuesta aparecerá aquí.' },
            { t: 'Ahora no', efeito: '', feito: 'Vale. El Barback vuelve a avisar dentro de 3 noches.' }
          ] },
        { id: 'freela', cad: 'fin', titulo: 'Extra de evento el sábado: cobra 180 €, no 120 €.',
          linhas: [['por qué', 'Tu noche en el Sea Bar rinde 151 € de media, con propinas.'], ['incluye', '5 horas y 2 cócteles de autor']],
          fonte: 'Tus registros de septiembre a noviembre. Valores ilustrativos.',
          opcoes: [
            { t: 'Responder 180 €', efeito: '+ 60 €', feito: 'Respuesta enviada al organizador con 180 € y lo que incluye.' },
            { t: 'Aceptar 120 €', efeito: '', feito: 'Aceptación enviada. El extra entró en tu agenda del sábado.' },
            { t: 'Lo escribo yo', efeito: '', feito: 'Borrador abierto con los números al lado. No se envió nada.' }
          ] },
        { id: 'residencia', cad: 'mkt', titulo: 'Casa Ostra abrió una residencia de 2 semanas en Clásicos.',
          linhas: [['piden', 'Grado Infusión en Clásicos'], ['tú', 'Infusión, con 3 años y 2 meses en el oficio']],
          fonte: 'Vacante publicada el 17/11 y tu Pasaporte, solo con los sellos públicos.',
          opcoes: [
            { t: 'Presentarme con el pasaporte', efeito: '', feito: 'Candidatura enviada con el enlace dropp.me/teo. Solo aparecen los sellos públicos.' },
            { t: 'Guardar', efeito: '', feito: 'Guardada en tu lista de vacantes. Cierra el 30/11.' }
          ] }
      ] as RecadoDado[],
      bancada: 'En la barra hoy',
      servico: 'Durante el servicio',
      servicoTxt: 'Silencio, solo voz. Pregunta una medida o avisa de lo que se acabó; el Barback responde con la ficha.',
      falar: 'Hablar con el Barback',
      falarAviso: 'En la app, el Barback solo escucha mientras mantienes pulsado el botón.',
      agenda: 'Esta semana',
      agendaItens: agendaEs
    },
    caderno: {
      abas: { lotes: 'Lotes', conferir: 'Comprobar', fichas: 'Fichas' },
      lotesTit: 'Lotes contados por el tiempo',
      lotes: [
        { rotulo: 'PF-001 · Botella #2', tempo: 'Caduca en 2 días', tinta: 'laranja', nome: 'Cordial de maracuyá', pct: 60, feito: 'hecho 15/11', vence: 'caduca 20/11', tec: 'Brix 52° · pH 3,1 · 700 de 2.500 ml', descricao: 'Hecho hace 3 días, caduca en 2' },
        { rotulo: 'MEL-005 · Botella #5', tempo: 'Se acaba hoy', tinta: 'vermelho', nome: 'Jarabe de miel 2:1', pct: 21, feito: 'hecho 15/11', vence: 'caduca 29/11', tec: 'Brix 66° · quedan 200 de 1.000 ml · salen 400 ml por noche', descricao: 'Quedan 200 ml y salen 400 ml por noche' },
        { rotulo: 'MP-002 · Barril #4', tempo: 'Caduca en 22 días', tinta: 'verde', nome: 'Ponche de leche clarificado', pct: 27, feito: 'hecho 10/11', vence: 'caduca 10/12', tec: 'clarificado con suero · 19,4% ABV · 3.200 de 5.000 ml', descricao: 'Hecho hace 8 días, caduca en 22' }
      ] as LoteDado[],
      visorTit: 'Comprobar la barra',
      visorTxt: 'Apunta al QR de la etiqueta. Cada botella leída entra en la lista del día.',
      ler: 'Leer una etiqueta',
      lerAviso: 'En la app, la cámara se abre aquí y lee el QR en menos de un segundo.',
      diaTit: 'Botellas del día',
      garrafas: [
        { recip: 'Botella #2', nome: 'Cordial de maracuyá', lote: 'PF-001', estado: 'ok', st: 'leída 17:10' },
        { recip: 'Botella #5', nome: 'Jarabe de miel 2:1', lote: 'MEL-005', estado: 'meio', st: 'leída · vacía' },
        { recip: 'Barril #4', nome: 'Ponche de leche clarificado', lote: 'MP-002', estado: 'ok', st: 'leída 17:12' },
        { recip: 'Botella #7', nome: 'Orgeat', lote: 'ORG-011', estado: 'perdido', st: 'no estaba · merma de 3,36 €' },
        { recip: 'Botella #3', nome: 'Cordial de lima', lote: 'LIM-022', estado: 'falta', st: 'sin leer' }
      ] as GarrafaDado[],
      resumo: '5 botellas hoy: 3 leídas (1 vacía) · 1 no estaba · 1 sin leer',
      fecharConf: 'Cerrar la comprobación',
      fecharConfAviso: 'Comprobación cerrada a las 17:15. La merma del orgeat fue al libro de turno, con el coste.',
      fichasTit: 'Fichas y coste por dosis',
      meta: 'meta de la casa: 22%',
      acima: 'por encima de la meta',
      fichas: [
        { nome: 'Negroni de la casa', servico: 'vaso bajo · hielo en bloque · piel de naranja', preco: 9.0, custo: 2.08 },
        { nome: 'Boulevardier', servico: 'vaso bajo · hielo en bloque · piel de naranja', preco: 12.0, custo: 2.65 },
        { nome: 'Penicillin', servico: 'vaso bajo · hielo en bloque · jengibre confitado', preco: 11.0, custo: 2.43 },
        { nome: 'Hanky Panky', servico: 'copa coupe · sin hielo · piel de naranja', preco: 10.0, custo: 1.93 },
        { nome: 'Shrub de jengibre', servico: 'vaso alto · cubitos · rodaja de lima', preco: 9.0, custo: 1.35 }
      ] as FichaDado[],
      formulaRot: 'Coste por dosis · Negroni de la casa',
      formulaLinhas: ['ginebra 30 ml 0,78 € + Campari 30 ml 0,73 €', '+ vermut 30 ml 0,42 € + piel 0,05 €', '+ hielo en bloque 0,10 € = 2,08 €', '2,08 € ÷ 9,00 € = 23,1% · meta 22%']
    },
    passaporte: {
      secao: 'Pasaporte del oficio',
      cargo: 'head bartender · Sea Bar, Valencia',
      cantos: [{ n: '12', r: 'años de barra' }, { n: '7', r: 'casas' }, { n: '38', r: 'fichas' }, { n: '9', r: 'formados' }],
      oficiosTit: 'Siete oficios, en cuatro grados',
      oficiosNota: 'El grado pide tiempo y prueba firmada: Infusión en 6 meses, Reserva en 2 años, Solera en 5 años y 3 personas formadas.',
      oficios: [
        { nome: 'Hospitalidad', cor: 'magenta', grau: 'Solera', tempo: '9 años' },
        { nome: 'Creación', cor: 'amarelo', grau: 'Reserva', tempo: '4 años y 2 meses' },
        { nome: 'Clásicos', cor: 'laranja', grau: 'Infusión', tempo: '3 años y 2 meses' },
        { nome: 'Coste y gestión', cor: 'violeta', grau: 'Infusión', tempo: '2 años y 6 meses' },
        { nome: 'Preparación y fermentación', cor: 'verde', grau: 'Infusión', tempo: '1 año y 8 meses' },
        { nome: 'Hielo y dilución', cor: 'ciano', grau: 'Gota', tempo: '4 meses' },
        { nome: 'Sin alcohol', cor: 'vermelho', grau: 'Gota', tempo: '1 mes' }
      ] as OficioDado[],
      carimbosTit: 'Últimos sellos',
      carimbos: [
        { tipo: 'jornada', rotulo: 'Jornada', titulo: 'Bar Brasa', linha: 'Madrid · 14/11/2026', rotacao: -3 },
        { tipo: 'escola', rotulo: 'Escuela', titulo: 'Clarificación', linha: 'julio de 2026', rotacao: 2 },
        { tipo: 'arquivo', rotulo: 'Archivo', titulo: 'Hanky Panky', linha: 'falta 1 colega', pendente: true, rotacao: -2 },
        { tipo: 'mentor', rotulo: 'Mentor', titulo: 'Ana Lima', linha: 'marzo de 2026', rotacao: 3 }
      ] as CarimboDado[],
      recrutador: 'Verlo como lo ve quien contrata',
      recrutadorAviso: 'En la app, se abre dropp.me/teo: solo los sellos públicos, con la firma de quien lo vio.'
    },
    atlas: {
      abas: { estante: 'Estante', escola: 'Escuela', agenda: 'Agenda' },
      estanteTit: 'Estante de la semana',
      estante: [
        { rot: 'Técnica · AT-022 · Hielo y dilución', nome: 'Hielo claro en bloque', porque: 'Negroni, Boulevardier y Penicillin salen con hielo en bloque, que hoy se compra hecho a 0,10 € por dosis.', linha: '10 L · −18 °C · 30 h · rinde 7 kg' },
        { rot: 'Técnica · AT-014 · Preparación y fermentación', nome: 'Clarificar sin centrífuga', porque: 'El cordial de maracuyá (PF-001) sale cada semana, y el Sea Bar no tiene centrífuga.', linha: '1 kg · 2 g de enzima · 4 °C · 12 h' },
        { rot: 'Archivo · ARQ-031', nome: 'Hanky Panky', porque: 'Tu registro del 12/11 espera a un colega: falta Tomás Vidal.', linha: 'Ada Coleman · American Bar del Savoy, Londres' }
      ] as ItemEstante[],
      escolaTit: 'Escuela DROPP',
      escolaTxt: 'Cursos en grupo, con práctica en el bar. Quien termina se lleva el sello Escuela en el Pasaporte.',
      escolaProx: 'Próximo curso: Hielo claro en la práctica · empieza el 01/12 · 3 plazas libres',
      escolaBtn: 'Hazte socio · 30 días gratis',
      escolaPreco: '9,99 € al mes, o 19,99 € con el Barback personal',
      escolaAviso: 'La suscripción está en el prototipo de la Escuela DROPP.',
      agendaTit: 'Agenda del sector',
      agendaItens: agendaEs
    }
  }
};

export type Textos = (typeof TEXTOS)['pt'];

export const euro = (n: number, lang: Lang) => {
  const s = n.toFixed(2).replace('.', ',');
  return lang === 'es' ? `${s} €` : `€${s}`;
};
export const pct = (n: number) => `${(Math.round(n * 1000) / 10).toString().replace('.', ',')}%`;
