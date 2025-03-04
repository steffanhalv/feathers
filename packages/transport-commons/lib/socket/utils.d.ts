import { HookContext, Application } from '@feathersjs/feathers';
import { CombinedChannel } from '../channels/channel/combined';
import { RealTimeConnection } from '../channels/channel/base';
export declare const DEFAULT_PARAMS_POSITION = 1;
export declare const paramsPositions: {
    [key: string]: number;
};
export declare function normalizeError(e: any): any;
export declare function getDispatcher(emit: string, socketMap: WeakMap<RealTimeConnection, any>, socketKey?: any): (event: string, channel: CombinedChannel, context: HookContext, data?: any) => void;
export declare function runMethod(app: Application, connection: RealTimeConnection, path: string, method: string, args: any[]): Promise<void>;
