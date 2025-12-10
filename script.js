 
        // Menu mobile toggle
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.querySelector('i').classList.toggle('fa-bars');
            hamburger.querySelector('i').classList.toggle('fa-times');
        });
        
        // Fechar menu ao clicar em um link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.querySelector('i').classList.remove('fa-times');
                hamburger.querySelector('i').classList.add('fa-bars');
            });
        });
        
        // FAQ accordion
        document.querySelectorAll('.faq-question').forEach(question => {
            question.addEventListener('click', () => {
                const faqItem = question.parentElement;
                faqItem.classList.toggle('active');
            });
        });
        
        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
        
        // Smooth scroll para links internos
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Adicionar classe ativa ao link do menu conforme scroll
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');
        
        window.addEventListener('scroll', () => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (scrollY >= (sectionTop - 150)) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
   

 














/**
 * SISTEMA DE CADASTRO DE TREINAMENTO - TRÁFEGO PAGO
 * 
 * Este script implementa o fluxo completo de cadastro via SweetAlert2,
 * com validação, envio de email via EmailJS e geração de PDF.
 */

// Configurações do EmailJS (substitua com suas credenciais)
const EMAILJS_CONFIG = {
    serviceId: 'service_t556cw2',
    templateId: 'Netzageexpress2025',
    publicKey: 'RY22s8G5zuFcHB3Sy'
};

// Dados dos planos mapeados a partir dos cards
const PLANOS = {
    1: {
        nome: 'Virtual + Presencial',
        preco: '25.000 Kz',
        descricao: 'Treinamento completo de 1 dia',
        id: 1
    },
    2: {
        nome: 'Já possui cartão',
        preco: '15.000 Kz',
        descricao: 'Para quem já tem cartão virtual',
        id: 2
    },
    3: {
        nome: 'Treinamento Domicílio',
        preco: '25.000 Kz',
        descricao: 'Treinamento personalizado em sua casa',
        id: 3
    }
};

// Informações bancárias para o PDF
const INFO_BANCARIA = {
    banco: 'Banco de Angola',
    iban: 'AO06 0045 0000 0023 1234 5678 9',
    titular: 'Academia de Tráfego Pago Lda',
    linhaApoio: '+244 923 456 789',
    emailSuporte: 'suporte@academiadetraregopago.ao'
};

// Controle de scripts carregados
const SCRIPTS_CARREGADOS = {
    emailjs: false,
    jspdf: false
};

/**
 * Inicializa o sistema e adiciona os event listeners aos botões
 */
function inicializarSistemaCadastro() {
    console.log('Sistema de cadastro inicializado');
    
    // Aguardar o DOM estar completamente carregado
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', configurarEventos);
    } else {
        configurarEventos();
    }
}

/**
 * Configura os eventos de clique nos botões dos cards
 */
function configurarEventos() {
    // Encontrar todos os botões "Escolher Plano"
    const botoesPlano = document.querySelectorAll('.pricing-footer .btn');
    
    if (botoesPlano.length === 0) {
        console.warn('Nenhum botão de plano encontrado. Verifique se o HTML está correto.');
        return;
    }
    
    // Adicionar evento de clique a cada botão
    botoesPlano.forEach((botao, index) => {
        // Determinar qual plano baseado na posição no DOM
        const numeroPlano = index + 1; // 1, 2 ou 3
        
        botao.addEventListener('click', (event) => {
            event.preventDefault();
            iniciarFluxo(numeroPlano);
        });
        
        console.log(`Botão do Plano ${numeroPlano} configurado`);
    });
}

/**
 * Inicia o fluxo de cadastro para o plano escolhido
 * @param {number} planoId - ID do plano (1, 2 ou 3)
 */
async function iniciarFluxo(planoId) {
    const plano = PLANOS[planoId];
    
    if (!plano) {
        Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: 'Plano não encontrado. Por favor, recarregue a página e tente novamente.',
            confirmButtonText: 'OK'
        });
        return;
    }
    
    console.log(`Iniciando fluxo para: ${plano.nome}`);
    
    try {
        // Etapa 1: Validação dos Requisitos Mínimos
        const requisitosAprovados = await validarRequisitos(plano);
        
        if (!requisitosAprovados) {
            return; // Fluxo encerrado
        }
        
        // Etapa 2: Coleta de Dados do Participante
        const dadosAluno = await coletarDados(plano);
        
        if (!dadosAluno) {
            return; // Usuário cancelou
        }
        
        // Preparar os dados para email e PDF
        const dadosCompletos = {
            ...dadosAluno,
            timestamp: Date.now().toString().slice(-8),
            telefoneLimpo: dadosAluno.telefone.replace(/\D/g, ''),
            dataFormatada: new Date(dadosAluno.dataCadastro).toLocaleString('pt-AO', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        };
        
        // Executar ambas as operações em paralelo
        await Promise.allSettled([
            enviarEmail(dadosCompletos),
            gerarPDF(dadosCompletos)
        ]);
        
        // Etapa 5: Confirmação Final
        await confirmacaoFinal(dadosCompletos);
        
    } catch (error) {
        console.error('Erro no fluxo principal:', error);
        Swal.fire({
            icon: 'error',
            title: 'Erro no Processamento',
            html: `
                <div style="text-align: left;">
                    <p>Ocorreu um erro durante o processamento. Por favor:</p>
                    <ul style="margin-left: 20px; margin-top: 10px;">
                        <li>Tente novamente mais tarde</li>
                        <li>Ou entre em contato conosco</li>
                    </ul>
                    <p style="margin-top: 15px;">
                        <strong>WhatsApp:</strong> ${INFO_BANCARIA.linhaApoio}<br>
                        <strong>Email:</strong> ${INFO_BANCARIA.emailSuporte}
                    </p>
                </div>
            `,
            confirmButtonText: 'Entendi'
        });
    }
}

/**
 * Valida os requisitos mínimos do aluno
 * @param {Object} plano - Dados do plano selecionado
 * @returns {Promise<boolean>} - true se aprovado, false caso contrário
 */
async function validarRequisitos(plano) {
    const { value: requisitos } = await Swal.fire({
        title: `<strong>Pré-requisitos para: ${plano.nome}</strong>`,
        html: `
            <div style="text-align: left; margin-top: 20px;">
                <p style="margin-bottom: 15px; color: #555;">Para garantir os melhores resultados no treinamento, é necessário ter:</p>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600;">Você possui computador? *</label>
                    <select id="computador" class="swal2-input" style="display: block; width: 100%;">
                        <option value="">Selecione...</option>
                        <option value="sim">Sim</option>
                        <option value="nao">Não</option>
                    </select>
                </div>
                
                <div style="margin-bottom: 10px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600;">Você possui smartphone? *</label>
                    <select id="smartphone" class="swal2-input" style="display: block; width: 100%;">
                        <option value="">Selecione...</option>
                        <option value="sim">Sim</option>
                        <option value="nao">Não</option>
                    </select>
                </div>
                
                <p style="font-size: 12px; color: #888; margin-top: 15px;">* Campos obrigatórios</p>
            </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Continuar',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            const computador = document.getElementById('computador').value;
            const smartphone = document.getElementById('smartphone').value;
            
            if (!computador || !smartphone) {
                Swal.showValidationMessage('Por favor, responda todas as perguntas');
                return false;
            }
            
            return { computador, smartphone };
        }
    });
    
    if (!requisitos) return false; // Usuário cancelou
    
    // Verificar se atende aos requisitos
    if (requisitos.computador === 'nao' || requisitos.smartphone === 'nao') {
        await Swal.fire({
            icon: 'error',
            title: 'Requisitos não atendidos',
            html: `
                <div style="text-align: left;">
                    <p><strong>Lamentamos, mas não podemos continuar.</strong></p>
                    <p>Estes requisitos são obrigatórios para garantir os resultados do treinamento:</p>
                    <ul style="margin-left: 20px; margin-top: 10px;">
                        <li>Computador</li>
                        <li>Smartphone</li>
                    </ul>
                    <p style="margin-top: 15px;">Entre em contato conosco se tiver dúvidas sobre os requisitos.</p>
                </div>
            `,
            confirmButtonText: 'Entendi'
        });
        return false;
    }
    
    return true;
}

/**
 * Coleta os dados pessoais do aluno
 * @param {Object} plano - Dados do plano selecionado
 * @returns {Promise<Object|null>} - Dados do aluno ou null se cancelado
 */
async function coletarDados(plano) {
    const { value: dados } = await Swal.fire({
        title: `<strong>Dados do Participante</strong>`,
        html: `
            <div style="text-align: left; margin-top: 15px;">
                <p style="margin-bottom: 15px; color: #555;">Preencha seus dados para continuar com a inscrição no plano:</p>
                <p style="background: #f8f9fa; padding: 10px; border-radius: 5px; margin-bottom: 20px;">
                    <strong>Plano:</strong> ${plano.nome}<br>
                    <strong>Valor:</strong> ${plano.preco}
                </p>
                
                <input 
                    id="nome" 
                    class="swal2-input" 
                    placeholder="Nome Completo *" 
                    style="display: block;"
                >
                <input 
                    id="email" 
                    class="swal2-input" 
                    placeholder="E-mail *" 
                    type="email"
                    style="display: block;"
                >
                <input 
                    id="telefone" 
                    class="swal2-input" 
                    placeholder="Telefone (ex: +244 912 345 678) *" 
                    style="display: block;"
                >
                <input 
                    id="morada" 
                    class="swal2-input" 
                    placeholder="Morada (Endereço completo) *" 
                    style="display: block;"
                >
                
                <input 
                    id="plano" 
                    type="hidden" 
                    value="${plano.id}"
                >
                
                <p style="font-size: 12px; color: #888; margin-top: 10px;">* Campos obrigatórios</p>
            </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Próximo',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            const nome = document.getElementById('nome').value.trim();
            const email = document.getElementById('email').value.trim();
            const telefone = document.getElementById('telefone').value.trim();
            const morada = document.getElementById('morada').value.trim();
            const planoId = document.getElementById('plano').value;
            
            // Validações
            if (!nome || !email || !telefone || !morada) {
                Swal.showValidationMessage('Por favor, preencha todos os campos obrigatórios');
                return false;
            }
            
            // Validação básica de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                Swal.showValidationMessage('Por favor, insira um email válido');
                return false;
            }
            
            // Validação básica de telefone (pelo menos 9 dígitos)
            const telefoneLimpo = telefone.replace(/\D/g, '');
            if (telefoneLimpo.length < 9) {
                Swal.showValidationMessage('Por favor, insira um número de telefone válido');
                return false;
            }
            
            return {
                nome,
                email,
                telefone,
                morada,
                planoId: parseInt(planoId),
                planoNome: plano.nome,
                planoPreco: plano.preco,
                dataCadastro: new Date().toISOString()
            };
        }
    });
    
    return dados;
}

/**
 * Envia os dados do aluno via EmailJS
 * @param {Object} dadosAluno - Dados completos do aluno
 * @returns {Promise<boolean>} - true se enviado com sucesso
 */
async function enviarEmail(dadosAluno) {
    let loaderExibido = false;
    
    try {
        // Carregar EmailJS se ainda não estiver carregado
        if (!SCRIPTS_CARREGADOS.emailjs) {
            await carregarScript('https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js');
            SCRIPTS_CARREGADOS.emailjs = true;
        }
        
        // Inicializar EmailJS com a chave pública
        emailjs.init(EMAILJS_CONFIG.publicKey);
        
        // Mostrar loader
        Swal.fire({
            title: 'Enviando dados...',
            text: 'Por favor, aguarde enquanto processamos sua inscrição.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
                loaderExibido = true;
            }
        });
        
        // Preparar template parameters com todos os dados necessários
        const templateParams = {
            nome_completo: dadosAluno.nome,
            email: dadosAluno.email,
            telefone: dadosAluno.telefone,
            telefone_limpo: dadosAluno.telefoneLimpo,
            morada: dadosAluno.morada,
            plano: dadosAluno.planoNome,
            preco: dadosAluno.planoPreco,
            data_cadastro: dadosAluno.dataFormatada,
            data_envio: new Date().toLocaleString('pt-AO'),
            timestamp: dadosAluno.timestamp
        };
        
        console.log('Enviando email com parâmetros:', templateParams);
        
        // Enviar email
        const response = await emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.templateId,
            templateParams
        );
        
        console.log('Email enviado com sucesso:', response);
        
        if (loaderExibido) {
            Swal.close();
        }
        
        return true;
        
    } catch (error) {
        console.error('Erro ao enviar email:', error);
        
        if (loaderExibido) {
            Swal.close();
        }
        
        // Não interrompemos o fluxo, apenas registramos o erro
        console.warn('O email não pôde ser enviado, mas o processo continuará.');
        return false;
    }
}

/**
 * Gera e faz download do PDF com os dados do aluno
 * @param {Object} dadosAluno - Dados completos do aluno
 * @returns {Promise<boolean>} - true se gerado com sucesso
 */
 
async function gerarPDF(dadosAluno) {
    try {
        // Carregar jsPDF se ainda não estiver carregado
        if (!SCRIPTS_CARREGADOS.jspdf) {
            await carregarScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
            SCRIPTS_CARREGADOS.jspdf = true;
        }
        
        // Informações bancárias atualizadas
        const INFO_BANCARIA_ATUALIZADA = {
            banco: 'BANCO BAI',
            conta: '0040.0000.1403.9597.1019.8',
            titular: 'PASCOAL ZAGE',
            linhaApoio1: '930 620 876',
            linhaApoio2: '921 500 330',
            email1: 'netzage@gmail.com',
            email2: 'pascoalzage54@gmail.com'
        };
        
        // Criar novo documento PDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });
        
        // Configurações
        const margin = 20;
        const pageWidth = doc.internal.pageSize.getWidth();
        const contentWidth = pageWidth - (2 * margin);
        let yPosition = margin;
        
        // ========== CABEÇALHO PROFISSIONAL ==========
        // Fundo do cabeçalho
        doc.setFillColor(41, 128, 185); // Azul profissional
        doc.rect(0, 0, pageWidth, 45, 'F');
        
        // Título principal (menor para não conflitar)
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.text('COMPROVANTE DE INSCRIÇÃO', pageWidth / 2, 30, { align: 'center' });
        
        // Subtítulo menor
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('Treinamento Profissional em Tráfego Pago', pageWidth / 2, 36, { align: 'center' });
        
        // ========== LOGO ==========
        yPosition = 50; // Espaço após cabeçalho
        
        try {
            // Tentar carregar a imagem da logo
            const logoImg = new Image();
            logoImg.crossOrigin = 'Anonymous';
            logoImg.src = '../assets/logo.png';
            
            await new Promise((resolve, reject) => {
                logoImg.onload = resolve;
                logoImg.onerror = () => {
                    console.log('Logo não encontrado, usando texto alternativo');
                    // Logo em texto se imagem não disponível
                    doc.setFontSize(18);
                    doc.setFont('helvetica', 'bold');
                    doc.setTextColor(41, 128, 185);
                    doc.text('NETZAGE', pageWidth / 2, yPosition, { align: 'center' });
                    resolve();
                };
            });
            
            // Se a imagem carregou, adicioná-la
            if (logoImg.complete && logoImg.naturalHeight !== 0) {
                const logoWidth = 40;
                const logoHeight = 15;
                const logoX = (pageWidth - logoWidth) / 2;
                
                doc.addImage(logoImg, 'PNG', logoX, yPosition - 10, logoWidth, logoHeight);
                yPosition += 10; // Ajustar posição após logo
            }
        } catch (error) {
            console.log('Erro ao carregar logo, usando texto:', error);
            doc.setFontSize(18);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(41, 128, 185);
            doc.text('NETZAGE', pageWidth / 2, yPosition, { align: 'center' });
        }
        
        yPosition += 15;
        
        // ========== SEÇÃO: DADOS DO PARTICIPANTE ==========
        // Título da seção
        doc.setFillColor(245, 245, 245);
        doc.roundedRect(margin, yPosition, contentWidth, 8, 2, 2, 'F');
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(41, 128, 185);
        doc.text('DADOS DO PARTICIPANTE', margin + 5, yPosition + 5.5);
        
        yPosition += 12;
        
        // Tabela de informações com fonte melhorada
        const dadosParticipante = [
            { label: 'Nome Completo:', value: dadosAluno.nome },
            { label: 'Email:', value: dadosAluno.email },
            { label: 'Telefone:', value: dadosAluno.telefone },
            { label: 'Morada:', value: dadosAluno.morada }
        ];
        
        dadosParticipante.forEach((item, index) => {
            // Label em negrito
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(60, 60, 60);
            doc.text(item.label, margin, yPosition);
            
            // Valor em normal
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(30, 30, 30);
            const textWidth = doc.getTextWidth(item.label);
            
            // Quebrar texto longo se necessário
            const maxWidth = contentWidth - textWidth - 15;
            if (doc.getTextWidth(item.value) > maxWidth) {
                const lines = doc.splitTextToSize(item.value, maxWidth);
                lines.forEach((line, lineIndex) => {
                    doc.text(line, margin + textWidth + 5, yPosition + (lineIndex * 4.5));
                });
                yPosition += (lines.length * 4.5);
            } else {
                doc.text(item.value, margin + textWidth + 5, yPosition);
                yPosition += 7;
            }
        });
        
        yPosition += 8;
        
        // ========== SEÇÃO: DETALHES DO PLANO ==========
        // Título da seção
        doc.setFillColor(245, 245, 245);
        doc.roundedRect(margin, yPosition, contentWidth, 8, 2, 2, 'F');
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(41, 128, 185);
        doc.text('DETALHES DO PLANO', margin + 5, yPosition + 5.5);
        
        yPosition += 12;
        
        // Card do plano
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(220, 220, 220);
        doc.setLineWidth(0.5);
        doc.roundedRect(margin, yPosition, contentWidth, 30, 3, 3, 'S');
        
        // Ícone do plano
        doc.setFontSize(20);
        doc.setTextColor(41, 128, 185);
        doc.text('🎯', margin + 8, yPosition + 10);
        
        // Nome do plano
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 30, 30);
        
        // Quebrar nome do plano se for muito longo
        const maxPlanWidth = contentWidth - 50;
        const planLines = doc.splitTextToSize(dadosAluno.planoNome, maxPlanWidth);
        planLines.forEach((line, lineIndex) => {
            doc.text(line, margin + 22, yPosition + 10 + (lineIndex * 6));
        });
        
        // Valor
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(39, 174, 96); // Verde
        doc.text(dadosAluno.planoPreco, pageWidth - margin - 8, yPosition + 10, { align: 'right' });
        
        // Data de inscrição
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        doc.text(`Data: ${dadosAluno.dataFormatada}`, margin + 22, yPosition + 20);
        
        // Status
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(231, 76, 60); // Vermelho
        doc.text('Status: Pendente', margin + 22, yPosition + 26);
        
        yPosition += 35;
        
        // ========== SEÇÃO: INFORMAÇÕES DE PAGAMENTO ==========
        // Título da seção
        doc.setFillColor(245, 245, 245);
        doc.roundedRect(margin, yPosition, contentWidth, 8, 2, 2, 'F');
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(41, 128, 185);
        doc.text('INFORMAÇÕES PARA PAGAMENTO', margin + 5, yPosition + 5.5);
        
        yPosition += 12;
        
        // Card das informações bancárias
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(41, 128, 185);
        doc.setLineWidth(0.8);
        doc.roundedRect(margin, yPosition, contentWidth, 45, 3, 3, 'S');
        
        let bankY = yPosition + 8;
        
        // Banco em destaque
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(41, 128, 185);
        doc.text('BANCO BAI', margin + 8, bankY);
        
        bankY += 7;
        
        // Conta bancária
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(60, 60, 60);
        doc.text('Conta:', margin + 8, bankY);
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 30, 30);
        doc.text(INFO_BANCARIA_ATUALIZADA.conta, pageWidth - margin - 8, bankY, { align: 'right' });
        
        bankY += 7;
        
        // Titular
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(60, 60, 60);
        doc.text('Titular:', margin + 8, bankY);
        
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(30, 30, 30);
        doc.text(INFO_BANCARIA_ATUALIZADA.titular, margin + 25, bankY);
        
        bankY += 6;
        
        // Linhas de apoio
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(60, 60, 60);
        doc.text('WhatsApp:', margin + 8, bankY);
        
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(30, 30, 30);
        doc.text(INFO_BANCARIA_ATUALIZADA.linhaApoio1, margin + 28, bankY);
        doc.text(INFO_BANCARIA_ATUALIZADA.linhaApoio2, pageWidth - margin - 8, bankY, { align: 'right' });
        
        bankY += 6;
        
        // Emails
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(60, 60, 60);
        doc.text('Email:', margin + 8, bankY);
        
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(30, 30, 30);
        doc.text(INFO_BANCARIA_ATUALIZADA.email1, margin + 22, bankY);
        
        bankY += 5;
        doc.text(INFO_BANCARIA_ATUALIZADA.email2, margin + 22, bankY);
        
        yPosition += 50;
        
        // ========== SEÇÃO: INSTRUÇÕES ==========
        // Título da seção
        doc.setFillColor(255, 243, 205); // Fundo amarelo claro para alerta
        doc.roundedRect(margin, yPosition, contentWidth, 8, 2, 2, 'F');
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(193, 105, 0); // Laranja para alertas
        doc.text('INSTRUÇÕES IMPORTANTES', margin + 5, yPosition + 5.5);
        
        yPosition += 12;
        
        // Lista de instruções
        const instrucoes = [
            { icon: '📅', text: 'Pagamento deve ser feito até 2 dias antes do evento' },
            { icon: '⚠️', text: 'Envio do comprovante não garante vaga se esgotarem' },
            { icon: '💸', text: 'Pagamento após vagas esgotadas = devolução total' },
            { icon: '📱', text: `Enviar comprovante para: ${INFO_BANCARIA_ATUALIZADA.linhaApoio1}` },
            { icon: '📧', text: `Ou para: ${INFO_BANCARIA_ATUALIZADA.email1}` },
            { icon: '🔒', text: 'Guarde este documento para referência' }
        ];
        
        instrucoes.forEach((instrucao, index) => {
            // Verificar se precisa de nova página
            if (yPosition > 250) {
                doc.addPage();
                yPosition = margin;
            }
            
            // Ícone
            doc.setFontSize(10);
            doc.setTextColor(41, 128, 185);
            doc.text(instrucao.icon, margin, yPosition + 3);
            
            // Texto
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(50, 50, 50);
            
            const maxTextWidth = contentWidth - 12;
            const lines = doc.splitTextToSize(instrucao.text, maxTextWidth);
            
            lines.forEach((line, lineIndex) => {
                doc.text(line, margin + 8, yPosition + 3 + (lineIndex * 4));
            });
            
            yPosition += (lines.length * 4) + 3;
        });
        
        yPosition += 5;
        
        // ========== RODAPÉ ==========
        // Linha divisória
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.3);
        doc.line(margin, 270, pageWidth - margin, 270);
        
        // Número de inscrição
        const numeroInscricao = `INSC-${dadosAluno.timestamp}`;
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(100, 100, 100);
        doc.text(`Nº: ${numeroInscricao}`, margin, 275);
        
        // Data de geração
        const dataGeracao = new Date().toLocaleString('pt-AO', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        doc.text(`Gerado: ${dataGeracao}`, pageWidth / 2, 275, { align: 'center' });
        
        // Contato rápido
        doc.setFontSize(7);
        doc.setFont('helvetica', 'italic');
        doc.text(`WhatsApp: ${INFO_BANCARIA_ATUALIZADA.linhaApoio1}`, pageWidth - margin, 275, { align: 'right' });
        
        // ========== MARCA D'ÁGUA ==========
        doc.setFontSize(40);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(240, 240, 240);
        doc.setGState(new doc.GState({ opacity: 0.07 }));
        doc.text('NETZAGE', pageWidth / 2, 150, { align: 'center', angle: 45 });
        doc.setGState(new doc.GState({ opacity: 1 }));
        
        // ========== SALVAR PDF ==========
        const nomeArquivo = `Netzage-Inscricao-${dadosAluno.nome.replace(/\s+/g, '_').substring(0, 20)}.pdf`;
        doc.save(nomeArquivo);
        
        console.log('PDF profissional gerado:', nomeArquivo);
        return true;
        
    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        
        // Versão de fallback mais simples
        try {
            await gerarPDFSimples(dadosAluno);
        } catch (fallbackError) {
            throw new Error('Falha na geração do PDF');
        }
    }
}

// Versão simplificada de fallback
async function gerarPDFSimples(dadosAluno) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const INFO = {
        banco: 'BANCO BAI',
        conta: '0040.0000.1403.9597.1019.8',
        titular: 'PASCOAL ZAGE',
        telefone1: '930 620 876',
        telefone2: '921 500 330',
        email1: 'netzage@gmail.com',
        email2: 'pascoalzage54@gmail.com'
    };
    
    let y = 20;
    
    // Título
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('NETZAGE - Comprovante', 20, y);
    y += 8;
    
    doc.setFontSize(12);
    doc.text('Treinamento Tráfego Pago', 20, y);
    y += 15;
    
    // Dados
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Participante:', 20, y);
    doc.setFont('helvetica', 'normal');
    doc.text(dadosAluno.nome, 45, y);
    y += 7;
    
    doc.setFont('helvetica', 'bold');
    doc.text('Plano:', 20, y);
    doc.setFont('helvetica', 'normal');
    doc.text(dadosAluno.planoNome, 35, y);
    doc.text(dadosAluno.planoPreco, 180, y, { align: 'right' });
    y += 7;
    
    doc.setFont('helvetica', 'bold');
    doc.text('Data:', 20, y);
    doc.setFont('helvetica', 'normal');
    doc.text(dadosAluno.dataFormatada, 35, y);
    y += 15;
    
    // Pagamento
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Pagamento:', 20, y);
    y += 8;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Banco:', 20, y);
    doc.setFont('helvetica', 'normal');
    doc.text(INFO.banco, 35, y);
    y += 6;
    
    doc.setFont('helvetica', 'bold');
    doc.text('Conta:', 20, y);
    doc.setFont('helvetica', 'normal');
    doc.text(INFO.conta, 35, y);
    y += 6;
    
    doc.setFont('helvetica', 'bold');
    doc.text('Titular:', 20, y);
    doc.setFont('helvetica', 'normal');
    doc.text(INFO.titular, 40, y);
    y += 6;
    
    doc.setFont('helvetica', 'bold');
    doc.text('WhatsApp:', 20, y);
    doc.setFont('helvetica', 'normal');
    doc.text(`${INFO.telefone1} / ${INFO.telefone2}`, 40, y);
    y += 6;
    
    doc.setFont('helvetica', 'bold');
    doc.text('Email:', 20, y);
    doc.setFont('helvetica', 'normal');
    doc.text(INFO.email1, 35, y);
    y += 5;
    doc.text(INFO.email2, 35, y);
    y += 10;
    
    doc.setFontSize(9);
    doc.text(`Enviar comprovante para WhatsApp`, 20, y);
    y += 5;
    doc.text(`Nº Inscrição: INSC-${dadosAluno.timestamp}`, 20, y);
    
    doc.save(`Inscricao-${dadosAluno.nome.replace(/\s/g, '_')}.pdf`);
}

/**
 * Exibe a confirmação final do cadastro
 * @param {Object} dadosAluno - Dados completos do aluno
 */
async function confirmacaoFinal(dadosAluno) {
    await Swal.fire({
        icon: 'success',
        title: 'Cadastro Concluído!',
        html: `
            <div style="text-align: left;">
                <p><strong>Parabéns, ${dadosAluno.nome.split(' ')[0]}!</strong></p>
                <p>Seu cadastro no plano <strong>${dadosAluno.planoNome}</strong> foi concluído com sucesso.</p>
                
                <div style="background: #e8f4fc; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #2980b9;">
                    <p style="margin: 0 0 10px 0; color: #2980b9; font-weight: 600;">✓ Confirmações recebidas:</p>
                    <ul style="margin: 0 0 0 20px;">
                        <li>Dados registrados no sistema</li>
                        <li>Email de confirmação enviado</li>
                        <li>PDF gerado e baixado automaticamente</li>
                    </ul>
                </div>
                
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
                    <p><strong>Próximos passos:</strong></p>
                    <ol style="margin-left: 20px; margin-top: 10px;">
                        <li>Verifique sua caixa de email (incluindo spam)</li>
                        <li>Para garantir sua vaga, envie o comprovante de pagamento para nosso WhatsApp</li>
                        <li>As instruções completas estão no PDF gerado</li>
                        <li>Nossa equipe entrará em contato em até 24h</li>
                    </ol>
                </div>
                
                <p style="margin-top: 15px; font-size: 14px;">
                    <strong>WhatsApp:</strong> ${INFO_BANCARIA.linhaApoio}<br>
                    <strong>Email:</strong> ${INFO_BANCARIA.emailSuporte}<br>
                    <strong>Nº de Inscrição:</strong> INSC-${dadosAluno.timestamp}
                </p>
            </div>
        `,
        confirmButtonText: 'Entendi',
        confirmButtonColor: '#2980b9',
        width: 600,
        allowOutsideClick: false
    });
}

/**
 * Carrega um script externo dinamicamente
 * @param {string} src - URL do script
 * @returns {Promise} - Promise que resolve quando o script é carregado
 */
function carregarScript(src) {
    return new Promise((resolve, reject) => {
        // Verificar se o script já existe
        if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
        }
        
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
            console.log(`Script carregado: ${src}`);
            resolve();
        };
        script.onerror = (error) => {
            console.error(`Erro ao carregar script ${src}:`, error);
            reject(error);
        };
        document.head.appendChild(script);
    });
}

/**
 * Função auxiliar para garantir que SweetAlert2 esteja disponível
 */
function verificarDependencias() {
    if (typeof Swal === 'undefined') {
        console.error('SweetAlert2 não está carregado!');
        return false;
    }
    return true;
}

// Inicializar o sistema quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    if (verificarDependencias()) {
        inicializarSistemaCadastro();
    } else {
        console.error('Não foi possível inicializar o sistema: dependências faltando.');
        // Exibir mensagem de erro amigável para o usuário
        const botoes = document.querySelectorAll('.pricing-footer .btn');
        botoes.forEach(botao => {
            botao.addEventListener('click', function(e) {
                e.preventDefault();
                alert('Sistema temporariamente indisponível. Por favor, recarregue a página ou tente mais tarde.');
            });
        });
    }
});

// Também inicializar se o DOM já estiver carregado
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(function() {
        if (verificarDependencias()) {
            inicializarSistemaCadastro();
        }
    }, 100);
}