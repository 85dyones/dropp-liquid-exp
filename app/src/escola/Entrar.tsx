// O formulário de entrada: e-mail, depois o código do e-mail (ou o link). Usado na página de entrada do app.
import { useState, type FormEvent } from 'react';
import { LOGIN_POR_CODIGO } from './conexao';
import { useEscola } from './contexto';

export function FormEntrar() {
  const { fonte, t, lang, avisar, agir } = useEscola();
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [estado, setEstado] = useState<'livre' | 'mandando' | 'mandado' | 'confirmando'>('livre');

  const mandar = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setEstado('mandando');
    try { await fonte.entrar(email.trim(), lang); setEstado('mandado'); }
    catch { setEstado('livre'); avisar(t.erros.falhou); }
  };
  const confirmar = async (e: FormEvent) => {
    e.preventDefault();
    setEstado('confirmando');
    // Deu certo: a sessão muda e a página de entrada dá lugar ao app.
    if (!(await agir(() => fonte.confirmarCodigo(email.trim(), codigo)))) setEstado('mandado');
  };

  if (estado === 'mandado' || estado === 'confirmando') {
    return (
      <div className="esc-form">
        <p className="esc-lido" role="status"><span className="dp-st dp-st--ok">ok</span><span>{LOGIN_POR_CODIGO ? t.codigoMandado(email.trim()) : t.linkMandado(email.trim())}</span></p>
        {LOGIN_POR_CODIGO ? (
          <form className="esc-form" onSubmit={confirmar}>
            <label className="esc-campo">
              <span className="esc-rotulo">{t.codigoRot}</span>
              <input value={codigo} inputMode="numeric" autoComplete="one-time-code" pattern="[0-9 ]{6,10}" maxLength={10} required autoFocus onChange={(e) => setCodigo(e.target.value)} />
            </label>
            <button type="submit" className="dp-btn dp-btn--cheio dp-btn--largo" disabled={estado === 'confirmando'}>{estado === 'confirmando' ? t.confirmando : t.confirmar}</button>
          </form>
        ) : null}
        <button type="button" className="esc-link" onClick={() => { setEstado('livre'); setCodigo(''); }}>{t.outroEmail}</button>
      </div>
    );
  }

  return (
    <form className="esc-form" onSubmit={mandar}>
      <label className="esc-campo">
        <span className="esc-rotulo">{t.emailRot}</span>
        <input type="email" autoComplete="email" inputMode="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <button type="submit" className="dp-btn dp-btn--cheio dp-btn--largo" disabled={estado === 'mandando'}>{estado === 'mandando' ? t.mandando : t.entrarBtn}</button>
    </form>
  );
}
