// src/server.ts
import cluster from 'cluster';
import os from 'os';
import { createServer } from 'http';
import { app } from './app';

const numCPUs = os.cpus().length;
const port = process.env.PORT || 3000;

if (cluster.isPrimary) {
  console.log(`🧠 Primary ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`❌ Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });

} else {
  const server = createServer(app);

  server.listen(port, () => {
    console.log(`✅ Worker ${process.pid} started on port ${port}`);
  });
}
