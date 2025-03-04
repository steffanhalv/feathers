import { TransportConnection } from '@feathersjs/feathers';
import { Base } from './base';
import { AxiosClient } from './axios';
import { FetchClient } from './fetch';
import { SuperagentClient } from './superagent';
export { AxiosClient, FetchClient, SuperagentClient };
export declare type Handler<ServiceTypes> = (connection: any, options?: any, Service?: any) => TransportConnection<ServiceTypes>;
export interface Transport<ServiceTypes> {
    superagent: Handler<ServiceTypes>;
    fetch: Handler<ServiceTypes>;
    axios: Handler<ServiceTypes>;
}
export declare type RestService<T = any, D = Partial<any>> = Base<T, D>;
export default function restClient<ServiceTypes = any>(base?: string): Transport<ServiceTypes>;
