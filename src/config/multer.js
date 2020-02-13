import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err);

        // Retornará no formato exemplo: sdfsf243asd.png
        // null é o erro (1º)
        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
