function login() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(async (response) => {
            ocultarCarregamento();

            const user = response.user;

            // Obter o ID token do Firebase
            const token = await user.getIdToken();

            // Armazenar localmente (opcional)
            localStorage.setItem("authToken", token);

            // Enviar token para a extensão
            try {
             firebase.auth().currentUser.getIdToken().then(token => {
  chrome.runtime.sendMessage("ljgkafphldiajchpnpgehaledhaofooh", {
    type: "AUTH_TOKEN",
    token: token
  });
});

            } catch (err) {
                console.warn("Erro ao enviar token para a extensão:", err);
            }

            // Redirecionar
window.location.href = "../../index.html";  })  
        .catch(error => {      
            ocultarCarregamento();
            trocarTexto();
            console.log('Erro:', error.message);
        });
}
function contato() {
    const numero = '5531982654515'; // Código do país (55) + DDD (31) + número
    const mensagem = encodeURIComponent("Olá, gostaria de entrar em contato.");
    const url = `https://wa.me/${numero}?text=${mensagem}`;
    window.open(url, '_blank'); // Abre em nova aba
}
