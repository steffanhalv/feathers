"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationClient = void 0;
const errors_1 = require("@feathersjs/errors");
const storage_1 = require("./storage");
class OauthError extends errors_1.FeathersError {
    constructor(message, data) {
        super(message, 'OauthError', 401, 'oauth-error', data);
    }
}
const getMatch = (location, key) => {
    const regex = new RegExp(`(?:\&?)${key}=([^&]*)`);
    const match = location.hash ? location.hash.match(regex) : null;
    if (match !== null) {
        const [, value] = match;
        return [value, regex];
    }
    return [null, regex];
};
class AuthenticationClient {
    constructor(app, options) {
        const socket = app.io;
        const storage = new storage_1.StorageWrapper(app.get('storage') || options.storage);
        this.app = app;
        this.options = options;
        this.authenticated = false;
        this.app.set('storage', storage);
        if (socket) {
            this.handleSocket(socket);
        }
    }
    get service() {
        return this.app.service(this.options.path);
    }
    get storage() {
        return this.app.get('storage');
    }
    handleSocket(socket) {
        // Connection events happen on every reconnect
        const connected = this.app.io ? 'connect' : 'open';
        const disconnected = this.app.io ? 'disconnect' : 'disconnection';
        socket.on(disconnected, () => {
            const authPromise = new Promise((resolve) => socket.once(connected, (data) => resolve(data)))
                // Only reconnect when `reAuthenticate()` or `authenticate()`
                // has been called explicitly first
                // Force reauthentication with the server
                .then(() => (this.authenticated ? this.reAuthenticate(true) : null));
            this.app.set('authentication', authPromise);
        });
    }
    getFromLocation(location) {
        const [accessToken, tokenRegex] = getMatch(location, this.options.locationKey);
        if (accessToken !== null) {
            location.hash = location.hash.replace(tokenRegex, '');
            return Promise.resolve(accessToken);
        }
        const [message, errorRegex] = getMatch(location, this.options.locationErrorKey);
        if (message !== null) {
            location.hash = location.hash.replace(errorRegex, '');
            return Promise.reject(new OauthError(decodeURIComponent(message)));
        }
        return Promise.resolve(null);
    }
    setAccessToken(accessToken) {
        return this.storage.setItem(this.options.storageKey, accessToken);
    }
    getAccessToken() {
        return this.storage.getItem(this.options.storageKey).then((accessToken) => {
            if (!accessToken && typeof window !== 'undefined' && window.location) {
                return this.getFromLocation(window.location);
            }
            return accessToken || null;
        });
    }
    removeAccessToken() {
        return this.storage.removeItem(this.options.storageKey);
    }
    reset() {
        this.app.set('authentication', null);
        this.authenticated = false;
        return Promise.resolve(null);
    }
    handleError(error, type) {
        if (error.code === 401 || error.code === 403) {
            const promise = this.removeAccessToken().then(() => this.reset());
            return type === 'logout' ? promise : promise.then(() => Promise.reject(error));
        }
        return Promise.reject(error);
    }
    reAuthenticate(force = false, strategy) {
        // Either returns the authentication state or
        // tries to re-authenticate with the stored JWT and strategy
        let authPromise = this.app.get('authentication');
        if (!authPromise || force === true) {
            authPromise = this.getAccessToken().then((accessToken) => {
                if (!accessToken) {
                    return this.handleError(new errors_1.NotAuthenticated('No accessToken found in storage'), 'authenticate');
                }
                return this.authenticate({
                    strategy: strategy || this.options.jwtStrategy,
                    accessToken
                });
            });
            this.app.set('authentication', authPromise);
        }
        return authPromise;
    }
    authenticate(authentication, params) {
        if (!authentication) {
            return this.reAuthenticate();
        }
        const promise = this.service
            .create(authentication, params)
            .then((authResult) => {
            const { accessToken } = authResult;
            this.authenticated = true;
            this.app.emit('login', authResult);
            this.app.emit('authenticated', authResult);
            return this.setAccessToken(accessToken).then(() => authResult);
        })
            .catch((error) => this.handleError(error, 'authenticate'));
        this.app.set('authentication', promise);
        return promise;
    }
    logout() {
        return Promise.resolve(this.app.get('authentication'))
            .then(() => this.service.remove(null).then((authResult) => this.removeAccessToken()
            .then(() => this.reset())
            .then(() => {
            this.app.emit('logout', authResult);
            return authResult;
        })))
            .catch((error) => this.handleError(error, 'logout'));
    }
}
exports.AuthenticationClient = AuthenticationClient;
//# sourceMappingURL=core.js.map