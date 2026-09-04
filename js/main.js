/* main.js — scripts do portfólio */


/* Tema claro/escuro */

var btnTema   = document.getElementById('btnTema');
var iconeTema = document.getElementById('icone-tema');
var body      = document.body;

function aplicarTema(tema) {
  body.classList.remove('dark-theme', 'light-theme');
  body.classList.add(tema);
  // Ícone: sol = escuro, lua = claro
  iconeTema.textContent = (tema === 'dark-theme') ? '☀' : '☾';
}

// Tema salvo (padrão: escuro)
var temaSalvo = localStorage.getItem('tema') || 'dark-theme';
aplicarTema(temaSalvo);

// Alterna tema ao clicar
btnTema.addEventListener('click', function() {
  var novoTema = body.classList.contains('dark-theme') ? 'light-theme' : 'dark-theme';
  aplicarTema(novoTema);
  localStorage.setItem('tema', novoTema);
});


/* Menu hamburguer (mobile) */

var navToggle = document.getElementById('navToggle');
var navLinks  = document.getElementById('navLinks');

// Abre/fecha o menu
navToggle.addEventListener('click', function() {
  var aberto = navLinks.classList.toggle('aberto');
  navToggle.classList.toggle('aberto', aberto);
  navToggle.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
});

// Fecha o menu ao clicar em um link
var todosOsLinks = document.querySelectorAll('.nav-link');
todosOsLinks.forEach(function(link) {
  link.addEventListener('click', function() {
    navLinks.classList.remove('aberto');
    navToggle.classList.remove('aberto');
    navToggle.setAttribute('aria-label', 'Abrir menu');
  });
});


/* Sombra na navbar ao rolar */

var navbar = document.getElementById('navbar');

window.addEventListener('scroll', function() {
  // Classe 'rolado' após 10px de scroll
  if (window.scrollY > 10) {
    navbar.classList.add('rolado');
  } else {
    navbar.classList.remove('rolado');
  }
});


/* Link ativo no menu */

var secoes    = document.querySelectorAll('section[id]');
var linksMenu = document.querySelectorAll('.nav-link');

// Observa as seções visíveis
var observadorSecao = new IntersectionObserver(function(entradas) {
  entradas.forEach(function(entrada) {
    if (entrada.isIntersecting) {
      var id = entrada.target.getAttribute('id');
      // Marca só o link da seção atual
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


/* Animação de entrada ao rolar */

// Blocos animados
var elementosAnimados = document.querySelectorAll(
  '.secao-header, .sobre-grid, .tl-item, .idioma-item, ' +
  '.projeto-card, .contato-grid'
);

// Classe inicial de animação
elementosAnimados.forEach(function(el) {
  el.classList.add('animar');
});

// Adiciona 'visivel' ao entrar na tela
var observadorFade = new IntersectionObserver(function(entradas) {
  entradas.forEach(function(entrada) {
    if (entrada.isIntersecting) {
      entrada.target.classList.add('visivel');
      // Para de observar após animar
      observadorFade.unobserve(entrada.target);
    }
  });
}, { threshold: 0.1 });

elementosAnimados.forEach(function(el) {
  observadorFade.observe(el);
});


/* Foto: imagem ou placeholder */

var imgFoto       = document.getElementById('img-foto');
var fotoPlacehold = document.getElementById('foto-placeholder');

// Foto ou placeholder
if (imgFoto) {
  imgFoto.addEventListener('load', function() {
    // Exibe a foto
    imgFoto.style.display = 'block';
    fotoPlacehold.style.display = 'none';
  });

  imgFoto.addEventListener('error', function() {
    // Mantém o placeholder
    imgFoto.style.display = 'none';
    fotoPlacehold.style.display = 'flex';
  });
}


/* Validação do formulário de contato */

var formulario   = document.getElementById('formulario-contato');
var campoNome    = document.getElementById('nome');
var campoEmail   = document.getElementById('email');
var campoMensagem= document.getElementById('mensagem');
var erroNome     = document.getElementById('erro-nome');
var erroEmail    = document.getElementById('erro-email');
var erroMensagem = document.getElementById('erro-mensagem');
var msgSucesso   = document.getElementById('msg-sucesso');
var btnEnviar    = document.querySelector('.btn-enviar');

// Valida formato de e-mail
function emailValido(email) {
  var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
}

// Define erro do campo
function definirErro(campo, elementoErro, mensagem) {
  elementoErro.textContent = mensagem;
  if (mensagem !== '') {
    campo.classList.add('erro');
  } else {
    campo.classList.remove('erro');
  }
}

// Remove erro ao digitar
campoNome.addEventListener('input', function() {
  definirErro(campoNome, erroNome, '');
});
campoEmail.addEventListener('input', function() {
  definirErro(campoEmail, erroEmail, '');
});
campoMensagem.addEventListener('input', function() {
  definirErro(campoMensagem, erroMensagem, '');
});

// Valida o formulário
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
  // Impede reload da página
  evento.preventDefault();

  // Só continua se a validação passar
  if (!validarFormulario()) return;

  // Desabilita o botão
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


/* Ano dinâmico no rodapé */

var spanAno = document.getElementById('ano-atual');
if (spanAno) {
  spanAno.textContent = new Date().getFullYear();
}
