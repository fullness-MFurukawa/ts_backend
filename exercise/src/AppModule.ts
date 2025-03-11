import { Module } from "@nestjs/common";
import { InfrastructureModule } from "./infrastructure/InfrastructureModule";


/**
 * アプリケーション全体のモジュール定義
 * - 各レイヤーモジュールを統合
 * - アプリケーションのエントリーポイント
 * @author Fullness
 * @date 2025-03-10
 * @version 1.0.0
 */
@Module({
    imports: [
        InfrastructureModule    ,// インフラストラクチャ層のモジュール定義
    ],
})
export class AppModule {}