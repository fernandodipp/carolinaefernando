/**
 * Backend gratuito para o site do casamento (Google Apps Script + Google Planilhas).
 *
 * - POST tipo=rsvp   → grava uma linha na aba "Confirmações".
 * - POST tipo=recado → grava uma linha na aba "Recados" (coluna "Aprovado" vazia).
 * - GET  ?tipo=recados → devolve, em JSON, só os recados com "Aprovado" = SIM.
 *
 * Instalação: veja o README do repositório.
 */

var ABAS = {
  rsvp: {
    nome: "Confirmações",
    colunas: ["Data", "Nome", "Presença", "Acompanhantes", "Nomes dos acompanhantes", "Restrições", "Telefone", "Mensagem"],
    campos: ["nome", "presenca", "acompanhantes", "nomesAcompanhantes", "restricoes", "telefone", "mensagem"],
  },
  recado: {
    nome: "Recados",
    colunas: ["Data", "Nome", "E-mail", "Mensagem", "Aprovado"],
    campos: ["nome", "email", "mensagem"],
  },
};

function aba_(config) {
  var planilha = SpreadsheetApp.getActiveSpreadsheet();
  var aba = planilha.getSheetByName(config.nome);
  if (!aba) {
    aba = planilha.insertSheet(config.nome);
    aba.appendRow(config.colunas);
    aba.setFrozenRows(1);
  }
  return aba;
}

function limpar_(valor) {
  var texto = String(valor || "").slice(0, 4000);
  // Evita que o conteúdo seja interpretado como fórmula na planilha.
  return /^[=+\-@]/.test(texto) ? "'" + texto : texto;
}

function doPost(e) {
  var p = (e && e.parameter) || {};
  var config = ABAS[p.tipo];
  if (!config || !p.nome) {
    return ContentService.createTextOutput("erro");
  }
  var linha = [new Date()].concat(config.campos.map(function (c) { return limpar_(p[c]); }));
  if (p.tipo === "recado") linha.push("");
  var trava = LockService.getScriptLock();
  trava.waitLock(10000);
  try {
    aba_(config).appendRow(linha);
  } finally {
    trava.releaseLock();
  }
  return ContentService.createTextOutput("ok");
}

function doGet(e) {
  var saida = [];
  if (e && e.parameter && e.parameter.tipo === "recados") {
    var dados = aba_(ABAS.recado).getDataRange().getValues().slice(1);
    saida = dados
      .filter(function (l) { return String(l[4]).trim().toUpperCase() === "SIM"; })
      .reverse()
      .map(function (l) { return { nome: l[1], mensagem: l[3] }; });
  }
  return ContentService.createTextOutput(JSON.stringify(saida)).setMimeType(ContentService.MimeType.JSON);
}
