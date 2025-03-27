import {    ArgumentsHost, 
            Catch, 
            ExceptionFilter, 
            HttpException, 
            HttpStatus, 
            Logger, 
            UnauthorizedException} from "@nestjs/common";
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
    
    /**
     * 例外ごとのHTTPステータスコードをマッピング
     */
     private static readonly statusMap = new Map<Function, number>([
        [HttpException, HttpStatus.INTERNAL_SERVER_ERROR], // デフォルト
        [DomainException, HttpStatus.BAD_REQUEST], // DomainException
        [ExistsException, HttpStatus.BAD_REQUEST], // ExistsException
        [NotFoundException, HttpStatus.NOT_FOUND], // NotFoundException
        [InternalException, HttpStatus.INTERNAL_SERVER_ERROR],// InternalException
        [UnauthorizedException, HttpStatus.UNAUTHORIZED],// 認証失敗
    ]);

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        // 例外のステータスコードを取得 (マップにない場合は500)
        const status = HttpExceptionFilter.statusMap.get(exception.constructor) || HttpStatus.INTERNAL_SERVER_ERROR;
        
        // 例外メッセージを取得
        const message = exception instanceof HttpException 
            ? exception.getResponse()
            : exception.message || "内部エラーが発生しました";

        // 例外をログに記録
        if (!(exception instanceof HttpException)) {
            this.logger.error("エラーが発生しました", exception.stack || exception);
        }

        // エラーレスポンスを送信
        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: typeof message === "string" ? message : (message as any).message,
        });
    }
}

