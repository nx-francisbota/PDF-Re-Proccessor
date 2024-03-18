const pino = require('pino');
const stream = pino.destination({
    dest: `${__dirname}/app.log`
})

exports.logger = pino(stream);


