// Controle mínimo do Edge pelo protocolo de depuração (CDP), sem dependências.
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const EDGE = process.env.EDGE || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

export async function abrirEdge(porta = 9333) {
  const perfil = mkdtempSync(join(tmpdir(), 'dropp-edge-'));
  const proc = spawn(EDGE, ['--headless=new', `--remote-debugging-port=${porta}`, `--user-data-dir=${perfil}`,
    '--hide-scrollbars', '--autoplay-policy=no-user-gesture-required', '--allow-file-access-from-files', 'about:blank'], { stdio: 'ignore' });
  for (let i = 0; i < 50; i++) {
    try { const r = await fetch(`http://127.0.0.1:${porta}/json/version`); if (r.ok) break; } catch { /* ainda subindo */ }
    await espera(200);
  }
  const fechar = async () => { proc.kill(); await espera(500); try { rmSync(perfil, { recursive: true, force: true }); } catch { /* arquivo preso */ } };
  return { porta, fechar };
}

export async function novaAba(porta) {
  const alvo = await (await fetch(`http://127.0.0.1:${porta}/json/new?about:blank`, { method: 'PUT' })).json();
  const ws = new WebSocket(alvo.webSocketDebuggerUrl);
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
  let id = 0;
  const pendentes = new Map();
  const ouvintes = new Map();
  ws.onmessage = (m) => {
    const d = JSON.parse(m.data);
    if (d.id && pendentes.has(d.id)) {
      const { ok, falha } = pendentes.get(d.id); pendentes.delete(d.id);
      d.error ? falha(new Error(`${d.error.message} ${d.error.data || ''}`)) : ok(d.result);
    } else if (d.method && ouvintes.has(d.method)) ouvintes.get(d.method).splice(0).forEach((f) => f(d.params));
  };
  const send = (method, params = {}) => new Promise((ok, falha) => { id += 1; pendentes.set(id, { ok, falha }); ws.send(JSON.stringify({ id, method, params })); });
  const evento = (method) => new Promise((r) => { if (!ouvintes.has(method)) ouvintes.set(method, []); ouvintes.get(method).push(r); });
  await send('Page.enable');
  await send('Runtime.enable');
  const avaliar = async (expr) => {
    const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
    return r.result.value;
  };
  const ir = async (url, extra = 1200) => { const carregou = evento('Page.loadEventFired'); await send('Page.navigate', { url }); await carregou; await espera(extra); };
  return { send, avaliar, ir, fechar: () => ws.close() };
}

export { espera };
