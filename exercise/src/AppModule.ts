import { Module } from "@nestjs/common";
import { InfrastructureModule } from "./infrastructure/InfrastructureModule";
import { ApplicationModule } from "./application/ApplicationModule";
import { InterfaceModule } from "./interface/InterfaceModule";
import { ConfigModule } from "@nestjs/config";


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
        // JWTで利用
        ConfigModule.forRoot({ isGlobal: true }), // 環境変数を読み込む
        InfrastructureModule    ,// インフラストラクチャ層のモジュール定義
        ApplicationModule       ,// アプリケーション層のモジュール定義
        InterfaceModule         ,// インターフェイス層のモジュール定義
    ],
})
export class AppModule {}