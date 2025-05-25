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

const main = document.getElementById("main")


// Letícia

async function mostrar() {

    const espacoDosFilmes = document.getElementById("filmes");
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

    const espacoDosFilmes = document.getElementById("filmes");   
    if(!espacoDosFilmes){
        main.innerHTML = "";
        main.innerHTML = `

             <div onclick="RedirectAddMovie()" id="addMovie">
            <svg width="30px" height="30px" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        
                    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <g id="Dribbble-Light-Preview" transform="translate(-179.000000, -600.000000)" fill="#E5E5E5">
                            <g id="icons" transform="translate(56.000000, 160.000000)">
                                <path d="M137.7,450 C137.7,450.552 137.2296,451 136.65,451 L134.55,451 L134.55,453 C134.55,453.552 134.0796,454 133.5,454 C132.9204,454 132.45,453.552 132.45,453 L132.45,451 L130.35,451 C129.7704,451 129.3,450.552 129.3,450 C129.3,449.448 129.7704,449 130.35,449 L132.45,449 L132.45,447 C132.45,446.448 132.9204,446 133.5,446 C134.0796,446 134.55,446.448 134.55,447 L134.55,449 L136.65,449 C137.2296,449 137.7,449.448 137.7,450 M133.5,458 C128.86845,458 125.1,454.411 125.1,450 C125.1,445.589 128.86845,442 133.5,442 C138.13155,442 141.9,445.589 141.9,450 C141.9,454.411 138.13155,458 133.5,458 M133.5,440 C127.70085,440 123,444.477 123,450 C123,455.523 127.70085,460 133.5,460 C139.29915,460 144,455.523 144,450 C144,444.477 139.29915,440 133.5,440" id="plus_circle-[#1427]"></path>
                            </g>
                        </g>
                    </g>
            </svg>
        </div>

        <div id="filmes">

        </div>
        
        `;

        mostrar();
    }else{
        espacoDosFilmes.innerHTML = "";
        mostrar();
    }

}

document.getElementById("generoTexto").addEventListener("click", function () {
    document.getElementById("generoMenu").classList.toggle("visible");
});

const OpsGenero = document.getElementsByClassName("opGenero");
const espacoDosFilmes = document.getElementById("filmes");

Array.from(OpsGenero).forEach(op => {

    op.addEventListener("click", () => {

        const espacoDosFilmes = document.getElementById("filmes");   
        if(!espacoDosFilmes){
            main.innerHTML = "";
            main.innerHTML = `

                <div onclick="RedirectAddMovie()" id="addMovie">
                <svg width="30px" height="30px" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            
                        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                            <g id="Dribbble-Light-Preview" transform="translate(-179.000000, -600.000000)" fill="#E5E5E5">
                                <g id="icons" transform="translate(56.000000, 160.000000)">
                                    <path d="M137.7,450 C137.7,450.552 137.2296,451 136.65,451 L134.55,451 L134.55,453 C134.55,453.552 134.0796,454 133.5,454 C132.9204,454 132.45,453.552 132.45,453 L132.45,451 L130.35,451 C129.7704,451 129.3,450.552 129.3,450 C129.3,449.448 129.7704,449 130.35,449 L132.45,449 L132.45,447 C132.45,446.448 132.9204,446 133.5,446 C134.0796,446 134.55,446.448 134.55,447 L134.55,449 L136.65,449 C137.2296,449 137.7,449.448 137.7,450 M133.5,458 C128.86845,458 125.1,454.411 125.1,450 C125.1,445.589 128.86845,442 133.5,442 C138.13155,442 141.9,445.589 141.9,450 C141.9,454.411 138.13155,458 133.5,458 M133.5,440 C127.70085,440 123,444.477 123,450 C123,455.523 127.70085,460 133.5,460 C139.29915,460 144,455.523 144,450 C144,444.477 139.29915,440 133.5,440" id="plus_circle-[#1427]"></path>
                                </g>
                            </g>
                        </g>
                </svg>
            </div>

            <div id="filmes">

            </div>
            
            `;

            document.getElementById("generoMenu").classList.toggle("visible"); 
            mostrarGenero(op.textContent)
        }else{
            document.getElementById("generoMenu").classList.toggle("visible"); 
            espacoDosFilmes.innerHTML = "";
            mostrarGenero(op.textContent)
        }

    });
});

async function mostrarGenero(generoSelecionado){
    
    const espacoDosFilmes = document.getElementById("filmes");
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

function RedirectAddMovie(){
    window.location.href = "cadastroFilmes.html";
}

////////////////////////////////////////////

const meusFilmes = document.getElementById("meusFilmes");

meusFilmes.onclick = ()=>{
    const espacoDosFilmes = document.getElementById("filmes");   
    if(!espacoDosFilmes){
        main.innerHTML = "";
        main.innerHTML = `

             <div onclick="RedirectAddMovie()" id="addMovie">
            <svg width="30px" height="30px" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        
                    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <g id="Dribbble-Light-Preview" transform="translate(-179.000000, -600.000000)" fill="#E5E5E5">
                            <g id="icons" transform="translate(56.000000, 160.000000)">
                                <path d="M137.7,450 C137.7,450.552 137.2296,451 136.65,451 L134.55,451 L134.55,453 C134.55,453.552 134.0796,454 133.5,454 C132.9204,454 132.45,453.552 132.45,453 L132.45,451 L130.35,451 C129.7704,451 129.3,450.552 129.3,450 C129.3,449.448 129.7704,449 130.35,449 L132.45,449 L132.45,447 C132.45,446.448 132.9204,446 133.5,446 C134.0796,446 134.55,446.448 134.55,447 L134.55,449 L136.65,449 C137.2296,449 137.7,449.448 137.7,450 M133.5,458 C128.86845,458 125.1,454.411 125.1,450 C125.1,445.589 128.86845,442 133.5,442 C138.13155,442 141.9,445.589 141.9,450 C141.9,454.411 138.13155,458 133.5,458 M133.5,440 C127.70085,440 123,444.477 123,450 C123,455.523 127.70085,460 133.5,460 C139.29915,460 144,455.523 144,450 C144,444.477 139.29915,440 133.5,440" id="plus_circle-[#1427]"></path>
                            </g>
                        </g>
                    </g>
            </svg>
        </div>

        <div id="filmes">

        </div>
        
        `;

        mostrarMeusFilmes();
    }else{
        espacoDosFilmes.innerHTML = "";
        mostrarMeusFilmes();
    }
}

async function mostrarMeusFilmes() {
    
    const espacoDosFilmes = document.getElementById("filmes");
    
    try{
        const token = localStorage.getItem("token");
        
        const res = await fetch("http://localhost:7000/meusFilmes", {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        
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
        alert("Erro ao conectar ao servidor")
    }


}


async function mostrarColaboradores(){

    try{
        const res = await fetch("http://localhost:7000/colaboradores");

        const dados = await res.json()

        console.log(dados.mensagem)

        const colaboradores = dados.colaboradores;


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


const userConfig = document.getElementById("user");
const dropMenu = document.getElementById("dropDownMenu");
const generoOp = document.getElementById("generoTexto");
const menuGenero = document.getElementById("generoMenu");

userConfig.onclick = ()=>{
    dropMenu.classList.toggle("hidden");
};

function erase(){
    localStorage.removeItem("token");
    window.location.href = "login.html";
}


document.addEventListener("click", (e)=>{
    if(!userConfig.contains(e.target) && !dropMenu.contains(e.target)){
        dropMenu.classList.add("hidden");
    }
});

document.addEventListener("click", (e)=>{
    if(!generoOp.contains(e.target) && !document.getElementById("generoMenu").contains(e.target)){
        generoMenu.classList.remove("visible");
    }
});