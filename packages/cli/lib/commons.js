"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.injectSource = exports.renderSource = exports.prettify = exports.PRETTIERRC = exports.getJavaScript = exports.checkPreconditions = exports.initializeBaseContext = exports.addVersions = exports.getDatabaseAdapter = exports.version = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
const promises_1 = require("fs/promises");
const pinion_1 = require("@feathershq/pinion");
const ts = __importStar(require("typescript"));
const prettier_1 = __importDefault(require("prettier"));
const path_2 = __importDefault(require("path"));
exports.version = JSON.parse(fs_1.default.readFileSync((0, path_1.join)(__dirname, '..', 'package.json')).toString()).version;
/**
 * Returns the name of the Feathers database adapter for a supported database type
 *
 * @param database The type of the database
 * @returns The name of the adapter
 */
const getDatabaseAdapter = (database) => (database === 'mongodb' ? 'mongodb' : 'knex');
exports.getDatabaseAdapter = getDatabaseAdapter;
/**
 * Returns dependencies with the versions from the context attached (if available)
 *
 * @param dependencies The dependencies to install
 * @param versions The dependency version list
 * @returns A list of dependencies with their versions
 */
const addVersions = (dependencies, versions) => dependencies.map((dep) => `${dep}@${versions[dep] ? versions[dep] : 'latest'}`);
exports.addVersions = addVersions;
/**
 * Loads the application package.json and populates information like the library and test directory
 * and Feathers app specific information.
 *
 * @returns The updated context
 */
const initializeBaseContext = () => (ctx) => Promise.resolve(ctx)
    .then((0, pinion_1.loadJSON)((0, pinion_1.fromFile)('package.json'), (pkg) => ({ pkg }), {}))
    .then((0, pinion_1.loadJSON)(path_2.default.join(__dirname, '..', 'package.json'), (pkg) => ({
    dependencyVersions: {
        ...pkg.devDependencies,
        ...ctx.dependencyVersions,
        '@feathersjs/cli': exports.version
    }
})))
    .then((ctx) => {
    var _a, _b, _c, _d, _e, _f, _g;
    return ({
        ...ctx,
        lib: ((_b = (_a = ctx.pkg) === null || _a === void 0 ? void 0 : _a.directories) === null || _b === void 0 ? void 0 : _b.lib) || 'src',
        test: ((_d = (_c = ctx.pkg) === null || _c === void 0 ? void 0 : _c.directories) === null || _d === void 0 ? void 0 : _d.test) || 'test',
        language: ctx.language || ((_f = (_e = ctx.pkg) === null || _e === void 0 ? void 0 : _e.feathers) === null || _f === void 0 ? void 0 : _f.language),
        feathers: (_g = ctx.pkg) === null || _g === void 0 ? void 0 : _g.feathers
    });
});
exports.initializeBaseContext = initializeBaseContext;
/**
 * Checks if the current context contains a valid generated application. This is necesary for most
 * generators (besides the app generator).
 *
 * @param ctx The context to check against
 * @returns Throws an error or returns the original context
 */
const checkPreconditions = () => async (ctx) => {
    if (!ctx.feathers) {
        console.log(ctx);
        throw new Error(`Can not run generator since the current folder does not appear to be a Feathers application.
Either your package.json is missing or it does not have \`feathers\` property.
`);
    }
    return ctx;
};
exports.checkPreconditions = checkPreconditions;
const importRegex = /from '(\..*)'/g;
const escapeNewLines = (code) => code.replace(/\n\n/g, '\n/* :newline: */');
const restoreNewLines = (code) => code.replace(/\/\* :newline: \*\//g, '\n');
const fixLocalImports = (code) => code.replace(importRegex, "from '$1.js'");
/**
 * Returns the transpiled and prettified JavaScript for a TypeScript source code
 *
 * @param typescript The TypeScript source code
 * @param options TypeScript transpilation options
 * @returns The formatted JavaScript source code
 */
const getJavaScript = (typescript, options = {}) => {
    const source = escapeNewLines(typescript);
    const transpiled = ts.transpileModule(source, {
        ...options,
        compilerOptions: {
            module: ts.ModuleKind.ESNext,
            target: ts.ScriptTarget.ES2020,
            preserveValueImports: true,
            ...options.compilerOptions
        }
    });
    return fixLocalImports(restoreNewLines(transpiled.outputText));
};
exports.getJavaScript = getJavaScript;
const getFileName = async (target, ctx) => `${await (0, pinion_1.getCallable)(target, ctx)}.${ctx.language}`;
/**
 * The default configuration for prettifying files
 */
exports.PRETTIERRC = {
    tabWidth: 2,
    useTabs: false,
    printWidth: 110,
    semi: false,
    trailingComma: 'none',
    singleQuote: true
};
/*
 * Format a source file using Prettier. Will use the local configuration, the settings set in
 * `options` or a default configuration
 *
 * @param target The file to prettify
 * @param options The Prettier options
 * @returns The updated context
 */
const prettify = (target, options = exports.PRETTIERRC) => async (ctx) => {
    const fileName = await getFileName(target, ctx);
    const config = (await prettier_1.default.resolveConfig(ctx.cwd)) || options;
    const content = (await (0, promises_1.readFile)(fileName)).toString();
    try {
        await (0, promises_1.writeFile)(fileName, await prettier_1.default.format(content, {
            parser: ctx.language === 'ts' ? 'typescript' : 'babel',
            ...config
        }));
    }
    catch (error) {
        throw new Error(`Error prettifying ${fileName}: ${error.message}`);
    }
    return ctx;
};
exports.prettify = prettify;
/**
 * Render a source file template for the language set in the context.
 *
 * @param templates The JavaScript and TypeScript template to render
 * @param target The target filename without extension (will be added based on language)
 * @returns The updated context
 */
const renderSource = (template, target, options) => async (ctx) => {
    const { language } = ctx;
    const fileName = await getFileName(target, ctx);
    const content = language === 'js' ? (0, exports.getJavaScript)(await (0, pinion_1.getCallable)(template, ctx)) : template;
    const renderer = (0, pinion_1.renderTemplate)(content, fileName, options);
    return renderer(ctx).then((0, exports.prettify)(target));
};
exports.renderSource = renderSource;
/**
 * Inject a source template as the language set in the context.
 *
 * @param template The source template to render
 * @param location The location to inject the code to. Must use the target language.
 * @param target The target file name
 * @param transpile Set to `false` if the code should not be transpiled to JavaScript
 * @returns
 */
const injectSource = (template, location, target, transpile = true) => async (ctx) => {
    const { language } = ctx;
    const source = language === 'js' && transpile ? (0, exports.getJavaScript)(await (0, pinion_1.getCallable)(template, ctx)) : template;
    const fileName = await getFileName(target, ctx);
    const injector = (0, pinion_1.inject)(source, location, fileName);
    return injector(ctx).then((0, exports.prettify)(target));
};
exports.injectSource = injectSource;
//# sourceMappingURL=commons.js.map