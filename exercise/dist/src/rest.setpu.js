"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupRestServer = setupRestServer;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const HttpExceptionFilter_1 = require("./interface/filter/HttpExceptionFilter");
/**
 * REST API サーバーの初期化
 * @param app NestJS アプリケーションインスタンス
 * @author Fullness,Inc.
 * @date 2025-03-16
 * @version 1.0.0
 */
async function setupRestServer(app) {
    const logger = new common_1.Logger("REST");
    try {
        // ConfigService のインスタンスを取得
        const configService = app.get(config_1.ConfigService);
        // 環境変数からポートを取得
        const REST_PORT = configService.get("REST_PORT", 14040);
        // CORS 設定
        const allowedOrigins = configService.get("CORS_ORIGIN")?.split(",") || [];
        app.enableCors({
            origin: allowedOrigins.length > 0 ? allowedOrigins : "*",
            methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
            allowedHeaders: "Content-Type,Authorization",
        });
        // 例外フィルターの設定
        app.useGlobalFilters(new HttpExceptionFilter_1.HttpExceptionFilter());
        app.useGlobalPipes(new common_1.ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }));
        app.use((0, cookie_parser_1.default)());
        app.use((0, helmet_1.default)());
        // サーバー起動
        await app.listen(REST_PORT);
        logger.log(`✅ REST APIの実行: http://localhost:${REST_PORT}`);
    }
    catch (error) {
        logger.error("❌ REST API の初期化に失敗しました:", error);
    }
}
