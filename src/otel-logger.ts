// import { logs } from '@opentelemetry/api-logs';
// import {
//   LoggerProvider,
//   SimpleLogRecordProcessor,
//   ConsoleLogRecordExporter,
// } from '@opentelemetry/sdk-logs';
// import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
// import { registerInstrumentations } from '@opentelemetry/instrumentation';
// import { WinstonInstrumentation } from '@opentelemetry/instrumentation-winston';
// import { OpenTelemetryTransportV3 } from '@opentelemetry/winston-transport';

// import { context, ROOT_CONTEXT } from '@opentelemetry/api';

// if (!context.active()) {
//   console.log('Initializing OpenTelemetry Context...');
//   context.with(ROOT_CONTEXT, () => {});
// }

// // Winston logging

// import * as winston from 'winston';

// // ✅ Ensure Winston is correctly imported
// const { format, transports } = winston;
// const nestLogLevels = {
//   log: 'info',
//   error: 'error',
//   warn: 'warn',
//   debug: 'debug',
//   verbose: 'info', // 'verbose' is not standard in Winston, mapping to 'info'
// };

// // Initialize OpenTelemetry Tracer Provider
// const tracerProvider = new NodeTracerProvider();
// tracerProvider.register();

// // Initialize Logger Provider
// const loggerProvider = new LoggerProvider();
// loggerProvider.addLogRecordProcessor(
//   new SimpleLogRecordProcessor(new ConsoleLogRecordExporter()), // Export to console (debugging)
// );
// logs.setGlobalLoggerProvider(loggerProvider);

// // Register Winston Instrumentation with correct logHook
// registerInstrumentations({
//   instrumentations: [
//     new WinstonInstrumentation({
//       disableLogSending: true, // Prevent duplicate logs
//       logHook: (span, record) => {
//         if (span) {
//           record['trace_id'] = span.spanContext().traceId;
//           record['span_id'] = span.spanContext().spanId;
//         }
//       },
//     }),
//   ],
// });

// // ✅ Configure Winston Logger
// export const logger = winston.createLogger({
//   levels: winston.config.npm.levels,
//   level: 'info',
//   format: format.combine(format.timestamp(), format.json()),
//   transports: [
//     new winston.transports.Console(),
//     new OpenTelemetryTransportV3(), // Logs to OpenTelemetry
//   ],
// });
// export class NestWinstonLogger {
//   log(message: string, context?: string) {
//     logger.info({ message, context });
//   }
//   error(message: string, trace?: string, context?: string) {
//     logger.error({ message, trace, context });
//   }
//   warn(message: string, context?: string) {
//     logger.warn({ message, context });
//   }
//   debug(message: string, context?: string) {
//     logger.debug({ message, context });
//   }
//   verbose(message: string, context?: string) {
//     logger.info({ message, context });
//   }
// }
// logger.info('OpenTelemetry Winston logging initialized.');
