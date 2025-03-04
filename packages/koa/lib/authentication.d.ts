import { Middleware } from './declarations';
export declare type AuthenticationSettings = {
    service?: string;
    strategies?: string[];
};
export declare function parseAuthentication(settings?: AuthenticationSettings): Middleware;
export declare function authenticate(settings: string | AuthenticationSettings, ...strategies: string[]): Middleware;
