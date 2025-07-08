/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalHttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalHttpExceptionFilter.name);
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    this.logger.error(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      exception.message || exception.toString(),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      exception.stack,
    );

    // Determine the appropriate HTTP status code
    let status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Extract error message details if available
    let errorResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: exception };

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      errorResponse = typeof res === 'string' ? { message: res } : res;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    } else if (exception?.isAxiosError && exception?.response) {
      // Axios error with response
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      status = exception.response.status || HttpStatus.BAD_REQUEST;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      errorResponse = exception.response.data || { message: exception.message };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    } else if (exception?.response?.status && exception?.response?.data) {
      // Generic HTTP-like error
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      status = exception.response.status;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      errorResponse = exception.response.data;
    } else {
      errorResponse = {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        message: exception.message || exception.toString(),
      };
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: errorResponse,
    });
  }
}
