(function () {
  "use strict";
  var C = window.SITE_CONFIG || {};
  var html = document.documentElement;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var poucoMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var ponteiroFino = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- Explosão de corações ---------- */
  var cores = ["#C9735A", "#9A7556", "#F2D7B8", "#A9B5A0", "#C8A574"];
  function coracoes(x, y, total) {
    if (poucoMovimento) return;
    for (var i = 0; i < (total || 18); i++) {
      var c = document.createElement("span");
      var ang = Math.random() * Math.PI * 2, dist = 70 + Math.random() * 160;
      c.className = "coracao-voa";
      c.textContent = Math.random() > .3 ? "♥" : "♡";
      c.style.left = x + "px"; c.style.top = y + "px";
      c.style.setProperty("--dx", Math.cos(ang) * dist + "px");
      c.style.setProperty("--dy", Math.sin(ang) * dist - 60 + "px");
      c.style.setProperty("--g", (Math.random() * 120 - 60) + "deg");
      c.style.setProperty("--t", (12 + Math.random() * 18) + "px");
      c.style.setProperty("--c", cores[i % cores.length]);
      document.body.appendChild(c);
      setTimeout(c.remove.bind(c), 1500);
    }
  }
  function centro(el) { var r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }

  /* ---------- Convite de abertura ---------- */
  function iniciar() { html.classList.add("iniciado"); }
  var intro = $(".intro");
  if (intro && !html.classList.contains("sem-intro")) {
    document.body.style.overflow = "hidden";
    var envelope = $(".envelope", intro), selo = $(".selo", intro);
    var fechado = true;
    var concluir = function (rapido) {
      intro.classList.add("saindo");
      setTimeout(function () {
        intro.remove(); document.body.style.overflow = ""; iniciar();
      }, rapido ? 500 : 900);
      try { sessionStorage.setItem("convite-aberto", "1"); } catch (e) { /* sem armazenamento */ }
    };
    var abrir = function () {
      if (!fechado) return; fechado = false;
      var p = centro(selo); coracoes(p[0], p[1], 24);
      envelope.classList.add("aberto");
      $(".intro-dica", intro).textContent = "Seja bem-vindo ♡";
      setTimeout(function () { concluir(false); }, 2300);
    };
    selo.addEventListener("click", abrir);
    envelope.addEventListener("click", abrir);
    $(".intro-pular", intro).addEventListener("click", function () { fechado = false; concluir(true); });
    document.addEventListener("keydown", function (e) {
      if (intro.isConnected && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); abrir(); }
    });
    setTimeout(function () { selo.focus({ preventScroll: true }); }, 100);
  } else {
    if (intro) intro.remove();
    iniciar();
  }

  /* ---------- Menu ---------- */
  var topo = $(".topo"), menu = $("#menu"), botaoMenu = $(".menu-botao");
  function fecharMenu() {
    menu.classList.remove("aberto"); topo.classList.remove("menu-aberto");
    botaoMenu.setAttribute("aria-expanded", "false");
  }
  botaoMenu.addEventListener("click", function () {
    var aberto = menu.classList.toggle("aberto");
    topo.classList.toggle("menu-aberto", aberto);
    botaoMenu.setAttribute("aria-expanded", String(aberto));
  });
  $$("#menu a").forEach(function (a) { a.addEventListener("click", fecharMenu); });

  /* Link ativo conforme a seção visível */
  var links = {};
  $$('#menu a:not(.botao)').forEach(function (a) { links[a.getAttribute("href").slice(1)] = a; });
  if ("IntersectionObserver" in window) {
    var obsMenu = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (!en.isIntersecting || !links[en.target.id]) return;
        Object.keys(links).forEach(function (k) { links[k].classList.toggle("ativo", k === en.target.id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    $$("section[id]").forEach(function (s) { obsMenu.observe(s); });
  }

  /* ---------- Rolagem: cabeçalho, barra de progresso e paralaxe ---------- */
  var progresso = $(".progresso"), heroFoto = $(".hero-foto"), confFoto = $(".confirmar-foto"), confirmar = $("#confirmar");
  var agendado = false;
  function aoRolar() {
    agendado = false;
    var y = window.scrollY, h = document.documentElement.scrollHeight - window.innerHeight;
    topo.classList.toggle("rolado", y > 40);
    progresso.style.setProperty("--p", h > 0 ? (y / h).toFixed(4) : 0);
    if (poucoMovimento) return;
    if (y < window.innerHeight * 1.2) heroFoto.style.setProperty("--paralaxe", (y * .35).toFixed(1) + "px");
    var r = confirmar.getBoundingClientRect();
    if (r.bottom > 0 && r.top < window.innerHeight) {
      confFoto.style.setProperty("--paralaxe", ((r.top + r.height / 2 - window.innerHeight / 2) * -.15).toFixed(1) + "px");
    }
  }
  window.addEventListener("scroll", function () {
    if (!agendado) { agendado = true; requestAnimationFrame(aoRolar); }
  }, { passive: true });
  aoRolar();

  /* ---------- Pétalas caindo ---------- */
  var petalas = $(".petalas");
  if (petalas && !poucoMovimento) {
    var qtd = window.innerWidth < 600 ? 14 : 26;
    for (var i = 0; i < qtd; i++) {
      var p = document.createElement("span");
      p.className = "petala" + (i % 5 === 0 ? " folhinha" : "");
      p.style.setProperty("--x", Math.random() * 100 + "%");
      p.style.setProperty("--t", (8 + Math.random() * 12) + "px");
      p.style.setProperty("--d", (9 + Math.random() * 10) + "s");
      p.style.setProperty("--a", (-Math.random() * 18) + "s");
      p.style.setProperty("--s", (20 + Math.random() * 60) + "px");
      petalas.appendChild(p);
    }
  }

  /* ---------- Brilhos que seguem o mouse na abertura ---------- */
  var hero = $(".hero"), ultimo = 0;
  if (hero && ponteiroFino && !poucoMovimento) {
    hero.addEventListener("mousemove", function (e) {
      var agora = Date.now(); if (agora - ultimo < 35) return; ultimo = agora;
      var r = hero.getBoundingClientRect(), f = document.createElement("span");
      f.className = "faisca";
      f.style.left = (e.clientX - r.left) + "px"; f.style.top = (e.clientY - r.top) + "px";
      f.style.setProperty("--dx", (Math.random() * 40 - 20) + "px");
      f.style.setProperty("--dy", (Math.random() * 30 + 10) + "px");
      hero.appendChild(f);
      setTimeout(f.remove.bind(f), 950);
    });
  }

  /* ---------- Contagem regressiva com virada ---------- */
  var alvo = new Date(C.dataCasamento || "2027-03-20T16:30:00-03:00").getTime();
  var campos = {};
  $$("[data-contagem]").forEach(function (el) { campos[el.dataset.contagem] = el; });
  function doisDigitos(n) { return n < 10 ? "0" + n : String(n); }
  function definir(el, valor) {
    if (el.textContent === valor) return;
    el.textContent = valor;
    el.classList.remove("vira"); void el.offsetWidth; el.classList.add("vira");
  }
  function atualizarContagem() {
    var resta = Math.max(0, alvo - Date.now());
    var s = Math.floor(resta / 1000);
    definir(campos.dias, String(Math.floor(s / 86400)));
    definir(campos.horas, doisDigitos(Math.floor(s % 86400 / 3600)));
    definir(campos.minutos, doisDigitos(Math.floor(s % 3600 / 60)));
    definir(campos.segundos, doisDigitos(s % 60));
    if (resta === 0) {
      $(".hero-rotulo").textContent = "Chegou o grande dia!";
      clearInterval(relogio);
    }
  }
  var relogio = setInterval(atualizarContagem, 1000);
  atualizarContagem();

  /* ---------- Links configuráveis ---------- */
  $$("[data-link]").forEach(function (a) { if (C[a.dataset.link]) a.href = C[a.dataset.link]; });
  var hosp = C.hospedagem || {};
  if (hosp.instagram) $$('[data-link="instagram"]').forEach(function (a) { a.href = hosp.instagram; });
  if (hosp.whatsapp) $$("[data-whatsapp]").forEach(function (a) {
    a.href = "https://wa.me/" + hosp.whatsapp + "?text=" +
      encodeURIComponent("Olá, Taís! Vou ao casamento de Carolina e Fernando e gostaria de informações sobre hospedagem.");
  });

  /* ---------- Mapa, rota e agenda ---------- */
  var local = C.local || {};
  var busca = encodeURIComponent(local.buscaMapa || "Hospedaria Casa de Campo");
  $$('[data-mapa="ver"]').forEach(function (a) {
    a.href = "https://www.google.com/maps/search/?api=1&query=" + busca;
  });
  var formRota = $("[data-rota]");
  if (formRota) formRota.addEventListener("submit", function (e) {
    e.preventDefault();
    var origem = encodeURIComponent(formRota.partida.value.trim());
    window.open("https://www.google.com/maps/dir/?api=1&origin=" + origem + "&destination=" + busca, "_blank", "noopener");
  });
  var agenda = $("[data-agenda]");
  if (agenda) {
    var inicio = new Date(alvo), fim = new Date(alvo + 7 * 3600 * 1000);
    var fmt = function (d) { return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, ""); };
    agenda.href = "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      "&text=" + encodeURIComponent("Casamento de Carolina e Fernando") +
      "&dates=" + fmt(inicio) + "/" + fmt(fim) +
      "&location=" + encodeURIComponent(local.buscaMapa || local.nome || "") +
      "&details=" + encodeURIComponent("Cerimônia religiosa e festa. Contamos com você!");
  }

  /* ---------- Lista de presentes ---------- */
  var grade = $("[data-presentes]");
  if (grade && Array.isArray(C.presentes)) {
    var moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
    C.presentes.forEach(function (p, i) {
      var item = document.createElement("article");
      item.className = "presente inclinavel";
      item.style.transitionDelay = (i % 4) * 90 + "ms";
      item.innerHTML =
        '<div><span class="presente-icone" aria-hidden="true"></span></div><h3></h3>' +
        '<p class="presente-valor">a partir de<strong></strong></p>' +
        '<a class="botao" target="_blank" rel="noopener">Presentear</a>';
      $(".presente-icone", item).textContent = p.icone || "🎁";
      $("h3", item).textContent = p.nome;
      $("strong", item).textContent = moeda.format(p.valor);
      var botao = $("a", item);
      botao.href = p.link || C.paginaPresentes || "#";
      botao.addEventListener("click", function () { var c = centro(botao); coracoes(c[0], c[1], 12); });
      grade.appendChild(item);
    });
  }

  /* ---------- Inclinação 3D ---------- */
  if (ponteiroFino && !poucoMovimento) {
    $$(".inclinavel").forEach(function (el) {
      var forca = el.classList.contains("presente") ? 10 : 4;
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        el.style.setProperty("--ry", ((px - .5) * forca).toFixed(2) + "deg");
        el.style.setProperty("--rx", ((.5 - py) * forca).toFixed(2) + "deg");
        el.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
        el.style.setProperty("--my", (py * 100).toFixed(1) + "%");
      });
      el.addEventListener("mouseleave", function () {
        el.style.setProperty("--rx", "0deg"); el.style.setProperty("--ry", "0deg");
      });
    });
  }

  /* ---------- Versículo palavra por palavra ---------- */
  var verso = $(".versiculo blockquote p");
  if (verso && !poucoMovimento) {
    var palavras = verso.textContent.trim().split(/\s+/);
    verso.setAttribute("aria-label", verso.textContent.trim());
    verso.innerHTML = "";
    palavras.forEach(function (w, i) {
      var s = document.createElement("span");
      s.className = "palavra"; s.setAttribute("aria-hidden", "true");
      s.style.setProperty("--i", i); s.textContent = w;
      verso.appendChild(s); verso.appendChild(document.createTextNode(" "));
    });
  }

  /* ---------- Visualizador de fotos ---------- */
  var itens = $$(".galeria-item"), lb = $(".lightbox"), lbImg = $("img", lb), lbCont = $(".lb-contador", lb), atual = 0;
  itens.forEach(function (a, i) { a.style.setProperty("--i", i % 4); });
  function mostrar(i, direcao) {
    atual = (i + itens.length) % itens.length;
    lbImg.src = itens[atual].href;
    lbCont.textContent = (atual + 1) + " / " + itens.length;
    if (direcao) {
      lbImg.style.setProperty("--de", direcao * 40 + "px");
      lbImg.classList.remove("trocando"); void lbImg.offsetWidth; lbImg.classList.add("trocando");
    }
    lb.hidden = false; document.body.style.overflow = "hidden";
  }
  function fechar() { lb.hidden = true; lbImg.src = ""; document.body.style.overflow = ""; }
  itens.forEach(function (a, i) { a.addEventListener("click", function (e) { e.preventDefault(); mostrar(i, 0); }); });
  $(".lb-fechar").addEventListener("click", fechar);
  $(".lb-anterior").addEventListener("click", function () { mostrar(atual - 1, -1); });
  $(".lb-proxima").addEventListener("click", function () { mostrar(atual + 1, 1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) fechar(); });
  document.addEventListener("keydown", function (e) {
    if (lb.hidden) return;
    if (e.key === "Escape") fechar();
    if (e.key === "ArrowLeft") mostrar(atual - 1, -1);
    if (e.key === "ArrowRight") mostrar(atual + 1, 1);
  });
  var toqueX = null;
  lb.addEventListener("touchstart", function (e) { toqueX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", function (e) {
    if (toqueX === null) return;
    var dx = e.changedTouches[0].clientX - toqueX;
    if (Math.abs(dx) > 50) mostrar(atual + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
    toqueX = null;
  });

  /* ---------- Formulários (confirmação e recados) ---------- */
  var formRsvp = $('[data-formulario="rsvp"]');
  var blocoSim = $(".so-se-sim");
  if (formRsvp) {
    blocoSim.hidden = true;
    $$('input[name="presenca"]', formRsvp).forEach(function (r) {
      r.addEventListener("change", function () {
        blocoSim.hidden = formRsvp.presenca.value !== "Sim";
        if (r.checked && r.value === "Sim") { var c = centro(r.parentNode); coracoes(c[0], c[1], 10); }
      });
    });
  }

  function enviar(form, tipo, sucesso) {
    var aviso = $(".aviso", form);
    aviso.className = "aviso"; void aviso.offsetWidth;
    if (!form.checkValidity()) {
      aviso.textContent = "Preencha os campos obrigatórios, por favor.";
      aviso.classList.add("erro");
      var invalido = $(":invalid", form); if (invalido) invalido.focus();
      return;
    }
    if (!C.endpointFormularios) {
      aviso.textContent = "O envio ainda não foi ativado. Tente novamente em breve.";
      aviso.classList.add("erro");
      return;
    }
    var dados = new URLSearchParams(new FormData(form));
    dados.append("tipo", tipo);
    var botao = $('button[type="submit"]', form);
    botao.disabled = true; aviso.textContent = "Enviando…";
    fetch(C.endpointFormularios, { method: "POST", mode: "no-cors", body: dados })
      .then(function () {
        aviso.textContent = sucesso; aviso.classList.add("ok"); form.reset();
        var c = centro(botao); coracoes(c[0], c[1], 30);
        if (blocoSim && form === formRsvp) blocoSim.hidden = true;
        if (tipo === "recado") carregarRecados();
      })
      .catch(function () {
        aviso.textContent = "Não foi possível enviar. Verifique sua conexão e tente de novo.";
        aviso.classList.add("erro");
      })
      .then(function () { botao.disabled = false; });
  }
  if (formRsvp) formRsvp.addEventListener("submit", function (e) {
    e.preventDefault();
    enviar(formRsvp, "rsvp", "Presença registrada. Obrigado pelo carinho! ♡");
  });
  var formRecado = $('[data-formulario="recado"]');
  if (formRecado) formRecado.addEventListener("submit", function (e) {
    e.preventDefault();
    enviar(formRecado, "recado", "Mensagem enviada. Ela aparece no mural após a nossa aprovação. ♡");
  });

  /* ---------- Mural de recados (somente mensagens aprovadas) ---------- */
  function carregarRecados() {
    var mural = $("[data-mural]");
    if (!mural || !C.endpointFormularios) return;
    fetch(C.endpointFormularios + "?tipo=recados")
      .then(function (r) { return r.json(); })
      .then(function (lista) {
        if (!Array.isArray(lista) || !lista.length) return;
        mural.innerHTML = "";
        lista.forEach(function (m) {
          var el = document.createElement("article");
          el.className = "recado";
          el.innerHTML = "<p></p><footer></footer>";
          $("p", el).textContent = m.mensagem;
          $("footer", el).textContent = m.nome;
          mural.appendChild(el);
        });
      })
      .catch(function () { /* mantém a mensagem padrão */ });
  }
  carregarRecados();

  /* ---------- Coração no monograma do rodapé ---------- */
  var mono = $(".rodape-monograma");
  if (mono) mono.addEventListener("click", function () { var c = centro(mono); coracoes(c[0], c[1], 20); });

  /* ---------- Entrada ao rolar ---------- */
  $$(".titulo-secao, .historia-texto, .historia-fotos, .cartao-local, .dicas-grade, .confirmar-cartao, .recados-grade, .versiculo blockquote, .galeria-item, .presente")
    .forEach(function (el) { el.classList.add("revelar"); });
  var revelaveis = $$(".revelar");
  if ("IntersectionObserver" in window && !poucoMovimento) {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (!en.isIntersecting) return;
        var alvoEl = en.target;
        alvoEl.classList.add("visivel"); obs.unobserve(alvoEl);
        // Remove o atraso da entrada para o hover responder na hora.
        if (alvoEl.style.transitionDelay) setTimeout(function () { alvoEl.style.transitionDelay = ""; }, 1400);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revelaveis.forEach(function (el) { obs.observe(el); });
  } else {
    revelaveis.forEach(function (el) { el.classList.add("visivel"); });
  }
})();
