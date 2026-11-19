/* @ds-bundle: {"format":4,"namespace":"Dropp","components":[{"name":"Botao"},{"name":"Selecao"},{"name":"Selo"},{"name":"Abas"},{"name":"Navegacao"},{"name":"Aviso"},{"name":"Papel"},{"name":"ModoBalcao"},{"name":"Etiqueta"},{"name":"Carimbo"},{"name":"Rotulo"},{"name":"Recado"},{"name":"Ficha"},{"name":"ReguaLote"},{"name":"ReguaLeitura"},{"name":"Formula"}]} */
(function () {
  var R = window.React;
  var h = R.createElement;

  function cx() {
    var out = [];
    for (var i = 0; i < arguments.length; i++) if (arguments[i]) out.push(arguments[i]);
    return out.join(' ');
  }

  var PETALAS = [
    ['M50 8 C50 8 36 28 32 46 C37 40 45 36 50 36 C55 36 63 40 68 46 C64 28 50 8 50 8 Z', '#FACC15'],
    ['M32 46 C24 57 20 68 22 79 C25 80 29 80 34 78 C31 66 33 55 42 46 C38 45 35 45 32 46 Z', '#10B981'],
    ['M22 79 C24 93 35 106 50 108 C46 98 46 88 50 78 C39 77 31 82 22 79 Z', '#06B6D4'],
    ['M68 46 C76 57 80 68 78 79 C75 80 71 80 66 78 C69 66 67 55 58 46 C62 45 65 45 68 46 Z', '#F97316'],
    ['M78 79 C76 93 65 106 50 108 C54 98 54 88 50 78 C61 77 69 82 78 79 Z', '#EF4444'],
    ['M50 38 C42 45 38 56 39 68 C40 82 48 94 50 96 C52 94 60 82 61 68 C62 56 58 45 50 38 Z', '#D946EF'],
    ['M50 78 C44 86 44 95 50 106 C56 95 56 86 50 78 Z', '#8B5CF6']
  ];

  function Gota(p) {
    var props = { viewBox: p.viewBox || '0 0 100 120', className: p.className, 'aria-hidden': p.label ? undefined : 'true', role: p.label ? 'img' : undefined, 'aria-label': p.label };
    if (p.contorno) {
      return h('svg', props, h('g', { className: 'dp-traco' }, PETALAS.map(function (x, i) { return h('path', { key: i, d: x[0] }); })));
    }
    return h('svg', props, PETALAS.map(function (x, i) { return h('path', { key: i, d: x[0], fill: x[1] }); }));
  }

  /* Ações */
  function Botao(p) {
    var v = p.variante || 'vazado';
    return h('button', {
      type: p.type || 'button', disabled: p.disabled, onClick: p.onClick,
      className: cx('dp-btn', v === 'cheio' && 'dp-btn--cheio', p.largo && 'dp-btn--largo', p.peq && 'dp-btn--peq', p.className)
    }, p.children);
  }

  function Selecao(p) {
    var opcoes = p.opcoes || [];
    if (p.tipo === 'chip') {
      return h('div', { className: 'dp-chips', role: 'group', 'aria-label': p.rotulo },
        opcoes.map(function (o) {
          return h('button', { key: o.valor, type: 'button', className: 'dp-chip', 'aria-pressed': o.valor === p.valor ? 'true' : 'false', onClick: function () { p.onChange && p.onChange(o.valor); } },
            o.n != null ? h('span', { className: 'dp-chip-n' }, '(' + o.n + ')') : null, o.rotulo);
        }));
    }
    return h('div', { className: cx('dp-seg-row', opcoes.length === 4 && 'dp-seg-row--quatro'), role: 'group', 'aria-label': p.rotulo },
      opcoes.map(function (o) {
        return h('button', { key: o.valor, type: 'button', className: 'dp-seg', 'aria-pressed': o.valor === p.valor ? 'true' : 'false', onClick: function () { p.onChange && p.onChange(o.valor); } },
          h('span', null, o.rotulo), o.nota != null ? h('small', null, o.nota) : null);
      }));
  }

  /* Estado */
  function Selo(p) {
    return h('span', { className: cx('dp-st', 'dp-st--' + (p.estado || 'ok')) }, p.children);
  }

  function Aviso(p) {
    return h('div', { className: 'dp-aviso', role: 'status' },
      h('span', { className: 'dp-aviso-txt' }, p.children),
      p.onFechar ? h('button', { type: 'button', className: 'dp-aviso-fechar', onClick: p.onFechar }, p.fechar || 'Fechar') : null);
  }

  /* Navegação */
  function Abas(p) {
    if (p.titulo) {
      return h('div', { className: 'dp-voltar-bar' },
        h('button', { type: 'button', className: 'dp-voltar', onClick: p.onVoltar }, p.voltar || '← Voltar'),
        h('span', { className: 'dp-voltar-tit' }, p.titulo));
    }
    return h('div', { className: 'dp-abas' }, (p.abas || []).map(function (a) {
      return h('button', { key: a, type: 'button', className: 'dp-aba', 'aria-pressed': a === p.ativa ? 'true' : 'false', onClick: function () { p.onChange && p.onChange(a); } }, a);
    }));
  }

  var ICONES = {
    turno: [h('circle', { key: 1, cx: 12, cy: 12, r: 8.5 }), h('path', { key: 2, d: 'M12 7.5V12l3 2' })],
    caderno: [h('rect', { key: 1, x: 5, y: 3.5, width: 14, height: 17 }), h('path', { key: 2, d: 'M8.5 8h7M8.5 12h7M8.5 16h4' })],
    atlas: [h('path', { key: 1, d: 'M4 5.5h6a2 2 0 0 1 2 2V20a2 2 0 0 0-2-2H4zM20 5.5h-6a2 2 0 0 0-2 2V20a2 2 0 0 1 2-2h6z' })]
  };
  var AREAS = [['turno', 'Turno'], ['caderno', 'Caderno'], ['passaporte', 'Passaporte'], ['atlas', 'Atlas']];

  function Navegacao(p) {
    var nomes = p.nomes || {};
    return h('nav', { className: 'dp-nav', 'aria-label': p.rotulo || 'Áreas do DROPP' }, AREAS.map(function (a) {
      var icone = a[0] === 'passaporte'
        ? h(Gota, {})
        : h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', 'aria-hidden': 'true' }, ICONES[a[0]]);
      return h('button', { key: a[0], type: 'button', className: 'dp-nav-item', 'aria-current': a[0] === p.atual ? 'page' : undefined, onClick: function () { p.onChange && p.onChange(a[0]); } }, icone, nomes[a[0]] || a[1]);
    }));
  }

  /* Superfícies */
  function Papel(p) {
    return h('div', { className: cx('dp-papel', p.corte && 'dp-papel--corte', p.className) }, p.children);
  }

  function ModoBalcao(p) {
    return h('div', { className: cx('dp-tela', p.className), 'data-theme': p.tema || 'balcao' }, p.children);
  }

  /* Peças do ofício */
  function Etiqueta(p) {
    var qr = p.qr;
    return h('div', { className: 'dp-etiqueta' },
      h('div', { className: 'dp-etq-cab' }, h('span', { className: 'dp-etq-casa' }, p.casa), h('span', { className: 'dp-etq-cidade' }, p.cidade)),
      h('span', { className: 'dp-etq-nome' }, p.nome),
      h('span', { className: 'dp-etq-id' }, p.lote),
      h('div', { className: 'dp-etq-hr' }),
      h('div', { className: 'dp-etq-datas' },
        h('div', null, h('span', { className: 'dp-etq-k' }, p.rotuloFeito || 'Feito'), h('span', { className: 'dp-etq-v' }, p.feito), h('span', { className: 'dp-etq-s' }, p.por)),
        h('div', null, h('span', { className: 'dp-etq-k' }, p.rotuloVence || 'Vence'), h('span', { className: 'dp-etq-v' }, p.vence), h('span', { className: 'dp-etq-s' }, p.conservar))),
      h('div', { className: 'dp-etq-hr' }),
      h('p', { className: 'dp-etq-ing' }, p.ingredientes),
      h('p', { className: 'dp-etq-al' }, p.alergenos),
      h('div', { className: 'dp-etq-pe' },
        qr ? h('svg', { className: 'dp-etq-qr', viewBox: '0 0 ' + qr.lado + ' ' + qr.lado, shapeRendering: 'crispEdges', role: 'img', 'aria-label': 'QR do lote' },
          h('rect', { className: 'dp-qr-fundo', width: qr.lado, height: qr.lado }), h('path', { className: 'dp-qr-mod', d: qr.path })) : null,
        h('div', { className: 'dp-etq-pe-dir' },
          h('span', { className: 'dp-etq-ler' }, p.instrucao || 'Leia no DROPP para dar baixa, registrar perda ou reimprimir'),
          h('span', { className: 'dp-etq-marca' }, h(Gota, { contorno: true }), 'DROPP · Liquid Experience'))));
  }

  var FORMA = { casa: 'redondo', arquivo: 'redondo', carta: 'oval', mentor: 'oval' };
  function Carimbo(p) {
    var tipo = p.tipo || 'jornada';
    var forma = p.forma || FORMA[tipo];
    return h('span', {
      className: cx('dp-carimbo', 'dp-cor-' + tipo, forma && 'dp-carimbo--' + forma, p.pendente && 'dp-carimbo--pendente'),
      style: p.rotacao ? { transform: 'rotate(' + p.rotacao + 'deg)' } : undefined
    }, h('span', null, p.rotulo || tipo), h('span', { className: 'dp-carimbo-tit' }, p.titulo), p.linha ? h('span', { className: 'dp-carimbo-linha' }, p.linha) : null);
  }

  function Rotulo(p) {
    return h('div', { className: 'dp-rotulo' },
      h('div', { className: 'dp-rot-arco' }, h('span', { className: 'dp-rot-dropp' }, h(Gota, {}), 'DROPP'), h('span', { className: 'dp-rot-esp' }, 'Liquid experience')),
      h('div', { className: 'dp-rot-miolo' },
        h('p', { className: 'dp-rot-secao' }, h('span', null, p.secao || 'Passaporte do ofício')),
        h(Gota, { className: 'dp-rot-gota', viewBox: '16 4 68 108', label: 'A gota de ' + p.nome }),
        h('p', { className: 'dp-rot-nome' }, p.nome),
        h('p', { className: 'dp-rot-cargo' }, p.cargo),
        h('div', { className: 'dp-rot-cantos' }, (p.cantos || []).map(function (c) {
          return h('div', { key: c.r, className: 'dp-canto' }, h('span', { className: 'dp-canto-n' }, c.n), h('span', { className: 'dp-canto-r' }, c.r));
        })),
        h('p', { className: 'dp-fita' }, 'Meet · ', h('span', { className: 'dp-fita-y' }, 'Share'), ' · Enjoy'),
        h('p', { className: 'dp-rot-pe' }, h('span', null, p.link), h('span', null, 'el bar primero'))));
  }

  var CADEIRA = { operacao: ['dp-cad-op', 'Operação'], financeiro: ['dp-cad-fin', 'Financeiro'], marketing: ['dp-cad-mkt', 'Marketing'] };
  function Recado(p) {
    var c = CADEIRA[p.cadeira || 'operacao'];
    return h('div', { className: 'dp-papel dp-papel--corte dp-recado' },
      h('div', { className: 'dp-recado-cab' }, h('span', { className: 'dp-cadeira' }, h('span', { className: 'dp-cadeira-ponto ' + c[0] }), p.nomeCadeira || c[1]), h('span', { className: 'dp-nivel' }, p.nivel)),
      h('p', { className: 'dp-recado-tit' }, p.titulo),
      p.linhas ? h('dl', { className: 'dp-linhas' }, p.linhas.map(function (l) { return h('div', { key: l.k }, h('dt', null, l.k), h('dd', null, l.v)); })) : null,
      p.fonte ? h('p', { className: 'dp-fonte' }, p.fonte) : null,
      p.acoes ? h('div', { className: 'dp-linha-btns' }, p.acoes.map(function (a, i) { return h(Botao, { key: a, variante: i === 0 ? 'cheio' : 'vazado' }, a); })) : null);
  }

  function Ficha(p) {
    return h('div', { className: 'dp-papel dp-ficha' },
      h('span', { className: 'dp-ficha-l' }, h('span', { className: 'dp-ficha-nome' }, p.nome), h('span', { className: 'dp-ficha-serv' }, p.servico)),
      h(Selo, { estado: p.estado || 'ok' }, p.custo));
  }

  /* Medidas */
  function ReguaLote(p) {
    var tinta = 'var(--tinta-' + (p.tinta || 'verde') + ')';
    var pct = Math.max(0, Math.min(100, p.pct || 0)) + '%';
    return h('div', { className: 'dp-papel dp-papel--corte' },
      h('span', { className: 'dp-rot' }, p.rotulo),
      h('span', { className: 'dp-lote-tempo', style: { color: tinta } }, p.tempo),
      h('span', { className: 'dp-lote-nome' }, p.nome),
      h('span', { className: 'dp-regua-lote', role: 'img', 'aria-label': p.descricao },
        h('span', { className: 'dp-rl-trilho' }, h('span', { className: 'dp-rl-enchido', style: { width: pct, background: tinta } })),
        h('span', { className: 'dp-rl-hoje', style: { left: pct } })),
      h('span', { className: 'dp-lote-datas' }, h('span', null, p.feito), h('span', null, p.vence)),
      p.tec ? h('span', { className: 'dp-lote-tec' }, p.tec) : null);
  }

  function ReguaLeitura(p) {
    var passos = p.passos || [];
    var atual = p.atual || 0;
    var n = passos.length || 1;
    var cur = passos[atual] || {};
    var feito = n > 1 ? (atual / (n - 1)) * (100 - 100 / n) : 0;
    return h('div', { className: 'dp-regua-leitura' },
      h('div', { className: 'dp-rl-cab' },
        h('div', { className: 'dp-rl-l' }, h('b', { className: 'dp-rl-med' }, cur.medida), h('span', { className: 'dp-rl-uni' }, cur.uni)),
        h('span', { className: 'dp-rl-passo' }, (p.passo || 'passo') + ' ' + (atual + 1) + ' ' + (p.de || 'de') + ' ' + n)),
      h('div', { className: 'dp-rl-ticks', style: { gridTemplateColumns: 'repeat(' + n + ', minmax(0, 1fr))' } },
        h('span', { className: 'dp-rl-linha', style: { left: 50 / n + '%', right: 50 / n + '%' } }),
        h('span', { className: 'dp-rl-feito', style: { left: 50 / n + '%', width: feito + '%' } }),
        passos.map(function (s, i) {
          return h('button', { key: i, type: 'button', className: 'dp-rl-tick', 'data-feito': i < atual ? 'true' : 'false', 'aria-current': i === atual ? 'true' : undefined, 'aria-label': 'Passo ' + (i + 1) + ': ' + s.medida, onClick: function () { p.onPasso && p.onPasso(i); } },
            h('span', { className: 'dp-rl-dot' }), h('span', { className: 'dp-rl-tk' }, s.medida));
        })));
  }

  function Formula(p) {
    return h('div', { className: 'dp-papel' },
      h('div', { className: 'dp-resultado' }, h('span', { className: 'dp-rot' }, p.rotulo), h('span', { className: 'dp-resultado-v' }, p.valor)),
      h('p', { className: 'dp-formula' }, (p.linhas || []).join('\n')));
  }

  window.Dropp = {
    Botao: Botao, Selecao: Selecao, Selo: Selo, Abas: Abas, Navegacao: Navegacao, Aviso: Aviso,
    Papel: Papel, ModoBalcao: ModoBalcao, Etiqueta: Etiqueta, Carimbo: Carimbo, Rotulo: Rotulo,
    Recado: Recado, Ficha: Ficha, ReguaLote: ReguaLote, ReguaLeitura: ReguaLeitura, Formula: Formula,
    Gota: Gota
  };
})();
