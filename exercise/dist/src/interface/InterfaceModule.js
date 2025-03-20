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
        ],
        exports: [
            'RegisterProductParamConverter', // 商品登録パラメータ変換クラス
            'ModifyProductParamConverter', // 商品変更パラメータ変換クラス
        ]
    })
], InterfaceModule);
