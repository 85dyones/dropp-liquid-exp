// Motor dos protótipos: lê um Main.dc.html do editor de canvas e monta a tela em React.
// O formato: um <x-dc> com <helmet> (fontes e CSS), o template com {{caminhos}},
// <sc-if value>, <sc-for list as>, eventos onX="{{função}}" e ref="{{função}}",
// e um <script type="text/x-dc"> com a classe Component extends DCLogic.
import { Component as ReactComponent, Fragment, createElement, type ReactNode } from 'react';

type Vals = Record<string, unknown>;
type Escopo = Record<string, unknown>;

export class DCLogic {
  props: Record<string, unknown>;
  state: Record<string, unknown> | null = null;
  __agendar?: () => void;
  constructor(props: Record<string, unknown>) {
    this.props = props || {};
  }
  setState(parcial: Record<string, unknown> | ((s: unknown, p: unknown) => Record<string, unknown>)) {
    const novo = typeof parcial === 'function' ? parcial(this.state, this.props) : parcial;
    this.state = Object.assign({}, this.state || {}, novo);
    this.__agendar?.();
  }
}

type Logica = DCLogic & {
  renderVals: () => Vals;
  componentDidMount?: () => void;
  componentDidUpdate?: () => void;
  componentWillUnmount?: () => void;
};
type ClasseLogica = new (props: Record<string, unknown>) => Logica;

export type Prototipo = {
  helmet: Element[];
  template: ChildNode[];
  Logica: ClasseLogica;
  padroes: Record<string, unknown>;
};

export function lerPrototipo(html: string): Prototipo {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const xdc = doc.querySelector('x-dc');
  if (!xdc) throw new Error('Arquivo sem <x-dc>.');
  const helmetEl = xdc.querySelector('helmet');
  const helmet = helmetEl ? Array.from(helmetEl.children) : [];
  helmetEl?.remove();
  const script = doc.querySelector('script[type="text/x-dc"]');
  if (!script) throw new Error('Arquivo sem a lógica (script text/x-dc).');
  const def = JSON.parse(script.getAttribute('data-props') || '{}') as Record<string, { default?: unknown }>;
  const padroes: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(def)) if (!k.startsWith('$') && v && 'default' in v) padroes[k] = v.default;
  // eslint-disable-next-line no-new-func
  const Logica = new Function('DCLogic', `${script.textContent}\n;return Component;`)(DCLogic) as ClasseLogica;
  return { helmet, template: Array.from(xdc.childNodes), Logica, padroes };
}

// ——— valores ———
const RE = /\{\{\s*([^}]+?)\s*\}\}/g;
const SO = /^\s*\{\{\s*([^}]+?)\s*\}\}\s*$/;

function resolver(caminho: string, vals: Vals, escopo: Escopo): unknown {
  const c = caminho.trim();
  if (c === 'true') return true;
  if (c === 'false') return false;
  if (/^-?\d+(\.\d+)?$/.test(c)) return Number(c);
  const partes = c.split('.');
  let atual: unknown = partes[0] in escopo ? escopo[partes[0]] : vals[partes[0]];
  for (const k of partes.slice(1)) {
    if (atual === null || atual === undefined) return undefined;
    atual = (atual as Record<string, unknown>)[k];
  }
  return atual;
}

const comoTexto = (v: unknown) => (v === null || v === undefined || typeof v === 'boolean' ? '' : String(v));

function valor(txt: string, vals: Vals, escopo: Escopo): unknown {
  const so = txt.match(SO);
  if (so) return resolver(so[1], vals, escopo);
  return txt.replace(RE, (_, p: string) => comoTexto(resolver(p, vals, escopo)));
}

// ——— atributos ———
const EVENTOS = ['onClick', 'onChange', 'onInput', 'onKeyDown', 'onKeyUp', 'onFocus', 'onBlur', 'onScroll', 'onSubmit',
  'onPointerDown', 'onPointerUp', 'onMouseDown', 'onMouseUp', 'onMouseEnter', 'onMouseLeave', 'onTouchStart', 'onTouchEnd',
  'onAnimationEnd', 'onTransitionEnd', 'onDoubleClick', 'onContextMenu', 'onWheel'];
const EVENTO = Object.fromEntries(EVENTOS.map((e) => [e.toLowerCase(), e]));
const NOMES: Record<string, string> = {
  class: 'className', for: 'htmlFor', tabindex: 'tabIndex', readonly: 'readOnly', maxlength: 'maxLength',
  minlength: 'minLength', colspan: 'colSpan', rowspan: 'rowSpan', autocomplete: 'autoComplete', autofocus: 'autoFocus',
  contenteditable: 'contentEditable', crossorigin: 'crossOrigin', inputmode: 'inputMode', enterkeyhint: 'enterKeyHint',
  spellcheck: 'spellCheck', srcset: 'srcSet', referrerpolicy: 'referrerPolicy', datetime: 'dateTime',
  'xlink:href': 'xlinkHref', 'xml:space': 'xmlSpace', 'xlink:title': 'xlinkTitle'
};
const BOOLEANOS = new Set(['disabled', 'hidden', 'checked', 'selected', 'required', 'multiple', 'open', 'readOnly', 'autoFocus', 'inert', 'novalidate']);
const VAZIOS = new Set(['input', 'br', 'img', 'hr', 'meta', 'link', 'source', 'area', 'col', 'wbr']);
const SEM_ESPACO = new Set(['table', 'thead', 'tbody', 'tfoot', 'tr', 'colgroup', 'select']);

const camelo = (s: string) => s.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());

function estilo(txt: string): Record<string, string> {
  const out: Record<string, string> = {};
  let nivel = 0;
  let atual = '';
  const partes: string[] = [];
  for (const ch of txt) {
    if (ch === '(') nivel++;
    if (ch === ')') nivel--;
    if (ch === ';' && nivel === 0) { partes.push(atual); atual = ''; } else atual += ch;
  }
  partes.push(atual);
  for (const p of partes) {
    const i = p.indexOf(':');
    if (i < 0) continue;
    const prop = p.slice(0, i).trim();
    const val = p.slice(i + 1).trim();
    if (!prop || val === '') continue;
    const chave = prop.startsWith('--') ? prop : prop.startsWith('-') ? camelo(prop.slice(1)).replace(/^./, (c) => c.toUpperCase()) : camelo(prop);
    out[chave] = val;
  }
  return out;
}

function atributos(el: Element, vals: Vals, escopo: Escopo, chave: string | number) {
  const svg = el.namespaceURI === 'http://www.w3.org/2000/svg';
  const props: Record<string, unknown> = { key: chave };
  const tag = el.localName;
  let temOnChange = false;
  for (const a of Array.from(el.attributes)) {
    if (a.name.startsWith('hint-')) continue;
    const bruto = a.value;
    let v: unknown = bruto.includes('{{') ? valor(bruto, vals, escopo) : bruto;
    let nome = a.name;
    if (nome.startsWith('on')) {
      const ev = EVENTO[nome];
      if (ev && typeof v === 'function') { props[ev] = v; if (ev === 'onChange') temOnChange = true; }
      continue;
    }
    if (nome === 'ref') { if (typeof v === 'function') props.ref = v; continue; }
    if (nome === 'style') { props.style = typeof v === 'string' ? estilo(v) : v; continue; }
    nome = NOMES[nome] || nome;
    if (svg && nome.includes('-') && !nome.startsWith('aria-') && !nome.startsWith('data-')) nome = camelo(nome);
    if (nome === 'checked' && tag === 'input') { props.checked = bruto === '' ? true : Boolean(v) && v !== 'false'; continue; }
    if (BOOLEANOS.has(nome)) {
      if (bruto === '' && !bruto.includes('{{')) v = true;
      if (v === false || v === 'false' || v === null || v === undefined) continue;
      v = Boolean(v);
    }
    if ((nome === 'value' || nome === 'checked') && (tag === 'input' || tag === 'textarea' || tag === 'select')) {
      if (nome === 'value' && (v === null || v === undefined)) v = '';
    }
    props[nome] = v;
  }
  if ((tag === 'input' || tag === 'textarea' || tag === 'select') && !temOnChange) {
    if ('value' in props) { props.defaultValue = props.value; delete props.value; }
    if ('checked' in props) { props.defaultChecked = props.checked; delete props.checked; }
  }
  return props;
}

// ——— árvore ———
function filhos(nos: ArrayLike<ChildNode>, vals: Vals, escopo: Escopo, pai: string): ReactNode[] {
  const out: ReactNode[] = [];
  Array.from(nos).forEach((no, i) => {
    const r = montarNo(no, vals, escopo, i, pai);
    if (r !== null && r !== undefined) out.push(r);
  });
  return out;
}

function montarNo(no: ChildNode, vals: Vals, escopo: Escopo, chave: number, pai: string): ReactNode {
  if (no.nodeType === Node.TEXT_NODE) {
    const txt = no.textContent || '';
    if (!txt.trim()) return SEM_ESPACO.has(pai) ? null : txt;
    if (!txt.includes('{{')) return txt;
    const partes: ReactNode[] = [];
    let ultimo = 0;
    let n = 0;
    txt.replace(RE, (m: string, p: string, pos: number) => {
      if (pos > ultimo) partes.push(txt.slice(ultimo, pos));
      partes.push(createElement('span', { key: `v${n++}` }, comoTexto(resolver(p, vals, escopo))));
      ultimo = pos + m.length;
      return m;
    });
    if (ultimo < txt.length) partes.push(txt.slice(ultimo));
    return createElement(Fragment, { key: chave }, ...partes);
  }
  if (no.nodeType !== Node.ELEMENT_NODE) return null;
  const el = no as Element;
  const tag = el.localName;
  if (tag === 'script' || tag === 'helmet') return null;
  if (tag === 'sc-if') {
    const v = valor(el.getAttribute('value') || '', vals, escopo);
    return v ? createElement(Fragment, { key: chave }, ...filhos(el.childNodes, vals, escopo, pai)) : null;
  }
  if (tag === 'sc-for') {
    const lista = valor(el.getAttribute('list') || '', vals, escopo);
    const como = el.getAttribute('as') || 'item';
    const itens = Array.isArray(lista) ? lista : [];
    return createElement(Fragment, { key: chave },
      ...itens.map((item, i) => createElement(Fragment, { key: i }, ...filhos(el.childNodes, vals, { ...escopo, [como]: item }, pai))));
  }
  const props = atributos(el, vals, escopo, chave);
  if (VAZIOS.has(tag)) return createElement(tag, props);
  if (tag === 'textarea') {
    if (!('value' in props) && !('defaultValue' in props)) props.defaultValue = el.textContent || '';
    return createElement(tag, props);
  }
  return createElement(tag, props, ...filhos(el.childNodes, vals, escopo, tag));
}

// ——— componente ———
type HostProps = { prototipo: Prototipo; props: Record<string, unknown>; aoErro?: (e: unknown) => void };

export class Host extends ReactComponent<HostProps> {
  logica: Logica;
  constructor(p: HostProps) {
    super(p);
    this.logica = new p.prototipo.Logica({ ...p.props });
    this.logica.__agendar = () => this.forceUpdate();
  }
  componentDidMount() { this.logica.componentDidMount?.(); }
  componentDidUpdate() { this.logica.componentDidUpdate?.(); }
  componentWillUnmount() { this.logica.__agendar = undefined; this.logica.componentWillUnmount?.(); }
  render() {
    this.logica.props = { ...this.props.props };
    const vals = this.logica.renderVals();
    return createElement(Fragment, null, ...filhos(this.props.prototipo.template, vals, {}, 'body'));
  }
}

export class Limite extends ReactComponent<{ children: ReactNode }, { erro: string | null }> {
  state = { erro: null as string | null };
  static getDerivedStateFromError(e: unknown) { return { erro: e instanceof Error ? e.message : String(e) }; }
  render() {
    if (this.state.erro) return createElement('p', { className: 'motor-erro', role: 'alert' }, `O protótipo parou: ${this.state.erro}`);
    return this.props.children;
  }
}
