/// <reference types="node" />
/// <reference types="node" />
import { SignOptions, Secret, VerifyOptions } from 'jsonwebtoken';
import { Application, Params } from '@feathersjs/feathers';
import { IncomingMessage, ServerResponse } from 'http';
import { AuthenticationConfiguration } from './options';
export interface AuthenticationResult {
    [key: string]: any;
}
export interface AuthenticationRequest {
    strategy?: string;
    [key: string]: any;
}
export interface AuthenticationParams extends Params {
    payload?: {
        [key: string]: any;
    };
    jwtOptions?: SignOptions;
    authStrategies?: string[];
    secret?: string;
    [key: string]: any;
}
export declare type ConnectionEvent = 'login' | 'logout' | 'disconnect';
export interface AuthenticationStrategy {
    /**
     * Implement this method to get access to the AuthenticationService
     *
     * @param auth The AuthenticationService
     */
    setAuthentication?(auth: AuthenticationBase): void;
    /**
     * Implement this method to get access to the Feathers application
     *
     * @param app The Feathers application instance
     */
    setApplication?(app: Application): void;
    /**
     * Implement this method to get access to the strategy name
     *
     * @param name The name of the strategy
     */
    setName?(name: string): void;
    /**
     * Implement this method to verify the current configuration
     * and throw an error if it is invalid.
     */
    verifyConfiguration?(): void;
    /**
     * Implement this method to setup this strategy
     * @param auth The AuthenticationService
     * @param name The name of the strategy
     */
    setup?(auth: AuthenticationBase, name: string): Promise<void>;
    /**
     * Authenticate an authentication request with this strategy.
     * Should throw an error if the strategy did not succeed.
     *
     * @param authentication The authentication request
     * @param params The service call parameters
     */
    authenticate?(authentication: AuthenticationRequest, params: AuthenticationParams): Promise<AuthenticationResult>;
    /**
     * Update a real-time connection according to this strategy.
     *
     * @param connection The real-time connection
     * @param context The hook context
     */
    handleConnection?(event: ConnectionEvent, connection: any, authResult?: AuthenticationResult): Promise<void>;
    /**
     * Parse a basic HTTP request and response for authentication request information.
     *
     * @param req The HTTP request
     * @param res The HTTP response
     */
    parse?(req: IncomingMessage, res: ServerResponse): Promise<AuthenticationRequest | null>;
}
export interface JwtVerifyOptions extends VerifyOptions {
    algorithm?: string | string[];
}
/**
 * A base class for managing authentication strategies and creating and verifying JWTs
 */
export declare class AuthenticationBase {
    app: Application;
    strategies: {
        [key: string]: AuthenticationStrategy;
    };
    configKey: string;
    isReady: boolean;
    /**
     * Create a new authentication service.
     *
     * @param app The Feathers application instance
     * @param configKey The configuration key name in `app.get` (default: `authentication`)
     * @param options Optional initial options
     */
    constructor(app: Application, configKey?: string, options?: {});
    /**
     * Return the current configuration from the application
     */
    get configuration(): AuthenticationConfiguration;
    /**
     * A list of all registered strategy names
     */
    get strategyNames(): string[];
    /**
     * Register a new authentication strategy under a given name.
     *
     * @param name The name to register the strategy under
     * @param strategy The authentication strategy instance
     */
    register(name: string, strategy: AuthenticationStrategy): void;
    /**
     * Get the registered authentication strategies for a list of names.
     *
     * @param names The list or strategy names
     */
    getStrategies(...names: string[]): AuthenticationStrategy[];
    /**
     * Returns a single strategy by name
     *
     * @param name The strategy name
     * @returns The authentication strategy or undefined
     */
    getStrategy(name: string): AuthenticationStrategy;
    /**
     * Create a new access token with payload and options.
     *
     * @param payload The JWT payload
     * @param optsOverride The options to extend the defaults (`configuration.jwtOptions`) with
     * @param secretOverride Use a different secret instead
     */
    createAccessToken(payload: string | Buffer | object, optsOverride?: SignOptions, secretOverride?: Secret): Promise<string>;
    /**
     * Verifies an access token.
     *
     * @param accessToken The token to verify
     * @param optsOverride The options to extend the defaults (`configuration.jwtOptions`) with
     * @param secretOverride Use a different secret instead
     */
    verifyAccessToken(accessToken: string, optsOverride?: JwtVerifyOptions, secretOverride?: Secret): Promise<any>;
    /**
     * Authenticate a given authentication request against a list of strategies.
     *
     * @param authentication The authentication request
     * @param params Service call parameters
     * @param allowed A list of allowed strategy names
     */
    authenticate(authentication: AuthenticationRequest, params: AuthenticationParams, ...allowed: string[]): Promise<AuthenticationResult>;
    handleConnection(event: ConnectionEvent, connection: any, authResult?: AuthenticationResult): Promise<void>;
    /**
     * Parse an HTTP request and response for authentication request information.
     *
     * @param req The HTTP request
     * @param res The HTTP response
     * @param names A list of strategies to use
     */
    parse(req: IncomingMessage, res: ServerResponse, ...names: string[]): Promise<AuthenticationRequest>;
    setup(): Promise<void>;
}
