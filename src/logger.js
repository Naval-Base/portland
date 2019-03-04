const winston = require('winston');

const logger = winston.createLogger({
	format: winston.format.combine(
		winston.format.colorize({ all: true }),
		winston.format.timestamp({ format: 'YYYY/MM/DD HH:mm:ss' }),
		winston.format.printf(info => `[${info.timestamp}] ${info.level}: ${info.message}`)
	),
	transports: [new winston.transports.Console()]
});

module.exports = logger;
