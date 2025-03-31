"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterfaceModule = void 0;
const common_1 = require("@nestjs/common");
const ApplicationModule_1 = require("../application/ApplicationModule");
const ProductKeywordSearchRESTController_1 = require("./rest/controller/ProductKeywordSearchRESTController");
const RegisterProductParamConverter_1 = require("./rest/adapter/RegisterProductParamConverter");
const ProductRegisterRESTController_1 = require("./rest/controller/ProductRegisterRESTController");
const ModifyProductParamComverter_1 = require("./rest/adapter/ModifyProductParamComverter");
const ProductModifyRESTController_1 = require("./rest/controller/ProductModifyRESTController");
const RegisterUserController_1 = require("./rest/controller/auth/RegisterUserController");
const RegisterUserParamToConverter_1 = require("./rest/adapter/RegisterUserParamToConverter");
const AuthenticateParamConverter_1 = require("./rest/adapter/AuthenticateParamConverter");
const AuthenticateController_1 = require("./rest/controller/auth/AuthenticateController");
const RolesGuard_1 = require("./rest/controller/auth/RolesGuard");
const JwtBlacklistGuard_1 = require("./rest/controller/auth/JwtBlacklistGuard");
const LogoutParamConverter_1 = require("./rest/adapter/LogoutParamConverter");
/**
 * インターフェイス層のモジュール定義
 * - 商品カテゴリサービス、商品サービスを登録
 * - リクエストに応答するControllerと、リクエストパラメータを変換するAdapterを提供
 * @author Fullness
 * @date 2025-03-16
 * @version 1.0.0
 */
let InterfaceModule = class InterfaceModule {
};
exports.InterfaceModule = InterfaceModule;
exports.InterfaceModule = InterfaceModule = __decorate([
    (0, common_1.Module)({
        imports: [
            ApplicationModule_1.ApplicationModule, // サービス層のモジュール定義
        ],
        controllers: [
            ProductKeywordSearchRESTController_1.ProductKeywordSearchRESTController, // 商品キーワード検索:RESTAPIコントローラ
            ProductRegisterRESTController_1.ProductRegisterRESTController, // 商品登録:RESTAPIコントローラ
            ProductModifyRESTController_1.ProductModifyRESTController, // 既存商品の変更RESTAPIコントローラ
            RegisterUserController_1.RegisterUserController, // ユーザー登録RESTAPIコントローラ 
            AuthenticateController_1.AuthenticateController, // 認証RESTAPIコントローラ  
        ],
        providers: [
            // RegisterProductParamからProductDTOへの変換
            {
                provide: 'RegisterProductParamConverter',
                useClass: RegisterProductParamConverter_1.RegisterProductParamConverter,
            },
            // ModifyProductParamからProductDTOへの変換
            {
                provide: 'ModifyProductParamConverter',
                useClass: ModifyProductParamComverter_1.ModifyProductParamConverter,
            },
            // ModifyProductParamからProductDTOへの変換
            {
                provide: 'ModifyProductParamConverter',
                useClass: ModifyProductParamComverter_1.ModifyProductParamConverter,
            },
            // RegisterUserParamからUserDTOへの変換
            {
                provide: 'RegisterUserParamConverter',
                useClass: RegisterUserParamToConverter_1.RegisterUserParamConverter,
            },
            // AuthenticateParamからAuthenticateDTOへの変換
            {
                provide: 'AuthenticateParamConverter',
                useClass: AuthenticateParamConverter_1.AuthenticateParamConverter,
            },
            // LogoutParamからLogoutDTOへの変換
            {
                provide: 'LogoutParamConverter',
                useClass: LogoutParamConverter_1.LogoutParamConverter,
            },
            RolesGuard_1.RolesGuard, // Roleを利用したGuardを追加 2025-03-28
            JwtBlacklistGuard_1.JwtBlacklistGuard, // JWT認証ガード（ブラックリスト対応）2025-03-30
        ],
        exports: [
            'RegisterProductParamConverter', // 商品登録パラメータ変換クラス
            'ModifyProductParamConverter', // 商品変更パラメータ変換クラス
            'RegisterUserParamConverter', // RegisterUserParamからUserDTOへの変換
            'AuthenticateParamConverter', // AuthenticateParamからAuthenticateDTOへの変換
            'LogoutParamConverter', // LogoutParamからLogoutDTOへの変換
        ]
    })
], InterfaceModule);
