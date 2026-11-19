// Textos da Escola, em português e em espanhol da Espanha.
import type { Lang } from '../textos';
import type { CodigoErro, Plano, StatusInscricao, TipoEncontro, TipoMaterial } from './tipos';

const NBSP = ' ';

const pt = {
  titulo: 'Escola DROPP',
  intro: 'Cursos em turma, com prática no bar. Quem termina leva o carimbo Escola no Passaporte.',
  carregando: 'Abrindo a Escola…',
  falhouAbrir: 'A Escola não abriu. Confira a conexão e tente de novo.',
  tentarDeNovo: 'Tentar de novo',

  entrarTit: 'Entre para participar',
  entrarTxt: 'O catálogo é aberto. Para entrar numa turma, ler o mural e mandar a crítica, entre com o seu e-mail: mandamos um link, sem senha.',
  emailRot: 'Seu e-mail',
  entrarBtn: 'Mandar o link',
  mandando: 'Mandando…',
  linkMandado: (e: string) => `Mandamos um link para ${e}. Toque nele para entrar: você entra no navegador onde abrir o link.`,
  codigoMandado: (e: string) => `Mandamos um e-mail para ${e}. Digite aqui o código que veio nele, ou toque no link.`,
  codigoRot: 'Código do e-mail',
  confirmar: 'Entrar',
  confirmando: 'Entrando…',
  outroEmail: 'Usar outro e-mail',
  nomeRot: 'Como você aparece na turma',
  nomeNota: 'Vai nos seus posts do mural e nos pedidos de carimbo. Use o nome com que o balcão te conhece.',
  salvarNome: 'Salvar o nome',
  mudarNome: 'Mudar',
  nomeSalvo: 'Nome salvo.',
  sair: 'Sair',
  entrouComo: (n: string) => `Você entrou como ${n}.`,

  planoRot: 'Seu plano',
  planos: { gratis: 'Grátis', socio: 'Sócio DROPP', barback: 'Sócio com Barback' } as Record<Plano, string>,
  planoTxt: {
    gratis: 'Turmas patrocinadas abertas a todos. As outras turmas, a biblioteca e a crítica do mês são para sócios.',
    socio: 'Todas as turmas, a biblioteca, a crítica do mês e a aula ao vivo.',
    barback: 'Tudo do Sócio, mais o Barback pessoal, que monta a sua trilha.'
  } as Record<Plano, string>,
  serSocio: 'Ser sócio · 30 dias grátis',
  serSocioAviso: 'A assinatura entra na próxima etapa. Por enquanto, a equipe DROPP ativa o plano à mão.',
  precoSocio: '€9,99 por mês, ou €19,99 com o Barback pessoal',
  ensinaRot: 'quem ensina',

  demoTit: 'Demonstração',
  demoTxt: 'Os dados ficam só neste navegador. Troque de pessoa para ver a turma pelos três lados.',
  demoQuem: 'Quem está usando',
  demoPlano: 'Plano do Teo',
  recomecar: 'Recomeçar a demonstração',
  recomecado: 'A demonstração voltou ao começo.',

  suasTurmas: 'Suas turmas',
  ensinaTit: 'Turmas que você ensina',
  proximas: 'Próximas turmas',
  verTurma: 'Ver a turma',
  comeca: (d: string) => `começa ${d}`,
  vagasLivres: (n: number) => (n === 1 ? '1 vaga livre' : `${n} vagas livres`),
  cheia: 'turma cheia',
  paraSocios: 'para sócios',
  abertaATodos: 'aberta a todos',
  maiores: 'só maiores de 18',
  pagoPor: (p: string) => `Pago por ${p}`,
  statusInscricao: { inscrito: 'na turma', concluido: 'concluída', cancelado: 'saiu' } as Record<StatusInscricao, string>,

  voltar: '← Escola',
  quemEnsina: 'Quem ensina',
  acesso: 'Acesso',
  acessoSocios: 'Sócios DROPP',
  acessoTodos: 'Aberta a todos, só maiores de 18',
  comoProva: 'Como se prova',
  comoProvaTxt: 'Prática presencial com duas assinaturas: quem ensina e um colega da turma.',
  oQueLeva: 'O que leva',
  oQueLevaTxt: (oficio: string) => `O carimbo Escola em ${oficio}, no Passaporte.`,
  vagas: 'Vagas',
  vagasTxt: (livres: number, total: number) => `${livres} de ${total} livres`,
  pagoNota: 'O patrocínio aparece sempre. A prática é avaliada pela mesma regra, e a marca não assina carimbo.',
  encontros: 'Encontros',
  tipoEncontro: { aula_app: 'no app', aula_ao_vivo: 'ao vivo', pratica: 'presencial' } as Record<TipoEncontro, string>,
  quandoQuiser: 'quando quiser',
  feita: 'feita',
  marcarFeita: 'Marcar como feita',
  desmarcar: 'Desmarcar',
  entrarTurma: 'Entrar na turma',
  entrou: 'Você entrou na turma.',
  sairTurma: 'Sair da turma',
  saiu: 'Você saiu da turma. A vaga ficou livre.',
  precisaEntrar: 'Entre com o seu e-mail para entrar na turma.',
  precisaSocio: 'Ser sócio para entrar · 30 dias grátis',
  avulso: (p: string) => `Só a prática presencial · €${p}`,
  avulsoNota: 'A prática presencial dá o carimbo do mesmo jeito. As aulas online, a biblioteca e a crítica ficam para sócios.',
  avulsoAviso: 'A prática avulsa é paga fora da loja e entra com a assinatura, na próxima etapa.',
  naTurma: 'na turma',
  voceEnsina: 'Você ensina esta turma',

  carimboTit: 'Carimbo Escola',
  carimboTxt: 'Peça depois da prática. O carimbo bate com duas assinaturas: quem ensina e um colega que viu.',
  pedirCarimbo: 'Pedir o carimbo',
  pedido: 'Pedido mandado. Agora faltam as duas assinaturas.',
  assinaturaEnsina: 'Assinatura de quem ensina',
  assinaturaColega: 'Conferência de um colega',
  aguardando: 'aguardando',
  feitoPor: (n: string, d: string) => `${n} · ${d}`,
  carimboBateu: 'O carimbo bateu e está no seu Passaporte.',
  pedidosTit: 'Pedidos de carimbo',
  pedidosNada: 'Ninguém pediu o carimbo ainda.',
  assinar: 'Assinar',
  assinado: 'Assinado.',
  conferirTit: 'Colegas esperando conferência',
  conferirNota: 'Confira só a prática que você viu.',
  conferir: 'Conferir',
  conferido: 'Conferido.',
  carimboRot: 'Escola',

  muralTit: 'Mural da turma',
  muralNota: 'Só quem está na turma lê. Sem curtidas: pergunta, resposta e o que deu certo ou errado.',
  muralFechado: 'O mural é só para quem está na turma.',
  muralVazio: 'Ninguém escreveu ainda. Comece com uma pergunta.',
  muralPlaceholder: 'Escreva para a turma',
  postar: 'Postar',
  postado: 'Postado no mural.',
  responder: 'Responder',
  respostaPlaceholder: 'Sua resposta',
  mandarResposta: 'Mandar',
  fixado: 'fixado',
  oculto: 'oculto',
  ocultoSeu: 'oculto por quem ensina: só você vê',
  fixar: 'Fixar',
  desafixar: 'Desafixar',
  ocultar: 'Ocultar',
  mostrar: 'Mostrar',

  bibliotecaTit: 'Biblioteca',
  bibliotecaNota: 'Monografias, fichas e procedimentos da DROPP. Guarde na estante o que vai usar.',
  bibliotecaFechada: 'A biblioteca é para sócios.',
  tipoMaterial: { monografia: 'Monografia', ficha: 'Ficha', procedimento: 'Procedimento' } as Record<TipoMaterial, string>,
  guardar: 'Guardar na estante',
  guardado: 'na estante',
  tirar: 'Tirar da estante',

  criticaTit: 'Crítica do mês',
  criticaTxt: 'Mande um drink por mês, com a ficha. Quem ensina responde por escrito.',
  criticaFechada: 'A crítica do mês é para sócios.',
  drinkRot: 'Qual drink',
  fichaRot: 'A ficha: doses, gelo, copo',
  enviar: 'Mandar para a crítica',
  enviada: 'enviada',
  enviadaTxt: 'Mandada. A resposta chega até o fim do mês.',
  respostaDe: 'Resposta',
  semResposta: 'ainda sem resposta',
  paraResponder: 'Críticas para responder',
  respondidas: 'Respondidas',
  nadaParaResponder: 'Nenhuma crítica esperando resposta.',
  respostaRot: 'Sua resposta',
  mandarRespostaCritica: 'Responder',
  respondida: 'Resposta mandada.',

  eventosTit: 'Ao vivo e prazos',
  eventosVazio: 'Nada marcado agora.',
  eventosFechado: 'A aula ao vivo e os prazos da crítica são para sócios.',
  tipoEvento: { aula_ao_vivo: 'Aula ao vivo', critica: 'Prazo', troca_de_fichas: 'Troca de fichas' } as Record<string, string>,

  oficios: {
    'gelo-diluicao': 'Gelo e diluição', 'custo-gestao': 'Custo e gestão', 'sem-alcool': 'Sem álcool',
    'preparo-fermentacao': 'Preparo e fermentação', classicos: 'Clássicos', criacao: 'Criação', hospitalidade: 'Hospitalidade'
  } as Record<string, string>,

  erros: {
    so_socios: 'Isso é para sócios.',
    turma_cheia: 'A turma está cheia.',
    turma_fechada: 'A turma não aceita mais inscrições.',
    so_quem_ensina: 'Só quem ensina a turma faz isso.',
    precisa_outra_pessoa: 'A conferência precisa ser de outra pessoa.',
    so_colega_da_turma: 'Só um colega da turma confere.',
    nao_carimba_a_si: 'Ninguém assina o próprio carimbo.',
    nao_inscrito: 'Entre na turma primeiro.',
    ja_mandou: 'Você já mandou a crítica deste mês.',
    sem_permissao: 'Sem permissão para isso.',
    precisa_entrar: 'Entre com o seu e-mail primeiro.',
    texto_vazio: 'Escreva alguma coisa antes de mandar.',
    codigo_invalido: 'Código errado ou vencido. Confira o último e-mail ou peça outro.',
    falhou: 'Não deu certo. Tente de novo.'
  } as Record<CodigoErro, string>
};

export type TextosEscola = typeof pt;

const es: TextosEscola = {
  titulo: 'Escuela DROPP',
  intro: 'Cursos en grupo, con práctica en el bar. Quien termina se lleva el sello Escuela en el Pasaporte.',
  carregando: 'Abriendo la Escuela…',
  falhouAbrir: 'La Escuela no se abrió. Revisa la conexión e inténtalo de nuevo.',
  tentarDeNovo: 'Intentar de nuevo',

  entrarTit: 'Entra para participar',
  entrarTxt: 'El catálogo es abierto. Para apuntarte a un curso, leer el tablón y mandar la crítica, entra con tu correo: te mandamos un enlace, sin contraseña.',
  emailRot: 'Tu correo',
  entrarBtn: 'Mandar el enlace',
  mandando: 'Mandando…',
  linkMandado: (e: string) => `Te hemos enviado un enlace a ${e}. Tócalo para entrar: entrarás en el navegador donde lo abras.`,
  codigoMandado: (e: string) => `Te hemos enviado un correo a ${e}. Escribe aquí el código que viene en él, o toca el enlace.`,
  codigoRot: 'Código del correo',
  confirmar: 'Entrar',
  confirmando: 'Entrando…',
  outroEmail: 'Usar otro correo',
  nomeRot: 'Cómo apareces en el curso',
  nomeNota: 'Sale en tus mensajes del tablón y en las peticiones de sello. Usa el nombre con el que te conoce la barra.',
  salvarNome: 'Guardar el nombre',
  mudarNome: 'Cambiar',
  nomeSalvo: 'Nombre guardado.',
  sair: 'Salir',
  entrouComo: (n: string) => `Has entrado como ${n}.`,

  planoRot: 'Tu plan',
  planos: { gratis: 'Gratis', socio: 'Socio DROPP', barback: 'Socio con Barback' },
  planoTxt: {
    gratis: 'Cursos patrocinados abiertos a todos. Los demás cursos, la biblioteca y la crítica del mes son para socios.',
    socio: 'Todos los cursos, la biblioteca, la crítica del mes y la clase en directo.',
    barback: 'Todo lo del Socio, más el Barback personal, que monta tu itinerario.'
  },
  serSocio: 'Hazte socio · 30 días gratis',
  serSocioAviso: 'La suscripción llega en la próxima etapa. Por ahora, el equipo DROPP activa el plan a mano.',
  precoSocio: `9,99${NBSP}€ al mes, o 19,99${NBSP}€ con el Barback personal`,
  ensinaRot: 'quien enseña',

  demoTit: 'Demostración',
  demoTxt: 'Los datos se quedan solo en este navegador. Cambia de persona para ver el curso desde los tres lados.',
  demoQuem: 'Quién la usa',
  demoPlano: 'Plan de Teo',
  recomecar: 'Empezar de nuevo',
  recomecado: 'La demostración ha vuelto al principio.',

  suasTurmas: 'Tus cursos',
  ensinaTit: 'Cursos que enseñas',
  proximas: 'Próximos cursos',
  verTurma: 'Ver el curso',
  comeca: (d: string) => `empieza el ${d}`,
  vagasLivres: (n: number) => (n === 1 ? '1 plaza libre' : `${n} plazas libres`),
  cheia: 'curso completo',
  paraSocios: 'para socios',
  abertaATodos: 'abierto a todos',
  maiores: 'solo mayores de 18',
  pagoPor: (p: string) => `Pagado por ${p}`,
  statusInscricao: { inscrito: 'apuntado', concluido: 'terminado', cancelado: 'te saliste' },

  voltar: '← Escuela',
  quemEnsina: 'Quién enseña',
  acesso: 'Acceso',
  acessoSocios: 'Socios DROPP',
  acessoTodos: 'Abierto a todos, solo mayores de 18',
  comoProva: 'Cómo se demuestra',
  comoProvaTxt: 'Práctica presencial con dos firmas: quien enseña y un compañero del curso.',
  oQueLeva: 'Qué te llevas',
  oQueLevaTxt: (oficio: string) => `El sello Escuela en ${oficio}, en el Pasaporte.`,
  vagas: 'Plazas',
  vagasTxt: (livres: number, total: number) => `${livres} de ${total} libres`,
  pagoNota: 'El patrocinio se ve siempre. La práctica se evalúa con la misma regla y la marca no firma sellos.',
  encontros: 'Encuentros',
  tipoEncontro: { aula_app: 'en la app', aula_ao_vivo: 'en directo', pratica: 'presencial' },
  quandoQuiser: 'cuando quieras',
  feita: 'hecha',
  marcarFeita: 'Marcar como hecha',
  desmarcar: 'Desmarcar',
  entrarTurma: 'Apuntarme al curso',
  entrou: 'Ya estás en el curso.',
  sairTurma: 'Salir del curso',
  saiu: 'Has salido del curso. La plaza queda libre.',
  precisaEntrar: 'Entra con tu correo para apuntarte al curso.',
  precisaSocio: 'Hazte socio para apuntarte · 30 días gratis',
  avulso: (p: string) => `Solo la práctica presencial · ${p}${NBSP}€`,
  avulsoNota: 'La práctica presencial da el sello igual. Las clases en línea, la biblioteca y la crítica son para socios.',
  avulsoAviso: 'La práctica suelta se paga fuera de la tienda y llega con la suscripción, en la próxima etapa.',
  naTurma: 'apuntado',
  voceEnsina: 'Enseñas este curso',

  carimboTit: 'Sello Escuela',
  carimboTxt: 'Pídelo después de la práctica. El sello se estampa con dos firmas: quien enseña y un compañero que lo vio.',
  pedirCarimbo: 'Pedir el sello',
  pedido: 'Petición enviada. Ahora faltan las dos firmas.',
  assinaturaEnsina: 'Firma de quien enseña',
  assinaturaColega: 'Visto bueno de un compañero',
  aguardando: 'pendiente',
  feitoPor: (n: string, d: string) => `${n} · ${d}`,
  carimboBateu: 'El sello está estampado y ya está en tu Pasaporte.',
  pedidosTit: 'Peticiones de sello',
  pedidosNada: 'Nadie ha pedido el sello todavía.',
  assinar: 'Firmar',
  assinado: 'Firmado.',
  conferirTit: 'Compañeros esperando tu visto bueno',
  conferirNota: 'Da el visto bueno solo a la práctica que viste.',
  conferir: 'Dar el visto bueno',
  conferido: 'Visto bueno dado.',
  carimboRot: 'Escuela',

  muralTit: 'Tablón del curso',
  muralNota: 'Solo lo lee quien está en el curso. Sin «me gusta»: pregunta, respuesta y lo que salió bien o mal.',
  muralFechado: 'El tablón es solo para quien está en el curso.',
  muralVazio: 'Nadie ha escrito todavía. Empieza con una pregunta.',
  muralPlaceholder: 'Escribe al curso',
  postar: 'Publicar',
  postado: 'Publicado en el tablón.',
  responder: 'Responder',
  respostaPlaceholder: 'Tu respuesta',
  mandarResposta: 'Enviar',
  fixado: 'fijado',
  oculto: 'oculto',
  ocultoSeu: 'ocultado por quien enseña: solo lo ves tú',
  fixar: 'Fijar',
  desafixar: 'Quitar de arriba',
  ocultar: 'Ocultar',
  mostrar: 'Mostrar',

  bibliotecaTit: 'Biblioteca',
  bibliotecaNota: 'Monografías, fichas y procedimientos de DROPP. Guarda en la estantería lo que vas a usar.',
  bibliotecaFechada: 'La biblioteca es para socios.',
  tipoMaterial: { monografia: 'Monografía', ficha: 'Ficha', procedimento: 'Procedimiento' },
  guardar: 'Guardar en la estantería',
  guardado: 'en la estantería',
  tirar: 'Quitar de la estantería',

  criticaTit: 'Crítica del mes',
  criticaTxt: 'Manda un cóctel al mes, con la ficha. Quien enseña responde por escrito.',
  criticaFechada: 'La crítica del mes es para socios.',
  drinkRot: 'Qué cóctel',
  fichaRot: 'La ficha: medidas, hielo, vaso',
  enviar: 'Mandar a la crítica',
  enviada: 'enviada',
  enviadaTxt: 'Enviada. La respuesta llega antes de fin de mes.',
  respostaDe: 'Respuesta',
  semResposta: 'todavía sin respuesta',
  paraResponder: 'Críticas por responder',
  respondidas: 'Respondidas',
  nadaParaResponder: 'Ninguna crítica espera respuesta.',
  respostaRot: 'Tu respuesta',
  mandarRespostaCritica: 'Responder',
  respondida: 'Respuesta enviada.',

  eventosTit: 'En directo y plazos',
  eventosVazio: 'Nada programado ahora.',
  eventosFechado: 'La clase en directo y los plazos de la crítica son para socios.',
  tipoEvento: { aula_ao_vivo: 'Clase en directo', critica: 'Plazo', troca_de_fichas: 'Intercambio de fichas' },

  oficios: {
    'gelo-diluicao': 'Hielo y dilución', 'custo-gestao': 'Coste y gestión', 'sem-alcool': 'Sin alcohol',
    'preparo-fermentacao': 'Preparación y fermentación', classicos: 'Clásicos', criacao: 'Creación', hospitalidade: 'Hospitalidad'
  },

  erros: {
    so_socios: 'Esto es para socios.',
    turma_cheia: 'El curso está completo.',
    turma_fechada: 'El curso ya no admite inscripciones.',
    so_quem_ensina: 'Solo quien enseña el curso puede hacerlo.',
    precisa_outra_pessoa: 'El visto bueno tiene que darlo otra persona.',
    so_colega_da_turma: 'Solo un compañero del curso da el visto bueno.',
    nao_carimba_a_si: 'Nadie firma su propio sello.',
    nao_inscrito: 'Apúntate al curso primero.',
    ja_mandou: 'Ya has mandado la crítica de este mes.',
    sem_permissao: 'No tienes permiso para esto.',
    precisa_entrar: 'Entra con tu correo primero.',
    texto_vazio: 'Escribe algo antes de enviar.',
    codigo_invalido: 'Código incorrecto o caducado. Revisa el último correo o pide otro.',
    falhou: 'No ha salido bien. Inténtalo de nuevo.'
  }
};

export const TX: Record<Lang, TextosEscola> = { pt, es };

// Datas no fuso de Madri, onde a Escola acontece.
const FUSO = 'Europe/Madrid';
const loc = (lang: Lang) => (lang === 'pt' ? 'pt-BR' : 'es-ES');

export function diaMes(iso: string) {
  const [a, m, d] = iso.slice(0, 10).split('-');
  return a && m && d ? `${d}/${m}` : iso;
}

// "04/12 · 11:00" nas duas línguas, montado à mão: o Intl de cada navegador varia no zero à esquerda.
export function dataHora(iso: string, _lang?: Lang) {
  const partes = new Intl.DateTimeFormat('en-GB', { timeZone: FUSO, day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date(iso));
  const p = (tipo: string) => (partes.find((x) => x.type === tipo)?.value ?? '').padStart(2, '0');
  return `${p('day')}/${p('month')} · ${p('hour')}:${p('minute')}`;
}

export function diaSemana(iso: string, lang: Lang) {
  const d = iso.length <= 10 ? new Date(`${iso}T12:00:00Z`) : new Date(iso);
  const s = new Intl.DateTimeFormat(loc(lang), { timeZone: FUSO, weekday: 'short' }).format(d).replace('.', '');
  return s;
}

export function mesAno(iso: string, lang: Lang) {
  const d = iso.length <= 10 ? new Date(`${iso}T12:00:00Z`) : new Date(iso);
  return new Intl.DateTimeFormat(loc(lang), { timeZone: FUSO, month: 'long', year: 'numeric' }).format(d);
}

export function erroTexto(e: unknown, t: TextosEscola) {
  const c = (e as { codigo?: CodigoErro })?.codigo;
  return c && t.erros[c] ? t.erros[c] : t.erros.falhou;
}
