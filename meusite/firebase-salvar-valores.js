
import {AtualizarDados} from "./atualizarDados.js";
import { firebaseConfig, initializeApp, getAuth, onAuthStateChanged, signOut, getDatabase, ref, set  } from "./firebaseKeys.js";
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// Monitorar autenticação do usuário
onAuthStateChanged(auth, (user) => {
  const userInfo = document.getElementById("user-info");
  if (user) {
    if(userInfo) userInfo.innerText = `Usuário: ${user.email}`;
  } else {
    if(userInfo) userInfo.innerText = "Nenhum usuário autenticado";
            window.location.href = "./login/login.html";


  }
});

// Função para logout
export function logout() {
  signOut(auth).then(() => {
    window.location.href = "./login/login.html";
  }).catch(error => {
    console.error("Erro ao sair:", error);
  });
}

// Funções para mostrar e esconder alertas
const alertBox = document.getElementById("fullscreenAlert");
const alertaSucesso = document.getElementById("alertaSucesso");
const closeAlertButton = document.getElementById("closeAlert");

function mostrarAlerta() {
  if (alertBox) alertBox.style.display = "flex";
}

function esconderAlerta() {
  if (alertBox) alertBox.style.display = "none";
}

 function mostrarAlertaSucesso() {
  if (alertaSucesso) {
    alertaSucesso.style.display = "block";
    setTimeout(() => {
      alertaSucesso.style.display = "none";
    }, 4000);
  }
};

// Fechar alerta ao clicar no botão
if(closeAlertButton){
  closeAlertButton.addEventListener("click", () => {
    esconderAlerta();
  });
}

// Funções para salvar dados no Firebase Realtime Database
function salvarDadosEmLista(caminho, dados) {


  const rgvitimavalor01 = document.getElementById("rgvitima")?.value;
  const nomevitima = document.getElementById("nomevitima")?.value;
let changedElement = document.getElementById("elementoRG");
  changedElement.textContent = "É preciso preencher o NOME e RG da vítima!"

  if (!rgvitimavalor01) {
    mostrarAlerta();
    console.error("O ID da vítima está vazio.");
    return;
  } else if (!nomevitima) {
    mostrarAlerta();
    console.error("O nome da vítima está vazio.");
    
  } else {

  const referencia = ref(db, `${caminho}/${rgvitimavalor01}`);
  const dadosJSON = JSON.stringify(dados);

  set(referencia, dadosJSON)
    .then(() => console.log("Dados salvos com sucesso no Realtime Database!"))
    .catch(erro => console.error("Erro ao salvar dados:", erro));}
};


function salvarDadosEmListaAutor(caminho, dados) {

  const rgautor = document.getElementById("rgautor")?.value;
  const nomeautor = document.getElementById("nomeautor")?.value;
  let changedElement = document.getElementById("elementoRG");
  changedElement.textContent = "É preciso preencher o NOME e RG do autor!"

  if (!rgautor) {
    mostrarAlerta();
    console.error("O ID do autor está vazio.");
    return;
  } else if (!nomeautor) {
    mostrarAlerta();
    console.error("O nome do autor está vazio.");
    
  } else {
          mostrarNotificacao2("✅ Dados do autor salvos/atualizados com sucesso!");

  const referencia = ref(db, `${caminho}/${rgautor}`);
  const dadosJSON = JSON.stringify(dados);

  set(referencia, dadosJSON)
    .then(() => console.log("Dados salvos com sucesso no Realtime Database!"))
    .catch(erro => console.error("Erro ao salvar dados:", erro));}
};


function salvarDadosEmListaVitima(caminho, dados) {

   const rgvitimavalor01 = document.getElementById("rgvitima")?.value;
  const nomevitima = document.getElementById("nomevitima")?.value;
let changedElement = document.getElementById("elementoRG");
  changedElement.textContent = "É preciso preencher o NOME e RG da vítima!"

  if (!rgvitimavalor01) {
    mostrarAlerta();
    console.error("O ID da vítima está vazio.");
    return;
  } else if (!nomevitima) {
    mostrarAlerta();
    console.error("O ID da vítima está vazio.");
    
  } else {
          mostrarNotificacao("✅ Dados da vítima salvos/atualizados com sucesso!");

  const referencia = ref(db, `${caminho}/${rgvitimavalor01}`);
  const dadosJSON = JSON.stringify(dados);

  set(referencia, dadosJSON)
    .then(() => console.log("Dados salvos com sucesso no Realtime Database!"))
    .catch(erro => console.error("Erro ao salvar dados:", erro));}
};



function salvarDadosEmListaComplementar(caminho, dados) {

   const rgvitimavalor01 = document.getElementById("rgautor")?.value;
  const nomevitima = document.getElementById("nomevitima")?.value;
let changedElement = document.getElementById("elementoRG");
  changedElement.textContent = "É preciso preencher o NOME e RG do autor!"

  if (!rgvitimavalor01) {
    mostrarAlerta();
    console.error("O ID do autor está vazio.");
    return;
  } else if (!nomevitima) {
    mostrarAlerta();
    console.error("O ID do autor está vazio.");
    
  } else {
          mostrarNotificacao("✅ Dados complementares salvos/atualizados com sucesso!");

  const referencia = ref(db, `${caminho}/${rgvitimavalor01}`);
  const dadosJSON = JSON.stringify(dados);

  set(referencia, dadosJSON)
    .then(() => console.log("Dados salvos com sucesso no Realtime Database!"))
    .catch(erro => console.error("Erro ao salvar dados:", erro));}
};



function mostrarNotificacao(mensagem, tempo = 2000) {
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
function mostrarNotificacao2(mensagem, tempo = 4000) {
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

// Função para formatar telefone: remove não numéricos, pega últimos 9 dígitos e formata XXX-XXX-XXX
function formatarTelefone(telefone) {
  if (!telefone) return "NULL";
  let tel = telefone.replace(/\D/g, "").slice(-9);
  tel = tel.replace(/(\d{3})(\d{3})(\d{3})/, "$1-$2-$3");
  return tel || "NULL";
}
export function Geral() {
  console.log("Função Geral foi chamada.");


  // Capturar dados dos inputs
  const nomeVitima = document.getElementById("nomevitima")?.value || "NULL";
  const rgVitima = document.getElementById("rgvitima")?.value || "NULL";
  const cpfVitima = document.getElementById("cpfvitima")?.value || "NULL";
  const cpfAutor = document.getElementById("cpfautor")?.value || "NULL";
  const nomeAutor = document.getElementById("nomeautor")?.value || "NULL";
  const nomeMaeVitima = document.getElementById("nomeMaeVitima")?.value || "NULL";
  const nomePaiVitima = document.getElementById("nomePaiVitima")?.value || "NULL";
  const dataNascimentoVitima = document.getElementById("datanascimentovitima")?.value || "NULL";
  const nomeMaeAutor = document.getElementById("nomeMaeAutor")?.value || "NULL";
  const nomePaiAutor = document.getElementById("nomePaiAutor")?.value || "NULL";
  const dataNascimentoAutor = document.getElementById("datanascimentoautor")?.value || "NULL";
  const telefoneAutor = formatarTelefone(document.getElementById("telefoneautor")?.value);
  const telefoneVitima = formatarTelefone(document.getElementById("telefonevitima")?.value);
  const rgAutorOutro = document.getElementById("rgautor")?.value || "NULL";
  const redsOrigem = document.getElementById("redsorigem")?.value || "NULL";
  const medidaProtetiva = document.getElementById("medidaprotetiva")?.value || "NULL";
  const enderecoVitima = document.getElementById("enderecoVitima")?.value || "NULL";
  const enderecoAutor = document.getElementById("enderecoAutor")?.value || "NULL";
  const ocupacaoVitima = document.getElementById("ocupacaoVitima")?.value || "NULL";
  const ocupacaoAutor = document.getElementById("ocupacaoAutor")?.value || "NULL";
  const estadoCivilAutor = document.querySelector('select[id="estadoCivilAutor"]')?.value || "NULL";
  const corAutor = document.querySelector('select[id="corAutor"]')?.value || "NULL";
  const escolaridadeAutor = document.querySelector('select[id="escolaridadeAutor"]')?.value || "NULL";
  const escolaridadeVitima = document.querySelector('select[id="escolaridadeVitima"]')?.value || "NULL";
  const corVitima = document.querySelector('select[id="cor"]')?.value || "NULL";
  const estadoCivilVitima = document.querySelector('select[id="estadoCivil"]')?.value || "NULL";



  // Montar os arrays com dados para salvar
  const dadosLista = [
    nomeVitima,
    telefoneVitima,
    rgAutorOutro,
    nomeAutor,
    telefoneAutor,
    redsOrigem,
    medidaProtetiva,
    cpfVitima,
    cpfAutor,
    enderecoVitima,
    enderecoAutor,
    ocupacaoVitima,
    ocupacaoAutor,
    escolaridadeVitima,
    corVitima,
    estadoCivilVitima,
    escolaridadeAutor,
    corAutor,
    estadoCivilAutor,
    nomeMaeVitima,
    nomePaiVitima,
    dataNascimentoVitima,
    nomeMaeAutor,
    nomePaiAutor,
    dataNascimentoAutor
    
  ];

  const dadosListaAutor = [
    nomeAutor,  //0
    telefoneAutor, //1
    rgAutorOutro,   //2
    cpfAutor, //3
    enderecoAutor, //4
    ocupacaoAutor, //5
    escolaridadeAutor, //6
    corAutor, //7
    estadoCivilAutor, //8
    nomeMaeAutor, //9
    nomePaiAutor, //10
    dataNascimentoAutor, //11
    medidaProtetiva, //14
     redsOrigem  //15

    
  ];
  

  // Montar os arrays com dados para salvar
  const dadosListaVitima = [
    nomeVitima, //0
    telefoneVitima, //1
    rgVitima, //2
    cpfVitima, //3
    enderecoVitima, //4
    ocupacaoVitima, //5
    escolaridadeVitima, //6
    corVitima, //7
    estadoCivilVitima, //8
    nomeMaeVitima, //9
    nomePaiVitima, //10
    dataNascimentoVitima, //11
    medidaProtetiva, //12
    redsOrigem  //13
    
  ];


  // Montar os arrays com dados para salvar
  const dadosListaComplementar = [
   
    rgVitima, //2
   rgAutorOutro,   //2
    medidaProtetiva, //12
    redsOrigem  //13
    
  ];
  


  if(rgVitima == "NULL") {

    let changedElement = document.getElementById("elementoRG");
  changedElement.textContent = "É preciso preencher o RG da vítima!"
    mostrarAlerta();


  } else if(rgAutorOutro == "NULL") {
   let changedElement = document.getElementById("elementoRG");
  changedElement.textContent = "É preciso preencher o RG do autor!"  
    mostrarAlerta();

} else {  
     salvarDadosEmListaComplementar("DADOSCOMPLEMENTARES", dadosListaComplementar);

 AtualizarDados();

  }
  // Salvar dados no Firebase
 //salvarDadosEmLista("DADOS", dadosLista);
   // salvarDadosEmListaAutor("DADOSGERAIS", dadosListaAutor);

}
// Evento ao clicar no botão "showAlert"
document.getElementById("showAlert")?.addEventListener("click", () => {

Geral()



});

// Expor logout para uso no HTML, se quiser usar onclick="logout()"
window.logout = logout;


window.onload = function () {

  showText(); // Chama sua função aqui
};

export {mostrarAlertaSucesso};