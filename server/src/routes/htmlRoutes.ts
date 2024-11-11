import path from 'node:path';

import { Router } from 'express';


const router = Router();

// TODO: Define route to serve index.html
router.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });

export default router;
