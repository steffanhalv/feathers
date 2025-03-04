"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const pinion_1 = require("@feathershq/pinion");
const commons_1 = require("../../commons");
const tsKoaApp = ({ transports }) => `import serveStatic from 'koa-static'
import { feathers } from '@feathersjs/feathers'
import configuration from '@feathersjs/configuration'
import { koa, rest, bodyParser, errorHandler, parseAuthentication, cors } from '@feathersjs/koa'
${transports.includes('websockets') ? "import socketio from '@feathersjs/socketio'" : ''}

import type { Application } from './declarations'
import { configurationSchema } from './configuration'
import { logErrorHook } from './logger'
import { services } from './services/index'
import { channels } from './channels'

const app: Application = koa(feathers())

// Load our app configuration (see config/ folder)
app.configure(configuration(configurationSchema))

// Set up Koa middleware
app.use(serveStatic(app.get('public')))
app.use(errorHandler())
app.use(cors())
app.use(parseAuthentication())
app.use(bodyParser())

// Configure services and transports
app.configure(rest())
${transports.includes('websockets')
    ? `app.configure(socketio({
  cors: {
    origin: app.get('origins')
  }
}))`
    : ''}
app.configure(services)
app.configure(channels)

// Register hooks that run on all service methods
app.hooks({
  around: {
    all: [ logErrorHook ]
  },
  before: {},
  after: {},
  error: {}
})
// Register application setup and teardown hooks here
app.hooks({
  setup: [],
  teardown: []
})

export { app }
`;
const tsExpressApp = ({ transports }) => `import compress from 'compression'

import { feathers } from '@feathersjs/feathers'
import express, {
  rest, json, urlencoded, cors,
  serveStatic, notFound, errorHandler
} from '@feathersjs/express'
import configuration from '@feathersjs/configuration'
${transports.includes('websockets') ? "import socketio from '@feathersjs/socketio'" : ''}

import type { Application } from './declarations'
import { configurationSchema } from './configuration'
import { logger, logErrorHook } from './logger'
import { services } from './services/index'
import { channels } from './channels'

const app: Application = express(feathers())

// Load app configuration
app.configure(configuration(configurationSchema))
app.use(cors())
app.use(compress())
app.use(json())
app.use(urlencoded({ extended: true }))
// Host the public folder
app.use('/', serveStatic(app.get('public')))

// Configure services and real-time functionality
app.configure(rest())
${transports.includes('websockets')
    ? `app.configure(socketio({
  cors: {
    origin: app.get('origins')
  }
}))`
    : ''}
app.configure(services)
app.configure(channels)

// Configure a middleware for 404s and the error handler
app.use(notFound())
app.use(errorHandler({ logger }))

// Register hooks that run on all service methods
app.hooks({
  around: {
    all: [ logErrorHook ]
  },
  before: {},
  after: {},
  error: {}
})
// Register application setup and teardown hooks here
app.hooks({
  setup: [],
  teardown: []
})

export { app }
`;
const template = (ctx) => ctx.framework === 'express' ? tsExpressApp(ctx) : tsKoaApp(ctx);
const generate = (ctx) => (0, pinion_1.generator)(ctx).then((0, commons_1.renderSource)(template, (0, pinion_1.toFile)(({ lib }) => lib, 'app')));
exports.generate = generate;
//# sourceMappingURL=app.tpl.js.map