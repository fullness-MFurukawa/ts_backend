"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const logger = new common_1.Logger("Main");
async function bootstrap() {
    logger.log("サービスを起動します...");
    logger.warn("これは警告メッセージです");
    logger.error("これはエラーメッセージです");
    console.log("アプリが起動しました");
}
bootstrap();
