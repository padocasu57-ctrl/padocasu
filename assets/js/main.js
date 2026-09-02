/* Padócasu — interações do site */
(function () {
  'use strict';

  /* =========================================================
     CONFIGURAÇÃO

     ANIMAR_SEMPRE
       true  → o site anima e rola suave sempre, mesmo que o
               computador do visitante esteja com a opção
               "reduzir movimento" ligada. (padrão)
       false → respeita a configuração do sistema: quem tem
               "reduzir movimento" ligado vê o site parado.

     DURACAO_ROLAGEM
       tempo em milissegundos da rolagem suave ao clicar
       num link do menu. Menor = mais rápido.
     ========================================================= */
  var ANIMAR_SEMPRE = true;
  var DURACAO_ROLAGEM = 900;

  var prefereMenosMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var reduce = prefereMenosMovimento && !ANIMAR_SEMPRE;
  if (ANIMAR_SEMPRE) document.documentElement.classList.add('anima-sempre');

  var WA = 'https://wa.me/5511992169708?text=';

  /* ---------- rolagem suave (feita aqui, não no CSS) ----------
     O CSS não controla mais a rolagem: navegadores desligam
     "scroll-behavior: smooth" quando o sistema está em modo
     "reduzir movimento", e era isso que fazia a página pular. */
  var alturaNav = 74;

  function posicaoDe(alvo) {
    var topo = alvo.getBoundingClientRect().top + window.pageYOffset - alturaNav;
    var maximo = document.documentElement.scrollHeight - window.innerHeight;
    return Math.max(0, Math.min(topo, maximo));
  }

  var animacaoAtiva = null;
  var animacaoAtivaId = 0;

  function rolarAte(destino) {
    if (reduce) { window.scrollTo(0, destino); return; }

    var inicio = window.pageYOffset;
    var distancia = destino - inicio;
    if (Math.abs(distancia) < 2) return;

    var duracao = Math.min(DURACAO_ROLAGEM, 320 + Math.abs(distancia) * 0.28);
    var t0 = null;
    var id = ++animacaoAtivaId;
    animacaoAtiva = id;

    function passo(t) {
      if (animacaoAtiva !== id) return;          // outra rolagem assumiu
      if (t0 === null) t0 = t;
      var p = Math.min(1, (t - t0) / duracao);
      // easeInOutCubic — sai devagar, ganha velocidade, freia no fim
      var e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      window.scrollTo(0, inicio + distancia * e);
      if (p < 1) requestAnimationFrame(passo);
      else animacaoAtiva = null;
    }
    requestAnimationFrame(passo);
  }

  // cancela a animação se a pessoa rolar/tocar no meio do caminho
  ['wheel', 'touchstart', 'keydown'].forEach(function (ev) {
    window.addEventListener(ev, function () { animacaoAtiva = null; }, { passive: true });
  });

  document.addEventListener('click', function (e) {
    var link = e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!link) return;
    var href = link.getAttribute('href');
    if (!href || href === '#') return;
    var alvo = document.getElementById(href.slice(1));
    if (!alvo) return;
    e.preventDefault();
    rolarAte(posicaoDe(alvo));
    history.replaceState(null, '', href);
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
  });

  /* ---------- ano no rodapé ---------- */
  var ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();

  /* ---------- links de WhatsApp por item ----------
     A mensagem já vai escrita e termina com pergunta, para a
     conversa começar andando em vez de morrer num "olá". */
  document.querySelectorAll('.item__wa').forEach(function (a) {
    var item = a.getAttribute('data-item') || '';
    a.href = WA + encodeURIComponent(
      'Oi, Su! Tudo bem? Vim pelo site da Padócasu e queria encomendar: ' + item +
      '. Como funciona o prazo e a entrega?');
    a.target = '_blank';
    a.rel = 'noopener';
  });

  /* ---------- marquee ---------- */
  var frases = [
    'Fermentação natural', 'Receitas de família', 'Ingredientes naturais',
    'Feito à mão', 'Sem conservantes'
  ];
  function montaMarquee(el, lista) {
    if (!el) return;
    var bloco = lista.map(function (f) {
      return '<span>' + f + '<span class="sparkle"><svg><use href="#i-sparkle"></use></svg></span></span>';
    }).join('');
    el.innerHTML = bloco + bloco; // duplicado p/ loop contínuo
  }
  montaMarquee(document.getElementById('mq1'), frases);
  montaMarquee(document.getElementById('mq2'), [
    'Pão', 'Torta cremosa', 'Pastinha', 'Cheesecake', 'Papo de anjo', 'Geleia', 'Granola', 'Bolo', 'Focaccia', 'Ciabatta'
  ]);

  /* ---------- faixa de variedade (logo abaixo da capa) ----------
     Para quem chega saber, em dois segundos, que não é só pão.
     Cada bolinha leva direto para a categoria no cardápio. */
  var variedade = [
    ['pao-redondo',    'Pães',         'a partir de R$ 24', '#c-paes',       'Pães redondos de fermentação natural numa gamela de madeira'],
    ['torta',          'Tortas',       'a partir de R$ 42', '#c-tortas',     'Torta cremosa dourada servida com salada'],
    ['homus',          'Pastinhas',    'a partir de R$ 20', '#c-pastinhas',  'Coalhada seca e homus servidos com pão'],
    ['cheesecake',     'Cheesecake',   'R$ 39',             '#c-cheesecake', 'Cheesecake coberto com geleia da casa'],
    ['papo-de-anjo',   'Papo de anjo', 'R$ 38',             '#c-papodeanjo', 'Papo de anjo em calda, em potes de vidro'],
    ['geleias',        'Geleias',      'R$ 28',             '#c-geleias',    'Potes de geleia caseira com uma tigelinha servida'],
    ['granola',        'Granola',      'R$ 28',             '#c-granola',    'Granola rica com castanhas e sementes'],
    ['bolo',           'Bolo',         'sob consulta',      '#c-bolo',       'Bolo com frutas cristalizadas e castanhas']
  ];
  var listaVar = document.getElementById('variedadeLista');
  if (listaVar) {
    listaVar.innerHTML = variedade.map(function (v) {
      return '<li><a href="' + v[3] + '">' +
             '<span class="variedade__disc"><img src="assets/img/' + v[0] + '.jpg" alt="' + v[4] + '" width="920" height="920" loading="lazy"></span>' +
             '<span class="variedade__nome">' + v[1] + '</span>' +
             '<span class="variedade__preco">' + v[2] + '</span>' +
             '</a></li>';
    }).join('');
  }

  /* ---------- rodízio de fotos da capa ---------- */
  var fotosCapa = document.querySelectorAll('#heroDisc .disc__foto');
  if (fotosCapa.length > 1 && !reduce) {
    var atual = 0;
    setInterval(function () {
      fotosCapa[atual].classList.remove('is-on');
      atual = (atual + 1) % fotosCapa.length;
      fotosCapa[atual].classList.add('is-on');
    }, 4200);
  }

  /* ---------- galeria circular (ambiente da casa) ---------- */
  var fotos = [
    ['su-cozinha', 'A Su na cozinha, entre os pães e as geleias do dia'],
    ['pao-trancado', 'Pães trançados recheados, recém-saídos do forno'],
    ['coalhada', 'Coalhada seca fresca, com hortelã e tomatinho'],
    ['mesa-farta', 'Mesa farta: focaccia, torta, geleias, homus e coalhada'],
    ['focaccia', 'Focaccia com tomate seco, azeitona e alecrim'],
    ['maos-pao', 'Coalhada passada na fatia de pão, na hora'],
    ['geleias2', 'Geleias da estação em potes de vidro'],
    ['cheesecake-450', 'Cheesecakes de 450 g prontos para entrega'],
    ['mesa', 'A mesa posta para receber'],
    ['cheesecake-topo', 'Cheesecake visto de cima, coberto de geleia'],
    ['bolo-fatia', 'Fatia do bolo de frutas cristalizadas'],
    ['focaccia2', 'Focaccias assadas em forma'],
    ['conserva-vidro', 'Conservas em vidro'],
    ['pao-detalhe', 'Detalhe da casca do pão']
  ];
  var gal = document.getElementById('galTrack');
  if (gal) {
    var html = fotos.map(function (f) {
      return '<figure><img src="assets/img/' + f[0] + '.jpg" alt="' + f[1] + '" width="920" height="920" loading="lazy"></figure>';
    }).join('');
    gal.innerHTML = html + html;
  }

  /* ---------- reveal on scroll ---------- */
  var rvs = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -4% 0px', threshold: 0.02 });
    rvs.forEach(function (el) { io.observe(el); });
  } else {
    rvs.forEach(function (el) { el.classList.add('is-in'); });
  }
  /* a capa sempre entra no load, independente do observer */
  document.querySelectorAll('.hero .rv').forEach(function (el) { el.classList.add('is-in'); });

  /* ---------- nav: fundo sólido + link ativo ---------- */
  var nav = document.getElementById('nav');
  var fab = document.getElementById('fab');
  var secoes = ['cozinha', 'fermentacao', 'cardapio', 'encontrar'].map(function (id) {
    return document.getElementById(id);
  }).filter(Boolean);
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav__links a'));

  function onScroll() {
    var y = window.pageYOffset;
    nav.classList.toggle('is-stuck', y > window.innerHeight * 0.82);
    if (fab) fab.classList.toggle('is-in', y > window.innerHeight * 0.6);

    var atual = null;
    secoes.forEach(function (s) {
      if (s.getBoundingClientRect().top <= window.innerHeight * 0.4) atual = s.id;
    });
    links.forEach(function (a) {
      a.classList.toggle('is-active', a.getAttribute('href') === '#' + atual);
    });
  }

  /* ---------- parallax leve ---------- */
  var pars = Array.prototype.slice.call(document.querySelectorAll('[data-par]'));
  function onParallax() {
    if (reduce) return;
    var vh = window.innerHeight;
    pars.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      var k = parseFloat(el.getAttribute('data-par')) || 0;
      var d = (r.top + r.height / 2 - vh / 2) * k;
      el.style.transform = 'translate3d(0,' + d.toFixed(1) + 'px,0)';
    });
  }

  var ticking = false;
  function tick() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () { onScroll(); onParallax(); ticking = false; });
  }
  window.addEventListener('scroll', tick, { passive: true });
  window.addEventListener('resize', tick);
  tick();

  /* ---------- menu mobile ---------- */
  var burger = document.getElementById('burger');
  if (burger) {
    burger.addEventListener('click', function () {
      var aberto = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', aberto ? 'true' : 'false');
      burger.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
      document.body.style.overflow = aberto ? 'hidden' : '';
    });
    document.querySelectorAll('.nav__links a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- chips do cardápio ---------- */
  var chips = Array.prototype.slice.call(document.querySelectorAll('.chip'));
  var cats = chips.map(function (c) { return document.querySelector(c.getAttribute('href')); });
  if ('IntersectionObserver' in window) {
    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        chips.forEach(function (c, i) { c.classList.toggle('is-active', cats[i] === e.target); });
      });
    }, { rootMargin: '-35% 0px -55% 0px' });
    cats.forEach(function (c) { if (c) io2.observe(c); });
  }

  /* ---------- conferência rápida (abre o Console do navegador, F12) ----------
     Serve para confirmar que este arquivo é o que está rodando de verdade
     e o que cada script está fazendo. Pode apagar depois de conferir. */
  console.info(
    '%cPadócasu · scripts ativos (v2)',
    'background:#C1440E;color:#fff;padding:3px 8px;border-radius:3px;font-weight:600',
    '\n• rolagem suave: JS próprio (não depende do CSS)  ANIMAR_SEMPRE=' + ANIMAR_SEMPRE +
    '\n• sistema pede menos movimento? ' + (prefereMenosMovimento ? 'sim' : 'não') +
    ' → animando: ' + (!reduce) +
    '\n• esteiras de texto montadas: ' + document.querySelectorAll('.marquee__track span').length +
    '\n• fotos da galeria: ' + document.querySelectorAll('.gal__track figure').length +
    '\n• blocos com animação de entrada: ' + document.querySelectorAll('.rv').length +
    '\n• links de WhatsApp por item: ' + document.querySelectorAll('.item__wa').length
  );
})();
