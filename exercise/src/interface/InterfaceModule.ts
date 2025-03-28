import { Module } from "@nestjs/common";
import { ApplicationModule } from "@src/application/ApplicationModule";
import { ProductKeywordSearchRESTController } from "./rest/controller/ProductKeywordSearchRESTController";
import { RegisterProductParamConverter } from "./rest/adapter/RegisterProductParamConverter";
import { ProductRegisterRESTController } from "./rest/controller/ProductRegisterRESTController";
import { ModifyProductParamConverter } from "./rest/adapter/ModifyProductParamComverter";
import { ProductModifyRESTController } from "./rest/controller/ProductModifyRESTController";
import { RegisterUserController } from "./rest/controller/auth/RegisterUserController";
import { RegisterUserParamConverter } from "./rest/adapter/RegisterUserParamToConverter";
import { AuthenticateParamConverter } from "./rest/adapter/AuthenticateParamConverter";
import { AuthenticateController } from "./rest/controller/auth/AuthenticateController";
import { RolesGuard } from "./rest/controller/auth/RolesGuard";

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
        RegisterUserController              , // ユーザー登録RESTAPIコントローラ 
        AuthenticateController              , // 認証RESTAPIコントローラ  
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
        // ModifyProductParamからProductDTOへの変換
        {
            provide:    'ModifyProductParamConverter',
            useClass:   ModifyProductParamConverter ,
        },
        // RegisterUserParamからUserDTOへの変換
        {
            provide:    'RegisterUserParamConverter' ,
            useClass:   RegisterUserParamConverter  ,
        },
        // AuthenticateParamからAuthenticateDTOへの変換
        {
            provide:    'AuthenticateParamConverter' ,
            useClass:   AuthenticateParamConverter  ,
        },
        RolesGuard, // Roleを利用したGuardを追加 2025-03-28
    ],
    exports:[
        'RegisterProductParamConverter' , // 商品登録パラメータ変換クラス
        'ModifyProductParamConverter'   , // 商品変更パラメータ変換クラス
        'RegisterUserParamConverter'    , // RegisterUserParamからUserDTOへの変換
        'AuthenticateParamConverter'    , // AuthenticateParamからAuthenticateDTOへの変換
    ]
})
export class InterfaceModule {}