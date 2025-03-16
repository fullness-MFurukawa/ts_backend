import {    ArgumentsHost, 
            Catch, 
            ExceptionFilter, 
            HttpException, 
            HttpStatus, 
            Logger } from "@nestjs/common";
import { DomainException } from "@src/application/domain/exception/DomainException";
import { ExistsException } from "@src/shared/exceptions/ExistsException";
import { InternalException } from "@src/shared/exceptions/InternalException";
import { NotFoundException } from "@src/shared/exceptions/NotFoundException";

/**
 * REST API 共通例外フィルター
 * @author Fullness,Inc.
 * @date 2025-03-16
 * @version 1.0.0
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = '内部エラーが発生しました';

        if (exception instanceof HttpException) { // HttpException の場合
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            message = typeof exceptionResponse === 'string' 
                ? exceptionResponse 
                : (exceptionResponse as any).message;
        } else if (exception instanceof DomainException) { // DomainExceptionの場合
            status = HttpStatus.BAD_REQUEST;
            message = exception.message;
        }else if (exception instanceof ExistsException) { // ExistsExceptionの場合
            status = HttpStatus.BAD_REQUEST;
            message = exception.message;
        } else if (exception instanceof NotFoundException) { // NotFoundExceptionの場合
            status = HttpStatus.NOT_FOUND;
            message = exception.message;
        } else if (exception instanceof InternalException) { // InternalExceptionの場合
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            message = exception.message;
        } else { // その他のエラーの場合
            this.logger.error(
                '予期しないエラーが発生しました', exception.stack || exception);
        }

        // レスポンスを送信
        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message,
        });
    }
}