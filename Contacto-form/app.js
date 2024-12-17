const inputs = document.querySelectorAll(".input");

function focusFunc() {
  let parent = this.parentNode;
  parent.classList.add("focus");
}

function blurFunc() {
  let parent = this.parentNode;
  if (this.value == "") {
    parent.classList.remove("focus");
  }
}

inputs.forEach((input) => {
  input.addEventListener("focus", focusFunc);
  input.addEventListener("blur", blurFunc);
});
  


const form = document.querySelector("form");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  // Obter os valores dos campos
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const message = document.getElementById('message').value.trim();
  const services = document.getElementById('services').value;

  // Armazenar as mensagens de erro
  const errors = [];
  if (!name) errors.push('O campo "Nome de Usuário" está vazio.');
  if (!email) errors.push('O campo "E-mail" está vazio.');
  if (!phone) errors.push('O campo "Telefone" está vazio.');
  if (!message) errors.push('O campo "Mensagem" está vazio.');
  if (!services) errors.push('O campo "Serviços" está vazio.');

  // Validar o telefone
  if (phone && (phone.length < 9 || phone.length > 12)) {
    errors.push('O número de telefone deve ter entre 9 e 12 caracteres.');
  }

  // Validar a mensagem
  if (message && (message.length < 10 || message.length > 5000)) {
    errors.push('A mensagem precisa ter no mínimo 10 letras e no máximo 5000 letras.Não se esqueça de inserir o código promocional para garantir o desconto!');
  }

  // Se houver erros, exiba uma mensagem e interrompa a execução
  if (errors.length > 0) {
    Swal.fire({
      icon: 'error',
      title: 'Erro',
      text: 'Por favor, preencha os seguintes campos corretamente: \n' + errors.join('\n'),
      confirmButtonText: 'Fechar'
    });
    return; // Interrompe o envio
  }

  // Exibir mensagem de carregamento
  const loadingMessage = document.createElement('p');
  loadingMessage.textContent = 'Enviando...';
  form.appendChild(loadingMessage);

  // Enviar os dados para o EmailJS
  emailjs.sendForm('Netzage', 'template_usdpewb', form)
    .then(() => {
      Swal.fire({
        icon: 'success',
        title: 'Sucesso',
        text: 'Mensagem enviada com sucesso!',
        confirmButtonText: 'Ok'
      }).then(() => {
        window.location.href = '../message.html'; // Redireciona para a página de sucesso
        form.reset(); // Reseta o formulário
        loadingMessage.remove(); // Remove a mensagem de carregamento
      });
    })
    .catch((error) => {
      console.error('Erro ao enviar o formulário:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Houve um erro ao enviar sua mensagem. Por favor, tente novamente.',
        confirmButtonText: 'Fechar'
      });
      loadingMessage.remove(); // Remove a mensagem de carregamento
    });
});







 // Codico promocional
 
const baseCode = "netzage2025";
const step = 3;
const maxCode = 4000;
const currentTimestamp = Date.now();
const validityTime = 15 * 60 * 1000; // 15 minutos em milissegundos

// Função para gerar o código promocional
function generatePromoCode() {
  let currentCode = JSON.parse(localStorage.getItem("currentCode")) || 2025;
  if (currentCode >= maxCode) {
    return "Limite de códigos atingido!";
  }
  const promoCode = `${baseCode}-${currentCode}`;
  localStorage.setItem("currentCode", JSON.stringify(currentCode + step));
  return promoCode;
}

// Função para verificar validade e atualizar a exibição
function updatePromoDisplay() {
  const promoCodeElement = document.getElementById("promoCode");
  const expiredMessageElement = document.getElementById("expiredMessage");
  const storedTimestamp = localStorage.getItem("promoTimestamp");

  if (storedTimestamp && currentTimestamp - storedTimestamp < validityTime) {
    const storedCode = localStorage.getItem("promoCode");
    promoCodeElement.textContent = storedCode;
  } else {
    const newCode = generatePromoCode();
    promoCodeElement.textContent = newCode;
    localStorage.setItem("promoCode", newCode);
    localStorage.setItem("promoTimestamp", JSON.stringify(currentTimestamp));
  }

  // Verifica se o código expirou
  setTimeout(() => {
    const timeElapsed = Date.now() - localStorage.getItem("promoTimestamp");
    if (timeElapsed >= validityTime) {
      promoCodeElement.style.display = "none";
      expiredMessageElement.style.display = "block";
      document.getElementById("copyButton").disabled = true;
    }
  }, validityTime - (currentTimestamp - localStorage.getItem("promoTimestamp")));
}

// Função para copiar o código para a área de transferência
function copyToClipboard() {
  const promoCode = document.getElementById("promoCode").textContent;
  navigator.clipboard.writeText(promoCode).then(() => {
    alert("O código promocional foi copiado para a área de transferência!");
  }).catch(() => {
    alert("Erro ao copiar o código!");
  });
}

// Evento de clique no botão de copiar
document.getElementById("copyButton").addEventListener("click", copyToClipboard);

// Atualiza o display do código ao carregar a página
updatePromoDisplay();
 