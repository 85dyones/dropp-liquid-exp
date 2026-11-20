// Uma turma: o que é, os encontros, entrar ou sair, o carimbo de duas assinaturas e o mural.
import { useState, type FormEvent } from 'react';
import { Botao, Carimbo, Papel } from '../ds/componentes';
import { eSocio, ensina, useCarregar, useEscola } from './contexto';
import { dataHora, mesAno } from './textos';
import type { Encontro, PedidoCarimbo, Post, Turma } from './tipos';

export function TurmaTela({ id, voltar }: { id: string; voltar: () => void }) {
  const { t, lang, eu } = useEscola();
  const turma = useCarregar((f) => f.turmas().then((ts) => ts.find((x) => x.id === id) ?? null), id);
  const inscricoes = useCarregar((f) => f.inscricoes());

  if (turma === undefined || inscricoes === undefined) return <p className="esc-estado dp-nota" role="status">{t.carregando}</p>;
  if (turma === null) return <div className="tela"><button type="button" className="dp-voltar" onClick={voltar}>{t.voltar}</button></div>;

  const minha = inscricoes.find((i) => i.turmaId === id && i.status !== 'cancelado');
  const livres = Math.max(0, turma.vagas - turma.ocupadas);
  const oficio = t.oficios[turma.oficio] ?? turma.oficio;

  return (
    <div className="tela esc-turma-tela">
      <div className="esc-voltar"><button type="button" className="dp-voltar" onClick={voltar}>{t.voltar}</button></div>

      <div className="esc-turma-grade">
        <div className="pilha">
          <div className="tela-cab">
            <span className="dp-rot">{turma.codigo} · {oficio}</span>
            <h2 className="dp-titulo-grande">{turma.titulo[lang]}</h2>
            {turma.patrocinador ? (
              <p className="esc-lido"><span className="dp-st dp-st--meio">{t.pagoPor(turma.patrocinador)}</span><span className="dp-nota">{t.pagoNota}</span></p>
            ) : null}
            <p className="item-porque">{turma.descricao[lang]}</p>
          </div>

          <dl className="esc-fatos">
            <div><dt>{t.quemEnsina}</dt><dd>{turma.instrutorNome}</dd></div>
            <div><dt>{t.acesso}</dt><dd>{turma.abertaATodos ? (turma.patrocinador ? t.acessoPatrocinada(turma.patrocinador) : t.acessoBasico) : t.acessoSocios}</dd></div>
            <div><dt>{t.comoProva}</dt><dd>{t.comoProvaTxt}</dd></div>
            <div><dt>{t.oQueLeva}</dt><dd>{t.oQueLevaTxt(oficio)}</dd></div>
            <div><dt>{t.vagas}</dt><dd>{livres ? t.vagasTxt(livres, turma.vagas) : t.cheia}</dd></div>
          </dl>

          <Encontros turma={turma} dentro={!!minha} />
          <Inscricao turma={turma} status={minha?.status} livres={livres} />
          {minha || ensina(eu, turma) ? <CarimboBloco turma={turma} dentro={!!minha} /> : null}
        </div>

        <Mural turma={turma} dentro={!!minha} />
      </div>
    </div>
  );
}

function Encontros({ turma, dentro }: { turma: Turma; dentro: boolean }) {
  const { fonte, t, lang, agir } = useEscola();
  const encontros = useCarregar((f) => f.encontros(turma.id), turma.id);
  const feitos = useCarregar((f) => f.progresso(turma.id), turma.id);
  const feito = new Set(feitos ?? []);
  return (
    <Papel corte className="esc-bloco">
      <span className="dp-rot">{t.encontros}</span>
      <ul className="esc-encontros">
        {(encontros ?? []).map((e: Encontro) => (
          <li key={e.id} data-feito={feito.has(e.id)}>
            <b className="esc-en-d">{e.quando ? dataHora(e.quando, lang).split(' · ')[0] : `${e.ordem}`}</b>
            <span className="esc-en-l">
              <span className="esc-en-t">{e.titulo[lang]}</span>
              <span className="dp-nota">{t.tipoEncontro[e.tipo]} · {e.quando ? dataHora(e.quando, lang).split(' · ')[1] : t.quandoQuiser}{e.lugar ? ` · ${e.lugar}` : ''}</span>
              <span className="dp-nota">{e.descricao[lang]}</span>
              {dentro && e.tipo === 'aula_app' ? (
                <span className="esc-pe">
                  {feito.has(e.id) ? <span className="dp-st dp-st--ok">{t.feita}</span> : null}
                  <button type="button" className="dp-btn dp-btn--peq" onClick={() => agir(() => fonte.marcarFeito(e.id, !feito.has(e.id)))}>
                    {feito.has(e.id) ? t.desmarcar : t.marcarFeita}
                  </button>
                </span>
              ) : null}
            </span>
          </li>
        ))}
      </ul>
    </Papel>
  );
}

function Inscricao({ turma, status, livres }: { turma: Turma; status?: string; livres: number }) {
  const { fonte, eu, t, agir, avisar } = useEscola();
  // Quem ensina a turma não se inscreve nela; o admin modera todas e pode entrar como aluno.
  if (eu && turma.instrutorId === eu.id) return <p className="esc-lido"><span className="dp-st dp-st--ok">{t.ensinaRot}</span><span>{t.voceEnsina}</span></p>;
  if (status) {
    return (
      <div className="esc-acoes">
        <p className="esc-lido"><span className="dp-st dp-st--ok">{t.statusInscricao[status as 'inscrito']}</span><span>{eu?.nome}</span></p>
        {status === 'inscrito' ? <button type="button" className="esc-link" onClick={() => agir(() => fonte.sairDaTurma(turma.id), t.saiu)}>{t.sairTurma}</button> : null}
      </div>
    );
  }
  if (!eu) return <p className="dp-nota">{t.precisaEntrar}</p>;
  if (!livres) return <p className="esc-lido"><span className="dp-st dp-st--perdido">{t.cheia}</span></p>;
  if (!turma.abertaATodos && !eSocio(eu)) {
    return (
      <div className="esc-acoes">
        <Botao cheio largo onClick={() => avisar(t.serSocioAviso)}>{t.precisaSocio}</Botao>
        <Botao largo onClick={() => avisar(t.avulsoAviso)}>{t.avulso(String(turma.precoPratica))}</Botao>
        <p className="dp-nota">{t.avulsoNota}</p>
      </div>
    );
  }
  return <Botao cheio largo onClick={() => agir(() => fonte.inscrever(turma.id), t.entrou)}>{t.entrarTurma}</Botao>;
}

// Quem ensina vê os pedidos para assinar; quem está na turma vê o próprio carimbo e os colegas para conferir.
// O admin que entrou como aluno vê os dois blocos; o banco impede a mesma pessoa de assinar e conferir o mesmo pedido.
function CarimboBloco({ turma, dentro }: { turma: Turma; dentro: boolean }) {
  const { fonte, eu, t, lang, agir } = useEscola();
  const pedidos = useCarregar((f) => f.carimbos(turma.id), turma.id);
  if (!eu || !pedidos) return null;
  const quemEnsina = ensina(eu, turma);
  const meu = pedidos.find((p) => p.userId === eu.id);
  const outros = pedidos.filter((p) => p.userId !== eu.id);
  const paraConferir = outros.filter((p) => !p.conferidoPor && p.assinadoPor !== eu.id);

  const blocoEnsina = quemEnsina ? (
    <Papel className="esc-bloco">
      <span className="dp-rot">{t.pedidosTit}</span>
      {!outros.length ? <p className="dp-nota">{t.pedidosNada}</p> : null}
      <ul className="esc-pedidos">
        {outros.map((p) => (
          <li key={p.id}>
            <Assinaturas p={p} nome />
            {!p.assinadoPor && p.conferidoPor !== eu.id ? <button type="button" className="dp-btn dp-btn--peq" onClick={() => agir(() => fonte.assinarCarimbo(p.id), t.assinado)}>{t.assinar}</button> : null}
          </li>
        ))}
      </ul>
    </Papel>
  ) : null;
  if (!dentro) return blocoEnsina;

  const bateu = meu && meu.assinadoPor && meu.conferidoPor;
  return (
    <>
    {blocoEnsina}
    <Papel className="esc-bloco">
      <span className="dp-rot">{t.carimboTit}</span>
      {bateu ? (
        <div className="esc-carimbo">
          <Carimbo tipo="escola" rotulo={t.carimboRot} titulo={t.oficios[turma.oficio] ?? turma.oficio} linha={mesAno(meu.conferidoEm ?? meu.assinadoEm ?? '', lang)} rotacao={-2} />
          <p className="dp-nota">{t.carimboBateu}</p>
        </div>
      ) : (
        <>
          <p>{t.carimboTxt}</p>
          {meu ? <Assinaturas p={meu} /> : <Botao largo onClick={() => agir(() => fonte.pedirCarimbo(turma.id), t.pedido)}>{t.pedirCarimbo}</Botao>}
        </>
      )}
      {paraConferir.length ? (
        <div className="esc-conferir">
          <span className="dp-rot">{t.conferirTit}</span>
          <p className="dp-nota">{t.conferirNota}</p>
          <ul className="esc-pedidos">
            {paraConferir.map((p) => (
              <li key={p.id}>
                <Assinaturas p={p} nome />
                <button type="button" className="dp-btn dp-btn--peq" onClick={() => agir(() => fonte.conferirCarimbo(p.id), t.conferido)}>{t.conferir}</button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </Papel>
    </>
  );
}

function Assinaturas({ p, nome }: { p: PedidoCarimbo; nome?: boolean }) {
  const { t, lang } = useEscola();
  const linha = (rot: string, quem: string | null, quando: string | null) => (
    <span className="esc-ass">
      <span className="dp-nota">{rot}</span>
      {quem ? <span className="dp-st dp-st--ok">{t.feitoPor(quem, quando ? dataHora(quando, lang).split(' · ')[0] : '')}</span> : <span className="dp-st dp-st--falta">{t.aguardando}</span>}
    </span>
  );
  return (
    <span className="esc-assinaturas">
      {nome ? <b>{p.userNome}</b> : null}
      {linha(t.assinaturaEnsina, p.assinadoNome, p.assinadoEm)}
      {linha(t.assinaturaColega, p.conferidoNome, p.conferidoEm)}
    </span>
  );
}

function Mural({ turma, dentro }: { turma: Turma; dentro: boolean }) {
  const { fonte, eu, t, agir } = useEscola();
  const quemEnsina = ensina(eu, turma);
  const pode = dentro || quemEnsina;
  const posts = useCarregar((f) => f.mural(turma.id), `${turma.id}-${pode}`);
  const [texto, setTexto] = useState('');

  const postar = async (e: FormEvent) => {
    e.preventDefault();
    if (await agir(() => fonte.postar(turma.id, texto), t.postado)) setTexto('');
  };

  return (
    <section className="secao esc-mural" aria-label={t.muralTit}>
      <div className="secao-cab">
        <h3 className="dp-titulo-bloco">{t.muralTit}</h3>
        <p className="dp-nota">{pode ? t.muralNota : t.muralFechado}</p>
      </div>
      {pode ? (
        <>
          <form className="esc-form esc-compor" onSubmit={postar}>
            <label className="esc-campo">
              <span className="esc-rotulo">{t.muralPlaceholder}</span>
              <textarea value={texto} rows={3} maxLength={2000} required onChange={(e) => setTexto(e.target.value)} />
            </label>
            <button type="submit" className="dp-btn dp-btn--cheio">{t.postar}</button>
          </form>
          {posts && !posts.length ? <p className="dp-nota">{t.muralVazio}</p> : null}
          {(posts ?? []).map((p) => <PostCartao key={p.id} p={p} turma={turma} moderar={quemEnsina} />)}
        </>
      ) : null}
    </section>
  );
}

function PostCartao({ p, turma, moderar }: { p: Post; turma: Turma; moderar: boolean }) {
  const { fonte, eu, t, lang, agir } = useEscola();
  const [abrir, setAbrir] = useState(false);
  const [resp, setResp] = useState('');
  const responder = async (e: FormEvent) => {
    e.preventDefault();
    if (await agir(() => fonte.responder(p.id, resp))) { setResp(''); setAbrir(false); }
  };
  const autor = (id: string, nome: string) => (
    <span className="esc-autor"><b>{nome}</b>{id === turma.instrutorId ? <span className="dp-nota"> · {t.ensinaRot}</span> : null}</span>
  );
  return (
    <article className="dp-papel esc-post" data-oculto={p.oculto}>
      <header className="esc-post-cab">
        {autor(p.autorId, p.autorNome)}
        <span className="dp-nota">{dataHora(p.criadoEm, lang)}</span>
      </header>
      {p.fixado || p.oculto ? (
        <span className="esc-pe">
          {p.fixado ? <span className="dp-st dp-st--meio">{t.fixado}</span> : null}
          {p.oculto ? <span className="dp-st dp-st--perdido">{moderar ? t.oculto : t.ocultoSeu}</span> : null}
        </span>
      ) : null}
      <p className="esc-post-txt">{p.texto}</p>
      {moderar ? (
        <span className="esc-pe">
          <button type="button" className="esc-link" onClick={() => agir(() => fonte.moderarPost(p.id, { fixado: !p.fixado }))}>{p.fixado ? t.desafixar : t.fixar}</button>
          <button type="button" className="esc-link" onClick={() => agir(() => fonte.moderarPost(p.id, { oculto: !p.oculto }))}>{p.oculto ? t.mostrar : t.ocultar}</button>
        </span>
      ) : null}
      {p.respostas.length ? (
        <ul className="esc-respostas">
          {p.respostas.map((r) => (
            <li key={r.id} data-oculto={r.oculto}>
              <span className="esc-post-cab">{autor(r.autorId, r.autorNome)}<span className="dp-nota">{dataHora(r.criadoEm, lang)}</span></span>
              {r.oculto ? <span className="dp-st dp-st--perdido">{moderar ? t.oculto : t.ocultoSeu}</span> : null}
              <p>{r.texto}</p>
              {moderar ? <button type="button" className="esc-link" onClick={() => agir(() => fonte.moderarResposta(r.id, !r.oculto))}>{r.oculto ? t.mostrar : t.ocultar}</button> : null}
            </li>
          ))}
        </ul>
      ) : null}
      {!p.oculto || moderar ? (
        abrir ? (
          <form className="esc-form" onSubmit={responder}>
            <label className="esc-campo">
              <span className="esc-rotulo">{t.respostaPlaceholder}</span>
              <textarea value={resp} rows={2} maxLength={1000} required autoFocus onChange={(e) => setResp(e.target.value)} />
            </label>
            <button type="submit" className="dp-btn dp-btn--peq">{t.mandarResposta}</button>
          </form>
        ) : (
          <button type="button" className="esc-link" onClick={() => setAbrir(true)} disabled={!eu}>{t.responder}</button>
        )
      ) : null}
    </article>
  );
}
