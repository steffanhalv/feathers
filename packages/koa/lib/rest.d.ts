import { Application, Middleware } from './declarations';
import { AuthenticationSettings } from './authentication';
export declare const formatter: Middleware;
export declare type RestOptions = {
    formatter?: Middleware;
    authentication?: AuthenticationSettings;
};
export declare const rest: (options?: RestOptions | Middleware) => (app: Application) => void;
