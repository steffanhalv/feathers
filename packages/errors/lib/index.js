"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convert = exports.errors = exports.Unavailable = exports.BadGateway = exports.NotImplemented = exports.GeneralError = exports.TooManyRequests = exports.Unprocessable = exports.LengthRequired = exports.Gone = exports.Conflict = exports.Timeout = exports.NotAcceptable = exports.MethodNotAllowed = exports.NotFound = exports.Forbidden = exports.PaymentError = exports.NotAuthenticated = exports.BadRequest = exports.FeathersError = void 0;
class FeathersError extends Error {
    constructor(err, name, code, className, _data) {
        let msg = typeof err === 'string' ? err : 'Error';
        const properties = {
            name,
            code,
            className,
            type: 'FeathersError'
        };
        if (Array.isArray(_data)) {
            properties.data = _data;
        }
        else if (typeof err === 'object' || _data !== undefined) {
            const { message, errors, ...rest } = typeof err === 'object' ? err : _data;
            msg = message || msg;
            properties.errors = errors;
            properties.data = rest;
        }
        super(msg);
        Object.assign(this, properties);
    }
    toJSON() {
        const result = {
            name: this.name,
            message: this.message,
            code: this.code,
            className: this.className
        };
        if (this.data !== undefined) {
            result.data = this.data;
        }
        if (this.errors !== undefined) {
            result.errors = this.errors;
        }
        return result;
    }
}
exports.FeathersError = FeathersError;
class BadRequest extends FeathersError {
    constructor(message, data) {
        super(message, 'BadRequest', 400, 'bad-request', data);
    }
}
exports.BadRequest = BadRequest;
// 401 - Not Authenticated
class NotAuthenticated extends FeathersError {
    constructor(message, data) {
        super(message, 'NotAuthenticated', 401, 'not-authenticated', data);
    }
}
exports.NotAuthenticated = NotAuthenticated;
// 402 - Payment Error
class PaymentError extends FeathersError {
    constructor(message, data) {
        super(message, 'PaymentError', 402, 'payment-error', data);
    }
}
exports.PaymentError = PaymentError;
// 403 - Forbidden
class Forbidden extends FeathersError {
    constructor(message, data) {
        super(message, 'Forbidden', 403, 'forbidden', data);
    }
}
exports.Forbidden = Forbidden;
// 404 - Not Found
class NotFound extends FeathersError {
    constructor(message, data) {
        super(message, 'NotFound', 404, 'not-found', data);
    }
}
exports.NotFound = NotFound;
// 405 - Method Not Allowed
class MethodNotAllowed extends FeathersError {
    constructor(message, data) {
        super(message, 'MethodNotAllowed', 405, 'method-not-allowed', data);
    }
}
exports.MethodNotAllowed = MethodNotAllowed;
// 406 - Not Acceptable
class NotAcceptable extends FeathersError {
    constructor(message, data) {
        super(message, 'NotAcceptable', 406, 'not-acceptable', data);
    }
}
exports.NotAcceptable = NotAcceptable;
// 408 - Timeout
class Timeout extends FeathersError {
    constructor(message, data) {
        super(message, 'Timeout', 408, 'timeout', data);
    }
}
exports.Timeout = Timeout;
// 409 - Conflict
class Conflict extends FeathersError {
    constructor(message, data) {
        super(message, 'Conflict', 409, 'conflict', data);
    }
}
exports.Conflict = Conflict;
// 410 - Gone
class Gone extends FeathersError {
    constructor(message, data) {
        super(message, 'Gone', 410, 'gone', data);
    }
}
exports.Gone = Gone;
// 411 - Length Required
class LengthRequired extends FeathersError {
    constructor(message, data) {
        super(message, 'LengthRequired', 411, 'length-required', data);
    }
}
exports.LengthRequired = LengthRequired;
// 422 Unprocessable
class Unprocessable extends FeathersError {
    constructor(message, data) {
        super(message, 'Unprocessable', 422, 'unprocessable', data);
    }
}
exports.Unprocessable = Unprocessable;
// 429 Too Many Requests
class TooManyRequests extends FeathersError {
    constructor(message, data) {
        super(message, 'TooManyRequests', 429, 'too-many-requests', data);
    }
}
exports.TooManyRequests = TooManyRequests;
// 500 - General Error
class GeneralError extends FeathersError {
    constructor(message, data) {
        super(message, 'GeneralError', 500, 'general-error', data);
    }
}
exports.GeneralError = GeneralError;
// 501 - Not Implemented
class NotImplemented extends FeathersError {
    constructor(message, data) {
        super(message, 'NotImplemented', 501, 'not-implemented', data);
    }
}
exports.NotImplemented = NotImplemented;
// 502 - Bad Gateway
class BadGateway extends FeathersError {
    constructor(message, data) {
        super(message, 'BadGateway', 502, 'bad-gateway', data);
    }
}
exports.BadGateway = BadGateway;
// 503 - Unavailable
class Unavailable extends FeathersError {
    constructor(message, data) {
        super(message, 'Unavailable', 503, 'unavailable', data);
    }
}
exports.Unavailable = Unavailable;
exports.errors = {
    FeathersError,
    BadRequest,
    NotAuthenticated,
    PaymentError,
    Forbidden,
    NotFound,
    MethodNotAllowed,
    NotAcceptable,
    Timeout,
    Conflict,
    LengthRequired,
    Unprocessable,
    TooManyRequests,
    GeneralError,
    NotImplemented,
    BadGateway,
    Unavailable,
    400: BadRequest,
    401: NotAuthenticated,
    402: PaymentError,
    403: Forbidden,
    404: NotFound,
    405: MethodNotAllowed,
    406: NotAcceptable,
    408: Timeout,
    409: Conflict,
    410: Gone,
    411: LengthRequired,
    422: Unprocessable,
    429: TooManyRequests,
    500: GeneralError,
    501: NotImplemented,
    502: BadGateway,
    503: Unavailable
};
function convert(error) {
    if (!error) {
        return error;
    }
    const FeathersError = exports.errors[error.name];
    const result = FeathersError
        ? new FeathersError(error.message, error.data)
        : new Error(error.message || error);
    if (typeof error === 'object') {
        Object.assign(result, error);
    }
    return result;
}
exports.convert = convert;
//# sourceMappingURL=index.js.map