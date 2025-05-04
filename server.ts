import mysql, {Connection, ConnectionOptions} from 'mysql2/promise';
import fastify, {FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import fastifyCookie from '@fastify/cookie';
import fastifySession from '@fastify/session';
import cors from '@fastify/cors';
import { request } from 'http';

const app = fastify()

app.register(cors);
app.register(fastifyCookie);





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
                email VARCHAR(100),
                senha VARCHAR(100)
            
            )
            `);

        await dbconn.query("INSERT INTO users (nome, email, senha) VALUES (?,?,?)", [nome, email, senha]);

        reply.status(200).send("dados enviados para o banco");
        console.log("mandado para o banco")

    } 
    catch (error:any) {
        console.error("erro ao mandar para o banco")
        reply.status(500).send("erro ao conectar ou mandar")
    }

    reply.status(200).send("Dados recebidos");
});




app.listen({port: 7000}, (err, address) =>{
    if (err) {
        console.error(err)
        process.exit(1)
      }
      console.log(`app listening at ${address}`)
})