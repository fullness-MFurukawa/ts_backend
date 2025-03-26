"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationModule = void 0;
const common_1 = require("@nestjs/common");
const InfrastructureModule_1 = require("../infrastructure/InfrastructureModule");
const CategoryDTOConverter_1 = require("./in/adapter/CategoryDTOConverter");
const ProductDTOConverter_1 = require("./in/adapter/ProductDTOConverter");
const ProductDTORestorer_1 = require("./in/adapter/ProductDTORestorer");
const CategoryInteractor_1 = require("./in/service/CategoryInteractor");
const ProductInteractor_1 = require("./in/service/ProductInteractor");
const RoleDTOConverter_1 = require("./in/adapter/RoleDTOConverter");
const RoleDTORestorer_1 = require("./in/adapter/RoleDTORestorer");
const UserDTOConverter_1 = require("./in/adapter/UserDTOConverter");
const UserDTORestorer_1 = require("./in/adapter/UserDTORestorer");
const RegisterUserInteractor_1 = require("./in/service/RegisterUserInteractor");
const AuthenticateUserInteractor_1 = require("./in/service/AuthenticateUserInteractor");
const jwt_1 = require("@nestjs/jwt");
/**
 * サービス層のモジュール定義
 * - 商品カテゴリサービス、商品サービスを登録
 * - ユースケース層から呼び出されるビジネスロジックを提供
 * - ドメインモデルやリポジトリと連携して具体的な操作を実行
 * @author Fullness
 * @date 2025-03-14
 * @version 1.0.0
 */
let ApplicationModule = class ApplicationModule {
};
exports.ApplicationModule = ApplicationModule;
exports.ApplicationModule = ApplicationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            InfrastructureModule_1.InfrastructureModule, // インフラストラクチャ層のモジュールをインポート
            jwt_1.JwtModule,
        ],
        providers: [
            // CategoryエンティティからCategoryDTOへ変換する
            {
                provide: 'CategoryDTOConverter',
                useClass: CategoryDTOConverter_1.CategoryDTOConverter,
            },
            // ProductエンティティからProductDTOへ変換する
            {
                provide: 'ProductDTOConverter',
                useClass: ProductDTOConverter_1.ProductDTOConverter,
            },
            // ProductDTOからProductエンティティを復元する
            {
                provide: 'ProductDTORestorer',
                useClass: ProductDTORestorer_1.ProductDTORestorer,
            },
            // 商品カテゴリユースケースインターフェイスの実装
            {
                provide: 'CategoryUsecase',
                useClass: CategoryInteractor_1.CategoryInteractor,
            },
            // 商品ユースケースインターフェイスの実装
            {
                provide: 'ProductUsecase',
                useClass: ProductInteractor_1.ProductInteractor,
            },
            /***********************************/
            /* 認証・認可機能   2025-03-23      */
            /***********************************/
            // RoleエンティティからRoleDTOへ変換する
            {
                provide: 'RoleDTOConverter',
                useClass: RoleDTOConverter_1.RoleDTOConverter,
            },
            // RoleDTOからRoleエンティティを復元する
            {
                provide: 'RoleDTORestorer',
                useClass: RoleDTORestorer_1.RoleDTORestorer,
            },
            // UserエンティティからUserDTOへ変換する
            {
                provide: 'UserDTOConverter',
                useClass: UserDTOConverter_1.UserDTOConverter,
            },
            // UserDTOからUserエンティティを復元する
            {
                provide: 'UserDTORestorer',
                useClass: UserDTORestorer_1.UserDTORestorer,
            },
            // ユーザー登録ユースケースインターフェイスの実装
            {
                provide: 'RegisterUserUsecase',
                useClass: RegisterUserInteractor_1.RegisterUserInteractor,
            },
            // ユーザー認証ユースケースインターフェイスの実装
            {
                provide: 'AuthenticateUserUsecase',
                useClass: AuthenticateUserInteractor_1.AuthenticateUserInteractor,
            },
        ],
        exports: [
            'CategoryDTOConverter',
            'ProductDTOConverter',
            'ProductDTORestorer',
            'CategoryUsecase',
            'ProductUsecase',
            'RoleDTOConverter',
            'RoleDTORestorer',
            'UserDTOConverter',
            'UserDTORestorer',
            'RegisterUserUsecase',
            'AuthenticateUserUsecase',
        ]
    })
], ApplicationModule);
