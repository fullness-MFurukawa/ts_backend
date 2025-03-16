import { INestApplication, Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { HttpExceptionFilter } from "./interface/filter/HttpExceptionFilter";
/**
 * REST API サーバーの初期化
 * @param app NestJS アプリケーションインスタンス
 * @author Fullness,Inc.
 * @date 2025-03-16
 * @version 1.0.0
 */
export async function setupRestServer(app: INestApplication): Promise<void> {
    const logger = new Logger("REST");
    try {
        // ConfigService のインスタンスを取得
        const configService = app.get(ConfigService);

        // 環境変数からポートを取得
        const REST_PORT = configService.get<number>("REST_PORT", 14040);

        // CORS 設定
        const allowedOrigins = configService.get<string>("CORS_ORIGIN")?.split(",") || [];
        app.enableCors({
            origin: allowedOrigins.length > 0 ? allowedOrigins : "*",
            methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
            allowedHeaders: "Content-Type,Authorization",
        });

        // 例外フィルターの設定
        app.useGlobalFilters(new HttpExceptionFilter());
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
                transform: true,
            }),
        );

        app.use(cookieParser());
        app.use(helmet());

        // サーバー起動
        await app.listen(REST_PORT);
        logger.log(`✅ REST APIの実行: http://localhost:${REST_PORT}`);
    } catch (error) {
        logger.error("❌ REST API の初期化に失敗しました:", error);
    }
}