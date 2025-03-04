/// <reference types="node" />
import http from 'http';
import { Server, ServerOptions } from 'socket.io';
import { Application } from '@feathersjs/feathers';
declare module '@feathersjs/feathers/lib/declarations' {
    interface Application<Services, Settings> {
        io: Server;
        listen(options: any): Promise<http.Server>;
    }
}
declare function configureSocketio(callback?: (io: Server) => void): (app: Application) => void;
declare function configureSocketio(options: number | Partial<ServerOptions>, callback?: (io: Server) => void): (app: Application) => void;
declare function configureSocketio(port: number, options?: Partial<ServerOptions>, callback?: (io: Server) => void): (app: Application) => void;
export = configureSocketio;
