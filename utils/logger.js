const pino = require('pino');
const transport = pino.transport({
    targets:[
        {
        level: 'error',
        target: 'pino-pretty'
        },
        {
        level: 'info',
        target: 'pino/file',
        options: {
            destination: `${__dirname}/../logs/app.log`
        }
    }]
})

exports.logger = pino(transport);



