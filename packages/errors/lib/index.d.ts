export interface FeathersErrorJSON {
    name: string;
    message: string;
    code: number;
    className: string;
    data?: any;
    errors?: any;
}
export declare type DynamicError = Error & {
    [key: string]: any;
};
export declare type ErrorMessage = string | DynamicError | {
    [key: string]: any;
} | any[];
export declare class FeathersError extends Error {
    readonly type: string;
    readonly code: number;
    readonly className: string;
    readonly data: any;
    readonly errors: any;
    constructor(err: ErrorMessage, name: string, code: number, className: string, _data: any);
    toJSON(): FeathersErrorJSON;
}
export declare class BadRequest extends FeathersError {
    constructor(message?: ErrorMessage, data?: any);
}
export declare class NotAuthenticated extends FeathersError {
    constructor(message?: ErrorMessage, data?: any);
}
export declare class PaymentError extends FeathersError {
    constructor(message?: ErrorMessage, data?: any);
}
export declare class Forbidden extends FeathersError {
    constructor(message?: ErrorMessage, data?: any);
}
export declare class NotFound extends FeathersError {
    constructor(message?: ErrorMessage, data?: any);
}
export declare class MethodNotAllowed extends FeathersError {
    constructor(message?: ErrorMessage, data?: any);
}
export declare class NotAcceptable extends FeathersError {
    constructor(message?: ErrorMessage, data?: any);
}
export declare class Timeout extends FeathersError {
    constructor(message?: ErrorMessage, data?: any);
}
export declare class Conflict extends FeathersError {
    constructor(message?: ErrorMessage, data?: any);
}
export declare class Gone extends FeathersError {
    constructor(message?: ErrorMessage, data?: any);
}
export declare class LengthRequired extends FeathersError {
    constructor(message?: ErrorMessage, data?: any);
}
export declare class Unprocessable extends FeathersError {
    constructor(message?: ErrorMessage, data?: any);
}
export declare class TooManyRequests extends FeathersError {
    constructor(message?: ErrorMessage, data?: any);
}
export declare class GeneralError extends FeathersError {
    constructor(message?: ErrorMessage, data?: any);
}
export declare class NotImplemented extends FeathersError {
    constructor(message?: ErrorMessage, data?: any);
}
export declare class BadGateway extends FeathersError {
    constructor(message?: ErrorMessage, data?: any);
}
export declare class Unavailable extends FeathersError {
    constructor(message?: ErrorMessage, data?: any);
}
export interface Errors {
    FeathersError: FeathersError;
    BadRequest: BadRequest;
    NotAuthenticated: NotAuthenticated;
    PaymentError: PaymentError;
    Forbidden: Forbidden;
    NotFound: NotFound;
    MethodNotAllowed: MethodNotAllowed;
    NotAcceptable: NotAcceptable;
    Timeout: Timeout;
    Conflict: Conflict;
    LengthRequired: LengthRequired;
    Unprocessable: Unprocessable;
    TooManyRequests: TooManyRequests;
    GeneralError: GeneralError;
    NotImplemented: NotImplemented;
    BadGateway: BadGateway;
    Unavailable: Unavailable;
    400: BadRequest;
    401: NotAuthenticated;
    402: PaymentError;
    403: Forbidden;
    404: NotFound;
    405: MethodNotAllowed;
    406: NotAcceptable;
    408: Timeout;
    409: Conflict;
    411: LengthRequired;
    422: Unprocessable;
    429: TooManyRequests;
    500: GeneralError;
    501: NotImplemented;
    502: BadGateway;
    503: Unavailable;
}
export declare const errors: {
    FeathersError: typeof FeathersError;
    BadRequest: typeof BadRequest;
    NotAuthenticated: typeof NotAuthenticated;
    PaymentError: typeof PaymentError;
    Forbidden: typeof Forbidden;
    NotFound: typeof NotFound;
    MethodNotAllowed: typeof MethodNotAllowed;
    NotAcceptable: typeof NotAcceptable;
    Timeout: typeof Timeout;
    Conflict: typeof Conflict;
    LengthRequired: typeof LengthRequired;
    Unprocessable: typeof Unprocessable;
    TooManyRequests: typeof TooManyRequests;
    GeneralError: typeof GeneralError;
    NotImplemented: typeof NotImplemented;
    BadGateway: typeof BadGateway;
    Unavailable: typeof Unavailable;
    400: typeof BadRequest;
    401: typeof NotAuthenticated;
    402: typeof PaymentError;
    403: typeof Forbidden;
    404: typeof NotFound;
    405: typeof MethodNotAllowed;
    406: typeof NotAcceptable;
    408: typeof Timeout;
    409: typeof Conflict;
    410: typeof Gone;
    411: typeof LengthRequired;
    422: typeof Unprocessable;
    429: typeof TooManyRequests;
    500: typeof GeneralError;
    501: typeof NotImplemented;
    502: typeof BadGateway;
    503: typeof Unavailable;
};
export declare function convert(error: any): any;
