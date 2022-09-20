/// <reference types="node" />
import { EventEmitter } from 'events';
import { FeathersApplication, ServiceMixin, Service, ServiceOptions, ServiceInterface, Application, FeathersService, ApplicationHookOptions } from './declarations';
export declare class Feathers<Services, Settings> extends EventEmitter implements FeathersApplication<Services, Settings> {
    services: Services;
    settings: Settings;
    mixins: ServiceMixin<Application<Services, Settings>>[];
    version: string;
    _isSetup: boolean;
    protected registerHooks: (this: any, allHooks: any) => any;
    constructor();
    get<L extends keyof Settings & string>(name: L): Settings[L];
    set<L extends keyof Settings & string>(name: L, value: Settings[L]): this;
    configure(callback: (this: this, app: this) => void): this;
    defaultService(location: string): ServiceInterface;
    service<L extends keyof Services & string>(location: L): FeathersService<this, keyof any extends keyof Services ? Service : Services[L]>;
    use<L extends keyof Services & string>(path: L, service: keyof any extends keyof Services ? ServiceInterface | Application : Services[L], options?: ServiceOptions): this;
    unuse<L extends keyof Services & string>(location: L): Promise<FeathersService<this, keyof any extends keyof Services ? Service : Services[L]>>;
    hooks(hookMap: ApplicationHookOptions<this>): this;
    setup(): Promise<this>;
    teardown(): Promise<this>;
}
