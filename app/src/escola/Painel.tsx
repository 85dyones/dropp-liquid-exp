// O painel da Escola, na aba Escola do Atlas: quem você é, as turmas, a crítica do mês, a biblioteca e os eventos.
import { useState, type FormEvent } from 'react';
import { Botao, Papel } from '../ds/componentes';
import { eInstrutor, eSocio, ensina, useCarregar, useEscola } from './contexto';
import { dataHora, diaMes, diaSemana, mesAno } from './textos';
import { mesDe, type Critica, type Plano, type Turma } from './tipos';

export function EscolaPainel({ abrirTurma }: { abrirTurma: (id: string) => void }) {
  const { fonte, eu, t } = useEscola();
  const turmas = useCarregar((f) => f.turmas());
  const inscricoes = useCarregar((f) => f.inscricoes());

  const minhas = new Map((inscricoes ?? []).filter((i) => i.status !== 'cancelado').map((i) => [i.turmaId, i.status]));
  const ensino = (turmas ?? []).filter((tm) => ensina(eu, tm));
  const dentro = (turmas ?? []).filter((tm) => minhas.has(tm.id));
  const outras = (turmas ?? []).filter((tm) => !minhas.has(tm.id) && !ensina(eu, tm));

  return (
    <section className="secao esc">
      <div className="secao-cab">
        <h2 className="dp-titulo-bloco">{t.titulo}</h2>
        <p className="dp-nota">{t.intro}</p>
      </div>

      {fonte.modo === 'demo' ? <BarraDemo /> : null}
      {eu ? <SeuPlano /> : null}

      {ensino.length ? <ListaTurmas titulo={t.ensinaTit} turmas={ensino} abrir={abrirTurma} /> : null}
      {dentro.length ? <ListaTurmas titulo={t.suasTurmas} turmas={dentro} abrir={abrirTurma} status={(id) => t.statusInscricao[minhas.get(id)!]} /> : null}
      {turmas === undefined ? <p className="dp-nota">{t.carregando}</p> : null}
      {outras.length ? <ListaTurmas titulo={t.proximas} turmas={outras} abrir={abrirTurma} /> : null}

      {eu ? <CriticaDoMes /> : null}
      {eu ? <Biblioteca /> : null}
      {eu ? <Eventos /> : null}
    </section>
  );
}

function BarraDemo() {
  const { fonte, eu, t, lang, avisar } = useEscola();
  const pessoas = fonte.pessoas?.() ?? [];
  const planos: Plano[] = ['gratis', 'socio', 'barback'];
  return (
    <Papel className="esc-bloco esc-demo">
      <span className="dp-rot">{t.demoTit}</span>
      <p className="dp-nota">{t.demoTxt}</p>
      <div className="esc-campo-grupo" role="group" aria-label={t.demoQuem}>
        <span className="esc-rotulo">{t.demoQuem}</span>
        <div className="dp-seg-row">
          {pessoas.map((p) => (
            <button key={p.id} type="button" className="dp-seg" aria-pressed={eu?.id === p.id} onClick={() => fonte.trocarPessoa?.(p.id)}>
              {p.nome.split(' ')[0]}<small>{p.rot[lang]}</small>
            </button>
          ))}
        </div>
      </div>
      {eu?.id === 'teo' ? (
        <div className="esc-campo-grupo" role="group" aria-label={t.demoPlano}>
          <span className="esc-rotulo">{t.demoPlano}</span>
          <div className="dp-seg-row">
            {planos.map((p) => (
              <button key={p} type="button" className="dp-seg" aria-pressed={eu.plano === p} onClick={() => fonte.trocarPlano?.(p)}>{t.planos[p]}</button>
            ))}
          </div>
        </div>
      ) : null}
      <button type="button" className="esc-link" onClick={() => { fonte.recomecar?.(); avisar(t.recomecado); }}>{t.recomecar}</button>
    </Papel>
  );
}

function SeuPlano() {
  const { fonte, eu, t, avisar } = useEscola();
  if (!eu) return null;
  const socio = eSocio(eu);
  // O teste de 30 dias: plano de sócio com data de fim.
  const emTeste = socio && !!eu.planoAte;
  return (
    <Papel className="esc-bloco">
      <div className="esc-cab-linha">
        <span className="dp-rot">{t.planoRot}</span>
        <span className={socio ? 'dp-st dp-st--ok' : 'dp-st dp-st--falta'}>{t.planos[eu.plano]}{emTeste ? ` · ${t.testeAte(diaMes(eu.planoAte!))}` : ''}</span>
      </div>
      <p>{emTeste ? t.testeTxt(diaMes(eu.planoAte!)) : t.planoTxt[eu.plano]}</p>
      {eInstrutor(eu) ? <p className="dp-nota">{eu.nome} · {t.ensinaRot}</p> : null}
      {!socio || emTeste ? (
        <>
          <Botao cheio largo onClick={() => avisar(t.serSocioAviso)}>{emTeste ? t.continuarSocio : t.serSocio}</Botao>
          <p className="dp-nota">{t.precoSocio}</p>
        </>
      ) : null}
      <SeuNome />
      {fonte.modo === 'nuvem' ? (
        <div className="esc-cab-linha">
          <span className="dp-nota">{eu.email}</span>
          <button type="button" className="esc-link" onClick={() => fonte.sair()}>{t.sair}</button>
        </div>
      ) : null}
    </Papel>
  );
}

// Quem entra pelo link chega sem nome; sem ele, o mural e o carimbo não dizem quem é.
function SeuNome() {
  const { fonte, eu, t, agir } = useEscola();
  const [editando, setEditando] = useState(false);
  const [nome, setNome] = useState(eu?.nome ?? '');
  if (!eu) return null;
  const aberto = editando || !eu.nome;
  const salvar = async (e: FormEvent) => {
    e.preventDefault();
    if (await agir(() => fonte.mudarNome(nome), t.nomeSalvo)) setEditando(false);
  };
  if (!aberto) {
    return (
      <div className="esc-cab-linha">
        <span><span className="dp-nota">{t.nomeRot}: </span><b>{eu.nome}</b></span>
        <button type="button" className="esc-link" onClick={() => { setNome(eu.nome); setEditando(true); }}>{t.mudarNome}</button>
      </div>
    );
  }
  return (
    <form className="esc-form" onSubmit={salvar}>
      <label className="esc-campo">
        <span className="esc-rotulo">{t.nomeRot}</span>
        <input value={nome} maxLength={80} required autoComplete="name" onChange={(e) => setNome(e.target.value)} />
      </label>
      <p className="dp-nota">{t.nomeNota}</p>
      <button type="submit" className="dp-btn dp-btn--peq">{t.salvarNome}</button>
    </form>
  );
}

function ListaTurmas({ titulo, turmas, abrir, status }: { titulo: string; turmas: Turma[]; abrir: (id: string) => void; status?: (id: string) => string }) {
  const { t, lang } = useEscola();
  return (
    <div className="esc-lista">
      <h3 className="sub-titulo">{titulo}</h3>
      {turmas.map((tm) => {
        const livres = Math.max(0, tm.vagas - tm.ocupadas);
        return (
          <button key={tm.id} type="button" className="dp-papel dp-papel--corte esc-turma" onClick={() => abrir(tm.id)}>
            <span className="dp-rot">{tm.codigo} · {t.oficios[tm.oficio] ?? tm.oficio}</span>
            <span className="item-nome">{tm.titulo[lang]}</span>
            <span className="item-linha">{t.comeca(diaMes(tm.inicio))} · {tm.instrutorNome} · {livres ? t.vagasLivres(livres) : t.cheia}</span>
            <span className="esc-pe">
              {status ? <span className="dp-st dp-st--ok">{status(tm.id)}</span> : null}
              {tm.patrocinador ? <span className="dp-st dp-st--meio">{t.pagoPor(tm.patrocinador)}</span> : null}
              {tm.abertaATodos
                ? <span className="dp-st dp-st--ok">{tm.patrocinador ? t.gratisChip : t.basico}</span>
                : <span className="dp-st dp-st--falta">{t.paraSocios}</span>}
              {tm.soMaiores ? <span className="dp-st dp-st--falta">{t.maiores}</span> : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function CriticaDoMes() {
  const { fonte, eu, t } = useEscola();
  const criticas = useCarregar((f) => f.criticas());
  if (eInstrutor(eu)) return <CriticasParaResponder criticas={criticas} />;
  const socio = eSocio(eu);
  const mes = mesDe(fonte.hoje());
  const destaMes = criticas?.find((c) => c.mes === mes && c.userId === eu?.id);
  const antigas = (criticas ?? []).filter((c) => c !== destaMes);
  return (
    <Papel corte className="esc-bloco">
      <div className="esc-cab-linha">
        <span className="dp-rot">{t.criticaTit}</span>
        {!socio ? <span className="dp-st dp-st--falta">{t.paraSocios}</span> : null}
      </div>
      <p>{socio ? t.criticaTxt : t.criticaFechada}</p>
      {socio && criticas && !destaMes ? <FormCritica /> : null}
      {destaMes ? <CriticaLida c={destaMes} /> : null}
      {antigas.map((c) => <CriticaLida key={c.id} c={c} />)}
    </Papel>
  );
}

function FormCritica() {
  const { fonte, t, agir } = useEscola();
  const [drink, setDrink] = useState('');
  const [ficha, setFicha] = useState('');
  const mandar = async (e: FormEvent) => {
    e.preventDefault();
    await agir(() => fonte.mandarCritica(drink, ficha), t.enviadaTxt);
  };
  return (
    <form className="esc-form" onSubmit={mandar}>
      <label className="esc-campo">
        <span className="esc-rotulo">{t.drinkRot}</span>
        <input value={drink} maxLength={80} required onChange={(e) => setDrink(e.target.value)} />
      </label>
      <label className="esc-campo">
        <span className="esc-rotulo">{t.fichaRot}</span>
        <textarea value={ficha} maxLength={2000} required rows={3} onChange={(e) => setFicha(e.target.value)} />
      </label>
      <button type="submit" className="dp-btn dp-btn--cheio dp-btn--largo">{t.enviar}</button>
    </form>
  );
}

function CriticaLida({ c }: { c: { mes: string; drink: string; ficha: string; resposta: string | null } }) {
  const { t, lang } = useEscola();
  return (
    <div className="esc-critica">
      <p className="esc-cab-linha"><b>{c.drink}</b><span className="dp-nota">{mesAno(c.mes, lang)}</span></p>
      <p className="esc-ficha">{c.ficha}</p>
      {c.resposta ? (
        <p className="esc-resposta"><span className="dp-rot">{t.respostaDe}</span>{c.resposta}</p>
      ) : (
        <p className="esc-lido"><span className="dp-st dp-st--ok">{t.enviada}</span><span className="dp-nota">{t.semResposta}</span></p>
      )}
    </div>
  );
}

function CriticasParaResponder({ criticas }: { criticas: Critica[] | undefined }) {
  const { t, lang } = useEscola();
  const abertas = (criticas ?? []).filter((c) => !c.resposta);
  const feitas = (criticas ?? []).filter((c) => c.resposta).slice(0, 5);
  return (
    <Papel corte className="esc-bloco">
      <span className="dp-rot">{t.paraResponder}</span>
      {criticas && !abertas.length ? <p className="dp-nota">{t.nadaParaResponder}</p> : null}
      {abertas.map((c) => (
        <div key={c.id} className="esc-critica">
          <p className="esc-cab-linha"><b>{c.drink}</b><span className="dp-nota">{c.userNome} · {mesAno(c.mes, lang)}</span></p>
          <p className="esc-ficha">{c.ficha}</p>
          <ResponderCritica id={c.id} />
        </div>
      ))}
      {feitas.length ? <span className="dp-rot">{t.respondidas}</span> : null}
      {feitas.map((c) => (
        <div key={c.id} className="esc-critica">
          <p className="esc-cab-linha"><b>{c.drink}</b><span className="dp-nota">{c.userNome}</span></p>
          <p className="esc-resposta">{c.resposta}</p>
        </div>
      ))}
    </Papel>
  );
}

function ResponderCritica({ id }: { id: string }) {
  const { fonte, t, agir } = useEscola();
  const [txt, setTxt] = useState('');
  const mandar = async (e: FormEvent) => {
    e.preventDefault();
    if (await agir(() => fonte.responderCritica(id, txt), t.respondida)) setTxt('');
  };
  return (
    <form className="esc-form" onSubmit={mandar}>
      <label className="esc-campo">
        <span className="esc-rotulo">{t.respostaRot}</span>
        <textarea value={txt} rows={3} required onChange={(e) => setTxt(e.target.value)} />
      </label>
      <button type="submit" className="dp-btn dp-btn--peq">{t.mandarRespostaCritica}</button>
    </form>
  );
}

function Biblioteca() {
  const { fonte, eu, t, lang, agir } = useEscola();
  const materiais = useCarregar((f) => f.materiais());
  const aberta = eSocio(eu) || eInstrutor(eu);
  const doMes = mesDe(fonte.hoje());
  return (
    <div className="esc-lista">
      <h3 className="sub-titulo">{t.bibliotecaTit}</h3>
      <p className="dp-nota">{aberta ? t.bibliotecaNota : t.bibliotecaFechada}</p>
      {(materiais ?? []).map((m) => (
        <Papel key={m.id} className="esc-material">
          <span className="dp-rot">{t.tipoMaterial[m.tipo]} · {t.oficios[m.oficio] ?? m.oficio}</span>
          <span className="esc-mat-nome">{m.titulo[lang]}</span>
          <span className="item-porque">{m.resumo[lang]}</span>
          <span className="esc-pe">
            {m.livreEm === doMes ? <span className="dp-st dp-st--meio">{t.materialDoMes}</span> : null}
            {m.guardado ? <span className="dp-st dp-st--ok">{t.guardado}</span> : null}
            <button type="button" className="dp-btn dp-btn--peq" onClick={() => agir(() => fonte.guardar(m.id, !m.guardado))}>{m.guardado ? t.tirar : t.guardar}</button>
          </span>
        </Papel>
      ))}
    </div>
  );
}

function Eventos() {
  const { eu, t, lang } = useEscola();
  const eventos = useCarregar((f) => f.eventos());
  if (!eventos) return null;
  return (
    <div className="esc-lista">
      <h3 className="sub-titulo">{t.eventosTit}</h3>
      {!eventos.length && (eSocio(eu) || eInstrutor(eu)) ? <p className="dp-nota">{t.eventosVazio}</p> : null}
      {!(eSocio(eu) || eInstrutor(eu)) ? <p className="dp-nota">{t.eventosFechado}</p> : null}
      <ul className="agenda">
        {eventos.map((ev) => {
          const [dia, hora] = dataHora(ev.quando, lang).split(' · ');
          const [d, m] = dia.split('/');
          return (
            <li key={ev.id} className="dp-papel">
              <span className="ag-data"><span className="ag-k">{diaSemana(ev.quando, lang)}</span><b className="ag-d">{d}</b><span className="ag-k">{m}</span></span>
              <span className="ag-l"><span className="ag-t">{ev.titulo[lang]}</span><span className="ag-s">{t.tipoEvento[ev.tipo]} · {hora} · {ev.soSocios ? t.paraSocios : t.abertaATodos}</span></span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
