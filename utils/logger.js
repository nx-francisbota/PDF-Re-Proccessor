const pino = require('pino');
const stream = pino.destination({
    dest: `${__dirname}/../logs/app.log`,
})

exports.logger = pino(stream);


