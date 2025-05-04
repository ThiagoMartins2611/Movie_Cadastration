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


app.post('/cadastrar', (request:FastifyRequest, reply:FastifyReply)=>{

    const {nome, email, senha} = request.body as any;

    console.table(request.body);

    

    reply.status(200).send("Dados recebidos");
});




app.listen({port: 7000}, (err, address) =>{
    if (err) {
        console.error(err)
        process.exit(1)
      }
      console.log(`app listening at ${address}`)
})