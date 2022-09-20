import { FeathersBaseContext } from '../commons';
export interface ServiceGeneratorContext extends FeathersBaseContext {
    /**
     * The chosen service name
     */
    name: string;
    /**
     * The path the service is registered on
     */
    path: string;
    /**
     * The list of subfolders this service is in
     */
    folder: string[];
    /**
     * The `camelCase` service name starting with a lowercase letter
     */
    camelName: string;
    /**
     * The `CamelCase` service name starting with an uppercase letter
     */
    upperName: string;
    /**
     * The service class name combined as `CamelCaseService`
     */
    className: string;
    /**
     * A kebab-cased (filename friendly) version of the service name
     */
    kebabName: string;
    /**
     * The actual filename (the last element of the path)
     */
    fileName: string;
    /**
     * Indicates how many file paths we should go up to import other things (e.g. `../../`)
     */
    relative: string;
    /**
     * The chosen service type
     */
    type: 'knex' | 'mongodb' | 'custom';
    /**
     * Wether this service uses authentication
     */
    authentication: boolean;
    /**
     * Set to true if this service is for an authentication entity
     */
    isEntityService?: boolean;
}
/**
 * Parameters the generator is called with
 */
export declare type ServiceGeneratorArguments = FeathersBaseContext & Partial<Pick<ServiceGeneratorContext, 'name' | 'path' | 'type' | 'authentication' | 'isEntityService'>>;
export declare const generate: (ctx: ServiceGeneratorArguments) => Promise<{
    /**
     * The chosen service name
     */
    name: string;
    /**
     * The path the service is registered on
     */
    path: string;
    /**
     * The list of subfolders this service is in
     */
    folder: string[];
    /**
     * The `camelCase` service name starting with a lowercase letter
     */
    camelName: string;
    /**
     * The `CamelCase` service name starting with an uppercase letter
     */
    upperName: string;
    /**
     * The service class name combined as `CamelCaseService`
     */
    className: string;
    /**
     * A kebab-cased (filename friendly) version of the service name
     */
    kebabName: string;
    /**
     * The actual filename (the last element of the path)
     */
    fileName: string;
    /**
     * Indicates how many file paths we should go up to import other things (e.g. `../../`)
     */
    relative: string;
    /**
     * The chosen service type
     */
    type: 'knex' | 'mongodb' | 'custom';
    /**
     * Wether this service uses authentication
     */
    authentication: boolean;
    /**
     * Set to true if this service is for an authentication entity
     */
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
}>;
