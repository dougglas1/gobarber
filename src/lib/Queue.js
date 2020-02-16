import Bee from 'bee-queue';
import CancellationMail from '../app/jobs/CancellationMail';
import redisConfig from '../config/redis';

const jobs = [CancellationMail];

class Queue {
  constructor() {
    this.queues = {};

    this.init();
  }

  init() {
    // Criação da fila
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        // Instância do Redis
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        // Processa as filas
        handle,
      };
    });
  }

  // Armazena o job na fila
  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  // Pega o Job e executa em Background em Tempo Real
  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];

      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err) {
    console.log(`Queue ${job.queue.name}: FAILED`, err);
  }
}

export default new Queue();
