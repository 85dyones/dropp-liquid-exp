// A página de entrada do app: o login vale para o DROPP inteiro, mesmo no plano grátis.
// "Ver demonstração" abre o app com os dados fictícios do Teo, sem gravar nada.
import { Gota, Papel } from '../ds/componentes';
import { FormEntrar } from '../escola/Entrar';
import { useEscola } from '../escola/contexto';
import type { Lang } from '../textos';

export function Entrada({ lang, setLang, idiomaRot, verDemo }: { lang: Lang; setLang: (l: Lang) => void; idiomaRot: string; verDemo: () => void }) {
  const { t } = useEscola();
  const e = t.entrada;
  return (
    <div className="entrada">
      <header className="entrada-topo">
        <p className="entrada-marca">
          <Gota className="entrada-gota" />
          <span className="entrada-nomes"><span className="entrada-nome">DROPP</span><span className="entrada-esp">Liquid Experience</span></span>
        </p>
        <div className="idioma" role="group" aria-label={idiomaRot}>
          {(['pt', 'es'] as Lang[]).map((l) => (
            <button key={l} type="button" aria-pressed={lang === l} onClick={() => setLang(l)}>{l.toUpperCase()}</button>
          ))}
        </div>
      </header>

      <main className="entrada-corpo">
        <h1 className="entrada-titulo">{e.titulo}</h1>
        <p className="entrada-texto">{e.texto}</p>
        <Papel className="entrada-form"><FormEntrar /></Papel>
        <p className="dp-nota">{e.teste}</p>
        <p className="entrada-demo">
          <button type="button" className="link-acao" onClick={verDemo}>{e.demo}</button>
          <span className="dp-nota">{e.demoNota}</span>
        </p>
      </main>
    </div>
  );
}
