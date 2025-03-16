import { Module } from "@nestjs/common";
import { ApplicationModule } from "@src/application/ApplicationModule";
import { ProductKeywordSearchRESTController } from "./rest/controller/ProductKeywordSearchRESTController";

/**
 * インターフェイス層のモジュール定義
 * - 商品カテゴリサービス、商品サービスを登録
 * - ユースケース層から呼び出されるビジネスロジックを提供
 * - ドメインモデルやリポジトリと連携して具体的な操作を実行
 * @author Fullness
 * @date 2025-03-16
 * @version 1.0.0
 */
@Module({
    imports: [
        ApplicationModule   ,  // サービス層のモジュール定義
    ],
    controllers:[
        ProductKeywordSearchRESTController  , // 商品キーワード検索:RESTAPIコントローラ
    ],
    providers:[

    ],
    exports:[

    ]
})
export class InterfaceModule {}