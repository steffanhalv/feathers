import { PackageJson } from 'type-fest';
import { Callable, PinionContext, Location } from '@feathershq/pinion';
import * as ts from 'typescript';
import { Options as PrettierOptions } from 'prettier';
export declare const version: any;
export declare type DependencyVersions = {
    [key: string]: string;
};
/**
 * The database types supported by this generator
 */
export declare type DatabaseType = 'mongodb' | 'mysql' | 'postgresql' | 'sqlite' | 'mssql';
/**
 * Returns the name of the Feathers database adapter for a supported database type
 *
 * @param database The type of the database
 * @returns The name of the adapter
 */
export declare const getDatabaseAdapter: (database: DatabaseType) => "mongodb" | "knex";
export declare type FeathersAppInfo = {
    /**
     * The application language
     */
    language: 'ts' | 'js';
    /**
     * The main database
     */
    database: DatabaseType;
    /**
     * The package manager used
     */
    packager: 'yarn' | 'npm';
    /**
     * A list of all chosen transports
     */
    transports: ('rest' | 'websockets')[];
    /**
     * The HTTP framework used
     */
    framework: 'koa' | 'express';
};
export interface AppPackageJson extends PackageJson {
    feathers?: FeathersAppInfo;
}
export interface FeathersBaseContext extends PinionContext {
    /**
     * Information about the Feathers application (like chosen language, database etc.)
     * usually taken from `package.json`
     */
    feathers: FeathersAppInfo;
    /**
     * The package.json file
     */
    pkg: AppPackageJson;
    /**
     * The folder where source files are put
     */
    lib: string;
    /**
     * The folder where test files are put
     */
    test: string;
    /**
     * The language the app is generated in
     */
    language: 'js' | 'ts';
    /**
     * A list dependencies that should be installed with a certain version.
     * Used for installing development dependencies during testing.
     */
    dependencyVersions?: DependencyVersions;
}
/**
 * Returns dependencies with the versions from the context attached (if available)
 *
 * @param dependencies The dependencies to install
 * @param versions The dependency version list
 * @returns A list of dependencies with their versions
 */
export declare const addVersions: (dependencies: string[], versions: DependencyVersions) => string[];
/**
 * Loads the application package.json and populates information like the library and test directory
 * and Feathers app specific information.
 *
 * @returns The updated context
 */
export declare const initializeBaseContext: () => <C extends FeathersBaseContext>(ctx: C) => Promise<C & {
    lib: string;
    test: string;
    language: "ts" | "js";
    feathers: FeathersAppInfo;
}>;
/**
 * Checks if the current context contains a valid generated application. This is necesary for most
 * generators (besides the app generator).
 *
 * @param ctx The context to check against
 * @returns Throws an error or returns the original context
 */
export declare const checkPreconditions: () => <T extends FeathersBaseContext>(ctx: T) => Promise<T>;
/**
 * Returns the transpiled and prettified JavaScript for a TypeScript source code
 *
 * @param typescript The TypeScript source code
 * @param options TypeScript transpilation options
 * @returns The formatted JavaScript source code
 */
export declare const getJavaScript: (typescript: string, options?: ts.TranspileOptions) => string;
/**
 * The default configuration for prettifying files
 */
export declare const PRETTIERRC: PrettierOptions;
export declare const prettify: <C extends PinionContext & {
    language: 'js' | 'ts';
}>(target: Callable<string, C>, options?: PrettierOptions) => (ctx: C) => Promise<C>;
/**
 * Render a source file template for the language set in the context.
 *
 * @param templates The JavaScript and TypeScript template to render
 * @param target The target filename without extension (will be added based on language)
 * @returns The updated context
 */
export declare const renderSource: <C extends PinionContext & {
    language: 'js' | 'ts';
}>(template: Callable<string, C>, target: Callable<string, C>, options?: {
    force: boolean;
}) => (ctx: C) => Promise<C>;
/**
 * Inject a source template as the language set in the context.
 *
 * @param template The source template to render
 * @param location The location to inject the code to. Must use the target language.
 * @param target The target file name
 * @param transpile Set to `false` if the code should not be transpiled to JavaScript
 * @returns
 */
export declare const injectSource: <C extends PinionContext & {
    language: 'js' | 'ts';
}>(template: Callable<string, C>, location: Location<C>, target: Callable<string, C>, transpile?: boolean) => (ctx: C) => Promise<C>;
