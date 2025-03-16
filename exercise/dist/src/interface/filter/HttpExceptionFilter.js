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
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = '内部エラーが発生しました';
        if (exception instanceof common_1.HttpException) { // HttpException の場合
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            message = typeof exceptionResponse === 'string'
                ? exceptionResponse
                : exceptionResponse.message;
        }
        else if (exception instanceof DomainException_1.DomainException) { // DomainExceptionの場合
            status = common_1.HttpStatus.BAD_REQUEST;
            message = exception.message;
        }
        else if (exception instanceof ExistsException_1.ExistsException) { // ExistsExceptionの場合
            status = common_1.HttpStatus.BAD_REQUEST;
            message = exception.message;
        }
        else if (exception instanceof NotFoundException_1.NotFoundException) { // NotFoundExceptionの場合
            status = common_1.HttpStatus.NOT_FOUND;
            message = exception.message;
        }
        else if (exception instanceof InternalException_1.InternalException) { // InternalExceptionの場合
            status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
            message = exception.message;
        }
        else { // その他のエラーの場合
            this.logger.error('予期しないエラーが発生しました', exception.stack || exception);
        }
        // レスポンスを送信
        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message,
        });
    }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = HttpExceptionFilter_1 = __decorate([
    (0, common_1.Catch)()
], HttpExceptionFilter);
