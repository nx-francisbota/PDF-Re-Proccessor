require('dotenv').config();
const nodeCron = require('node-cron');
const logger = require('pino')({});

const cron = require('cronitor')(process.env.CRONITOR_API_KEY);
const schedule = require('../constants/cronValues');

cron.wraps(nodeCron);

cron.schedule('FixMissingText', schedule.SCHEDULE, () => {
    logger.info("Fix missing text");
})

const monitor = await cron.Monitor.put({
    type: 'job',
    key: 'important-background-job',
    schedule: schedule.SCHEDULE,
    notify: 'slack:devops-alerts'
});