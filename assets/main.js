(function () {
  "use strict";

  var palco = document.querySelector(".palco");
  var cena = document.querySelector(".cena");
  var selo = document.querySelector(".selo");
  var convite = document.querySelector(".convite");
  var poucoMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var ponteiroFino = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- Brilhos discretos voando ---------- */
  var canvas = document.querySelector(".brilhos");
  var ctx = canvas.getContext("2d");
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var W = 0, H = 0, particulas = [], explosao = [];
  var cores = ["255,236,200", "232,201,142", "214,175,110", "255,255,255"];

  function redimensionar() {
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function novaParticula(inicio) {
    return {
      x: Math.random() * W,
      y: inicio ? Math.random() * H : H + 10,
      r: .5 + Math.random() * 1.6,
      vy: -(.12 + Math.random() * .38) * (poucoMovimento ? .4 : 1),
      fase: Math.random() * Math.PI * 2,
      amp: .2 + Math.random() * .5,
      pisca: .015 + Math.random() * .03,
      cor: cores[(Math.random() * cores.length) | 0],
      estrela: Math.random() < .14
    };
  }
  function desenharEstrela(x, y, r, a, cor) {
    var g = ctx.createRadialGradient(x, y, 0, x, y, r * 4);
    g.addColorStop(0, "rgba(" + cor + "," + a + ")");
    g.addColorStop(1, "rgba(" + cor + ",0)");
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(x, y, r * 4, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "rgba(" + cor + "," + a * .9 + ")";
    ctx.lineWidth = .6;
    ctx.beginPath();
    ctx.moveTo(x - r * 5, y); ctx.lineTo(x + r * 5, y);
    ctx.moveTo(x, y - r * 5); ctx.lineTo(x, y + r * 5);
    ctx.stroke();
  }
  function quadro() {
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < particulas.length; i++) {
      var p = particulas[i];
      p.fase += p.pisca;
      p.y += p.vy;
      p.x += Math.sin(p.fase * .7) * p.amp * .3;
      if (p.y < -12) particulas[i] = novaParticula(false);
      var a = .25 + .55 * Math.max(0, Math.sin(p.fase));
      if (p.estrela) desenharEstrela(p.x, p.y, p.r * .8, a * .8, p.cor);
      else {
        ctx.fillStyle = "rgba(" + p.cor + "," + a + ")";
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
    }
    for (var j = explosao.length - 1; j >= 0; j--) {
      var e = explosao[j];
      e.x += e.vx; e.y += e.vy; e.vx *= .975; e.vy = e.vy * .975 + (e.g || .015); e.vida -= e.queda;
      if (e.vida <= 0) { explosao.splice(j, 1); continue; }
      if (e.estrela) desenharEstrela(e.x, e.y, e.r, e.vida, e.cor);
      else {
        ctx.fillStyle = "rgba(" + e.cor + "," + e.vida + ")";
        ctx.beginPath(); ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2); ctx.fill();
      }
    }
    requestAnimationFrame(quadro);
  }
  function estourar(x, y, total, forca, largura, altura) {
    for (var i = 0; i < total; i++) {
      var ox = largura ? (Math.random() - .5) * largura : 0;
      var oy = altura ? (Math.random() - .5) * altura : 0;
      var ang = Math.random() * Math.PI * 2, v = (.6 + Math.random()) * (forca || 2.4);
      explosao.push({
        x: x + ox, y: y + oy,
        vx: Math.cos(ang) * v, vy: Math.sin(ang) * v - .6,
        r: .6 + Math.random() * 1.6,
        vida: 1, queda: .008 + Math.random() * .012,
        cor: cores[(Math.random() * cores.length) | 0],
        estrela: Math.random() < .25
      });
    }
  }
  {
    redimensionar();
    window.addEventListener("resize", redimensionar);
    var qtd = Math.round(Math.min(70, Math.max(28, W * H / 22000)));
    for (var i = 0; i < qtd; i++) particulas.push(novaParticula(true));
    requestAnimationFrame(quadro);
  }

  function centro(el) {
    var r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height };
  }

  /* ---------- Tamanho final: o convite cresce para ocupar a tela ---------- */
  function escalaFinal() {
    var largura = cena.offsetWidth, altura = cena.offsetHeight;
    if (!largura) return;
    var s = Math.min((window.innerWidth - 24) / largura, (window.innerHeight * .94) / altura, 1.25);
    cena.style.setProperty("--s-final", Math.max(1, s).toFixed(3));
  }
  escalaFinal();
  window.addEventListener("resize", escalaFinal);

  /* ---------- Abertura do envelope ---------- */
  var aberto = false;
  /* Gotas de espumante que respingam no brinde */
  function respingar(x, y, total) {
    for (var i = 0; i < total; i++) {
      var ang = -Math.PI / 2 + (Math.random() - .5) * 2.2, v = 1.5 + Math.random() * 3.2;
      explosao.push({
        x: x + (Math.random() - .5) * 8, y: y,
        vx: Math.cos(ang) * v, vy: Math.sin(ang) * v,
        r: .9 + Math.random() * 1.9, g: .13,
        vida: 1, queda: .012 + Math.random() * .01,
        cor: Math.random() < .7 ? "236,198,120" : "255,244,214",
        estrela: false
      });
    }
  }

  /* Tilintar de taças de cristal, sintetizado (sem arquivo de áudio) */
  function tilintar(atraso) {
    var Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    try {
      var ac = new Ctx(), t0 = ac.currentTime + atraso;
      var mestre = ac.createGain(); mestre.gain.value = .16; mestre.connect(ac.destination);
      [[0, 1], [.085, .45]].forEach(function (toque) {
        var t = t0 + toque[0];
        [[2093, 1, 1.5], [3135, .55, 1.1], [4186, .4, .9], [5274, .25, .7], [6650, .15, .5]].forEach(function (p) {
          var o = ac.createOscillator(), g = ac.createGain();
          o.type = "sine"; o.frequency.value = p[0] * (1 + (Math.random() - .5) * .006);
          g.gain.setValueAtTime(0, t);
          g.gain.linearRampToValueAtTime(p[1] * toque[1], t + .003);
          g.gain.exponentialRampToValueAtTime(.0001, t + p[2]);
          o.connect(g); g.connect(mestre);
          o.start(t); o.stop(t + p[2] + .05);
        });
      });
      setTimeout(function () { ac.close(); }, (atraso + 2) * 1000);
    } catch (e) { /* sem som */ }
  }

  var TOQUE = 930;  // momento em que as taças se encontram (ms)
  function abrir() {
    if (aberto) return;
    aberto = true;
    tilintar(TOQUE / 1000);

    /* 1. O brinde */
    palco.classList.add("brindando");
    setTimeout(function () {
      var s = centro(selo);
      estourar(s.x, s.y - s.h * .1, 46, 2.4);
      respingar(s.x, s.y - s.h * .15, 34);
      palco.classList.add("abrindo");
    }, TOQUE);

    /* 2. O convite */
    setTimeout(function () { palco.classList.add("puxando"); }, TOQUE + 1350);
    setTimeout(function () {
      cena.style.animation = "none";
      palco.classList.add("revelado");
    }, TOQUE + 2550);
    setTimeout(function () {
      palco.classList.add("pronto");
      var c = centro(convite);
      estourar(c.x, c.y, 90, 1.6, c.w, c.h);
      var link = document.querySelector(".botao");
      if (link) link.focus({ preventScroll: true });
    }, TOQUE + 3800);
  }

  {
    selo.addEventListener("click", abrir);
    cena.addEventListener("click", function (e) { if (!aberto && !e.target.closest(".convite")) abrir(); });
    document.addEventListener("keydown", function (e) {
      if (!aberto && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); abrir(); }
    });
  }

  /* ---------- Inclinação 3D do convite com o mouse ---------- */
  if (ponteiroFino && !poucoMovimento) {
    convite.addEventListener("mousemove", function (e) {
      if (!palco.classList.contains("pronto")) return;
      var r = convite.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      convite.style.setProperty("--ry", ((px - .5) * 7).toFixed(2) + "deg");
      convite.style.setProperty("--rx", ((.5 - py) * 7).toFixed(2) + "deg");
      convite.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
      convite.style.setProperty("--my", (py * 100).toFixed(1) + "%");
    });
    convite.addEventListener("mouseleave", function () {
      convite.style.setProperty("--rx", "0deg");
      convite.style.setProperty("--ry", "0deg");
    });
  }

  /* ---------- Faíscas ao clicar nos links ---------- */
  Array.prototype.forEach.call(document.querySelectorAll(".botao, .t-site, .t-endereco"), function (a) {
    a.addEventListener("click", function () {
      var c = centro(a);
      estourar(c.x, c.y, 26, 1.8);
    });
  });
})();
