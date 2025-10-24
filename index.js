// Import da configuração do Firebase
import { firebaseConfig } from './firebaseConfig.js';

// Inicializa Firebase (compat)
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const avaliacoesRef = database.ref('avaliacoes');

// Variáveis de estado para o Lazy Loading
const PAGE_SIZE = 5;
let lastKey = null; // Chave do último item carregado
let allLoaded = false; // Flag para saber se todas as avaliações foram carregadas
let isLoading = false; // Flag para evitar múltiplas chamadas de carregamento

/**
 * Helper: atualiza o texto do elemento #resultadoBusca com segurança
 */
function setResultadoBusca(text) {
  const el = document.getElementById('resultadoBusca');
  if (el) el.textContent = text;
}

/**
 * Cria o HTML para um item de avaliação.
 */
function createAvaliacaoItem(avaliacao) {
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
  return div;
}

/**
 * Adiciona eventos de clique aos botões de uma avaliação.
 */
function registerAvaliacaoEvents(item) {
  item.querySelectorAll('.btn.edit, .btn.continue').forEach(btn => {
    btn.addEventListener('click', e => {
      const key = e.currentTarget.dataset.key;
      if (key) window.location.href = `formulario.html?id=${key}`;
    });
  });
  item.querySelectorAll('.btn.print').forEach(btn => {
    btn.addEventListener('click', e => {
      const key = e.currentTarget.dataset.key;
      if (key) window.open(`avRisco.html?id=${key}`, '_blank');
    });
  });
}

/**
 * Renderiza as avaliações no DOM (append ou replace).
 */
function renderAvaliacoes(avaliacoes, append = true) {
  const listaAvaliacoes = document.getElementById('listaAvaliacoes');
  if (!listaAvaliacoes) return;

  if (!append) {
    listaAvaliacoes.innerHTML = '';
    // Remove o indicador de "carregando mais" se existir
    const loadingMore = document.getElementById('loadingMore');
    if (loadingMore) loadingMore.remove();
  }
  
  if (avaliacoes.length === 0 && !append) {
    listaAvaliacoes.innerHTML = '<div class="no-data">Nenhum registro encontrado.</div>';
    setResultadoBusca('0');
    return;
  }

  avaliacoes.forEach(avaliacao => {
    const item = createAvaliacaoItem(avaliacao);
    listaAvaliacoes.appendChild(item);
    registerAvaliacaoEvents(item);
  });

  // Atualiza a contagem total (apenas para a busca)
  if (!append) {
     setResultadoBusca(`${avaliacoes.length}`);
  }
}

/**
 * Carrega o próximo lote de avaliações (Lazy Loading).
 */
function loadNextBatch() {
  if (allLoaded || isLoading) return;

  const listaAvaliacoes = document.getElementById('listaAvaliacoes');
  if (!listaAvaliacoes) return;

  isLoading = true;
  showSpinnerAlert();

  // Adiciona um indicador de carregamento no final da lista
  let loadingIndicator = document.getElementById('loadingMore');
  if (!loadingIndicator) {
    loadingIndicator = document.createElement('div');
    loadingIndicator.id = 'loadingMore';
    loadingIndicator.className = 'loading';
    loadingIndicator.textContent = 'Carregando mais avaliações...';
    listaAvaliacoes.appendChild(loadingIndicator);
  }

  let query = avaliacoesRef.orderByKey().limitToLast(PAGE_SIZE + 1);
  
  if (lastKey) {
    // Se lastKey existe, queremos os itens ANTES dele (já que estamos usando limitToLast)
    query = avaliacoesRef.orderByKey().endBefore(lastKey).limitToLast(PAGE_SIZE + 1);
  }

  query.once('value', snapshot => {
    hideSpinnerAlert();
    isLoading = false;
    
    // Remove o indicador de carregamento
    if (loadingIndicator) loadingIndicator.remove();

    if (!snapshot.exists()) {
      allLoaded = true;
      if (!lastKey) { // Se for a primeira carga e não houver dados
        listaAvaliacoes.innerHTML = '<div class="no-data">Nenhum registro encontrado.</div>';
        setResultadoBusca('0');
      } else {
        // Se for uma carga subsequente e não houver mais dados
        const endMessage = document.createElement('div');
        endMessage.className = 'no-data';
        endMessage.textContent = 'Todas as avaliações foram carregadas.';
        listaAvaliacoes.appendChild(endMessage);
      }
      return;
    }

    const avals = [];
    snapshot.forEach(child => {
      avals.push({ key: child.key, ...(child.val()) });
    });

    // Como estamos usando orderBy/limitToLast, os resultados vêm em ordem ascendente de chave.
    // O Firebase não tem um "limitToFirst" reverso.
    // Para manter a ordem decrescente (mais recente primeiro), precisamos:
    // 1. Reverter o array.
    // 2. O último item (o primeiro na ordem decrescente) é o item de controle (lastKey) se houver mais resultados.
    
    // Inverte a ordem para que os mais recentes (chaves maiores) venham primeiro
    avals.reverse();
    
    let itemsToRender = avals;
    let newLastKey = null;

    if (avals.length > PAGE_SIZE) {
      // Se carregamos PAGE_SIZE + 1, o último é o item de controle
      itemsToRender = avals.slice(1); // Remove o item de controle
      newLastKey = itemsToRender[itemsToRender.length - 1].key;
    } else {
      allLoaded = true;
      newLastKey = avals[avals.length - 1]?.key || null;
    }

    // O lastKey deve ser o *primeiro* item do lote anterior na ordem ascendente (o último na ordem decrescente)
    // Para a próxima consulta, precisamos do key do último item que foi RENDERIZADO.
    lastKey = newLastKey;

    // Renderiza os itens
    renderAvaliacoes(itemsToRender, true);

    // Atualiza a contagem (apenas na primeira carga)
    if (!lastKey) {
        // Não é possível contar todas as avaliações com o lazy loading, 
        // então mostramos o número de itens carregados ou um indicador.
        setResultadoBusca(`+${itemsToRender.length} carregadas`);
    }

  }, error => {
    hideSpinnerAlert();
    isLoading = false;
    console.error("Erro ao carregar lote: ", error);
    listaAvaliacoes.innerHTML = '<div class="no-data">Erro ao carregar avaliações.</div>';
  });
}

/**
 * Reseta o estado e carrega o primeiro lote.
 */
function carregarAvaliacoes() {
  const listaAvaliacoes = document.getElementById('listaAvaliacoes');
  if (!listaAvaliacoes) return;

  // Limpa o estado
  lastKey = null;
  allLoaded = false;
  isLoading = false;
  
  // Limpa a lista
  listaAvaliacoes.innerHTML = '';
  setResultadoBusca('...');
  
  // Carrega o primeiro lote
  loadNextBatch();
}

/**
 * Busca avaliações filtradas por RG (Busca Global).
 * Esta função deve buscar em TODAS as avaliações e renderizar o resultado completo.
 */
function buscarPorRG(rg) {
  const listaAvaliacoes = document.getElementById('listaAvaliacoes');
  if (!listaAvaliacoes) return;

  // Desabilita o lazy loading enquanto a busca estiver ativa
  const container = document.querySelector('.container');
  if (container) container.removeEventListener('scroll', handleScroll);
  
  listaAvaliacoes.innerHTML = '<div class="loading">Buscando...</div>';
  setResultadoBusca('...');
  showSpinnerAlert();

  const rgLimpo = (rg || '').replace(/\D/g, '');
  if (!rgLimpo) {
    // Se o campo de busca estiver vazio, retorna ao carregamento normal
    hideSpinnerAlert();
    carregarAvaliacoes();
    // Reabilita o lazy loading
    if (container) container.addEventListener('scroll', handleScroll);
    return;
  }
  
  // A busca por rgVitima.equalTo(rgLimpo) já é uma busca global no banco de dados.
  // O que precisamos é garantir que ela não seja afetada pelo lazy loading.
  avaliacoesRef.orderByChild('rgVitima').equalTo(rgLimpo).once('value', snapshot => {
    hideSpinnerAlert();
    
    if (!snapshot.exists()) {
      renderAvaliacoes([], false); // Renderiza vazio
      return;
    }
    
    const avals = [];
    snapshot.forEach(child => {
      avals.push({ key: child.key, ...(child.val()) });
    });
    
    // Ordena por dataRegistro decrescente, como no carregamento normal
    avals.sort((a, b) => (b.dataRegistro || 0) - (a.dataRegistro || 0));
    
    // Renderiza todos os resultados da busca (sem lazy loading)
    renderAvaliacoes(avals, false);
    
    // Adiciona uma mensagem para o usuário saber que a lista está completa
    const endMessage = document.createElement('div');
    endMessage.className = 'no-data';
    endMessage.textContent = 'Fim dos resultados da busca.';
    listaAvaliacoes.appendChild(endMessage);

  }, error => {
    hideSpinnerAlert();
    console.error("Erro na busca: ", error);
    listaAvaliacoes.innerHTML = '<div class="no-data">Erro ao realizar a busca.</div>';
    setResultadoBusca('Erro');
  });
}

/**
 * Handler de rolagem para o Lazy Loading.
 */
function handleScroll() {
  const container = document.querySelector('.container');
  if (!container) return;

  // Verifica se o usuário rolou perto do final do conteúdo
  const scrollPosition = container.scrollTop + container.clientHeight;
  const scrollHeight = container.scrollHeight;
  
  // Se estiver a menos de 100px do final, carrega o próximo lote
  if (scrollHeight - scrollPosition < 100) {
    loadNextBatch();
  }
}

function salvarLink() {
  localStorage.setItem('linkAtual', window.location.href);
}

/* 
  -> Liga todos os event listeners de forma segura depois que o DOM estiver carregado.
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
  if (searchInput) searchInput.addEventListener('keypress', e => { 
    if (e.key === 'Enter') buscarPorRG(e.target.value); 
  });
  
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

  // Configuração do Lazy Loading no container
  if (container) {
    container.addEventListener('scroll', handleScroll);
  } else {
    console.warn("Elemento .container não encontrado. Lazy Loading desabilitado.");
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

