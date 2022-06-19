import cluster from 'cluster';
import { cpus } from 'os';
import 'dotenv/config';
import server from './server';

const coresAmount = cpus().length;
if (cluster.isPrimary) {
  console.log('Starting ', coresAmount, ' forks');
  for (let i = 0; i < coresAmount; i += 1) {
    cluster.fork();
  }
} else {
  server.listen(process.env.PORT, () => {
    console.log('Worker: ', process.pid);
  });
}
