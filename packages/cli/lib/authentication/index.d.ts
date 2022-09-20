import { FeathersBaseContext } from '../commons';
import { ServiceGeneratorContext } from '../service/index';
export interface AuthenticationGeneratorContext extends ServiceGeneratorContext {
    service: string;
    entity: string;
    authStrategies: string[];
    dependencies: string[];
}
export declare type AuthenticationGeneratorArguments = FeathersBaseContext & Partial<Pick<AuthenticationGeneratorContext, 'service' | 'authStrategies' | 'entity'>>;
export declare const prompts: (ctx: AuthenticationGeneratorArguments) => ({
    type: string;
    name: string;
    when: boolean;
    message: string;
    suffix: string;
    choices: ({
        name: string;
        value: string;
        checked: boolean;
    } | {
        name: string;
        value: string;
        checked?: undefined;
    })[];
    default?: undefined;
} | {
    name: string;
    type: string;
    when: boolean;
    message: string;
    default: string;
    suffix?: undefined;
    choices?: undefined;
} | {
    name: string;
    type: string;
    when: boolean;
    message: string;
    suffix: string;
    default: string;
    choices?: undefined;
})[];
export declare const generate: (ctx: AuthenticationGeneratorArguments) => Promise<{
    dependencies: string[];
    name: string;
    path: string;
    folder: string[];
    camelName: string;
    upperName: string;
    className: string;
    kebabName: string;
    fileName: string;
    relative: string;
    type: "mongodb" | "knex" | "custom";
    authentication: boolean;
    isEntityService?: boolean;
    feathers: import("../commons").FeathersAppInfo;
    pkg: import("../commons").AppPackageJson;
    lib: string;
    test: string;
    language: "ts" | "js";
    dependencyVersions?: import("../commons").DependencyVersions;
    cwd: string;
    _?: (string | number)[];
    pinion: import("@feathershq/pinion").Configuration;
    service: string;
    entity: string;
    authStrategies: string[];
}>;
