"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupRestServer = setupRestServer;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
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
            whitelist: true, // DTOで定義されていないプロパティを自動的に除外
            forbidNonWhitelisted: true, // DTOにないプロパティがリクエストに含まれていた場合、エラーを返す
            transform: true, // リクエストのデータ型をDTOで定義された型に変換
        }));
        // helmetは、HTTP ヘッダーを適切に設定してセキュリティを強化するミドルウェア
        app.use((0, helmet_1.default)());
        // Swagger(OpenAPI)の設定
        const config = new swagger_1.DocumentBuilder()
            .setTitle("マイクロサービスハンズオン:TypeScript編 商品管理API") // APIのタイトル
            .setDescription("商品管理APIのエンドポイント一覧") // 説明
            .setVersion("1.0.0") // バージョン
            .addTag("products") // タグ（カテゴリ分け用）
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup("api", app, document); // "/api" でSwagger UIを表示
        // サーバー起動
        await app.listen(REST_PORT);
        logger.log(`✅ REST APIの実行: http://localhost:${REST_PORT}`);
        common_1.Logger.log(`📖 OpenAPIドキュメント: http://localhost:${REST_PORT}/api`);
    }
    catch (error) {
        logger.error("❌ REST API の初期化に失敗しました:", error);
    }
}
