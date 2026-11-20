// Demonstração local da Escola: um mundo pequeno guardado no navegador, com as mesmas regras do banco.
// As turmas, encontros, materiais e eventos são os de supabase/seed.sql. Pessoas, bar e marca são fictícios.
// Hoje, na demonstração, é sexta, 20/11/2026, como nos protótipos.
import {
  ErroEscola, mesDe,
  type Critica, type Encontro, type Eu, type Evento, type FonteEscola, type Inscricao, type Material,
  type PedidoCarimbo, type Pessoa, type Plano, type Post, type Resposta, type StatusInscricao, type Turma
} from './tipos';

const CHAVE = 'dropp-escola-demo-v2';
const HOJE = new Date('2026-11-20T12:00:00+01:00');

type PostLinha = Omit<Post, 'autorNome' | 'respostas'>;
type RespostaLinha = Omit<Resposta, 'autorNome'>;
type CarimboLinha = { id: string; userId: string; turmaId: string; assinadoPor: string | null; assinadoEm: string | null; conferidoPor: string | null; conferidoEm: string | null };
type CriticaLinha = Omit<Critica, 'userNome'>;
type MaterialLinha = Omit<Material, 'guardado'>;

type Mundo = {
  versao: 2;
  euId: string;
  pessoas: Pessoa[];
  turmas: Array<Omit<Turma, 'ocupadas'>>;
  encontros: Encontro[];
  inscricoes: Array<{ turmaId: string; userId: string; status: StatusInscricao }>;
  progresso: Array<{ encontroId: string; userId: string }>;
  posts: PostLinha[];
  respostas: RespostaLinha[];
  carimbos: CarimboLinha[];
  criticas: CriticaLinha[];
  materiais: MaterialLinha[];
  estante: Array<{ userId: string; materialId: string }>;
  eventos: Evento[];
};

const pessoa = (id: string, nome: string, papel: Pessoa['papel'], plano: Plano, pt = '', es = ''): Pessoa => ({ id, nome, papel, plano, rot: { pt, es } });

function mundoNovo(): Mundo {
  const pessoas = [
    pessoa('teo', 'Teo Aranda', 'membro', 'gratis', 'você', 'tú'),
    pessoa('irene', 'Irene Soler', 'instrutor', 'socio', 'quem ensina', 'quien enseña'),
    pessoa('nuria', 'Nuria Calvo', 'membro', 'socio', 'colega da turma', 'compañera del curso'),
    pessoa('pablo', 'Pablo Ferrer', 'instrutor', 'socio'),
    ...['Lara Gil', 'Iker Sanz', 'Elena Quintana', 'Marcos Rey', 'Aitana Prieto', 'Joel Ortega', 'Carla Mestre', 'Sergi Bonet']
      .map((n) => pessoa(n.split(' ')[0].toLowerCase(), n, 'membro', 'socio'))
  ];
  const turmas: Mundo['turmas'] = [
    {
      id: 'esc-07', codigo: 'ESC-07', oficio: 'gelo-diluicao', instrutorId: 'irene', instrutorNome: 'Irene Soler',
      titulo: { es: 'Hielo claro en la práctica', pt: 'Gelo claro na prática' },
      descricao: { es: 'Hielo en bloque transparente, corte y dilución medida contra la ficha. Tres encuentros y una práctica evaluada con dos firmas.', pt: 'Gelo em bloco transparente, corte e diluição medida contra a ficha. Três encontros e uma prática avaliada com duas assinaturas.' },
      inicio: '2026-12-01', vagas: 12, patrocinador: null, abertaATodos: false, soMaiores: false, precoPratica: 39, status: 'aberta'
    },
    {
      id: 'esc-11', codigo: 'ESC-11', oficio: 'sem-alcool', instrutorId: 'irene', instrutorNome: 'Irene Soler',
      titulo: { es: 'Carta sin alcohol que vende', pt: 'Carta sem álcool que vende' },
      descricao: { es: 'Curso patrocinado, abierto a todos. La práctica la evalúa Irene Soler, como en cualquier curso.', pt: 'Curso patrocinado, aberto a todos. A prática é avaliada por Irene Soler, como em qualquer turma.' },
      inicio: '2026-12-03', vagas: 20, patrocinador: 'Aperitivos Exemplo', abertaATodos: true, soMaiores: true, precoPratica: 39, status: 'aberta'
    },
    {
      id: 'esc-14', codigo: 'ESC-14', oficio: 'custo-gestao', instrutorId: 'pablo', instrutorNome: 'Pablo Ferrer',
      titulo: { es: 'Coste por dosis y carta que paga', pt: 'Custo por dose e carta que paga' },
      descricao: { es: 'Coste de cada cóctel, la meta de la casa y el precio que cierra la cuenta, con tus propias fichas.', pt: 'Custo de cada drink, a meta da casa e o preço que fecha a conta, com as suas fichas.' },
      inicio: '2027-01-12', vagas: 12, patrocinador: null, abertaATodos: false, soMaiores: false, precoPratica: 39, status: 'aberta'
    },
    {
      id: 'esc-02', codigo: 'ESC-02', oficio: 'gelo-diluicao', instrutorId: 'irene', instrutorNome: 'Irene Soler',
      titulo: { es: 'Medida y dilución: lo básico', pt: 'Medida e diluição: o básico' },
      descricao: { es: 'Curso básico, gratis con tu cuenta. El jigger, la cuchara y cuánta agua entra al remover o agitar. Dos clases en la app y una práctica en tu barra.', pt: 'Curso básico, grátis com a sua conta. O jigger, a colher e quanta água entra ao mexer ou bater. Duas aulas no app e uma prática no seu balcão.' },
      inicio: '2026-11-30', vagas: 40, patrocinador: null, abertaATodos: true, soMaiores: false, precoPratica: 39, status: 'aberta'
    },
    {
      id: 'esc-03', codigo: 'ESC-03', oficio: 'preparo-fermentacao', instrutorId: 'pablo', instrutorNome: 'Pablo Ferrer',
      titulo: { es: 'Barra lista: mise en place', pt: 'Bancada pronta: mise en place' },
      descricao: { es: 'Curso básico, gratis con tu cuenta. Qué preparar antes del servicio, en qué orden y cómo etiquetar los lotes en el Cuaderno.', pt: 'Curso básico, grátis com a sua conta. O que preparar antes do serviço, em que ordem e como etiquetar os lotes no Caderno.' },
      inicio: '2026-12-07', vagas: 40, patrocinador: null, abertaATodos: true, soMaiores: false, precoPratica: 39, status: 'aberta'
    }
  ];
  const en = (turmaId: string, ordem: number, tipo: Encontro['tipo'], tes: string, tpt: string, des: string, dpt: string, quando: string | null, lugar: string | null): Encontro =>
    ({ id: `${turmaId}-${ordem}`, turmaId, ordem, tipo, titulo: { es: tes, pt: tpt }, descricao: { es: des, pt: dpt }, quando, lugar });
  const encontros = [
    en('esc-07', 1, 'aula_app', 'Clase 1 · Cuánto diluye tu hielo', 'Aula 1 · Quanto o seu gelo dilui', 'En la app, cuando quieras. Cambias el hielo y el tiempo hasta que el agua llega al 22% de la ficha.', 'No app, quando quiser. Você troca o gelo e o tempo até a água chegar aos 22% da ficha.', null, null),
    en('esc-07', 2, 'aula_ao_vivo', 'Clase 2 · Corte del bloque', 'Aula 2 · Corte do bloco', 'En directo, en línea.', 'Ao vivo, online.', '2026-12-04T11:00:00+01:00', null),
    en('esc-07', 3, 'pratica', 'Práctica evaluada', 'Prática avaliada', 'Presencial, con dos firmas: Irene Soler y un colega del curso.', 'Presencial, com duas assinaturas: Irene Soler e um colega da turma.', '2026-12-08T16:00:00+01:00', 'Bar Salitre, Valencia'),
    en('esc-14', 1, 'aula_app', 'Clase 1 · El coste de una dosis', 'Aula 1 · O custo de uma dose', 'En la app, con tu ficha del Negroni.', 'No app, com a sua ficha do Negroni.', null, null),
    en('esc-14', 2, 'pratica', 'Práctica · Una carta con coste cerrado', 'Prática · Uma carta com custo fechado', 'Presencial, con dos firmas.', 'Presencial, com duas assinaturas.', '2027-01-26T16:00:00+01:00', 'Valencia'),
    en('esc-11', 1, 'aula_app', 'Clase 1 · Dulzor, acidez y cuerpo sin alcohol', 'Aula 1 · Doçura, acidez e corpo sem álcool', 'En la app, cuando quieras.', 'No app, quando quiser.', null, null),
    en('esc-11', 2, 'pratica', 'Práctica evaluada', 'Prática avaliada', 'Presencial, evaluada por Irene Soler.', 'Presencial, avaliada por Irene Soler.', '2026-12-15T16:00:00+01:00', 'Ruzafa, Valencia'),
    en('esc-02', 1, 'aula_app', 'Clase 1 · El jigger y la dosis exacta', 'Aula 1 · O jigger e a dose certa', 'En la app, cuando quieras.', 'No app, quando quiser.', null, null),
    en('esc-02', 2, 'aula_app', 'Clase 2 · Remover o agitar: cuánta agua entra', 'Aula 2 · Mexer ou bater: quanta água entra', 'En la app, con tu ficha del Negroni.', 'No app, com a sua ficha do Negroni.', null, null),
    en('esc-02', 3, 'pratica', 'Práctica en tu barra', 'Prática no seu balcão', 'En tu bar, con dos firmas: quien enseña, por vídeo, y un compañero del curso.', 'No seu bar, com duas assinaturas: quem ensina, pelo vídeo, e um colega da turma.', '2026-12-11T18:00:00+01:00', null),
    en('esc-03', 1, 'aula_app', 'Clase 1 · La lista de preparación', 'Aula 1 · A lista de preparo', 'En la app: de las reservas del día a la lista del Cuaderno.', 'No app: das reservas do dia à lista do Caderno.', null, null),
    en('esc-03', 2, 'aula_app', 'Clase 2 · Lotes con etiqueta', 'Aula 2 · Lotes com etiqueta', 'En la app: caducidad, alérgenos y el QR.', 'No app: validade, alérgenos e o QR.', null, null),
    en('esc-03', 3, 'pratica', 'Práctica en tu barra', 'Prática no seu balcão', 'En tu bar, con dos firmas: quien enseña, por vídeo, y un compañero del curso.', 'No seu bar, com duas assinaturas: quem ensina, pelo vídeo, e um colega da turma.', '2026-12-18T18:00:00+01:00', null)
  ];
  const inscritos = (turmaId: string, ids: string[]) => ids.map((userId) => ({ turmaId, userId, status: 'inscrito' as StatusInscricao }));
  return {
    versao: 2,
    euId: 'teo',
    pessoas,
    turmas,
    encontros,
    // ESC-07: 9 de 12 vagas ocupadas, as 3 livres dos protótipos.
    inscricoes: [
      ...inscritos('esc-07', ['nuria', 'lara', 'iker', 'elena', 'marcos', 'aitana', 'joel', 'carla', 'sergi']),
      ...inscritos('esc-11', ['lara', 'joel', 'carla', 'sergi']),
      ...inscritos('esc-14', ['elena', 'marcos']),
      ...inscritos('esc-02', ['lara', 'iker', 'joel', 'aitana']),
      ...inscritos('esc-03', ['carla', 'sergi'])
    ],
    progresso: [{ encontroId: 'esc-07-1', userId: 'nuria' }, { encontroId: 'esc-07-1', userId: 'lara' }],
    posts: [
      { id: 'p1', turmaId: 'esc-07', autorId: 'irene', fixado: true, oculto: false, criadoEm: '2026-11-18T10:05:00+01:00',
        texto: 'Bienvenidos a ESC-07. Antes del directo del 04/12, haced la clase 1 en la app y traed vuestro número de dilución.' },
      { id: 'p2', turmaId: 'esc-07', autorId: 'nuria', fixado: false, oculto: false, criadoEm: '2026-11-19T23:40:00+01:00',
        texto: 'Mi bloque sale turbio en el fondo. ¿Es normal o es el congelador?' },
      { id: 'p3', turmaId: 'esc-07', autorId: 'lara', fixado: false, oculto: false, criadoEm: '2026-11-20T09:15:00+01:00',
        texto: '¿Alguien de Ruzafa para practicar el corte antes del 08/12?' }
    ],
    respostas: [
      { id: 'r1', postId: 'p2', autorId: 'irene', oculto: false, criadoEm: '2026-11-20T08:30:00+01:00', texto: 'Es normal: es el aire que baja con el frío. Corta los 3 cm de abajo y listo.' },
      { id: 'r2', postId: 'p2', autorId: 'lara', oculto: false, criadoEm: '2026-11-20T08:52:00+01:00', texto: 'A mí me pasaba igual. Con la nevera de camping dentro del congelador mejoró.' }
    ],
    carimbos: [],
    criticas: [
      { id: 'c1', userId: 'nuria', mes: '2026-11-01', drink: 'Penicillin', ficha: 'Scotch 60 ml, miel y jengibre 22,5 ml, limón 22,5 ml, Islay por encima.', resposta: null, respondidaEm: null }
    ],
    materiais: [
      { id: 'm1', tipo: 'monografia', oficio: 'gelo-diluicao', titulo: { es: 'Hielo claro: congelación direccional', pt: 'Gelo claro: congelamento direcional' },
        resumo: { es: 'Sin tapa, el frío entra solo por arriba y el hielo crece hacia abajo. 18 páginas, de Irene Soler.', pt: 'Sem tampa, o frio entra só por cima e o gelo cresce para baixo. 18 páginas, de Irene Soler.' }, livreEm: '2026-12-01' },
      { id: 'm2', tipo: 'procedimento', oficio: 'preparo-fermentacao', titulo: { es: 'Cordial de lima: procedimiento', pt: 'Cordial de limão: procedimento de preparo' },
        resumo: { es: 'El lote de 3 L: pesos, orden de los pasos, caducidad y la etiqueta lista para el Cuaderno.', pt: 'O lote de 3 L: pesos, ordem dos passos, validade e a etiqueta pronta para o Caderno.' }, livreEm: '2026-11-01' },
      { id: 'm3', tipo: 'ficha', oficio: 'custo-gestao', titulo: { es: 'Coste de la carta de invierno', pt: 'Custo da carta de inverno' },
        resumo: { es: 'Coste por dosis de cada cóctel, la meta de la casa y el precio que cierra la cuenta. De Pablo Ferrer.', pt: 'Custo por dose de cada drink, a meta da casa e o preço que fecha a conta. De Pablo Ferrer.' }, livreEm: null }
    ],
    estante: [],
    eventos: [
      { id: 'v1', tipo: 'aula_ao_vivo', quando: '2026-12-10T18:00:00+01:00', link: null, soSocios: true,
        titulo: { es: 'Clase en directo · Carta de invierno: qué entra y por qué', pt: 'Aula ao vivo · Carta de inverno: o que entra e por quê' } },
      { id: 'v2', tipo: 'critica', quando: '2026-11-25T23:59:00+01:00', link: null, soSocios: true,
        titulo: { es: 'Crítica del mes: envío hasta el día 25', pt: 'Crítica do mês: envio até o dia 25' } },
      { id: 'v3', tipo: 'aula_ao_vivo', quando: '2026-12-02T19:00:00+01:00', link: null, soSocios: false,
        titulo: { es: 'Clase abierta del mes · Hielo claro sin máquina', pt: 'Aula aberta do mês · Gelo claro sem máquina' } }
    ]
  };
}

function ler(): Mundo {
  try {
    const bruto = localStorage.getItem(CHAVE);
    if (bruto) {
      const m = JSON.parse(bruto) as Mundo;
      if (m && m.versao === 2) return m;
    }
  } catch { /* sem armazenamento: o mundo vive só nesta aba */ }
  return mundoNovo();
}

let seq = 0;
const novoId = () => {
  try { return crypto.randomUUID(); } catch { seq += 1; return `id-${Date.now()}-${seq}`; }
};

export function criarDemo(): FonteEscola {
  let m = ler();
  const ouvintes = new Set<() => void>();
  const gravar = () => { try { localStorage.setItem(CHAVE, JSON.stringify(m)); } catch { /* segue sem guardar */ } };
  const avisarTodos = () => ouvintes.forEach((f) => f());
  const agora = () => {
    // O relógio da demonstração anda a partir de 20/11, para os itens novos ficarem por último.
    const passou = Date.now() - inicioSessao;
    return new Date(HOJE.getTime() + passou).toISOString();
  };
  const inicioSessao = Date.now();

  const p = (id: string | null) => m.pessoas.find((x) => x.id === id);
  const nome = (id: string | null) => p(id)?.nome ?? '';
  const eu = () => p(m.euId)!;
  const eSocio = (id = m.euId) => { const x = p(id); return !!x && (x.plano === 'socio' || x.plano === 'barback'); };
  const eInstrutor = (id = m.euId) => { const x = p(id); return !!x && (x.papel === 'instrutor' || x.papel === 'admin'); };
  const turma = (id: string) => m.turmas.find((t) => t.id === id);
  const ensina = (turmaId: string, id = m.euId) => turma(turmaId)?.instrutorId === id || p(id)?.papel === 'admin';
  const inscricao = (turmaId: string, id = m.euId) => m.inscricoes.find((i) => i.turmaId === turmaId && i.userId === id);
  const eInscrito = (turmaId: string, id = m.euId) => { const i = inscricao(turmaId, id); return !!i && i.status !== 'cancelado'; };
  const ocupadas = (turmaId: string) => m.inscricoes.filter((i) => i.turmaId === turmaId && i.status !== 'cancelado').length;
  const muda = (f: () => void) => { f(); gravar(); };
  const erro = (c: ConstructorParameters<typeof ErroEscola>[0]) => { throw new ErroEscola(c); };
  const pronto = <T,>(v: T) => Promise.resolve(v);

  const concluir = (c: CarimboLinha) => {
    if (c.assinadoPor && c.conferidoPor) {
      const i = inscricao(c.turmaId, c.userId);
      if (i) i.status = 'concluido';
    }
  };

  const fonte: FonteEscola = {
    modo: 'demo',
    hoje: () => HOJE,
    eu: () => { const x = eu(); return pronto<Eu>({ id: x.id, nome: x.nome, plano: x.plano, papel: x.papel, planoAte: null }); },
    aoMudarSessao: (cb) => { ouvintes.add(cb); return () => { ouvintes.delete(cb); }; },
    entrar: async () => {},
    confirmarCodigo: async () => {},
    mudarNome: async (nome) => {
      const n = nome.trim();
      if (!n) erro('texto_vazio');
      muda(() => { eu().nome = n.slice(0, 80); });
    },
    sair: async () => {},

    turmas: async () => m.turmas.map((t) => ({ ...t, ocupadas: ocupadas(t.id) })).sort((a, b) => a.inicio.localeCompare(b.inicio)),
    encontros: async (turmaId) => m.encontros.filter((e) => e.turmaId === turmaId).sort((a, b) => a.ordem - b.ordem),
    inscricoes: async () => m.inscricoes.filter((i) => i.userId === m.euId).map<Inscricao>((i) => ({ turmaId: i.turmaId, status: i.status })),
    inscrever: async (turmaId) => {
      const t = turma(turmaId) ?? erro('falhou');
      const atual = inscricao(turmaId);
      if (atual && atual.status !== 'cancelado') return;
      if (t.status !== 'aberta') erro('turma_fechada');
      if (!(t.abertaATodos || eSocio())) erro('so_socios');
      if (ocupadas(turmaId) >= t.vagas) erro('turma_cheia');
      muda(() => { if (atual) atual.status = 'inscrito'; else m.inscricoes.push({ turmaId, userId: m.euId, status: 'inscrito' }); });
    },
    sairDaTurma: async (turmaId) => {
      const atual = inscricao(turmaId);
      if (atual && atual.status === 'inscrito') muda(() => { atual.status = 'cancelado'; });
    },
    progresso: async (turmaId) => {
      const ids = new Set(m.encontros.filter((e) => e.turmaId === turmaId).map((e) => e.id));
      return m.progresso.filter((x) => x.userId === m.euId && ids.has(x.encontroId)).map((x) => x.encontroId);
    },
    marcarFeito: async (encontroId, feito) => {
      const e = m.encontros.find((x) => x.id === encontroId) ?? erro('falhou');
      if (!eInscrito(e.turmaId)) erro('nao_inscrito');
      muda(() => {
        m.progresso = m.progresso.filter((x) => !(x.encontroId === encontroId && x.userId === m.euId));
        if (feito) m.progresso.push({ encontroId, userId: m.euId });
      });
    },

    mural: async (turmaId) => {
      const pode = ensina(turmaId);
      if (!pode && !eInscrito(turmaId)) return [];
      const ve = (x: { oculto: boolean; autorId: string }) => pode || !x.oculto || x.autorId === m.euId;
      return m.posts
        .filter((x) => x.turmaId === turmaId && ve(x))
        .sort((a, b) => Number(b.fixado) - Number(a.fixado) || b.criadoEm.localeCompare(a.criadoEm))
        .map<Post>((x) => ({
          ...x,
          autorNome: nome(x.autorId),
          respostas: m.respostas.filter((r) => r.postId === x.id && ve(r)).sort((a, b) => a.criadoEm.localeCompare(b.criadoEm)).map((r) => ({ ...r, autorNome: nome(r.autorId) }))
        }));
    },
    postar: async (turmaId, texto) => {
      const t = texto.trim();
      if (!t) erro('texto_vazio');
      if (!eInscrito(turmaId) && !ensina(turmaId)) erro('sem_permissao');
      muda(() => { m.posts.push({ id: novoId(), turmaId, autorId: m.euId, texto: t.slice(0, 2000), fixado: false, oculto: false, criadoEm: agora() }); });
    },
    responder: async (postId, texto) => {
      const t = texto.trim();
      if (!t) erro('texto_vazio');
      const post = m.posts.find((x) => x.id === postId) ?? erro('falhou');
      const pode = ensina(post.turmaId);
      if (!pode && (!eInscrito(post.turmaId) || post.oculto)) erro('sem_permissao');
      muda(() => { m.respostas.push({ id: novoId(), postId, autorId: m.euId, texto: t.slice(0, 1000), oculto: false, criadoEm: agora() }); });
    },
    moderarPost: async (postId, mudar) => {
      const post = m.posts.find((x) => x.id === postId) ?? erro('falhou');
      if (!ensina(post.turmaId)) erro('so_quem_ensina');
      muda(() => { if (mudar.fixado !== undefined) post.fixado = mudar.fixado; if (mudar.oculto !== undefined) post.oculto = mudar.oculto; });
    },
    moderarResposta: async (respostaId, oculto) => {
      const r = m.respostas.find((x) => x.id === respostaId) ?? erro('falhou');
      const post = m.posts.find((x) => x.id === r.postId) ?? erro('falhou');
      if (!ensina(post.turmaId)) erro('so_quem_ensina');
      muda(() => { r.oculto = oculto; });
    },

    carimbos: async (turmaId) => {
      const todos = eInscrito(turmaId) || ensina(turmaId);
      return m.carimbos
        .filter((c) => c.turmaId === turmaId && (todos || c.userId === m.euId))
        .map<PedidoCarimbo>((c) => ({ ...c, userNome: nome(c.userId), assinadoNome: c.assinadoPor ? nome(c.assinadoPor) : null, conferidoNome: c.conferidoPor ? nome(c.conferidoPor) : null }));
    },
    pedirCarimbo: async (turmaId) => {
      if (!eInscrito(turmaId)) erro('nao_inscrito');
      if (m.carimbos.some((c) => c.turmaId === turmaId && c.userId === m.euId)) return;
      muda(() => { m.carimbos.push({ id: novoId(), userId: m.euId, turmaId, assinadoPor: null, assinadoEm: null, conferidoPor: null, conferidoEm: null }); });
    },
    assinarCarimbo: async (id) => {
      const c = m.carimbos.find((x) => x.id === id) ?? erro('falhou');
      if (!ensina(c.turmaId)) erro('so_quem_ensina');
      if (c.userId === m.euId) erro('nao_carimba_a_si');
      if (c.conferidoPor === m.euId) erro('precisa_outra_pessoa');
      muda(() => { c.assinadoPor = m.euId; c.assinadoEm = agora(); concluir(c); });
    },
    conferirCarimbo: async (id) => {
      const c = m.carimbos.find((x) => x.id === id) ?? erro('falhou');
      if (c.userId === m.euId) erro('nao_carimba_a_si');
      if (c.assinadoPor === m.euId) erro('precisa_outra_pessoa');
      if (!eInscrito(c.turmaId)) erro('so_colega_da_turma');
      muda(() => { c.conferidoPor = m.euId; c.conferidoEm = agora(); concluir(c); });
    },

    criticas: async () => m.criticas
      .filter((c) => c.userId === m.euId || eInstrutor())
      .sort((a, b) => b.mes.localeCompare(a.mes))
      .map((c) => ({ ...c, userNome: nome(c.userId) })),
    mandarCritica: async (drink, ficha) => {
      if (!eSocio()) erro('so_socios');
      const d = drink.trim(); const f = ficha.trim();
      if (!d || !f) erro('texto_vazio');
      const mes = mesDe(HOJE);
      if (m.criticas.some((c) => c.userId === m.euId && c.mes === mes)) erro('ja_mandou');
      muda(() => { m.criticas.push({ id: novoId(), userId: m.euId, mes, drink: d.slice(0, 80), ficha: f.slice(0, 2000), resposta: null, respondidaEm: null }); });
    },
    responderCritica: async (id, resposta) => {
      if (!eInstrutor()) erro('so_quem_ensina');
      const t = resposta.trim();
      if (!t) erro('texto_vazio');
      const c = m.criticas.find((x) => x.id === id) ?? erro('falhou');
      muda(() => { c.resposta = t; c.respondidaEm = agora(); });
    },

    materiais: async () => {
      const ve = (x: MaterialLinha) => eSocio() || eInstrutor() || x.livreEm === mesDe(HOJE);
      return m.materiais.filter(ve).map((x) => ({ ...x, guardado: m.estante.some((e) => e.userId === m.euId && e.materialId === x.id) }));
    },
    guardar: async (materialId, sim) => {
      const x = m.materiais.find((y) => y.id === materialId);
      if (!x || !(eSocio() || eInstrutor() || x.livreEm === mesDe(HOJE))) erro('so_socios');
      muda(() => {
        m.estante = m.estante.filter((e) => !(e.userId === m.euId && e.materialId === materialId));
        if (sim) m.estante.push({ userId: m.euId, materialId });
      });
    },
    eventos: async () => m.eventos.filter((e) => !e.soSocios || eSocio() || eInstrutor()).sort((a, b) => a.quando.localeCompare(b.quando)),

    pessoas: () => m.pessoas.filter((x) => x.rot.pt),
    trocarPessoa: (id) => { if (p(id)) { m.euId = id; gravar(); avisarTodos(); } },
    trocarPlano: (plano) => { muda(() => { eu().plano = plano; }); avisarTodos(); },
    recomecar: () => { m = mundoNovo(); gravar(); avisarTodos(); }
  };
  return fonte;
}
