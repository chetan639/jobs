const express = require('express');
const logger = require('./logger');
const httpClient = require('./lib/httpClient');
const requestLogger = require('./middleware/requestLogger');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');
const { InMemoryItemRepository } = require('./modules/items/items.repository');
const { ItemService } = require('./modules/items/items.service');
const { itemRoutes } = require('./modules/items/items.routes');

// Composition root: build dependencies here and inject them.
// To move to a real DB, swap the InMemory*Repository classes for DB-backed ones.
function createApp(deps = {}) {
  const itemRepository = deps.itemRepository || new InMemoryItemRepository();
  const itemService = new ItemService({ itemRepository, logger });

  const app = express();
  app.use(express.json());
  app.use(requestLogger);

  app.get('/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

  // Demo of an outbound call through the shared HTTP client.
  app.get('/demo/outbound', async (req, res) => {
    const { data } = await httpClient.get('https://jsonplaceholder.typicode.com/todos/1');
    res.json({ upstream: data });
  });

  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}

module.exports = { createApp };
