import { Server } from "socket.io";

export type Bindings = {
  PORT: number;
  BASE_URL: string;
  KINDE_AUTH_DOMAIN: string;
  KINDE_CLIENT_ID: string;
  KINDE_CLIENT_SECRET: string;
  KINDE_REDIRECT_URL: string;
  KINDE_LOGOUT_REDIRECT_URL: string;
  DB_URL: string;
  R2_BUCKET_ENDPOINT: string;
  R2_BUCKET_NAME: string;
  R2_BUCKET_ACCESS_KEY_ID: string;
  R2_BUCKET_SECRET_ACCESS_KEY: string;
  R2_BUCKET_TOKEN: string;
};

export type Variables = {
  io: Server;
};

export type Env = {
  Bindings: Bindings;
  Variables: Variables;
};
