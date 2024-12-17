'use strict';



/**
 * add Event on elements
 */

const addEventOnElem = function (elem, type, callback) {
  if (elem.length > 1) {
    for (let i = 0; i < elem.length; i++) {
      elem[i].addEventListener(type, callback);
    }
  } else {
    elem.addEventListener(type, callback);
  }
}



/**
 * navbar toggle
 */

const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const navbarLinks = document.querySelectorAll("[data-nav-link]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
}

addEventOnElem(navTogglers, "click", toggleNavbar);

const closeNavbar = function () {
  navbar.classList.remove("active");
  overlay.classList.remove("active");
}

addEventOnElem(navbarLinks, "click", closeNavbar);



/**
 * header & back top btn show when scroll down to 100px
 */

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

const headerActive = function () {
  if (window.scrollY > 80) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
}

addEventOnElem(window, "scroll", headerActive);







    document.addEventListener("DOMContentLoaded", function () {
      // Define o caminho para a página
      var chat = "Contacto-form/form.html";

      // Seleciona todos os botões com a classe 'chat'
      var buttons = document.querySelectorAll(".chat");

      // Adiciona o evento de clique a cada botão
      buttons.forEach(function (button) {
        button.addEventListener("click", function () {
          // Redireciona para a página
          window.location.href = chat;
        });
      });
    });
  

    // Selecionar o link
const privacyLink = document.getElementById("notf2");

// Adicionar evento de clique
privacyLink.addEventListener("click", function () {
    Swal.fire({
        title: 'Política e Privacidade',
        html: `
            <p>
                Respeitamos sua privacidade e estamos comprometidos em proteger suas informações.
                Todas as suas informações pessoais serão tratadas com total segurança e nunca serão compartilhadas sem sua permissão.
            </p>
            <p>
                Se tiver dúvidas, entre em contato: <a href="netzage@gmail.com">netzatge@.com</a>.
            </p>
        `,
        icon: 'info',
        confirmButtonText: 'Entendi',
        confirmButtonColor: '#ff3131',
        backdrop: true,
    });
});




// Selecionar o link
const termsLink = document.getElementById("notf1");

// Adicionar evento de clique
termsLink.addEventListener("click", function () {
    Swal.fire({
        title: 'Termos e Condições',
        html: `
            <p>
                Ao utilizar nossos serviços, você concorda com os seguintes termos:
            </p>
            <ul style="text-align: left;">
                <li>
                    Nossos serviços são fornecidos "como estão" e não garantimos resultados específicos para campanhas de marketing.
                </li>
                <li>
                    Você é responsável por fornecer informações precisas e completas para a execução de estratégias personalizadas.
                </li>
                <li>
                    Reservamo-nos o direito de ajustar nossas políticas e processos para garantir a qualidade do serviço.
                </li>
                <li>
                    Qualquer material ou conteúdo fornecido por você será tratado com confidencialidade.
                </li>
                <li>
                    Não nos responsabilizamos por atrasos ou interrupções causados por fatores fora de nosso controle.
                </li>
            </ul>
            <p>
                Se tiver dúvidas, entre em contato conosco: <a href="mailto:netzage@gmail.com">netzage@.com</a>.
            </p>
        `,
        icon: 'info',
        confirmButtonText: 'Concordo',
        confirmButtonColor: '#ff3131',
        backdrop: true,
    });
});

 

// Selecionar todos os links
const helpCenterLink = document.getElementById("helpCenter");
const partnersLink = document.getElementById("partners");
const suggestionsLink = document.getElementById("suggestions");
const blogLink = document.getElementById("blog-2");
const newslettersLink = document.getElementById("newsletters");

// Função para exibir o alerta
function showAlert(title, message) {
    Swal.fire({
        title: title,
        html: `
            <p>${message}</p>
            <p>Para mais informações, entre em contato conosco pelo email: <a href="mailto:netzage@gmail.com">netzage@.com</a></p>
        `,
        icon: 'info',
        confirmButtonText: 'Entendi',
        confirmButtonColor: '#ff3131',
        backdrop: true,
    });
}

// Adicionar eventos de clique
helpCenterLink.addEventListener("click", function () {
    showAlert('Central de Ajuda', 'A Central de Ajuda ainda está em construção. Em breve, você poderá acessar artigos, tutoriais e muito mais.');
});

partnersLink.addEventListener("click", function () {
    showAlert('Parceiros', 'Nossa página de Parceiros está em desenvolvimento. Em breve, você poderá conhecer as empresas com as quais colaboramos.');
});

suggestionsLink.addEventListener("click", function () {
    showAlert('Sugestões', 'Ainda estamos trabalhando na página de Sugestões. Envie suas ideias e feedback para que possamos melhorar nossos serviços.');
});

blogLink.addEventListener("click", function () {
    showAlert('Blog', 'Nosso Blog está a caminho. Em breve, teremos artigos e atualizações sobre nossos serviços e tendências do setor.');
});

newslettersLink.addEventListener("click", function () {
    showAlert('Boletins Informativos', 'Estamos preparando os Boletins Informativos. Inscreva-se em nossa lista de emails para ficar por dentro das novidades.');
});

 
// Selecionar o link de assinatura (ou agendamento)
const subscriptionLink = document.getElementById("subscriptionLink");

// Selecionar o campo de e-mail usando a classe
const emailField = document.querySelector(".email-field");

// Função para exibir a notificação de agendamento
function showBookingAlert(event) {
    // Impedir o comportamento padrão do link (não recarregar a página)
    event.preventDefault();

    const emailValue = emailField.value.trim();

    // Verificar se o campo de e-mail está vazio
    if (emailValue === "") {
        Swal.fire({
            title: 'Atenção!',
            text: 'Por favor, insira seu e-mail antes de prosseguir com a assinatura.',
            icon: 'warning',
            confirmButtonText: 'OK',
            confirmButtonColor: '#f44336',
        });
    } else if (emailValue.length < 5) {
        // Verificar se o e-mail tem menos de 5 caracteres
        Swal.fire({
            title: 'E-mail inválido',
            text: 'O e-mail deve ter pelo menos 5 caracteres. Por favor, insira um e-mail válido.',
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: '#f44336',
        });
    } else {
        // Se o campo de e-mail estiver preenchido corretamente, mostrar a notificação de agendamento
        Swal.fire({
            title: 'Assinatura enviada com sucesso',
            html: ` 
                <p>Você está prestes a agendar um serviço conosco. Clique em "OK" para prosseguir com o agendamento.</p>
                <p>Você será redirecionado para a página de agendamento.</p>
            `,
            icon: 'info',
            confirmButtonText: 'OK',
            confirmButtonColor: '#007bff',
            backdrop: true,
        }).then((result) => {
            if (result.isConfirmed) {
                // Redireciona o usuário para a página de agendamento
                window.location.href = "Contacto-form/form.html"; // Altere o nome do arquivo conforme necessário
            }
        });
    }
}

// Adicionar evento de clique ao link de agendamento
subscriptionLink.addEventListener("click", showBookingAlert);



// Verifica se o usuário já aceitou os cookies
if (!localStorage.getItem('cookiesAccepted')) {
  // Exibe o banner de cookies com SweetAlert2
  Swal.fire({
    title: 'Usamos Cookies!',
    text: 'Este site utiliza cookies para melhorar sua experiência. Aceita nosso uso de cookies?',
    icon: 'info',
    showCancelButton: true,
    confirmButtonText: 'Aceitar',
    cancelButtonText: 'Recusar',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    footer: '<a href="#" id="notf2" class="footer-bottom-link">Leia nossa política de privacidade</a>'
  }).then((result) => {
    if (result.isConfirmed) {
      // Usuário aceitou
      localStorage.setItem('cookiesAccepted', 'true');
      Swal.fire('Obrigado!', 'Você aceitou o uso de cookies.', 'success');
    } else {
      // Usuário recusou
      Swal.fire('Entendido!', 'Sem cookies personalizados para você.', 'info');
    }
  });
} 

 


// Selecionar todos os links com a classe 'selldow'
const privacyLinks = document.querySelectorAll('.selldow');

// Adicionar evento de clique para cada link
privacyLinks.forEach(link => {
    link.addEventListener("click", function () {
        Swal.fire({
            title: 'Acesso Exclusivo ao Blog!',
            html: `
                <p>
                    🎉 Quando você se tornar nosso cliente, vai receber dicas e novidades exclusivas por e-mail!
                </p>
                <p>
                    📅 Para garantir seu acesso, agende seu serviço agora. Após 2 dias da publicação, você já pode aproveitar o conteúdo!
                </p>
                <p>
                    🔗 Clique aqui para agendar: <a href="agenda.html" target="_blank">Agendar agora</a>
                </p>
                <p>
                    O conteúdo é só para clientes. Não perca!
                </p>
            `,
            icon: 'success',
            confirmButtonText: 'Entendi, quero agendar!',
            confirmButtonColor: '#4CAF50',  // Cor de sucesso
            backdrop: true,
        });
    });
});





 
