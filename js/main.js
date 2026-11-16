(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  // Tesoura de barbeiro (SVG customizado, lâminas separadas para animar)
  var SC = '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" aria-hidden="true">' +
    '<g class="a"><path d="M13 37 38 6"/><circle cx="10" cy="41" r="5"/></g>' +
    '<g class="b"><path d="M35 37 10 6"/><circle cx="38" cy="41" r="5"/></g>' +
    '<circle cx="24" cy="24" r="2" fill="currentColor" stroke="none"/></svg>';
  $$('.sc').forEach(function (el) { el.innerHTML = SC; });
  if (window.lucide) window.lucide.createIcons();
  window.addEventListener('load', function () { if (window.lucide) window.lucide.createIcons(); });

  // Menu mobile
  var burger = $('#burger'), nav = $('#nav');
  function toggleMenu(open) {
    nav.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
  }
  burger.addEventListener('click', function () { toggleMenu(!nav.classList.contains('open')); });
  $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { toggleMenu(false); }); });

  // Scroll reveal com stagger
  var items = $$('.reveal');
  items.forEach(function (el) {
    var i = Array.prototype.indexOf.call(el.parentNode.children, el);
    el.style.transitionDelay = (i % 4) * 90 + 'ms';
  });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: .15 });
    items.forEach(function (el) { io.observe(el); });
  } else { items.forEach(function (el) { el.classList.add('in'); }); }

  // Abas de planos
  $$('.tab').forEach(function (t) {
    t.addEventListener('click', function () {
      $$('.tab').forEach(function (x) { x.classList.toggle('on', x === t); x.setAttribute('aria-selected', x === t); });
      $$('.panel').forEach(function (p) { p.classList.toggle('on', p.id === 'p-' + t.dataset.t); });
      $$('#p-' + t.dataset.t + ' .plan').forEach(function (p, i) {
        p.classList.remove('reveal', 'in'); p.style.animation = 'none'; void p.offsetWidth;
        p.style.animation = 'rise .6s ' + i * .09 + 's cubic-bezier(.2,.7,.2,1) both';
      });
    });
  });

  // Tesoura deslizando no divisor conforme o scroll
  var cuts = $$('.cut'), ticking = false;
  function moveScissors() {
    var vh = window.innerHeight;
    cuts.forEach(function (c) {
      var r = c.getBoundingClientRect();
      var p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
      $('.sc', c).style.left = (p * 100) + '%';
    });
    ticking = false;
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(moveScissors); } }, { passive: true });
  window.addEventListener('resize', moveScissors);
  moveScissors();

  // Modal de WhatsApp por unidade
  var modal = $('#wa-modal');
  function toggleModal(open) { modal.hidden = !open; if (open) $('a', modal).focus(); else $('#wa-open').focus(); }
  $('#wa-open').addEventListener('click', function () { toggleModal(true); });
  $('#wa-close').addEventListener('click', function () { toggleModal(false); });
  modal.addEventListener('click', function (e) { if (e.target === modal) toggleModal(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) toggleModal(false); });
})();
