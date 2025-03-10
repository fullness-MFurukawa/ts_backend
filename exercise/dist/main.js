import { Logger } from "@nestjs/common";
const logger = new Logger("Main");
async function bootstrap() {
    logger.log("サービスを起動します...");
    logger.warn("これは警告メッセージです");
    logger.error("これはエラーメッセージです");
    console.log("アプリが起動しました");
}
bootstrap();
