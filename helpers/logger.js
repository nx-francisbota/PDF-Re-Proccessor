const pino = require('pino');

const fileTransport = pino.transport({
    target: 'pino/file',
    options: {
        destination: '../logs',
    }
});

module.exports.Logger = pino({
    level: process.env.PINO_LOG_LEVEL || 'info',
    formatters: {
        level: (label) => {
            return { level: label.toUpperCase() };
        },
    },
    timestamp: pino.stdTimeFunctions.unixTime,
},
    fileTransport
);

