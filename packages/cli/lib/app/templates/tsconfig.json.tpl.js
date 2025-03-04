"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const pinion_1 = require("@feathershq/pinion");
const generate = (ctx) => (0, pinion_1.generator)(ctx).then((0, pinion_1.when)((ctx) => ctx.language === 'ts', (0, pinion_1.writeJSON)(({ lib }) => ({
    'ts-node': {
        files: true
    },
    compilerOptions: {
        target: 'es2020',
        module: 'commonjs',
        outDir: './lib',
        rootDir: `./${lib}`,
        declaration: true,
        strict: true,
        esModuleInterop: true
    },
    include: [lib],
    exclude: ['test']
}), (0, pinion_1.toFile)('tsconfig.json'))));
exports.generate = generate;
//# sourceMappingURL=tsconfig.json.tpl.js.map