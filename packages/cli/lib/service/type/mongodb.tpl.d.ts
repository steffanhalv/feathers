import { ServiceGeneratorContext } from '../index';
export declare const importTemplate = "import { MongoDBService } from '@feathersjs/mongodb'\nimport type { MongoDBAdapterParams } from '@feathersjs/mongodb'";
export declare const classCode: ({ className, upperName }: ServiceGeneratorContext) => string;
export declare const generate: (ctx: ServiceGeneratorContext) => Promise<ServiceGeneratorContext>;
