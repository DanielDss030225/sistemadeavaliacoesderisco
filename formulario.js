
        // Configuração do Firebase
import { firebaseConfig } from './firebaseConfig.js';


        // Inicializar Firebase
        firebase.initializeApp(firebaseConfig);
        const database = firebase.database();
        const storage = firebase.storage();

        // Variáveis globais
        let avaliacaoId = null;
        let formData = {};
        let blocosPendentes = [1, 2, 3, 4, 5, 6, 7, 8];
        let blocosPreenchidos = [];
        let currentTab = 1;

        // Função para obter parâmetros da URL
        function getUrlParameter(name) {
            name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
            const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
            const results = regex.exec(location.search);
            return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
        }


        // Verificar se é uma edição de avaliação existente
        document.addEventListener('DOMContentLoaded', function() {
            avaliacaoId = getUrlParameter('id');
            
            if (avaliacaoId) {
                // Carregar dados da avaliação existente
                carregarDadosAvaliacao(avaliacaoId);
                
            } else {
                // Nova avaliação - mostrar apenas a primeira aba
                showTab(1);
                atualizarBarraProgresso();
            }

            // Inicializar eventos
            inicializarEventos();
        });

        // Função para mostrar uma aba específica
   function showTab(tabNumber) {
    const baseElement = document.querySelector('.base');
    if (baseElement) {
        baseElement.scrollTo({ top: 0, behavior: 'auto' }); // instantâneo
    }

    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    document.querySelectorAll('.tab-item').forEach(item => {
        item.classList.remove('active');
    });

    document.getElementById(`tab${tabNumber}`).classList.add('active');
    document.querySelector(`[data-tab="${tabNumber}"]`).classList.add('active');

    currentTab = tabNumber;
    atualizarBarraProgresso();
}

const steps = document.querySelectorAll('.progress-step');

steps.forEach(step => {
  step.addEventListener('click', () => {
    // Remove 'active' de todos
    steps.forEach(s => s.classList.remove('active'));
    
    // Adiciona 'active' ao clicado
    step.classList.add('active');
  });
});


        // Função para carregar dados da avaliação existente
        function carregarDadosAvaliacao(id) {
            const avaliacaoRef = database.ref('avaliacoes/' + id);
            
            avaliacaoRef.once('value', (snapshot) => {
                if (snapshot.exists()) {
                    formData = snapshot.val();
                    
                    // Preencher os campos do formulário com os dados carregados
                    preencherFormulario(formData);
                    
                    // Atualizar blocos preenchidos/pendentes
                    atualizarBlocosPendentes();
                    
                    // Mostrar a primeira aba
                    showTab(1);
                    
                    // Se não houver pendências, mostrar botão de visualização
                    if (blocosPendentes.length === 0) {
                        document.getElementById('btnVisualizar').style.display = 'block';
                    }
                } else {
                    console.error('Avaliação não encontrada');
                    alert('Avaliação não encontrada!');
                    window.location.href = 'index.html';
                }
            }).catch((error) => {
                console.error('Erro ao carregar dados:', error);
                alert('Erro ao carregar dados da avaliação!');
            });
        }

        // Função para preencher o formulário com os dados carregados
        function preencherFormulario(data) {
            
            // Preencher campos de texto
            const textInputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="number"], textarea, input[type="hidden"]');
            textInputs.forEach(input => {
                if (data[input.id]) {
                    input.value = data[input.id];
                }
            });
            
            // Preencher campo de assinatura se houver URL
            if (data.signatureUrl) {
                const signaturePreview = document.getElementById("signaturePreview");
                const signaturePreviewContainer = document.getElementById("signaturePreviewContainer");
                signaturePreview.src = data.signatureUrl;
                signaturePreviewContainer.style.display = "block";
                document.getElementById("btnSalvarAssinatura").style.display = "none"; // Esconder botão de salvar se já tiver assinatura
                document.getElementById("uploadStatus").textContent = "Assinatura carregada.";
            }
            
            // Preencher campos de data
            const dateInputs = document.querySelectorAll('input[type="date"]');
            dateInputs.forEach(input => {
                if (data[input.id]) {
                    input.value = data[input.id];
                }
            });
            
            // Preencher checkboxes
            const checkboxes = document.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                if (data[checkbox.name] && data[checkbox.name].includes(checkbox.value)) {
                    checkbox.checked = true;
                }
            });
            
            // Preencher radio buttons
            const radios = document.querySelectorAll('input[type="radio"]');
            radios.forEach(radio => {
                if (data[radio.name] === radio.value) {
                    radio.checked = true;
                }
            });
            
            // Mostrar/ocultar campos condicionais
            if (data.separados === 'sim') {
                document.getElementById('tempoSeparacaoRow').style.display = 'flex';
            }
            
            if (data.mpu === 'sim' || data.mpu === 'solicitou') {
                document.getElementById('mpuDetalhesRow').style.display = 'block';
            }
            
            if (data.representou === 'sim') {
                document.getElementById('dataRepresentacaoRow').style.display = 'flex';
            }
            
            if (data.nacionalidadeVitima === 'estrangeira') {
                document.getElementById('paisEstrangeiroVitimaRow').style.display = 'flex';
            }
            
            if (data.nacionalidadeAgressor === 'estrangeiro') {
                document.getElementById('paisEstrangeiroAgressorRow').style.display = 'flex';
            }
            
            if (data.pmVitima === 'sim') {
                document.getElementById('unidadePMVitimaRow').style.display = 'flex';
            }
            
            if (data.pmAgressor === 'sim') {
                document.getElementById('unidadePMAgressorRow').style.display = 'flex';
            }
            
            if (data.antecedentesCriminaisAgressor === 'sim') {
                document.getElementById('artigosAntecedentesAgressorRow').style.display = 'flex';
            }
            
            if (data.temFilhos === 'sim-com-agressor' || data.temFilhos === 'sim-outro-relacionamento') {
                document.getElementById('filhosDetalhesRow').style.display = 'block';
            }
            
            if (data.acompanhamentoPsicologicoVitima === 'sim') {
                document.getElementById('orgaoAcompanhamentoRow').style.display = 'block';
            }
            
            if (data.localSeguro === 'sim') {
                document.getElementById('localSeguroDetalhesRow').style.display = 'flex';
            }
            
            if (data.situacaoMoradia === 'cedida') {
                document.getElementById('cedidaPorQuemRow').style.display = 'block';
            }



        }

        // Função para atualizar blocos pendentes
        function atualizarBlocosPendentes() {
            blocosPendentes = [];
            blocosPreenchidos = [];
            
            // Verificar cada bloco
            for (let i = 1; i <= 8; i++) {
                if (verificarBlocoPreenchido(i)) {
                    blocosPreenchidos.push(i);
                } else {
                    blocosPendentes.push(i);
                }
            }
        }

        // Função para verificar se um bloco está preenchido
        function verificarBlocoPreenchido(blocoNum) {
         
            switch (blocoNum) {
                case 1:
                    return formData.nomeVitima && formData.cpfVitima && formData.rgVitima;
                case 2:
                    return formData.nomeAgressor && formData.cpfAgressor && formData.rgAgressor;
                case 3:
                    return formData.tempoRelacionamento && formData.separados;
                case 4:
                    return formData.agressaoFisica || formData.atendimentoMedico || formData.violenciaPsicologica;
                case 5:
                    return formData.usoSubstancias || formData.doencaMental || formData.acompanhamentoPsicologico;
                case 6:
                    return formData.separacaoRecente && formData.temFilhos && formData.filhoDeficiencia && formData.conflitoGuardaFilhos;
                case 7:
                    return formData.localRisco && formData.situacaoMoradia && formData.dependenciaFinanceira;
                case 8:
                    return formData.nomeCompleto && formData.preenchimento && formData.grauRisco;
                default:
                    return false;
            }
        }
        // Função para atualizar a barra de progresso
        // outro arquivo .js

        function atualizarBarraProgresso() {
            // Resetar todos os passos
            for (let i = 1; i <= 8; i++) {
                const step = document.getElementById(`step${i}`);
                step.className = 'progress-step';
            }
            
            // Marcar passos preenchidos
            blocosPreenchidos.forEach(num => {
                document.getElementById(`step${num}`).classList.add('completed');
            });
            
            // Marcar passos pendentes
            blocosPendentes.forEach(num => {
                document.getElementById(`step${num}`).classList.add('pending');
            });
            
            // Marcar passo ativo
            document.getElementById(`step${currentTab}`).classList.add('active');


        }


        // Função para inicializar eventos
        function inicializarEventos() {
            // Eventos para os itens de navegação das abas
            document.querySelectorAll('.tab-item').forEach(item => {
                item.addEventListener('click', function() {
                    const tabNum = parseInt(this.getAttribute('data-tab'));
                    showTab(tabNum);
                });
            });
            
            // Eventos para os passos da barra de progresso
            document.querySelectorAll('.progress-step').forEach(step => {
                step.addEventListener('click', function() {
                    const stepNum = parseInt(this.getAttribute('data-step'));
                    showTab(stepNum);
                });
            });
            
            // Eventos para campos condicionais
            document.querySelectorAll('input[name="separados"]').forEach(radio => {
                radio.addEventListener('change', function() {
                    document.getElementById('tempoSeparacaoRow').style.display = this.value === 'sim' ? 'flex' : 'none';
                });
            });
            
            document.querySelectorAll('input[name="mpu"]').forEach(radio => {
                radio.addEventListener('change', function() {
                    document.getElementById('mpuDetalhesRow').style.display = (this.value === 'sim' || this.value === 'solicitou') ? 'block' : 'none';
                });
            });
            
            document.querySelectorAll('input[name="representou"]').forEach(radio => {
                radio.addEventListener('change', function() {
                    document.getElementById('dataRepresentacaoRow').style.display = this.value === 'sim' ? 'flex' : 'none';
                });
            });
            
            document.querySelectorAll('input[name="nacionalidadeVitima"]').forEach(radio => {
                radio.addEventListener('change', function() {
                    document.getElementById('paisEstrangeiroVitimaRow').style.display = this.value === 'estrangeira' ? 'flex' : 'none';
                });
            });
            
            document.querySelectorAll('input[name="nacionalidadeAgressor"]').forEach(radio => {
                radio.addEventListener('change', function() {
                    document.getElementById('paisEstrangeiroAgressorRow').style.display = this.value === 'estrangeiro' ? 'flex' : 'none';
                });
            });
            
            document.querySelectorAll('input[name="pmVitima"]').forEach(radio => {
                radio.addEventListener('change', function() {
                    document.getElementById('unidadePMVitimaRow').style.display = this.value === 'sim' ? 'flex' : 'none';
                });
            });
            
            document.querySelectorAll('input[name="pmAgressor"]').forEach(radio => {
                radio.addEventListener('change', function() {
                    document.getElementById('unidadePMAgressorRow').style.display = this.value === 'sim' ? 'flex' : 'none';
                });
            });
            
            document.querySelectorAll('input[name="antecedentesCriminaisAgressor"]').forEach(radio => {
                radio.addEventListener('change', function() {
                    document.getElementById('artigosAntecedentesAgressorRow').style.display = this.value === 'sim' ? 'flex' : 'none';
                });
            });
            
            document.querySelectorAll('input[name="temFilhos"]').forEach(radio => {
                radio.addEventListener('change', function() {
                    document.getElementById('filhosDetalhesRow').style.display = (this.value === 'sim-com-agressor' || this.value === 'sim-outro-relacionamento') ? 'block' : 'none';
                });
            });
            
            document.querySelectorAll('input[name="acompanhamentoPsicologicoVitima"]').forEach(radio => {
                radio.addEventListener('change', function() {
                    document.getElementById('orgaoAcompanhamentoRow').style.display = this.value === 'sim' ? 'block' : 'none';
                });
            });
            
            document.querySelectorAll('input[name="localSeguro"]').forEach(radio => {
                radio.addEventListener('change', function() {
                    document.getElementById('localSeguroDetalhesRow').style.display = this.value === 'sim' ? 'flex' : 'none';
                });
            });
            
            document.querySelectorAll('input[name="situacaoMoradia"]').forEach(radio => {
                radio.addEventListener('change', function() {
                    document.getElementById('cedidaPorQuemRow').style.display = this.value === 'cedida' ? 'block' : 'none';
                });
            });
            
            // Eventos para botões de navegação
            document.getElementById('btnProximo1').addEventListener('click', function() {
                navegarParaAba(2);
            });
            
            document.getElementById('btnVoltar2').addEventListener('click', function() {
                navegarParaAba(1);
            });
            
            document.getElementById('btnProximo2').addEventListener('click', function() {
                navegarParaAba(3);
            });
            
            document.getElementById('btnVoltar3').addEventListener('click', function() {
                navegarParaAba(2);
            });
            
            document.getElementById('btnProximo3').addEventListener('click', function() {
                navegarParaAba(4);
            });
            
            document.getElementById('btnVoltar4').addEventListener('click', function() {
                navegarParaAba(3);
            });
            
            document.getElementById('btnProximo4').addEventListener('click', function() {
                navegarParaAba(5);
            });
            
            document.getElementById('btnVoltar5').addEventListener('click', function() {
                navegarParaAba(4);
            });
            
            document.getElementById('btnProximo5').addEventListener('click', function() {
                navegarParaAba(6);
            });
            
            document.getElementById('btnVoltar6').addEventListener('click', function() {
                navegarParaAba(5);
            });
            
            document.getElementById('btnProximo6').addEventListener('click', function() {
                navegarParaAba(7);
            });
            
            document.getElementById('btnVoltar7').addEventListener('click', function() {
                navegarParaAba(6);
            });
            
            document.getElementById('btnProximo7').addEventListener('click', function() {
                navegarParaAba(8);
            });
            
            document.getElementById('btnVoltar8').addEventListener('click', function() {
                navegarParaAba(7);
            });
            
            // Evento para o botão de assinatura
            document.getElementById("btnAssinatura").addEventListener("click", function() {
                document.getElementById("signatureFileInput").click();
            });


// Evento para o input de arquivo de assinatura (com redimensionamento para o preview)
document.getElementById("signatureFileInput").addEventListener("change", function (event) {
    const file = event.target.files[0];
    const signaturePreview = document.getElementById("signaturePreview");
    const signaturePreviewContainer = document.getElementById("signaturePreviewContainer");
    const btnSalvarAssinatura = document.getElementById("btnSalvarAssinatura");
    const uploadStatus = document.getElementById("uploadStatus");

    if (!file || !file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
        alert("Por favor, selecione uma imagem válida (JPG, PNG, máx 5MB).");
        signaturePreviewContainer.style.display = "none";
        btnSalvarAssinatura.style.display = "none";
        uploadStatus.textContent = "";
        return;
    }

    const img = new Image();
    const reader = new FileReader();

    reader.onload = function (e) {
        img.onload = function () {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            const targetWidth = 300;
            const targetHeight = 100;

            canvas.width = targetWidth;
            canvas.height = targetHeight;

            ctx.clearRect(0, 0, targetWidth, targetHeight);
            ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

            // Mostrar preview redimensionado
            const resizedDataUrl = canvas.toDataURL("image/png");
            signaturePreview.src = resizedDataUrl;
            signaturePreviewContainer.style.display = "block";
            btnSalvarAssinatura.style.display = "inline-block";
            uploadStatus.textContent = "";
        };

        img.src = e.target.result;
    };

    reader.readAsDataURL(file);
});




        // Evento para o botão Salvar Assinatura (com redimensionamento)
document.getElementById("btnSalvarAssinatura").addEventListener("click", function () {
    const file = document.getElementById("signatureFileInput").files[0];
    const uploadStatus = document.getElementById("uploadStatus");
    const signatureUrlInput = document.getElementById("signatureUrl");

    if (!file) {
        alert("Por favor, selecione uma imagem para salvar.");
        return;
    }

    // Redimensionar imagem com canvas
    const img = new Image();
    const reader = new FileReader();

    reader.onload = function (e) {
        img.onload = function () {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            const targetWidth = 300;
            const targetHeight = 100;

            canvas.width = targetWidth;
            canvas.height = targetHeight;

            // Limpa e desenha a imagem redimensionada
            ctx.clearRect(0, 0, targetWidth, targetHeight);
            ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

            // Converte o canvas para blob
            canvas.toBlob(function (blob) {
                if (!blob) {
                    alert("Erro ao processar imagem.");
                    return;
                }

                const fileName = "assinatura_" + Date.now() + ".png";
                const storageRef = storage.ref("assinaturas/" + fileName);
                const uploadTask = storageRef.put(blob);

                uploadStatus.textContent = "Fazendo upload...";

                uploadTask.on("state_changed",
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        uploadStatus.textContent = `Upload ${progress.toFixed(2)}%`;
                    },
                    (error) => {
                        console.error("Erro no upload:", error);
                        uploadStatus.textContent = "Erro no upload da assinatura.";
                        alert("Erro ao fazer upload da assinatura: " + error.message);
                        
                    },
                    () => {
                        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                            signatureUrlInput.value = downloadURL;
                            uploadStatus.textContent = "Assinatura salva com sucesso!";
                            salvarFormulario();
alertaSucesso("Assinatura salva com sucesso!");


                        });
                    }
                );
            }, "image/png");
        };

        img.src = e.target.result;
    };

    reader.readAsDataURL(file);
});


            
            
            // Evento para o botão de salvar
            document.getElementById("btnSalvar").addEventListener("click", function() {
                salvarFormulario();
            });
            
            // Evento para o botão de visualizar
            document.getElementById("btnVisualizar").addEventListener("click", function() {
                visualizarParaImpressao();
            });


        }

        // Função para navegar para uma aba específica
        function navegarParaAba(abaNum) {
            // Coletar dados do formulário
            coletarDadosFormulario();
            salvarFormulario();
            // Mostrar a aba especificada
            showTab(abaNum);
            
        }

        // Função para coletar dados do formulário
        function coletarDadosFormulario() {
            // Coletar campos de texto
            const textInputs = document.querySelectorAll("input[type=\"text\"], input[type=\"email\"], input[type=\"tel\"], input[type=\"number\"], input[type=\"date\"], textarea, input[type=\"hidden\"]");
            textInputs.forEach(input => {
                formData[input.id] = input.value;
            });
            
            // Adicionar RG da vítima e agressor ao formData
            formData.rgVitima = document.getElementById("rgVitima").value;
            formData.rgAgressor = document.getElementById("rgAgressor").value;
            
            // Coletar checkboxes
            const checkboxGroups = {};
            document.querySelectorAll("input[type=\"checkbox\"]:checked").forEach(checkbox => {
                if (!checkboxGroups[checkbox.name]) {
                    checkboxGroups[checkbox.name] = [];
                }
                checkboxGroups[checkbox.name].push(checkbox.value);
            });
            
            // Adicionar grupos de checkboxes ao formData
            for (const [name, values] of Object.entries(checkboxGroups)) {
                formData[name] = values;
            }
            
            // Coletar radio buttons
            document.querySelectorAll("input[type=\"radio\"]:checked").forEach(radio => {
                formData[radio.name] = radio.value;
            });

            // Adicionar a URL da assinatura ao formData
            formData.signatureUrl = document.getElementById("signatureUrl").value;
            
            // Atualizar blocos pendentes
            atualizarBlocosPendentes();
            
        }

        // Função para salvar o formulário
        function salvarFormulario() {
            // Coletar dados do formulário
            coletarDadosFormulario();
            
            // Adicionar metadados
            formData.dataRegistro = formData.dataRegistro || Date.now();
            formData.dataAtualizacao = Date.now();
            formData.status = blocosPendentes.length > 0 ? 'pendente' : 'completo';
            formData.cpfAgressor = formData.cpfAgressor ? formData.cpfAgressor.replace(/\D/g, '') : '';
            
            // Referência para a avaliação no Firebase
            const avaliacoesRef = database.ref('avaliacoes');
            
            // Se for uma edição, atualizar a avaliação existente
            if (avaliacaoId) {
                avaliacoesRef.child(avaliacaoId).update(formData)
                    .then(() => {
alertaSucesso("✅ Avaliação atualizada!");

                        // Se não houver pendências, mostrar botão de visualização
                        if (blocosPendentes.length === 0) {
                            document.getElementById('btnVisualizar').style.display = 'block';
                        }
                    })
                    .catch((error) => {
                        console.error('Erro ao atualizar avaliação:', error);
                        alert('Erro ao atualizar avaliação!');
                    });
            } else {
                // Se for uma nova avaliação, criar um novo registro
                const novaAvaliacaoRef = avaliacoesRef.push();
                avaliacaoId = novaAvaliacaoRef.key;
                
                novaAvaliacaoRef.set(formData)
                    .then(() => {
alertaSucesso("✅ Avaliação salva com sucesso!");
                        
                        // Atualizar URL para incluir o ID da avaliação
                        window.history.replaceState(null, null, `?id=${avaliacaoId}`);
                        
                        // Se não houver pendências, mostrar botão de visualização
                        if (blocosPendentes.length === 0) {
                            document.getElementById('btnVisualizar').style.display = 'block';
                        }
                    })
                    .catch((error) => {
                        console.error('Erro ao salvar avaliação:', error);
                        alert('Erro ao salvar avaliação!');
                    });
            }
            
        }

        // Função para visualizar para impressão
        function visualizarParaImpressao() {
            // Verificar se todos os blocos estão preenchidos
            if (blocosPendentes.length > 0) {
                alert('Preencha todos os blocos antes de visualizar para impressão!');
                return;
            }
            
            // Verificar se existe um ID de avaliação
            if (!avaliacaoId) {
                alert('É necessário salvar a avaliação antes de visualizar para impressão!');
                return;
            }
            
            // Abrir a página de impressão em uma nova aba passando o ID da avaliação como parâmetro
            window.open(`avRisco.html?id=${avaliacaoId}`, '_blank');
            
        }

      


 function salvarLink() {
     localStorage.setItem("linkAtual", window.location.href);

}

function openEditor()  {
// Limpa os dados antigos do localStorage
localStorage.removeItem("rgVitima");
localStorage.removeItem("rgAgressor");
localStorage.removeItem("tempoRelacionamento");
localStorage.removeItem("tempoSeparacao");
localStorage.removeItem("numeroProcesso");
localStorage.removeItem("dataExpedicao");
localStorage.removeItem("relacaoVitimaAutor");
localStorage.removeItem("separados");
localStorage.removeItem("temFilhos");
localStorage.removeItem("quantidadeFilhos");
localStorage.removeItem("nomesIdadesFilhos");
localStorage.removeItem("mpu");
localStorage.removeItem("acessoArma");
localStorage.removeItem("violenciasPsicologicas");
localStorage.removeItem("agressoesFisicas");
localStorage.removeItem("agressoesSexuais");
localStorage.removeItem("agressoesPatrimoniais");
localStorage.removeItem("agressoesMorais");
localStorage.removeItem("usoSubstancias");
localStorage.removeItem("suicidioAgressor");
localStorage.removeItem("filhosPresenciaramViolencia");
localStorage.removeItem("nome"); // referente ao tipo de protocolo SPVD
localStorage.removeItem("linkAtual"); // usado no botão "OUTROS"
localStorage.removeItem("linkdaimagem"); // assinatura

//obtem os valors dos inputs tempoRelacionamento dataExpedicao
   let rgVitima = document.getElementById("rgVitima").value;
   let rgAgressor = document.getElementById("rgAgressor").value;
   let tempoRelacionamento = document.getElementById("tempoRelacionamento").value;
  let tempoSeparacao = document.getElementById("tempoSeparacao").value;
    let numeroProcesso = document.getElementById("numeroProcesso").value;
    let dataExpedicao = document.getElementById("dataExpedicao").value;

//armazena os valores no localStoragenumeroProcesso numeroProcesso
   localStorage.setItem("rgVitima", rgVitima);
   localStorage.setItem("rgAgressor", rgAgressor);
salvarLink();
   localStorage.setItem("tempoRelacionamento", tempoRelacionamento);
   localStorage.setItem("tempoSeparacao", tempoSeparacao);
   localStorage.setItem("numeroProcesso", numeroProcesso);
   localStorage.setItem("dataExpedicao", dataExpedicao);
salvarRelacaoVitimaAutor();
}

//separados

function salvarRelacaoVitimaAutor() {
  const relacaoVitimaAutor = document.querySelector('input[name="relacaoVitimaAutor"]:checked');

  if (relacaoVitimaAutor) {
    const textoSelecionado = document.querySelector(`label[for="${relacaoVitimaAutor.id}"]`).innerText;

    localStorage.setItem('relacaoVitimaAutor', textoSelecionado);
    console.log("Salvo no localStorage:", textoSelecionado);
separados()
  } else {
    alert("Preencha corretamente todos os dados.");
  }
}



//

function separados() {
  const separados = document.querySelector('input[name="separados"]:checked');

  if (separados) {
    const textoSelecionado = document.querySelector(`label[for="${separados.id}"]`).innerText;

    localStorage.setItem('separados', textoSelecionado);
    console.log("Salvo no localStorage:", textoSelecionado);
temFilhos() 
  } else {
    alert("Preencha corretamente todos os dados.");
  }
}



function temFilhos() {
           let quantidadeFilhos = document.getElementById("quantidadeFilhos").value;
           let nomesIdadesFilhos = document.getElementById("nomesIdadesFilhos").value;

  const temFilhos = document.querySelector('input[name="temFilhos"]:checked');

  if (temFilhos) {
    const textoSelecionado = document.querySelector(`label[for="${temFilhos.id}"]`).innerText;

    localStorage.setItem('temFilhos', textoSelecionado);
    console.log("Salvo no localStorage:", textoSelecionado);
    
if (textoSelecionado == "Não") {

} else if ( textoSelecionado == "Sim, com o agressor") {
        localStorage.setItem('quantidadeFilhos', quantidadeFilhos);
                localStorage.setItem('nomesIdadesFilhos', nomesIdadesFilhos);

 
} else {
      localStorage.setItem('quantidadeFilhos', quantidadeFilhos);
                localStorage.setItem('nomesIdadesFilhos', nomesIdadesFilhos);
  
}
mpu()

  } else {
    alert("Preencha corretamente todos os dados.");
  }

}


function mpu() {
  const mpu = document.querySelector('input[name="mpu"]:checked');

  if (mpu) {
    const textoSelecionado = document.querySelector(`label[for="${mpu.id}"]`).innerText;

    localStorage.setItem('mpu', textoSelecionado);
    console.log("Salvo no localStorage:", textoSelecionado);
 acessoArma()
  } else {
    alert("Preencha corretamente todos os dados.");
  }
}

function acessoArma() {
  const acessoArma = document.querySelector('input[name="acessoArma"]:checked');

  if (acessoArma) {
    const textoSelecionado = document.querySelector(`label[for="${acessoArma.id}"]`).innerText;

    localStorage.setItem('acessoArma', textoSelecionado);
    console.log("Salvo no localStorage:", textoSelecionado);
salvarViolenciaPsicologica()

  } else {
    alert("Preencha corretamente todos os dados.");
  }
}

//

function salvarViolenciaPsicologica() {
  const checkboxes = document.querySelectorAll('input[name="violenciaPsicologica"]:checked');
  const outrasInput = document.getElementById("outrasViolenciasPsicologicas");
  let respostas = [];

  checkboxes.forEach((checkbox) => {
    const label = document.querySelector(`label[for="${checkbox.id}"]`);
    if (label) {
      respostas.push(label.innerText.toUpperCase());
    }
  });

  if (outrasInput && outrasInput.value.trim() !== "") {
    respostas.push( outrasInput.value.trim().toUpperCase());
  }

  const resultadoFinal = respostas.join(", ");
  localStorage.setItem("violenciasPsicologicas", resultadoFinal);

  console.log("Violências psicológicas salvas:", resultadoFinal);
salvarAgressaoFisica();
}

function salvarAgressaoFisica() {
  const checkboxes = document.querySelectorAll('input[name="agressaoFisica"]:checked');
  const outrasInput = document.getElementById("outrasAgressoesFisicas");
  let respostas = [];

  checkboxes.forEach((checkbox) => {
    const label = document.querySelector(`label[for="${checkbox.id}"]`);
    if (label) {
      respostas.push(label.innerText.toUpperCase());
    }
  });

  if (outrasInput && outrasInput.value.trim() !== "") {
    respostas.push(  outrasInput.value.trim().toUpperCase());
  }

  const resultadoFinal = respostas.join(", ");
  localStorage.setItem("agressoesFisicas", resultadoFinal);

  console.log("Agressões físicas salvas:", resultadoFinal);

salvarAgressaoSexual()
}


function salvarAgressaoSexual() {
  const checkboxes = document.querySelectorAll('input[name="agressaoSexual"]:checked');
  const outrasInput = document.getElementById("outrasAgressoesSexuais");
  let respostas = [];

  checkboxes.forEach((checkbox) => {
    const label = document.querySelector(`label[for="${checkbox.id}"]`);
    if (label) {
      respostas.push(label.innerText.toUpperCase());
    }
  });

  if (outrasInput && outrasInput.value.trim() !== "") {
    respostas.push(outrasInput.value.trim().toUpperCase());
  }

  const resultadoFinal = respostas.join(", ");
  localStorage.setItem("agressoesSexuais", resultadoFinal);

  console.log("Agressões sexuais salvas:", resultadoFinal);
salvarAgressaoPatrimonial()
}

function salvarAgressaoPatrimonial() {
  const checkboxes = document.querySelectorAll('input[name="agressaoPatrimonial"]:checked');
  const outrasInput = document.getElementById("outrasAgressoesPatrimoniais");
  let respostas = [];

  checkboxes.forEach((checkbox) => {
    const label = document.querySelector(`label[for="${checkbox.id}"]`);
    if (label) {
      respostas.push(label.innerText.toUpperCase());
    }
  });

  if (outrasInput && outrasInput.value.trim() !== "") {
    respostas.push(outrasInput.value.trim().toUpperCase());
  }

  const resultadoFinal = respostas.join(", ");
  localStorage.setItem("agressoesPatrimoniais", resultadoFinal);

  console.log("Agressões patrimoniais salvas:", resultadoFinal);

  // Redirecionamento
salvarAgressaoMoral()
}

function salvarAgressaoMoral() {
  const checkboxes = document.querySelectorAll('input[name="agressaoMoral"]:checked');
  const outrasInput = document.getElementById("outrasAgressoesMorais");
  let respostas = [];

  checkboxes.forEach((checkbox) => {
    const label = document.querySelector(`label[for="${checkbox.id}"]`);
    if (label) {
      respostas.push(label.innerText.toUpperCase());
    }
  });

  if (outrasInput && outrasInput.value.trim() !== "") {
    respostas.push(outrasInput.value.trim().toUpperCase());
  }

  const resultadoFinal = respostas.join(", ");
  localStorage.setItem("agressoesMorais", resultadoFinal);

  console.log("Agressões morais salvas:", resultadoFinal);

  // Redirecionamento
 salvarUsoSubstancias()
}

function salvarUsoSubstancias() {
  const checkboxes = document.querySelectorAll('input[name="usoSubstancias"]:checked');
  let respostas = [];

  checkboxes.forEach((checkbox) => {
    const label = document.querySelector(`label[for="${checkbox.id}"]`);
    if (label) {
      respostas.push(label.innerText.toUpperCase());
    }
  });

  const resultadoFinal = respostas.join(", ");
  localStorage.setItem("usoSubstancias", resultadoFinal);

  console.log("Uso de substâncias salvo:", resultadoFinal);

  // Redirecionamento

salvarSuicidioAgressor()
}


function salvarSuicidioAgressor() {
  const selectedRadio = document.querySelector('input[name="suicidioAgressor"]:checked');
  let resposta = "";

  if (selectedRadio) {
    const label = document.querySelector(`label[for="${selectedRadio.id}"]`);
    if (label) {
      resposta = label.innerText.toUpperCase();
    }
  }

  localStorage.setItem("suicidioAgressor", resposta);

  console.log("Tentativa de suicídio do agressor salva:", resposta);

  // Redirecionamento
salvarFilhosPresenciaramViolencia() }

function salvarFilhosPresenciaramViolencia() {
  const selectedRadio = document.querySelector('input[name="filhosPresenciaramViolencia"]:checked');
  let resposta = "";

  if (selectedRadio) {
    const label = document.querySelector(`label[for="${selectedRadio.id}"]`);
    if (label) {
      resposta = label.innerText.toUpperCase();
    }
  }

  localStorage.setItem("filhosPresenciaramViolencia", resposta);

  console.log("Violência presenciada pelos filhos salva:", resposta);

  // Redirecionamento
  window.location.href = "./meusite/editordetexto.html";
}








  document.getElementById("DSSA").addEventListener("click", function(event) {
      openEditor();
      localStorage.setItem("nome", "PASSO DO PROTOCOLO DE 2ª RESPOSTA DO SPVD: ASSISTIDO NÃO LOCALIZADO");
  });

 document.getElementById("DSSV").addEventListener("click", function(event) {
  openEditor();
      localStorage.setItem("nome", "PASSO DO PROTOCOLO DE 2ª RESPOSTA DO SPVD: ASSISTIDA NÃO LOCALIZADA");
  });

  document.getElementById("NDA").addEventListener("click", function(event) {
    openEditor();
      localStorage.setItem("nome", "PASSO DO PROTOCOLO DE 2ª RESPOSTA DO SPVD: NOTIFICAÇÃO DO AUTOR");
    });

  document.getElementById("IDV").addEventListener("click", function(event) {
     openEditor();
     localStorage.setItem("nome", "PASSO DO PROTOCOLO DE 2ª RESPOSTA DO SPVD: INCLUSÃO DA VÍTIMA E AVALIAÇÃO DE RISCO");
  });
  

  document.getElementById("RDV").addEventListener("click", function(event) {
      openEditor();
      localStorage.setItem("nome", "PASSO DO PROTOCOLO DE 2ª RESPOSTA DO SPVD: RECUSA DA VÍTIMA");
  });

  document.getElementById("ADLPV").addEventListener("click", function(event) {
     openEditor();
      localStorage.setItem("nome", "PASSO DO PROTOCOLO DE 2ª RESPOSTA DO SPVD: APRESENTAÇÃO DA LEI PARA A VÍTIMA");
  });

  document.getElementById("ADLPA").addEventListener("click", function(event) {
     openEditor();
      localStorage.setItem("nome", "PASSO DO PROTOCOLO DE 2ª RESPOSTA DO SPVD: APRESENTAÇÃO DA LEI PARA O AUTOR");
  });

  document.getElementById("EDV").addEventListener("click", function(event) {
     openEditor();
      localStorage.setItem("nome", "PASSO DO PROTOCOLO DE 2ª RESPOSTA DO SPVD: ENCAMINHAMENTO");
  });


  document.getElementById("MDV").addEventListener("click", function(event) {
     openEditor();
      localStorage.setItem("nome", "PASSO DO PROTOCOLO DE 2ª RESPOSTA DO SPVD: MONITORAMENTO DA VÍTIMA");
  });

  document.getElementById("MDA").addEventListener("click", function(event) {
      openEditor();
      localStorage.setItem("nome", "PASSO DO PROTOCOLO DE 2ª RESPOSTA DO SPVD: MONITORAMENTO DO AUTOR");
  });

  document.getElementById("ECAV").addEventListener("click", function(event) {
      openEditor();
      localStorage.setItem("nome", "PASSO DO PROTOCOLO DE 2ª RESPOSTA DO SPVD: ENCERRAMENTO");
  });

  document.getElementById("RDEDV").addEventListener("click", function(event) {
   openEditor();
      localStorage.setItem("nome", "PASSO DO PROTOCOLO DE 2ª RESPOSTA DO SPVD: RECUSA DE ENCAMINHAMENTO");
  });
 

   document.getElementById("OUTROS").addEventListener("click", function(event) {
   window.location.href = "./meusite/index.html";
      localStorage.setItem("linkAtual", window.location.href);

  });
 


document.querySelectorAll('.progress-step').forEach(step => {
  step.addEventListener('click', () => {
    // Remove active de todos
    document.querySelectorAll('.progress-step').forEach(s => s.classList.remove('active'));
    
    // Adiciona active ao clicado
    step.classList.add('active');
  });
});   


function alertaSucesso(mensagem, tempo = 2000) {
  const notif = document.createElement("div");
  notif.textContent = mensagem;
  notif.style.position = "fixed";
  notif.style.bottom = "20px";
  notif.style.right = "20px";
notif.style.background = "linear-gradient(135deg, #2ecc71, #ffffff)"; // verde sucesso para branco
  notif.style.padding = "10px 15px";
  notif.style.borderRadius = "5px";
  notif.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";
  notif.style.zIndex = "10000";
  notif.style.fontSize = "14px";
  notif.style.transition = "opacity 0.5s ease";
  notif.style.color = "#000000ff"; // texto branco


  document.body.appendChild(notif);

  setTimeout(() => {
    notif.style.opacity = "0";
    setTimeout(() => document.body.removeChild(notif), 500);
  }, tempo);

}


function alertaErro(mensagem, tempo = 2000) {
  const notif = document.createElement("div");
  notif.textContent = mensagem;
  notif.style.position = "fixed";
  notif.style.bottom = "20px";
  notif.style.right = "20px";
notif.style.background = "linear-gradient(135deg, #ff3131ff, #ffffff)"; // verde sucesso para branco
  notif.style.color = "#000000ff"; // texto branco
  notif.style.padding = "10px 15px";
  notif.style.borderRadius = "5px";
  notif.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";
  notif.style.zIndex = "10000";
  notif.style.fontSize = "14px";
  notif.style.transition = "opacity 0.5s ease";

  document.body.appendChild(notif);

  setTimeout(() => {
    notif.style.opacity = "0";
    setTimeout(() => document.body.removeChild(notif), 500);
  }, tempo);

}


document.getElementById('btnAssinatura2').addEventListener('click', function (e) {
    e.preventDefault(); // Impede a navegação automática

    // Chama a função salvar
    salvarFormulario();
  salvarLink(); // chama a função

    // Após salvar, redireciona
    window.location.href = './Sistema de assinaturas/';
});
 




window.assinaturaAssinador = function() {

  const link = localStorage.getItem("linkdaimagem");
  const img = document.getElementById("signaturePreview");
  const inputHidden = document.getElementById("signatureUrl");
  const container = document.getElementById("signaturePreviewContainer");


  if (link && img) {
    img.src = link;

    // Mostra o container da imagem, se estiver oculto
    if (container) {
      container.style.display = "block";
    }

    if (inputHidden) {
      inputHidden.value = link;
    }
    navegarParaAba(8);

    // (Opcional) remover o link do localStorage após usar
    localStorage.removeItem("linkdaimagem");
  } else {
  }
}


document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    assinaturaAssinador();
        salvarFormulario();

        localStorage.removeItem("linkdaimagem");

  }, 1000); // 3000 milissegundos = 3 segundos
});


let touchStartX = 0;
let touchEndX = 0;

// Elemento onde você quer detectar o gesto (pode ser o container principal)
const swipeArea = document.body; // ou document.querySelector('.tabs-container')

swipeArea.addEventListener('touchstart', function (e) {
  touchStartX = e.changedTouches[0].screenX;
}, false);

swipeArea.addEventListener('touchend', function (e) {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipeGesture();
}, false);

function handleSwipeGesture() {
  const threshold = 50; // distância mínima para considerar como swipe

  if (touchEndX < touchStartX - threshold) {
    // Swipe para a esquerda → avançar
    irParaProximaAba();
  } else if (touchEndX > touchStartX + threshold) {
    // Swipe para a direita → voltar
    irParaAbaAnterior();
  }
}

function getAbaAtivaAtual() {
  const abaAtiva = document.querySelector('.tab-item.active');
  return abaAtiva ? parseInt(abaAtiva.dataset.tab) : 1;
}

function irParaProximaAba() {
  const atual = getAbaAtivaAtual();
  if (atual < 8) {
    navegarParaAba(atual + 1);
  }
}

function irParaAbaAnterior() {
  const atual = getAbaAtivaAtual();
  if (atual > 1) {
    navegarParaAba(atual - 1);
  }
}
