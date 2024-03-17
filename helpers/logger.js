const dotenv = require('dotenv');
const pino = require('pino');

const fileTransport = pino.transport({
    target: 'pino/file',
    options: {
        destination: `${__dirname}/app.log`,
    }
});

module.exports = pino({
    level: dotenv.PINO_LOG_LEVEL || 'info',
    formatters: {
        level: (label) => {
            return { level: label.toUpperCase() };
        },
    },
    timestamp: pino.stdTimeFunctions.unixTime,
},
    fileTransport
);

