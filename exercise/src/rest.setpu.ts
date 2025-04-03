import { INestApplication, Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
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
                whitelist: true,// DTOで定義されていないプロパティを自動的に除外
                forbidNonWhitelisted: true,// DTOにないプロパティがリクエストに含まれていた場合、エラーを返す
                transform: true,// リクエストのデータ型をDTOで定義された型に変換
            }),
        );

        // helmetは、HTTP ヘッダーを適切に設定してセキュリティを強化するミドルウェア
        app.use(helmet());

        // Swagger(OpenAPI)の設定
        const config = new DocumentBuilder()
            .setTitle("マイクロサービス[TypeScriptハンズオン]")  // APIのタイトル
            .setDescription("商品管理APIのエンドポイント一覧") // 説明
            .setVersion("1.0.0") // バージョン
            .addTag("商品管理機能と認証機能") // タグ（カテゴリ分け用）
            .addBearerAuth(
                {
                  type: 'http',
                  scheme: 'bearer',
                  bearerFormat: 'JWT',
                  name: 'Authorization',
                  in: 'header',
                },
                'access-token' // JWTアクセストークンの名称
              )
            .build();
        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup("api", app, document); // "/api" でSwagger UIを表示

        // サーバー起動
        await app.listen(REST_PORT);
        logger.log(`✅ REST APIの実行: http://localhost:${REST_PORT}`);
        Logger.log(`📖 OpenAPIドキュメント: http://localhost:${REST_PORT}/api`);
    } catch (error) {
        logger.error("❌ REST API の初期化に失敗しました:", error);
    }
}