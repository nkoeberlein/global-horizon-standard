import { serve } from '@hono/node-server';
import { app } from './app';

const port = Number.parseInt(process.env.PORT ?? '3000', 10);
console.log(`🌍 GHS API is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
