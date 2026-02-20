import express, { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { initDatabase } from '../storage/database';
import { purgeStaleCacheEntries } from '../storage/cache.repository';
import badgeRoutes from '../routes/badge.routes';

const app = express();
const PORT = 3000;

app.set('trust proxy', 1);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => false,
  }),
);

app.use('/badge', badgeRoutes);

app.get('/', (_req: Request, res: Response) => {
  res.json({
    service: 'Shaked-GitHub-Profile-Info',
    version: '1.0.0',
    endpoints: {
      badge: '/badge/:type?username=<github_username>',
      types: [
        'profile-views',
        'followers',
        'following',
        'repos',
        'gists',
        'created',
        'updated',
        'stars',
      ],
    },
  });
});

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

setInterval(() => {
  purgeStaleCacheEntries();
}, 60 * 60 * 1000).unref();

async function bootstrap(): Promise<void> {
  await initDatabase();
  app.listen(PORT, () => {
    console.log(`Badge service listening on port ${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

export default app;
