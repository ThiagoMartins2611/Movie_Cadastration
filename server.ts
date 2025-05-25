import mysql, {Connection, ConnectionOptions} from 'mysql2/promise';
import fastify, {FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import fastifyJwt from '@fastify/jwt';
import cors from '@fastify/cors';
import { request } from 'http';



const app = fastify()

app.register(cors, {

    origin: "http://127.0.0.1:5500",
    credentials: true

  });


app.register(fastifyJwt, {
    secret: 'thiagoCosta_LeticiaAlves_RafaelDebastiani',

});


let myPassword:string = "Thiago@4740w";


app.get('/', async (request:FastifyRequest, reply:FastifyReply)=>{
    reply.send("servidor rodando corretamente");
});

//cadastro
app.post('/cadastrarUsers', async (request:FastifyRequest, reply:FastifyReply)=>{

    const {nome, email, senha} = request.body as {nome:string, email:string, senha:string};

    console.table(request.body);

    try {

        const conn = await mysql.createConnection({
            host: "localhost",
            user: 'root',
            password: myPassword,
            port: 3306
        });


        await conn.query("CREATE DATABASE IF NOT EXISTS MovieCritcs");
        await conn.end();


        const dbconn = await mysql.createConnection({
            host: "localhost",
            user: 'root',
            password: myPassword,
            database:"MovieCritcs",
            port: 3306
        });

        await dbconn.query(
            `CREATE TABLE IF NOT EXISTS users(
            
                id INT AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(100),
                email VARCHAR(100) UNIQUE,
                senha VARCHAR(100)
            
            )
            `);

        await dbconn.query("INSERT INTO users (nome, email, senha) VALUES (?,?,?)", [nome, email, senha]);

      
        reply.status(200).send("dados enviados para o banco");
        console.log("mandado para o banco")

        dbconn.end()

    } 
    catch (error:any) {
        console.error("erro ao mandar para o banco")
        reply.status(500).send({mensagem: "Coloque um email diferente. Já tem um usuario com esse email"});
    }


    
});

//login
app.post('/LoginUser', async (request:FastifyRequest, reply:FastifyReply)=>{

    const {email, senha} = request.body as {email:string, senha:string} 

    try {

        const conn = await mysql.createConnection({
            host: "localhost",
            user: 'root',
            password: myPassword,
            port: 3306
        });


        await conn.query("CREATE DATABASE IF NOT EXISTS MovieCritcs");
        await conn.end();


        const dbconn = await mysql.createConnection({
            host: "localhost",
            user: 'root',
            password: myPassword,
            database:"MovieCritcs",
            port: 3306
        });


        await dbconn.query(
            `CREATE TABLE IF NOT EXISTS users(
            
                id INT AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(100),
                email VARCHAR(100) UNIQUE,
                senha VARCHAR(100)
            
            )
            `);

       const [rows] = await dbconn.query("SELECT * FROM users WHERE email = ? AND senha = ?", [email, senha]); 
       // a consulta que fazemos pelo mysql retorna uma array e um desses valores da array é "rows", no caso esse são os usuario que o progama encontra que tem aquelas infromações. 

       const usuarios = rows as any[];
       


       if(usuarios.length == 0){
        return reply.status(400).send({mensagem: "Usuario não identificado, confira o email e a senha"});
       }       

      
      
       
        const user = {
            id: usuarios[0].id,
            nome: usuarios[0].nome,
            email: usuarios[0].email
        }


        const token = app.jwt.sign(user, {expiresIn: '1h'});

 

        reply.status(200).send({
            mensagem: "Login realizado com sucesso",
            token
        });

       
        await dbconn.end();

    } catch (error:any) {
        console.log("banco não encontrado para conectar");
        reply.status(500).send({ mensagem: "Erro interno" });
    }
   

});

//verificar tokens
async function verificarToken(request: FastifyRequest, reply: FastifyReply) {
    try {

      await request.jwtVerify();

    } catch (err) {

      return reply.status(401).send({ mensagem: "Token inválido ou ausente" });
    }
}

//pagina principal
app.get('/page', { preHandler: verificarToken }, async (request:FastifyRequest, reply:FastifyReply)=>{

    reply.send({
        mensagem: "Você está logado",
        usuario: request.user
    });
});

app.get('/filmes', async(request:FastifyRequest, reply:FastifyReply) =>{

    try{
        const dbconn = await mysql.createConnection({
            host: "localhost",
            user: 'root',
            password: myPassword,
            database:"MovieCritcs",
            port: 3306
        });

        const dados = await dbconn.query("SELECT * FROM filmes");

        const filmes = dados[0];

        reply.status(200).send({mensagem: "dados enviados", filmes});

    }catch{
        console.log("erro ao tentar conectar com o banco")
    }
});

app.get('/colaboradores', async (request:FastifyRequest, reply:FastifyReply)=>{

    try{

        const dbconn = await mysql.createConnection({
            host: "localhost",
            user: 'root',
            password: myPassword,
            database:"MovieCritcs",
            port: 3306
        });

        const dados = await dbconn.query("SELECT * FROM users")

        const colaboradores = dados[0]

        reply.status(200).send({mensagem: "dados mandados", colaboradores})

    }
    catch(erro){
        reply.status(400).send({mensagem: "não foi possivel conectar com o banco"})
        console.log("erro ao conectar com o banco")
    }


});

//apagar o token
app.post('/logout', (request:FastifyRequest, reply:FastifyReply)=>{
    
    reply.send({ mensagem: "Logout realizado com sucesso" });
});


/////////////////////////////////////////////////////////////
//Leticia

app.post('/cadastrandoFilmes', async (request:FastifyRequest, reply:FastifyReply)=>{

    const {userId, nomeFilme, descricao, genero, classificacao, foto, lancamento, diretor} = request.body as {userId:number, nomeFilme:string, descricao:string, genero:string, classificacao:number, foto:string, lancamento:string, diretor:string};


    try{

    const dbconn = await mysql.createConnection({
        host: "localhost",
        user: 'root',
        password: myPassword,
        database:"MovieCritcs",
        port: 3306
    });

    await dbconn.query(
        
        `CREATE TABLE IF NOT EXISTS filmes(

            idfilme INT AUTO_INCREMENT PRIMARY KEY,
            userid INT,
            nome VARCHAR(60),
            descricao LONGTEXT,
            genero VARCHAR(45),
            classificacao INT UNSIGNED,
            foto VARCHAR(255) NOT NULL,
            lancamento DATE,       
            diretor VARCHAR(60),
            FOREIGN KEY (userid) REFERENCES users(id)
        ) 
        `);

    try {

        await dbconn.query("INSERT INTO filmes (userid, nome, descricao, genero, classificacao, foto, lancamento, diretor) VALUES (?,?,?,?,?,?,?,?)", [userId, nomeFilme, descricao, genero, classificacao, foto, lancamento, diretor]);
    
    }
     catch (error) {
        console.log(error)
        console.log("deu errado")

        return
    }
    

    reply.status(200).send({mensagem: "filme cadastrado"})
    console.log("filme cadastrado")
    await dbconn.end();
    }
    catch(erro){
        console.log("erro ao conectar com o banco")
    }
});



app.post('/mostrarPorGenero', async (request:FastifyRequest, reply:FastifyReply)=>{

    const {generoSelecionado} = request.body as {generoSelecionado:string}


    try{
        const dbconn = await mysql.createConnection({
        host: "localhost",
        user: 'root',
        password: myPassword,
        database:"MovieCritcs",
        port: 3306
        });

        const dados = await dbconn.query("SELECT * FROM filmes WHERE genero = ?", [generoSelecionado]);
        const filmes = dados[0];


        reply.status(200).send({mensagem:"Gênero analisado com sucesso, filmes enviados", filmes})
    }catch(erro){

        console.log("Erro ao conectar com o banco")

    }
});

///////////////////////////////////////////////////////////////////////////////////


app.get('/meusFilmes', { preHandler: verificarToken }, async (request:FastifyRequest, reply:FastifyReply)=>{

    const userid = (request as any).user.id
    

    try {
        
        const dbconn = await mysql.createConnection({
            host: "localhost",
            user: 'root',
            password: myPassword,
            database:"MovieCritcs",
            port: 3306
        });

        const dados = await dbconn.query("SELECT * FROM filmes WHERE userid = ?", [userid]);
        const filmes = dados[0];

        reply.status(200).send({mensagem: "dados enviados", filmes})


        
    } catch (error) {
        reply.status(400).send({mensagem: "deu errado meus amigos"})
        console.log("erro ao conettar ao banco")
    }
 

});



///////////////////////////////////////////////////////////////////////////////////

//rafael
app.post('/salvarComentarios', async (request: FastifyRequest, reply: FastifyReply) => {
  const {userid, comentario } = request.body as any;
    console.log(request.body)
  try {
    const dbconn = await mysql.createConnection({
      host: "localhost",
      user: 'root',
      password: myPassword,
      database: "MovieCritcs",
      port: 3306
    });

    await dbconn.query(`
      CREATE TABLE IF NOT EXISTS comentarios (
        idComentario INT AUTO_INCREMENT PRIMARY KEY,
        userid INT NOT NULL,
        comentario LONGTEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userid) REFERENCES users(id)
      )
    `);

  

    // Corrigido: inserir na tabela comentarios, não filmes
    await dbconn.query(
      "INSERT INTO comentarios (userid, comentario) VALUES (?, ?)",
      [userid, comentario]
    );

    await dbconn.end();

    reply.send({ success: true, message: 'Comentário salvo com sucesso!' });

  } catch (erro) {
    console.error("Erro ao conectar com o banco:", erro);
    reply.status(500).send({ success: false, message: 'Erro ao salvar comentário' });
  }
});


app.get('/obterComentarios', async (request:FastifyRequest, reply:FastifyReply) => {
  try {
    const dbconn = await mysql.createConnection({
      host: "localhost",
      user: 'root',
      password: myPassword,
      database: "MovieCritcs",
      port: 3306
    });

     await dbconn.query(`
      CREATE TABLE IF NOT EXISTS comentarios (
        idComentario INT AUTO_INCREMENT PRIMARY KEY,
        userid INT NOT NULL,
        comentario LONGTEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const rows = await dbconn.query("SELECT userid, comentario, created_at FROM comentarios ORDER BY created_at DESC");
    
    console.log(rows)
    

    await dbconn.end();


    reply.send({ success: true, comentarios: rows });

  } catch (erro) {
    console.error("Erro ao conectar com o banco:", erro);
    reply.status(500).send({ success: false, message: 'Erro ao obter comentários' });
  }
});

//////////////////////////////////////////////////////////////////////////////////

app.listen({port: 7000}, (err, address) =>{
    if (err) {
        console.error(err)
        process.exit(1)
      }
      console.log(`app listening at ${address}`)
})