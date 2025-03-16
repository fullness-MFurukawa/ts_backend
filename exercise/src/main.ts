import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./AppModule";
import { setupRestServer } from "./rest.setpu";

/**
 * NestJSのエントリーポイント
 * @author Fullness
 * @date 2025-03-16
 * @version 1.0.0
 */
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    // REST API サーバのセットアップ
    await setupRestServer(app);

    // 未処理の例外をキャッチ
    const logger = new Logger("Bootstrap");
    process.on("uncaughtException", (err) => {
        logger.error("❌ キャッチされない例外:", err.stack || err);
    });
    // 未処理の Promise 拒否をキャッチ
    process.on("unhandledRejection", (reason, promise) => {
        logger.error("❌ 未処理の拒否:", reason);
    });
}
bootstrap();
