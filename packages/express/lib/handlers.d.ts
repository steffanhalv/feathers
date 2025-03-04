import { ErrorRequestHandler, RequestHandler } from 'express';
export declare function notFound({ verbose }?: {
    verbose?: boolean;
}): RequestHandler;
export declare type ErrorHandlerOptions = {
    public?: string;
    logger?: boolean | {
        error?: (msg: any) => void;
        info?: (msg: any) => void;
    };
    html?: any;
    json?: any;
};
export declare function errorHandler(_options?: ErrorHandlerOptions): ErrorRequestHandler;
