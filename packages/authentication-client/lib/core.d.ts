import { FeathersError } from '@feathersjs/errors';
import { Application, Params } from '@feathersjs/feathers';
import { AuthenticationRequest, AuthenticationResult } from '@feathersjs/authentication';
import { Storage } from './storage';
export declare type ClientConstructor = new (app: Application, options: AuthenticationClientOptions) => AuthenticationClient;
export interface AuthenticationClientOptions {
    storage: Storage;
    header: string;
    scheme: string;
    storageKey: string;
    locationKey: string;
    locationErrorKey: string;
    jwtStrategy: string;
    path: string;
    Authentication: ClientConstructor;
}
export declare class AuthenticationClient {
    app: Application;
    authenticated: boolean;
    options: AuthenticationClientOptions;
    constructor(app: Application, options: AuthenticationClientOptions);
    get service(): import("@feathersjs/feathers").FeathersService<Application<any, any>, import("@feathersjs/feathers").Service<any, Partial<any>, Params<import("@feathersjs/feathers").Query>>>;
    get storage(): Storage;
    handleSocket(socket: any): void;
    getFromLocation(location: Location): Promise<any>;
    setAccessToken(accessToken: string): any;
    getAccessToken(): Promise<string | null>;
    removeAccessToken(): any;
    reset(): Promise<any>;
    handleError(error: FeathersError, type: 'authenticate' | 'logout'): any;
    reAuthenticate(force?: boolean, strategy?: string): Promise<AuthenticationResult>;
    authenticate(authentication?: AuthenticationRequest, params?: Params): Promise<AuthenticationResult>;
    logout(): Promise<AuthenticationResult | null>;
}
