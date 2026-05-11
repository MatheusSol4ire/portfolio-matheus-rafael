/**
 * main.js — Portfólio Matheus Rafael
 * Autor: Matheus Rafael de Oliveira Cardoso
 *
 * O que este arquivo faz:
 *  1. Alterna o tema claro/escuro e salva a preferência
 *  2. Abre/fecha o menu hamburguer no celular
 *  3. Adiciona sombra na navbar quando o usuário rola a página
 *  4. Marca o link ativo no menu conforme a seção visível
 *  5. Anima os elementos ao entrar na tela
 *  6. Valida e simula o envio do formulário de contato
 *  7. Mostra a foto se ela existir, ou mantém o placeholder
 *  8. Preenche o ano atual no rodapé automaticamente
 */


/* ============================================
   1. TEMA CLARO / ESCURO
   ============================================ */

// Pega os elementos do botão e do ícone do tema
var btnTema   = document.getElementById('btnTema');
var iconeTema = document.getElementById('icone-tema');
var body      = document.body;

// Função que aplica o tema escolhido
function aplicarTema(tema) {
  body.classList.remove('dark-theme', 'light-theme');
  body.classList.add(tema);
  // Troca o ícone: sol = tema escuro ativo, lua = tema claro ativo
  iconeTema.textContent = (tema === 'dark-theme') ? '☀' : '☾';
}

// Carrega o tema salvo pelo usuário (ou usa escuro como padrão)
var temaSalvo = localStorage.getItem('tema') || 'dark-theme';
aplicarTema(temaSalvo);

// Ao clicar no botão, alterna entre os temas e salva a escolha
btnTema.addEventListener('click', function() {
  var novoTema = body.classList.contains('dark-theme') ? 'light-theme' : 'dark-theme';
  aplicarTema(novoTema);
  localStorage.setItem('tema', novoTema);
});


/* ============================================
   2. MENU HAMBURGUER (MOBILE)
   ============================================ */

var navToggle = document.getElementById('navToggle');
var navLinks  = document.getElementById('navLinks');

// Abre ou fecha o menu ao clicar no botão hamburguer
navToggle.addEventListener('click', function() {
  var aberto = navLinks.classList.toggle('aberto');
  navToggle.classList.toggle('aberto', aberto);
  navToggle.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
});

// Fecha o menu quando qualquer link de navegação for clicado
var todosOsLinks = document.querySelectorAll('.nav-link');
todosOsLinks.forEach(function(link) {
  link.addEventListener('click', function() {
    navLinks.classList.remove('aberto');
    navToggle.classList.remove('aberto');
    navToggle.setAttribute('aria-label', 'Abrir menu');
  });
});


/* ============================================
   3. SOMBRA NA NAVBAR AO ROLAR
   ============================================ */

var navbar = document.getElementById('navbar');

window.addEventListener('scroll', function() {
  // Adiciona a classe 'rolado' quando o usuário rola mais de 10px
  if (window.scrollY > 10) {
    navbar.classList.add('rolado');
  } else {
    navbar.classList.remove('rolado');
  }
});


/* ============================================
   4. LINK ATIVO NO MENU (INTERSECTION OBSERVER)
      Destaca o link do menu conforme a seção
      que está visível na tela.
   ============================================ */

var secoes    = document.querySelectorAll('section[id]');
var linksMenu = document.querySelectorAll('.nav-link');

// IntersectionObserver: executa a função quando uma seção entra na tela
var observadorSecao = new IntersectionObserver(function(entradas) {
  entradas.forEach(function(entrada) {
    if (entrada.isIntersecting) {
      var id = entrada.target.getAttribute('id');
      // Remove 'ativo' de todos e adiciona só no link correspondente
      linksMenu.forEach(function(link) {
        if (link.getAttribute('href') === '#' + id) {
          link.classList.add('ativo');
        } else {
          link.classList.remove('ativo');
        }
      });
    }
  });
}, {
  rootMargin: '-20% 0px -60% 0px'
});

secoes.forEach(function(s) {
  observadorSecao.observe(s);
});


/* ============================================
   5. ANIMAÇÃO DE ENTRADA AO ROLAR
      Elementos recebem a classe 'animar'.
      Quando entram na tela, recebem 'visivel'.
   ============================================ */

// Seleciona os blocos que devem ser animados
var elementosAnimados = document.querySelectorAll(
  '.secao-header, .sobre-grid, .tl-item, .idioma-item, ' +
  '.projeto-card, .portfolio-em-breve, .contato-grid'
);

// Adiciona a classe inicial de animação
elementosAnimados.forEach(function(el) {
  el.classList.add('animar');
});

// Observer que adiciona 'visivel' quando o elemento entra na tela
var observadorFade = new IntersectionObserver(function(entradas) {
  entradas.forEach(function(entrada) {
    if (entrada.isIntersecting) {
      entrada.target.classList.add('visivel');
      // Para de observar após animar (melhora desempenho)
      observadorFade.unobserve(entrada.target);
    }
  });
}, { threshold: 0.1 });

elementosAnimados.forEach(function(el) {
  observadorFade.observe(el);
});


/* ============================================
   6. FOTO — mostra imagem ou placeholder
   ============================================ */

var imgFoto       = document.getElementById('img-foto');
var fotoPlacehold = document.getElementById('foto-placeholder');

// Tenta carregar a foto; se não existir, mantém as iniciais
if (imgFoto) {
  imgFoto.addEventListener('load', function() {
    // Foto carregou: exibe ela e esconde o placeholder
    imgFoto.style.display = 'block';
    fotoPlacehold.style.display = 'none';
  });

  imgFoto.addEventListener('error', function() {
    // Foto não encontrada: mantém o placeholder com as iniciais
    imgFoto.style.display = 'none';
    fotoPlacehold.style.display = 'flex';
  });
}


/* ============================================
   7. FORMULÁRIO DE CONTATO — VALIDAÇÃO
   ============================================ */

var formulario   = document.getElementById('formulario-contato');
var campoNome    = document.getElementById('nome');
var campoEmail   = document.getElementById('email');
var campoMensagem= document.getElementById('mensagem');
var erroNome     = document.getElementById('erro-nome');
var erroEmail    = document.getElementById('erro-email');
var erroMensagem = document.getElementById('erro-mensagem');
var msgSucesso   = document.getElementById('msg-sucesso');
var btnEnviar    = document.querySelector('.btn-enviar');

// Verifica se o e-mail tem formato válido (usuario@dominio.com)
function emailValido(email) {
  var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
}

// Mostra ou limpa uma mensagem de erro em um campo
function definirErro(campo, elementoErro, mensagem) {
  elementoErro.textContent = mensagem;
  if (mensagem !== '') {
    campo.classList.add('erro');
  } else {
    campo.classList.remove('erro');
  }
}

// Remove o erro assim que o usuário começa a digitar
campoNome.addEventListener('input', function() {
  definirErro(campoNome, erroNome, '');
});
campoEmail.addEventListener('input', function() {
  definirErro(campoEmail, erroEmail, '');
});
campoMensagem.addEventListener('input', function() {
  definirErro(campoMensagem, erroMensagem, '');
});

// Valida todos os campos; retorna true se tudo estiver correto
function validarFormulario() {
  var valido = true;

  // Nome: mínimo 3 caracteres
  if (campoNome.value.trim().length < 3) {
    definirErro(campoNome, erroNome, 'Informe seu nome completo.');
    valido = false;
  }

  // E-mail: formato obrigatório
  if (!emailValido(campoEmail.value)) {
    definirErro(campoEmail, erroEmail, 'Informe um e-mail válido (ex: voce@email.com).');
    valido = false;
  }

  // Mensagem: mínimo 10 caracteres
  if (campoMensagem.value.trim().length < 10) {
    definirErro(campoMensagem, erroMensagem, 'A mensagem deve ter pelo menos 10 caracteres.');
    valido = false;
  }

  return valido;
}

// Evento de envio do formulário
formulario.addEventListener('submit', function(evento) {
  // Impede o comportamento padrão (recarregar a página)
  evento.preventDefault();

  // Só continua se a validação passar
  if (!validarFormulario()) return;

  // Desabilita o botão para evitar cliques duplos
  btnEnviar.disabled = true;
  btnEnviar.textContent = 'Enviando...';

  // Simula o tempo de envio (1,5 segundos)
  setTimeout(function() {
    // Limpa todos os campos
    formulario.reset();

    // Restaura o botão
    btnEnviar.disabled = false;
    btnEnviar.textContent = 'Enviar mensagem →';

    // Exibe a mensagem de sucesso
    msgSucesso.style.display = 'block';

    // Oculta a mensagem após 5 segundos
    setTimeout(function() {
      msgSucesso.style.display = 'none';
    }, 5000);
  }, 1500);
});


/* ============================================
   8. ANO DINÂMICO NO RODAPÉ
   ============================================ */

var spanAno = document.getElementById('ano-atual');
if (spanAno) {
  spanAno.textContent = new Date().getFullYear();
}
