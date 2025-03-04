"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const pinion_1 = require("@feathershq/pinion");
const template = ({ framework }) => `import { HookContext as FeathersHookContext, NextFunction } from '@feathersjs/feathers'
import { Application as FeathersApplication } from '@feathersjs/${framework}'
import { ConfigurationSchema } from './configuration'

export { NextFunction }

export interface Configuration extends ConfigurationSchema {}

// A mapping of service names to types. Will be extended in service files.
export interface ServiceTypes {}

// The application instance type that will be used everywhere else
export type Application = FeathersApplication<ServiceTypes, Configuration>

// The context for hook functions - can be typed with a service class
export type HookContext<S = any> = FeathersHookContext<Application, S>
`;
const generate = (ctx) => (0, pinion_1.generator)(ctx).then((0, pinion_1.when)(({ language }) => language === 'ts', (0, pinion_1.renderTemplate)(template, (0, pinion_1.toFile)(({ lib }) => lib, 'declarations.ts'))));
exports.generate = generate;
//# sourceMappingURL=declarations.tpl.js.map