// Firebase SDKs
import { firebaseConfig, initializeApp, getDatabase, ref, get }from "./firebaseKeys.js";
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

//dados global
  let nomeVitima = document.getElementById("nomevitima");
  let rgVitima = document.getElementById("rgvitima");
  let cpfVitima = document.getElementById("cpfvitima");
  let cpfAutor = document.getElementById("cpfautor");
  let nomeAutor = document.getElementById("nomeautor");
  let nomeMaeVitima = document.getElementById("nomeMaeVitima");
  let nomePaiVitima = document.getElementById("nomePaiVitima");
  let dataNascimentoVitima = document.getElementById("datanascimentovitima");
  let nomeMaeAutor = document.getElementById("nomeMaeAutor");
  let nomePaiAutor = document.getElementById("nomePaiAutor");
  let dataNascimentoAutor = document.getElementById("datanascimentoautor");
  let telefoneAutor = document.getElementById("telefoneautor");
  let telefoneVitima = document.getElementById("telefonevitima");
  let rgAutorOutro = document.getElementById("rgautor");
  let redsOrigem = document.getElementById("redsorigem");
  let medidaProtetiva = document.getElementById("medidaprotetiva");
  let enderecoVitima = document.getElementById("enderecoVitima");
  let enderecoAutor = document.getElementById("enderecoAutor");
  let ocupacaoVitima = document.getElementById("ocupacaoVitima");
  let ocupacaoAutor = document.getElementById("ocupacaoAutor");
  let estadoCivilAutor = document.querySelector('select[id="estadoCivilAutor"]');
  let corAutor = document.querySelector('select[id="corAutor"]');
  let escolaridadeAutor = document.querySelector('select[id="escolaridadeAutor"]');
  let escolaridadeVitima = document.querySelector('select[id="escolaridadeVitima"]');
  let corVitima = document.querySelector('select[id="cor"]');
  let estadoCivilVitima = document.querySelector('select[id="estadoCivil"]');

  let nometestemunha = document.getElementById("nometestemunha");
  let rgtestemunha = document.getElementById("rgtestemunha");
  let cpftestemunha = document.getElementById("cpftestemunha");
  let nomeMaetestemunha = document.getElementById("nomeMaetestemunha");
  let nomePaitestemunha = document.getElementById("nomePaitestemunha");
  let dataNascimentotestemunha = document.getElementById("datanascimentotestemunha");
  let telefonetestemunha = document.getElementById("telefonetestemunha");
  let enderecotestemunha = document.getElementById("enderecotestemunha");
  let ocupacaotestemunha = document.getElementById("ocupacaotestemunha");
  let escolaridadetestemunha = document.querySelector('select[id="escolaridadetestemunha"]');
  let cortestemunha = document.querySelector('select[id="cortestemunha"]');
  let estadoCiviltestemunha = document.querySelector('select[id="estadoCiviltestemunha"]');





function mostrarNotificacao(mensagem, tempo = 2000) {
  const notif = document.createElement("div");
  notif.textContent = mensagem;
  notif.style.position = "fixed";
  notif.style.bottom = "20px";
  notif.style.right = "20px";
  notif.style.background = "red"; // verde sucesso
  notif.style.color = "#fff";
  notif.style.padding = "10px 15px";
  notif.style.borderRadius = "5px";
  notif.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";
  notif.style.zIndex = "10000";
  notif.style.fontWeight = "bold";
  notif.style.fontSize = "14px";
  notif.style.transition = "opacity 0.5s ease";

  document.body.appendChild(notif);

  setTimeout(() => {
    notif.style.opacity = "0";
    setTimeout(() => document.body.removeChild(notif), 500);
  }, tempo);

}

function mostrarNotificacao2(mensagem, tempo = 2000) {
  const notif = document.createElement("div");
  notif.textContent = mensagem;
  notif.style.position = "fixed";
  notif.style.bottom = "20px";
  notif.style.right = "20px";
  notif.style.background = "#28a745"; // verde sucesso
  notif.style.color = "#fff";
  notif.style.padding = "10px 15px";
  notif.style.borderRadius = "5px";
  notif.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";
  notif.style.zIndex = "10000";
  notif.style.fontWeight = "bold";
  notif.style.fontSize = "14px";
  notif.style.transition = "opacity 0.5s ease";

  document.body.appendChild(notif);

  setTimeout(() => {
    notif.style.opacity = "0";
    setTimeout(() => document.body.removeChild(notif), 500);
  }, tempo);

}




//function to obtain dados of victim

window.obterDadosVitima = async function (path, dados) {

      obterDadosComplemetares();

  const rg = rgVitima.value;
  
  if (!rg){ 

    nomeVitima.value = "";
    telefoneVitima.value = "";
    rgVitima.value = "";
    cpfVitima.value = "";
    enderecoVitima.value = "";
    ocupacaoVitima.value = "";
    escolaridadeVitima.value = "";
    corVitima.value = "";
    estadoCivilVitima.value = "";
    nomeMaeVitima.value = "";
    nomePaiVitima.value = "";
    dataNascimentoVitima.value = "";


  } else {
     mostrarCarregamento();

  const snapshot = await get(ref(db, `DADOSGERAIS/${rg}`));
  ocultarCarregamento();


  const valor = snapshot.val();
  if (!valor) { 

          mostrarNotificacao("❌ RG: "+ rg +", não cadastrado no sistema!");
  
  
  
  } else {
              mostrarNotificacao2("✅ Dados da vítima preenchidos com sucesso!");

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
  atualizarSelect("escolaridadeVitima", dadosArray[6]);
  atualizarSelect("cor", dadosArray[7]);
  atualizarSelect("estadoCivil", dadosArray[8]);
  // Atualiza INPUTs
  const mapeamentoInputs = {
    nomeMaeVitima: 9,
    nomePaiVitima: 10,
    datanascimentovitima: 11,
    nomevitima: 0,
    cpfvitima: 3,
    enderecoVitima: 4,
    ocupacaoVitima: 5,
    telefonevitima: 1,
    
  };

for (const [id, indice] of Object.entries(mapeamentoInputs)) {
    atualizarInput(id, dadosArray[indice] || "");
  }
  
};  };

//NECESSÁRIO AJUSTAR A ORDEM DOS INDICES NOS INPUTS




//function to obtain dados of victim

window.obterDadostestemunha = async function (path, dados) {

      obterDadosComplemetares();

  const rg = rgtestemunha.value;
  
  if (!rg){ 

    nometestemunha.value = "";
    telefonetestemunha.value = "";
    rgtestemunha.value = "";
    cpftestemunha.value = "";
    enderecotestemunha.value = "";
    ocupacaotestemunha.value = "";
    escolaridadetestemunha.value = "";
    cortestemunha.value = "";
    estadoCiviltestemunha.value = "";
    nomeMaetestemunha.value = "";
    nomePaitestemunha.value = "";
    dataNascimentotestemunha.value = "";


  } else {
     mostrarCarregamento();

  const snapshot = await get(ref(db, `DADOSGERAIS/${rg}`));
  ocultarCarregamento();


  const valor = snapshot.val();
  if (!valor) { 

          mostrarNotificacao("❌ RG: "+ rg +", não cadastrado no sistema!");
  
  
  
  } else {
              mostrarNotificacao2("✅ Dados da testemunha preenchidos com sucesso!");

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
  atualizarSelect("escolaridadetestemunha", dadosArray[6]);
  atualizarSelect("cortestemunha", dadosArray[7]);
  atualizarSelect("estadoCiviltestemunha", dadosArray[8]);
  // Atualiza INPUTs
  const mapeamentoInputs = {
    nomeMaetestemunha: 9,
    nomePaitestemunha: 10,
    datanascimentotestemunha: 11,
    nometestemunha: 0,
    cpftestemunha: 3,
    enderecotestemunha: 4,
    ocupacaotestemunha: 5,
    telefonetestemunha: 1,
    
  };

for (const [id, indice] of Object.entries(mapeamentoInputs)) {
    atualizarInput(id, dadosArray[indice] || "");
  }
  
};  };

//NECESSÁRIO AJUSTAR A ORDEM DOS INDICES NOS INPUTS






// Function to obtain dados of author
window.obterDadosAutor = async function (path, dados) {
    obterDadosComplemetares();

  const rg = rgAutorOutro.value
  
  if (!rg){ 
  
nomeAutor.value = "";
telefoneAutor.value = "";
    cpfAutor.value = "";
    enderecoAutor.value = "";
    ocupacaoAutor.value = "";
    escolaridadeAutor.value = "";
    corAutor.value = "";
    estadoCivilAutor.value = "";
    nomeMaeAutor.value = "";
    nomePaiAutor.value = "";
    dataNascimentoAutor.value = "";
    



  } else {
     mostrarCarregamento();

  const snapshot = await get(ref(db, `DADOSGERAIS/${rg}`));
  ocultarCarregamento();


 const valor = snapshot.val();
  if (!valor) { 

          mostrarNotificacao("❌ RG: "+ rg +", não cadastrado no sistema!");
  
  
  
  } else {
              mostrarNotificacao2("✅ Dados do autor preenchidos com sucesso!");

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
  atualizarSelect("estadoCivilAutor", dadosArray[8]);
  atualizarSelect("corAutor", dadosArray[7]);
  atualizarSelect("escolaridadeAutor", dadosArray[6]);
  // Atualiza INPUTs
  const mapeamentoInputs = {
    nomeMaeAutor: 9,
    nomePaiAutor: 10,
    datanascimentoautor: 11,
    nomeautor: 0,
    enderecoAutor: 4,
    ocupacaoAutor: 5,
    cpfautor: 3,
    telefoneautor: 1,

  };

for (const [id, indice] of Object.entries(mapeamentoInputs)) {
    atualizarInput(id, dadosArray[indice] || "");
  };
};  };
//NECESSÁRIO AJUSTAR A ORDEM DOS INDICES NOS INPUTS



window.obterDadosComplemetares = async function (path, dados) {
  const rg = rgAutorOutro.value;
 
  


  if (!rg){ 
    
medidaProtetiva.value = "";
    redsOrigem.value = "";
  } else {
     mostrarCarregamento();


  const snapshot = await get(ref(db, `DADOSCOMPLEMENTARES/${rg}`));
  ocultarCarregamento();

  const valor = snapshot.val();
  if (!valor) return console.error("ERRO: RG Não cadastrado no sistema!");

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




  const mapeamentoInputs = {
  
   redsorigem: 3,
   medidaprotetiva: 2
  };


for (const [id, indice] of Object.entries(mapeamentoInputs)) {
    atualizarInput(id, dadosArray[indice] || "");
  }
};  };