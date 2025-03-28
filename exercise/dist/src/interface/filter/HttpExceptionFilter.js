"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var HttpExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const DomainException_1 = require("../../application/domain/exception/DomainException");
const ExistsException_1 = require("../../shared/exceptions/ExistsException");
const InternalException_1 = require("../../shared/exceptions/InternalException");
const NotFoundException_1 = require("../../shared/exceptions/NotFoundException");
/**
 * REST API 共通例外フィルター
 * @author Fullness,Inc.
 * @date 2025-03-16
 * @version 1.0.0
 */
let HttpExceptionFilter = HttpExceptionFilter_1 = class HttpExceptionFilter {
    constructor() {
        this.logger = new common_1.Logger(HttpExceptionFilter_1.name);
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        // 例外のステータスコードを取得 (マップにない場合は500)
        const status = HttpExceptionFilter_1.statusMap.get(exception.constructor) || common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        // 例外メッセージを取得
        const message = exception instanceof common_1.HttpException
            ? exception.getResponse()
            : exception.message || "内部エラーが発生しました";
        // 例外をログに記録
        if (!(exception instanceof common_1.HttpException)) {
            this.logger.error("エラーが発生しました", exception.stack || exception);
        }
        // エラーレスポンスを送信
        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: typeof message === "string" ? message : message.message,
        });
    }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
/**
 * 例外ごとのHTTPステータスコードをマッピング
 */
HttpExceptionFilter.statusMap = new Map([
    [common_1.HttpException, common_1.HttpStatus.INTERNAL_SERVER_ERROR], // デフォルト
    [DomainException_1.DomainException, common_1.HttpStatus.BAD_REQUEST], // DomainException
    [ExistsException_1.ExistsException, common_1.HttpStatus.BAD_REQUEST], // ExistsException
    [NotFoundException_1.NotFoundException, common_1.HttpStatus.NOT_FOUND], // NotFoundException
    [InternalException_1.InternalException, common_1.HttpStatus.INTERNAL_SERVER_ERROR], // InternalException
    [common_1.UnauthorizedException, common_1.HttpStatus.UNAUTHORIZED], // 認証失敗
    [common_1.ForbiddenException, common_1.HttpStatus.FORBIDDEN], // 権限不足
]);
exports.HttpExceptionFilter = HttpExceptionFilter = HttpExceptionFilter_1 = __decorate([
    (0, common_1.Catch)()
], HttpExceptionFilter);
