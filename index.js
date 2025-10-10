// Import da configuração do Firebase
import { firebaseConfig } from './firebaseConfig.js';

// Inicializa Firebase (compat)
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const avaliacoesRef = database.ref('avaliacoes');

/**
 * Helper: atualiza o texto do elemento #resultadoBusca com segurança
 */
function setResultadoBusca(text) {
  const el = document.getElementById('resultadoBusca');
  if (el) el.textContent = text;
}

/**
 * Renderiza uma lista de avaliações no DOM,
 * passando um array de objetos { key, ...dados } em ordem decrescente por dataRegistro.
 */
function renderAvaliacoes(listaAvaliacoes, avaliacoes) {
  showSpinnerAlert();
  setTimeout(hideSpinnerAlert, 500);

  listaAvaliacoes.innerHTML = '0';

// Atualiza contagem com segurança
if (Array.isArray(avaliacoes)) {
  const count = avaliacoes.length > 0 ? avaliacoes.length : 0;

  setResultadoBusca(`${count}`);
} else {
  setResultadoBusca('0');
}

  avaliacoes.forEach(avaliacao => {
    const temPendencias = avaliacao.status === 'pendente';
    const div = document.createElement('div');
    div.className = `avaliacao-item ${temPendencias ? 'pendente' : 'completo'}`;
    div.innerHTML = `
      <div class="avaliacao-info">
        <h3>Vítima: ${avaliacao.nomeVitima || 'Não informado'}</h3>
        <p>RG da Vítima: ${avaliacao.rgVitima || 'Não informado'}</p>
        <p>Agressor: ${avaliacao.nomeAgressor || 'Não informado'}</p>
        <p>Data: ${new Date(avaliacao.dataRegistro || Date.now()).toLocaleDateString('pt-BR')}</p>
        <p class="status ${temPendencias ? 'pendente' : 'completo'}">
          Status: ${temPendencias ? 'Possui pendências' : 'Completo'}
        </p>
      </div>
      <div class="avaliacao-acoes">
        <button class="btn edit" data-key="${avaliacao.key}">Ver Mais</button>
        ${
          !temPendencias
            ? `<button class="btn print" data-key="${avaliacao.key}">Imprimir Avaliação</button>`
            : `<button class="btn continue" data-key="${avaliacao.key}">Continuar Avaliação</button>`
        }
      </div>
    `;
    listaAvaliacoes.appendChild(div);
  });

  // Registra eventos (seguro)
  document.querySelectorAll('.btn.edit, .btn.continue').forEach(btn => {
    btn.addEventListener('click', e => {
      const key = e.currentTarget.dataset.key;
      if (key) window.location.href = `formulario.html?id=${key}`;
    });
  });
  document.querySelectorAll('.btn.print').forEach(btn => {
    btn.addEventListener('click', e => {
      const key = e.currentTarget.dataset.key;
      if (key) window.open(`avRisco.html?id=${key}`, '_blank');
    });
  });
}

// Carrega todas as avaliações em ordem decrescente
function carregarAvaliacoes() {
  const listaAvaliacoes = document.getElementById('listaAvaliacoes');
  if (!listaAvaliacoes) return;

  listaAvaliacoes.innerHTML = '<div class="loading"></div>';

  avaliacoesRef.orderByChild('dataRegistro').on('value', snapshot => {
    if (!snapshot.exists()) {
      listaAvaliacoes.innerHTML = '<div class="no-data"></div>';
      return;
    }
    const avals = [];
    snapshot.forEach(child => {
      avals.push({ key: child.key, ...(child.val()) });
    });
    avals.sort((a, b) => (b.dataRegistro || 0) - (a.dataRegistro || 0));
    renderAvaliacoes(listaAvaliacoes, avals);
  });
}

// Busca avaliações filtradas por RG (e mantém ordem decrescente)
function buscarPorRG(rg) {
  const listaAvaliacoes = document.getElementById('listaAvaliacoes');
  if (!listaAvaliacoes) return;

  listaAvaliacoes.innerHTML = '<div class="loading">Buscando...</div>';
  setResultadoBusca('Buscando registros...');

  const rgLimpo = (rg || '').replace(/\D/g, '');
  if (!rgLimpo) {
    carregarAvaliacoes();
    return;
  }

  avaliacoesRef.orderByChild('rgVitima').equalTo(rgLimpo).once('value', snapshot => {
    if (!snapshot.exists()) {
      listaAvaliacoes.innerHTML = '<div class="no-data"></div>';
      setResultadoBusca('0');
      return;
    }
    const avals = [];
    snapshot.forEach(child => {
      avals.push({ key: child.key, ...(child.val()) });
    });
    avals.sort((a, b) => (b.dataRegistro || 0) - (a.dataRegistro || 0));
    renderAvaliacoes(listaAvaliacoes, avals);
  });
}

function salvarLink() {
  localStorage.setItem('linkAtual', window.location.href);
}

/* 
  -> Liga todos os event listeners de forma segura depois que o DOM estiver carregado.
     Assim evitamos erros caso algum botão não exista.
*/
document.addEventListener('DOMContentLoaded', () => {
  // Botões principais (verifica existência antes de adicionar)
  const btnNova = document.getElementById('btnNovaAvaliacao');
  if (btnNova) btnNova.addEventListener('click', () => { window.location.href = 'formulario.html'; });

  const btnPowerBI = document.getElementById('powerBI');
  if (btnPowerBI) btnPowerBI.addEventListener('click', () => { window.location.href = 'powerBi.html'; });

  const btnAutoGoogle = document.getElementById('autoformgoogle');
  if (btnAutoGoogle) btnAutoGoogle.addEventListener('click', () => {
    const arquivo = 'ExtensaoPVD-Chrome.zip';
    const link = document.createElement('a');
    link.href = arquivo;
    link.download = arquivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  const btnAutoMoz = document.getElementById('autoformmozzila');
  if (btnAutoMoz) btnAutoMoz.addEventListener('click', () => {
    window.open('https://addons.mozilla.org/pt-BR/firefox/addon/rppm-mindfulness-greenmesh/', '_blank');
  });

  const btnBaixarApp = document.getElementById('baixarApp');
  if (btnBaixarApp) btnBaixarApp.addEventListener('click', () => {
    window.open('https://play.google.com/store/apps/details?id=rppm.auxiliar.com.br&pli=1', '_blank');
  });

  const btnModelos = document.getElementById('modelosDeHistoricos');
  if (btnModelos) btnModelos.addEventListener('click', () => {
    // Remove apenas as chaves que você usava
    const keysToRemove = [
      "rgVitima","rgAgressor","tempoRelacionamento","tempoSeparacao","numeroProcesso","dataExpedicao",
      "relacaoVitimaAutor","separados","temFilhos","quantidadeFilhos","nomesIdadesFilhos","mpu",
      "acessoArma","violenciasPsicologicas","agressoesFisicas","agressoesSexuais","agressoesPatrimoniais",
      "agressoesMorais","usoSubstancias","suicidioAgressor","filhosPresenciaramViolencia","nome",
      "linkAtual","linkdaimagem"
    ];
    keysToRemove.forEach(k => localStorage.removeItem(k));
    salvarLink();
    window.location.href = './meusite2/index.html';
  });

  // Busca
  const btnSearch = document.getElementById('btnSearch');
  const searchInput = document.getElementById('searchInput');
  if (btnSearch) btnSearch.addEventListener('click', () => buscarPorRG(searchInput?.value || ''));
  if (searchInput) searchInput.addEventListener('keypress', e => { if (e.key === 'Enter') buscarPorRG(e.target.value); });

  // Voltar ao topo (container rolável)
  const container = document.querySelector('.container');
  const btnVoltarTopo = document.getElementById('btnVoltarTopo');
  if (container && btnVoltarTopo) {
    container.addEventListener('scroll', () => {
      btnVoltarTopo.classList.toggle('show', container.scrollTop > 100);
    });
    btnVoltarTopo.addEventListener('click', () => {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Carrega as avaliações assim que o DOM estiver pronto
  carregarAvaliacoes();
});

/* Spinner helpers */
function showSpinnerAlert() {
  const spinner = document.getElementById('spinnerAlert');
  if (spinner) spinner.classList.add('active');
  document.body.classList.add('no-scroll');
}

function hideSpinnerAlert() {
  const spinner = document.getElementById('spinnerAlert');
  if (spinner) spinner.classList.remove('active');
  document.body.classList.remove('no-scroll');
}
