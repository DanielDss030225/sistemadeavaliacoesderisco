// Import da configuração do Firebase
import { firebaseConfig } from './firebaseConfig.js';

// Inicializa Firebase (compat)
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const avaliacoesRef = database.ref('avaliacoes');

/**
 * Renderiza uma lista de avaliações no DOM,
 * passando um array de objetos { key, ...dados } em ordem decrescente por dataRegistro.
 */
function renderAvaliacoes(listaAvaliacoes, avaliacoes) {
  listaAvaliacoes.innerHTML = '';
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
        ${!temPendencias
          ? `<button class="btn print" data-key="${avaliacao.key}">Imprimir Avaliação</button>`
          : `<button class="btn continue" data-key="${avaliacao.key}">Continuar Avaliação</button>`
        }
      </div>
    `;
    listaAvaliacoes.appendChild(div);
  });

  // Registra eventos
  document.querySelectorAll('.btn.edit, .btn.continue').forEach(btn => {
    btn.addEventListener('click', e => {
      window.location.href = `formulario.html?id=${e.target.dataset.key}`;
    });
  });
  document.querySelectorAll('.btn.print').forEach(btn => {
    btn.addEventListener('click', e => {
      window.open(`avRisco.html?id=${e.target.dataset.key}`, '_blank');
    });
  });
}

// Carrega todas as avaliações em ordem decrescente
function carregarAvaliacoes() {
  const listaAvaliacoes = document.getElementById('listaAvaliacoes');
  listaAvaliacoes.innerHTML = '<div class="loading">Carregando avaliações...</div>';

  avaliacoesRef.orderByChild('dataRegistro').on('value', snapshot => {
    if (!snapshot.exists()) {
      listaAvaliacoes.innerHTML = '<div class="no-data">Nenhuma avaliação encontrada.</div>';
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
  listaAvaliacoes.innerHTML = '<div class="loading">Buscando...</div>';

  const rgLimpo = rg.replace(/\D/g, '');
  if (!rgLimpo) {
    carregarAvaliacoes();
    return;
  }

  avaliacoesRef.orderByChild('rgVitima').equalTo(rgLimpo).once('value', snapshot => {
    if (!snapshot.exists()) {
      listaAvaliacoes.innerHTML = '<div class="no-data">Nenhuma avaliação encontrada com este RG.</div>';
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
     localStorage.setItem("linkAtual", window.location.href);

}


// Event listeners para botões e busca
document.getElementById('btnNovaAvaliacao').addEventListener('click', () => {
  window.location.href = 'formulario.html';
});
document.getElementById('modelosDeHistoricos').addEventListener('click', () => {
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
  salvarLink();
  window.location.href = './meusite2/index.html';
  
});


document.getElementById('btnSearch').addEventListener('click', () => {
  buscarPorRG(document.getElementById('searchInput').value);
});
document.getElementById('searchInput').addEventListener('keypress', e => {
  if (e.key === 'Enter') {
    buscarPorRG(e.target.value);
  }
});

// Carrega avaliações ao iniciar a página
document.addEventListener('DOMContentLoaded', carregarAvaliacoes);
