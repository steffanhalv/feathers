"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const pinion_1 = require("@feathershq/pinion");
const jsPackageJson = (lib) => ({
    type: 'module',
    scripts: {
        start: `node ${lib}`,
        dev: `nodemon ${lib}/`,
        prettier: 'npx prettier "**/*.js" --write',
        mocha: 'cross-env NODE_ENV=test mocha test/ --recursive --exit',
        test: 'npm run mocha'
    }
});
const tsPackageJson = (lib) => ({
    scripts: {
        dev: `nodemon -x ts-node ${lib}/index.ts`,
        compile: 'shx rm -rf lib/ && tsc',
        start: 'npm run compile && node lib/',
        prettier: 'npx prettier "**/*.ts" --write',
        mocha: 'cross-env NODE_ENV=test mocha test/ --require ts-node/register --recursive --extension .ts --exit',
        test: 'npm run mocha'
    }
});
const packageJson = ({ name, description, language, packager, database, framework, transports, lib, test }) => ({
    name,
    description,
    version: '0.0.0',
    homepage: '',
    private: true,
    keywords: ['feathers'],
    author: {},
    contributors: [],
    bugs: {},
    engines: {
        node: `>= ${process.version.substring(1)}`
    },
    feathers: {
        language,
        packager,
        database,
        framework,
        transports
    },
    directories: {
        lib,
        test
    },
    main: language === 'ts' ? 'lib/client' : `${lib}/client`,
    ...(language === 'ts' ? tsPackageJson(lib) : jsPackageJson(lib))
});
const generate = (ctx) => (0, pinion_1.generator)(ctx).then((0, pinion_1.writeJSON)(packageJson, (0, pinion_1.toFile)('package.json')));
exports.generate = generate;
//# sourceMappingURL=package.json.tpl.js.map