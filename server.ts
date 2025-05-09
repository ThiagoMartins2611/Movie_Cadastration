import mysql, {Connection, ConnectionOptions} from 'mysql2/promise';
import fastify, {FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import fastifyCookie from '@fastify/cookie';
import fastifySession from '@fastify/session';
import cors from '@fastify/cors';


const app = fastify()

app.register(cors, {

    origin: "http://127.0.0.1:5500",
    credentials: true

  });

app.register(fastifyCookie);
app.register(fastifySession, {

    secret: 'thiagoCosta_LeticiaAlves_RafaelDebastiani',

    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60
    },

    saveUninitialized: false

});



app.get('/', async (request:FastifyRequest, reply:FastifyReply)=>{
    reply.send("servidor rodando corretamente");
});


app.post('/cadastrarUsers', async (request:FastifyRequest, reply:FastifyReply)=>{

    const {nome, email, senha} = request.body as {nome:string, email:string, senha:string};

    console.table(request.body);

    try {

        const conn = await mysql.createConnection({
            host: "localhost",
            user: 'root',
            password:"",
            port: 3306
        });


        await conn.query("CREATE DATABASE IF NOT EXISTS MovieCritcs");
        await conn.end();


        const dbconn = await mysql.createConnection({
            host: "localhost",
            user: 'root',
            password:"",
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


app.post('/LoginUser', async (request:FastifyRequest, reply:FastifyReply)=>{

    const {email, senha} = request.body as {email:string, senha:string} 

    try {

        const conn = await mysql.createConnection({
            host: "localhost",
            user: 'root',
            password:"",
            port: 3306
        });


        await conn.query("CREATE DATABASE IF NOT EXISTS MovieCritcs");
        await conn.end();


        const dbconn = await mysql.createConnection({
            host: "localhost",
            user: 'root',
            password:"",
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
      
       (request.session as any).authenticated = true;
       (request.session as any).user = {
            id: usuarios[0].id,
            nome: usuarios[0].nome,
            email: usuarios[0].email
        }


        console.table((request.session as any).user)
        const loginAuthenticated = (request.session as any).authenticated;

        console.log(loginAuthenticated);
        

        reply.status(200).send({
            mensagem: "Login realizado com sucesso",
            loginAuthenticated
        });

       
        
    } catch (error:any) {
        console.log("banco não encontrado para conectar")
    }
   

});


app.get('/page', async (request:FastifyRequest, reply:FastifyReply)=>{

    if((request.session as any).authenticated){

        reply.send({
            mensagem: "Você está logado",
            usuario: (request.session as any).user
        });

    }else{
        reply.status(401).send({mensagem: "Não autorizado, faça login"});
    }
});



app.post('/logout', (request:FastifyRequest, reply:FastifyReply)=>{

    request.session = null as any;

    reply.clearCookie('sessionId'); 
    
    reply.send({ mensagem: "Logout realizado com sucesso" });
});



app.listen({port: 7000}, (err, address) =>{
    if (err) {
        console.error(err)
        process.exit(1)
      }
      console.log(`app listening at ${address}`)
})