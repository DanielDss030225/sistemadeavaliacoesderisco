
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDQWO9csuYqrd0JyXa_cs4f3jAsjQAEWSw",
  authDomain: "meu-site-fd954.firebaseapp.com",
  projectId: "meu-site-fd954",
  storageBucket: "meu-site-fd954.firebasestorage.app",
  messagingSenderId: "1062346912662",
  appId: "1:1062346912662:web:0f41873e12965c545363b7",
  measurementId: "G-5HXX5ZZKER"
};



const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

//function to obtain dados of victim
export async function obterDadosVitima(path, dados) {
  // seu código
const rg = document.getElementById("rgVitima").value;

  
  if (!rg){ 
  } else {
  const snapshot = await get(ref(db, `DADOSGERAIS/${rg}`));
  const valor = snapshot.val();

  
  if (!valor) { 
  };


  let entrada;
  try {
    entrada = JSON.parse(valor);
  } catch (e) {
    return console.error("Erro ao converter dados JSON", e);
  };

  // Converte para array de strings
  const dadosArray = Array.isArray(entrada)
    ? entrada.map(item => item === null ? "NULL" : String(item))
    : new Array(25).fill("");
  // Função genérica para atualizar selects
  function atualizarSelect(id, valor) {
    const select = document.querySelector(`select[id="${id}"]`);
    if (select && valor !== "NULL") {
      const valorLimpo = valor.trim();
      const optionExists = Array.from(select.options).some(opt => opt.value.trim() === valorLimpo);
      if (optionExists) select.value = valorLimpo;
      else console.warn(`Valor "${valorLimpo}" não encontrado nas opções de '${id}'.`);
    }
  };

  // Função genérica para atualizar inputs
  function atualizarInput(id, valor) {
    const input = document.getElementById(id);
    if (input) input.value = (valor === "NULL") ? "" : valor;
  };
  // Atualiza SELECTs
  //atualizarSelect("escolaridadeVitima", dadosArray[6]);
  //atualizarSelect("cor", dadosArray[7]);
  //atualizarSelect("estadoCivil", dadosArray[8]);
  // Atualiza INPUTs
  const mapeamentoInputs = {
    nomeVitima: 0,
 telefoneVitima: 1,
 cpfVitima: 3,
 profissaoVitima: 5,


 
  };

for (const [id, indice] of Object.entries(mapeamentoInputs)) {
    atualizarInput(id, dadosArray[indice] || "");
  }
  


// ✅ Adicionar a idade calculada no campo "idadeVitima"
const dataNascimento = dadosArray[11]; // índice da data
if (dataNascimento && dataNascimento !== "NULL") {
  const idade = calcularIdade(dataNascimento);
  atualizarInput("idadeVitima", idade);
}

};  };


function calcularIdade(dataNascimentoStr) {
  const hoje = new Date();
  const nascimento = new Date(dataNascimentoStr);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mes = hoje.getMonth() - nascimento.getMonth();

  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }

  return idade;
}
//END OF FUNCTION VICTIN






//function to obtain dados of autor
export async function obterDadosAutor(path, dados) {
  assinaturaAsssinador();

  // seu código
const rg = document.getElementById("rgAgressor").value;

  
  if (!rg){ 
  } else {
  const snapshot = await get(ref(db, `DADOSGERAIS/${rg}`));
  const valor = snapshot.val();
  if (!valor) { 
  };


  let entrada;
  try {
    entrada = JSON.parse(valor);
  } catch (e) {
    return console.error("Erro ao converter dados JSON", e);
  };

  // Converte para array de strings
  const dadosArray = Array.isArray(entrada)
    ? entrada.map(item => item === null ? "NULL" : String(item))
    : new Array(25).fill("");
  // Função genérica para atualizar selects
  function atualizarSelect(id, valor) {
    const select = document.querySelector(`select[id="${id}"]`);
    if (select && valor !== "NULL") {
      const valorLimpo = valor.trim();
      const optionExists = Array.from(select.options).some(opt => opt.value.trim() === valorLimpo);
      if (optionExists) select.value = valorLimpo;
      else console.warn(`Valor "${valorLimpo}" não encontrado nas opções de '${id}'.`);
    }
  };

  // Função genérica para atualizar inputs
  function atualizarInput(id, valor) {
    const input = document.getElementById(id);
    if (input) input.value = (valor === "NULL") ? "" : valor;
  };
  // Atualiza SELECTs
  //atualizarSelect("escolaridadeVitima", dadosArray[6]);
  //atualizarSelect("cor", dadosArray[7]);
  //atualizarSelect("estadoCivil", dadosArray[8]);
  // Atualiza INPUTs
  const mapeamentoInputs = {
    nomeAgressor: 0,
 telefoneAgressor: 1,
 cpfAgressor: 3,
 profissaoAgressor: 5,

 
  };

for (const [id, indice] of Object.entries(mapeamentoInputs)) {
    atualizarInput(id, dadosArray[indice] || "");
  }
  


// ✅ Adicionar a idade calculada no campo "idadeVitima"
const dataNascimento2 = dadosArray[11]; // índice da data
if (dataNascimento2 && dataNascimento !== "NULL") {
  const idade2 = calcularIdade2(dataNascimento2);
  atualizarInput("idadeAgressor", idade2);
}

};  };


function calcularIdade2(dataNascimentoStr) {
  const hoje2 = new Date();
  const nascimento2 = new Date(dataNascimentoStr);
  let idade = hoje2.getFullYear() - nascimento2.getFullYear();
  const mes = hoje2.getMonth() - nascimento2.getMonth();

  if (mes < 0 || (mes === 0 && hoje2.getDate() < nascimento2.getDate())) {
    idade--;
  }

  return idade;
}
//END OF FUNCTION AUTOR



function assinaturaAsssinador() {
  const link = localStorage.getItem("linkdaimagem");
  const img = document.getElementById("signaturePreview");
  const inputHidden = document.getElementById("signatureUrl"); // input oculto

  if (link && img) {
    img.src = link;

    if (inputHidden) {
      inputHidden.value = link;
    }


    // Remove o link do localStorage após usar
    localStorage.removeItem("linkdaimagem");
  } else {
  }
}







