"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const AppModule_1 = require("./AppModule");
const rest_setpu_1 = require("./rest.setpu");
/**
 * NestJSのエントリーポイント
 * @author Fullness
 * @date 2025-03-16
 * @version 1.0.0
 */
async function bootstrap() {
    const app = await core_1.NestFactory.create(AppModule_1.AppModule);
    // REST API サーバのセットアップ
    await (0, rest_setpu_1.setupRestServer)(app);
    // 未処理の例外をキャッチ
    const logger = new common_1.Logger("Bootstrap");
    process.on("uncaughtException", (err) => {
        logger.error("❌ キャッチされない例外:", err.stack || err);
    });
    // 未処理の Promise 拒否をキャッチ
    process.on("unhandledRejection", (reason, promise) => {
        logger.error("❌ 未処理の拒否:", reason);
    });
}
bootstrap();
