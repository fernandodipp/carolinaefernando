/*
 * Configuração do site — edite aqui sem mexer no restante do código.
 */
window.SITE_CONFIG = {
  // Data e hora da cerimônia (horário de Brasília, UTC-3).
  dataCasamento: "2027-03-20T16:30:00-03:00",

  // URL do Web App do Google Apps Script (veja apps-script/Code.gs e o README).
  // Enquanto estiver vazia, os formulários mostram um aviso e não enviam dados.
  endpointFormularios: "",

  // Local da cerimônia e da festa.
  local: {
    nome: "Casa de Campo",
    // Texto usado para abrir o mapa e traçar a rota. Troque pelo endereço completo quando tiver.
    buscaMapa: "Hospedaria Casa de Campo",
  },

  // Álbum completo de fotos.
  albumCompleto: "https://photos.app.goo.gl/82EaZRJn7YdF7TGg9",

  // Hospedagem.
  hospedagem: {
    whatsapp: "5551999167826",
    instagram: "https://www.instagram.com/hospedariacasadecampo",
  },

  // Lista de presentes. O botão "Presentear" abre a página de pagamento.
  paginaPresentes: "https://www.carolinaefernando.com.br/pages/39036805",
  presentes: [
    { icone: "🏰", nome: "Aluguel de um castelo medieval por uma noite", valor: 1973.81 },
    { icone: "🎬", nome: "Controle remoto exclusivo do Fernando (sujeito à aprovação da esposa)", valor: 232.82 },
    { icone: "🌴", nome: "Cota VIP da nossa lua de mel", valor: 1008.21 },
    { icone: "🚢", nome: "Cruzeiro pelo Triângulo das Bermudas, com volta garantida", valor: 672.49 },
    { icone: "🛠️", nome: "Curso de sobrevivência para aprender a montar um móvel sem discutir", valor: 311.82 },
    { icone: "🍝", nome: "Curso para descobrir onde a Carolina quer comer", valor: 300.38 },
    { icone: "☕", nome: "Dose dupla de amor e cafeína", valor: 218.11 },
    { icone: "🐧", nome: "Encontro romântico com pinguins", valor: 404.32 },
  ],
};
