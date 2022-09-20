import { ServiceGeneratorContext } from '../index';
export declare const importTemplate = "import { KnexService } from '@feathersjs/knex'\nimport type { KnexAdapterParams } from '@feathersjs/knex'";
export declare const classCode: ({ className, upperName }: ServiceGeneratorContext) => string;
export declare const optionTemplate: ({ kebabName, feathers }: ServiceGeneratorContext) => string;
export declare const generate: (ctx: ServiceGeneratorContext) => Promise<ServiceGeneratorContext>;
