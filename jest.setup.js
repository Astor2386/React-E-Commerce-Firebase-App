// jest.setup.js
globalThis.TextEncoder = require('util').TextEncoder;
globalThis.TextDecoder = require('util').TextDecoder;
globalThis.fetch = require('node-fetch');
globalThis.Response = require('node-fetch').Response; // Add Response