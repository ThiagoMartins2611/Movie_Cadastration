import '@fastify/session';

declare module '@fastify/session' {
  interface SessionData {
    authenticated: boolean;
    user: {
      id: number;
      nome: string;
      email: string;
    };
  }
}