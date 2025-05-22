window.onload = async () => {

        const token = localStorage.getItem("token");

        if(!token){
            alert("token não encontrado, faça login... redirecionando para login");
            window.location.href = "login.html";

            return;
        }

        const res = await fetch('http://localhost:7000/page', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });


        if (!res.ok) {
            localStorage.removeItem("token");
            alert("Você não está logado ou o token expirou. Redirecionando para login...");
            window.location.href = "login.html";
        }

        const data = await res.json();

        if (res.ok) {
            console.log("Usuário logado:", data.usuario);
            // Exibir dados na tela, etc
        } else {
            alert("Você não está logado ou o token expirou. Redirecionando para login...");
            window.location.href = "login.html";
            
        }


        mostrar();
};

// Letícia

let espacoDosFilmes = document.getElementById("filmes");

async function mostrar() {
    
    try{

    const res = await fetch ("http://localhost:7000/filmes");
    const data = await res.json ();
    const filmes = data.filmes;

    console.log(data.mensagem);
 
    filmes.forEach((filme) => {

        const card = document.createElement("div")
        card.classList = "card";
        
        card.innerHTML = `
            <img src="${filme.foto}" alt="" class="fotoFilme">
            <div class="textContent">
                <h1 class="tituloFilme">${filme.nome}</h1>
                <h3 class="generoFilme">${filme.genero}</h3>
            </div>

        `

        espacoDosFilmes.appendChild(card);
    });
    
    }catch(erro){

        alert("erro ao conectar ao servidor");

        console.log(erro);
    }
}

const titulo = document.getElementById("titulo");


titulo.onclick = () => {

    espacoDosFilmes.innerHTML = "";

    mostrar();

}

document.getElementById("generoTexto").addEventListener("click", function () {
    document.getElementById("generoMenu").classList.toggle("visible");
});

const OpsGenero = document.getElementsByClassName("opGenero");

Array.from(OpsGenero).forEach(op => {

    op.addEventListener("click", () => {
        document.getElementById("generoMenu").classList.toggle("visible");
        espacoDosFilmes.innerHTML = "";
        mostrarGenero(op.textContent)
    });
});

async function mostrarGenero(generoSelecionado){
    try{
        const objgeneroSelecionado = {generoSelecionado};
        const res = await fetch("http://localhost:7000/mostrarPorGenero",{

            headers: {
                'Content-Type': 'application/json'
            },

            method: "POST",
                        
            body: JSON.stringify(objgeneroSelecionado)

        });

        const dados = await res.json() 
       
        if(res.status = 200){

            console.log(dados.mensagem);

            const filmes = dados.filmes;

            filmes.forEach((filme) => {
    
            const card = document.createElement("div")
            card.classList = "card";
            
            card.innerHTML = `
                <img src="${filme.foto}" alt="" class="fotoFilme">
                <div class="textContent">
                    <h1 class="tituloFilme">${filme.nome}</h1>
                    <h3 class="generoFilme">${filme.genero}</h3>
                </div>
    
            `
            espacoDosFilmes.appendChild(card);
        });

        }

    }catch(erro){
        alert("Erro ao conectar ao servidor")
    }
}

/////////////////

function erase(){
    localStorage.removeItem("token");
    window.location.href = "login.html";
}


const userConfig = document.getElementById("user");
const dropMenu = document.getElementById("dropDownMenu");


userConfig.onclick = ()=>{
    dropMenu.classList.toggle("hidden");
};

document.addEventListener("click", (e)=>{
    if(!userConfig.contains(e.target) && !dropMenu.contains(e.target)){
        dropMenu.classList.add("hidden");
    }
});



async function mostrarColaboradores(){

    try{
        const res = await fetch("http://localhost:7000/colaboradores");

        const dados = await res.json()

        console.log(dados.mensagem)

        const colaboradores = dados.colaboradores;


        const main = document.getElementById("main");

        let ul = document.getElementById("listaDeColaboradores");
        
        if(!ul){
            main.innerHTML = "";
            ul = document.createElement("ul");
            ul.id = "listaDeColaboradores";

            main.appendChild(ul)
        }else{
            main.innerHTML = "";
            ul = document.createElement("ul");
            ul.id = "listaDeColaboradores";

            main.appendChild(ul)
        }

        colaboradores.forEach(colaborador => {


            const li = document.createElement("li");
            li.classList = "colaboradores"

            const img = document.createElement("img")
            img.src = "user.png";
            img.alt = "";
            img.classList = "photoUser"

            const info = document.createElement("ul");
            info.classList = "infoColaboradores"
            
            const nome = document.createElement("li");
            nome.classList = "nomeColaborador opInfoColaborador";

            const email = document.createElement("li");
            email.classList = "emailColaborador opInfoColaborador";
        

            nome.innerText = colaborador.nome;
            email.innerText = colaborador.email;

            info.appendChild(nome);
            info.appendChild(email);

            li.appendChild(img)
            li.appendChild(info);

            ul.appendChild(li);

        });
        
        main.classList = "MainColaboradores";
    }
    catch(error){
        alert("falha em conectar com servidor")
        console.log(error)
    }
}

function RedirectAddMovie(){
    window.location.href = "cadastroFilmes.html";
}