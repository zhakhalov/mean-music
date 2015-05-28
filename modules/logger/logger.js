var winston = require('winston');
winston.emitErrs = true;

var logger = new winston.Logger({
    transports: [
        new winston.transports.File({
            name: 'info-file-log',
            level: 'info',
            filename: './log/info.log',
            json: true,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: false
        }),
        new winston.transports.File({
            name: 'debug-file-log',
            level: 'debug',
            filename: './log/debug.log',
            json: true,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: false
        }),
        new winston.transports.File({
            name: 'error-file-log',
            level: 'error',
            filename: './log/error.log',
            handleExceptions: !process.env.DEV,
            json: true,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: false
        }),
        new winston.transports.Console({
            name: 'console-log',
            handleExceptions: !process.env.DEV,
            json: false,
            colorize: true
        })
    ],
    exitOnError: false
});

module.exports = logger;