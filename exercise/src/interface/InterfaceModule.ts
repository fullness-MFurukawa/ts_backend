import { Module } from "@nestjs/common";
import { ApplicationModule } from "@src/application/ApplicationModule";
import { ProductKeywordSearchRESTController } from "./rest/controller/ProductKeywordSearchRESTController";
import { RegisterProductParamConverter } from "./rest/adapter/RegisterProductParamConverter";
import { ProductRegisterRESTController } from "./rest/controller/ProductRegisterRESTController";
import { ModifyProductParamConverter } from "./rest/adapter/ModifyProductParamComverter";
import { ProductModifyRESTController } from "./rest/controller/ProductModifyRESTController";

/**
 * インターフェイス層のモジュール定義
 * - 商品カテゴリサービス、商品サービスを登録
 * - リクエストに応答するControllerと、リクエストパラメータを変換するAdapterを提供
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
        ProductRegisterRESTController       , // 商品登録:RESTAPIコントローラ
        ProductModifyRESTController         , // 既存商品の変更RESTAPIコントローラ
    ],
    providers:[
        // RegisterProductParamからProductDTOへの変換
        {
            provide:    'RegisterProductParamConverter' ,
            useClass:   RegisterProductParamConverter,
        },
        // ModifyProductParamからProductDTOへの変換
        {
            provide:    'ModifyProductParamConverter',
            useClass:   ModifyProductParamConverter ,
        },
    ],
    exports:[
        'RegisterProductParamConverter' , // 商品登録パラメータ変換クラス
        'ModifyProductParamConverter'   , // 商品変更パラメータ変換クラス
    ]
})
export class InterfaceModule {}