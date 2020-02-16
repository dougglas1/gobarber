// Carregar variáveis de ambiente
import 'dotenv/config';

import Queue from './lib/Queue';

// Executar separado da aplicação (server.js)
// para assim não influenciar na performance
Queue.processQueue();
