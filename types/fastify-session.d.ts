// types/fastify-session.d.ts
import 'fastify';

declare module 'fastify' {
  interface Session {
    authenticated: boolean;
    user: {
      id: number;
      nome: string;
      email: string;
    };
  }
}