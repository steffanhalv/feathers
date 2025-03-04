import { AuthenticationBase, AuthenticationResult, AuthenticationRequest, AuthenticationParams } from './core';
import '@feathersjs/transport-commons';
import { ServiceMethods, ServiceAddons } from '@feathersjs/feathers';
declare module '@feathersjs/feathers/lib/declarations' {
    interface FeathersApplication<Services, Settings> {
        /**
         * Returns the default authentication service or the
         * authentication service for a given path.
         *
         * @param location The service path to use (optional)
         */
        defaultAuthentication?(location?: string): AuthenticationService;
    }
    interface Params {
        authenticated?: boolean;
        authentication?: AuthenticationRequest;
    }
}
export interface AuthenticationService extends ServiceAddons<AuthenticationResult, AuthenticationResult> {
}
export declare class AuthenticationService extends AuthenticationBase implements Partial<ServiceMethods<AuthenticationResult, AuthenticationRequest, AuthenticationParams>> {
    constructor(app: any, configKey?: string, options?: {});
    /**
     * Return the payload for a JWT based on the authentication result.
     * Called internally by the `create` method.
     *
     * @param _authResult The current authentication result
     * @param params The service call parameters
     */
    getPayload(_authResult: AuthenticationResult, params: AuthenticationParams): Promise<{
        [key: string]: any;
    }>;
    /**
     * Returns the JWT options based on an authentication result.
     * By default sets the JWT subject to the entity id.
     *
     * @param authResult The authentication result
     * @param params Service call parameters
     */
    getTokenOptions(authResult: AuthenticationResult, params: AuthenticationParams): Promise<any>;
    /**
     * Create and return a new JWT for a given authentication request.
     * Will trigger the `login` event.
     *
     * @param data The authentication request (should include `strategy` key)
     * @param params Service call parameters
     */
    create(data: AuthenticationRequest, params?: AuthenticationParams): Promise<AuthenticationResult>;
    /**
     * Mark a JWT as removed. By default only verifies the JWT and returns the result.
     * Triggers the `logout` event.
     *
     * @param id The JWT to remove or null
     * @param params Service call parameters
     */
    remove(id: string | null, params?: AuthenticationParams): Promise<AuthenticationResult>;
    /**
     * Validates the service configuration.
     */
    setup(): Promise<void>;
}
