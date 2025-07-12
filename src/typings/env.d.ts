// Deklaracje dla zmiennych z .env
declare namespace NodeJS {
  interface ProcessEnv {
    readonly API_KEY: string;
    readonly PORT?: string;
  }
}
