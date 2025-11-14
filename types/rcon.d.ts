declare module 'rcon' {
  export interface RconOptions {
    host: string;
    port: number;
    password: string;
  }

  export class Rcon {
    constructor(options: RconOptions);
    connect(): void;
    disconnect(): void;
    send(command: string, callback?: (err: Error | null, res?: string) => void): void;
    on(event: 'connect' | 'error' | 'end', listener: (err?: Error) => void): void;
    on(event: string, listener: (...args: any[]) => void): void;
  }
}
