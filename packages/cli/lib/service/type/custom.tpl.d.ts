import { ServiceGeneratorContext } from '../index';
export declare const template: ({ className, upperName, relative }: ServiceGeneratorContext) => string;
export declare const importTemplate = "import type { Id, NullableId, Params } from '@feathersjs/feathers'";
export declare const generate: (ctx: ServiceGeneratorContext) => Promise<ServiceGeneratorContext>;
