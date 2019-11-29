const { createLogger, format, transports } = require('winston')
require('winston-daily-rotate-file')
const { app_env } = require('../config.json')

const transport = new(transports.DailyRotateFile)({
    filename: 'shallty-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    dirname: 'logs/'
})

const logger = createLogger({
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.errors({
            stack: true
        }),
        format.splat(),
        format.json()
    ),
    defaultMeta: {
        service: 'shallty'
    },
    transports: [
        transport
    ]
})

if (app_env !== 'production') {
    logger.add(new transports.Console({
        format: format.combine(
            format.colorize()
        )
    }))
}

class Handler {
    /**
     * Handle error logging.
     * 
     * @param {Error} err Error instance.
     */
    error(err) {
        logger.error(err)

        return {
            error: true,
            message: 'Something went wrong. ' + err
        }
    }
}

module.exports = new Handler