const pino = require('pino');
const transport = pino.transport({
    targets:[
        {
        level: 'info',
        target: 'pino-pretty'
        },
        {
         level: 'error',
         target: 'pino-pretty'
        },
        {
            level: 'trace',
            target: 'pino/file',
            options: {
                destination: `${__dirname}/../logs/app.log`,
                ignore: 'pid,hostname'
            }
        }
        ]
})

exports.logger = pino(transport);



