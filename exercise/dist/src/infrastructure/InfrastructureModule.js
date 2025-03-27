"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfrastructureModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const CategoryModelConverter_1 = require("./typorm/adapter/CategoryModelConverter");
const ProductModel_1 = require("./typorm/model/ProductModel");
const CategoryModel_1 = require("./typorm/model/CategoryModel");
const CategoryModelRestorer_1 = require("./typorm/adapter/CategoryModelRestorer");
const ProductModelConverter_1 = require("./typorm/adapter/ProductModelConverter");
const ProductModelRestorer_1 = require("./typorm/adapter/ProductModelRestorer");
const CategoryRepositoryImpl_1 = require("./typorm/repository/CategoryRepositoryImpl");
const ProductRepositoryImpl_1 = require("./typorm/repository/ProductRepositoryImpl");
const config_1 = require("@nestjs/config");
const RoleModelConverter_1 = require("./typorm/adapter/RoleModelConverter");
const RoleModelRestorer_1 = require("./typorm/adapter/RoleModelRestorer");
const RoleModel_1 = require("./typorm/model/RoleModel");
const UserModel_1 = require("./typorm/model/UserModel");
const UserModelConverter_1 = require("./typorm/adapter/UserModelConverter");
const UserModelRestorer_1 = require("./typorm/adapter/UserModelRestorer");
const RoleRepositoryImpl_1 = require("./typorm/repository/RoleRepositoryImpl");
const UserRepositoryImpl_1 = require("./typorm/repository/UserRepositoryImpl");
/**
 * インフラストラクチャ層のモジュール定義
 * - データベース接続情報
 * - TypeORMエンティティおよびリポジトリ
 * - データモデルアダプタの登録
 * @author Fullness
 * @date 2025-03-10
 * @version 1.0.0
 */
let InfrastructureModule = class InfrastructureModule {
};
exports.InfrastructureModule = InfrastructureModule;
exports.InfrastructureModule = InfrastructureModule = __decorate([
    (0, common_1.Module)({
        imports: [
            // 環境変数を利用するために ConfigModule をロード
            config_1.ConfigModule.forRoot({
                isGlobal: true, // アプリケーション全体で利用可能にする
                envFilePath: ".env",
            }),
            // データベース接続情報を環境変数から設定 (TypeORM設定)
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: configService.get("DB_TYPE"), // データベースの種類
                    host: configService.get("DB_HOST"), // ホスト名
                    port: configService.get("DB_PORT"), // ポート番号
                    username: configService.get("DB_USERNAME"), // ユーザー名
                    password: configService.get("DB_PASSWORD"), // パスワード
                    database: configService.get("DB_DATABASE"), // データベース名
                    // 利用するエンティティ
                    entities: [
                        ProductModel_1.ProductModel,
                        CategoryModel_1.CategoryModel,
                        RoleModel_1.RoleModel,
                        UserModel_1.UserModel,
                        // UserRoleModel,
                        // RefreshTokenModel
                    ],
                    synchronize: configService.get("DB_SYNCHRONIZE"), // 本番環境では必ずfalseに設定
                    logging: configService.get("DB_LOGGING"), // SQLログの出力を有効化
                }),
            }),
            // TypeORMエンティティをモジュールに登録
            typeorm_1.TypeOrmModule.forFeature([
                ProductModel_1.ProductModel,
                CategoryModel_1.CategoryModel,
                RoleModel_1.RoleModel,
                UserModel_1.UserModel,
                // UserRoleModel,
                // RefreshTokenModel
            ]),
        ],
        providers: [
            // CategoryエンティティからCategoryModelへの変換
            {
                provide: 'CategoryModelConverter',
                useClass: CategoryModelConverter_1.CategoryModelConverter,
            },
            // CategoryModelからCategoryエンティティを復元
            {
                provide: 'CategoryModelRestorer',
                useClass: CategoryModelRestorer_1.CategoryModelRestorer,
            },
            // ProductエンティティからProductModelへの変換
            {
                provide: 'ProductModelConverter',
                useClass: ProductModelConverter_1.ProductModelConverter,
            },
            // ProductModelからProductエンティティを復元
            {
                provide: 'ProductModelRestorer',
                useClass: ProductModelRestorer_1.ProductModelRestorer,
            },
            // 商品カテゴリリポジトリ
            {
                provide: 'CategoryRepository',
                useClass: CategoryRepositoryImpl_1.CategoryRepositoryImpl,
            },
            // 商品リポジトリ
            {
                provide: 'ProductRepository',
                useClass: ProductRepositoryImpl_1.ProductRepositoryImpl,
            },
            /***********************************/
            /* 認証・認可機能                   */
            /***********************************/
            // RoleエンティティからRoleModelへの変換
            {
                provide: 'RoleModelConverter',
                useClass: RoleModelConverter_1.RoleModelConverter,
            },
            // RoleModelからRoleエンティティを復元
            {
                provide: 'RoleModelRestorer',
                useClass: RoleModelRestorer_1.RoleModelRestorer,
            },
            // UserエンティティからUserModelへの変換
            {
                provide: 'UserModelConverter',
                useClass: UserModelConverter_1.UserModelConverter,
            },
            // UserModelからUserエンティティを復元
            {
                provide: 'UserModelRestorer',
                useClass: UserModelRestorer_1.UserModelRestorer,
            },
            // ロールリポジトリ
            {
                provide: 'RoleRepository',
                useClass: RoleRepositoryImpl_1.RoleRepositoryImpl,
            },
            // ユーザーリポジトリ
            {
                provide: 'UserRepository',
                useClass: UserRepositoryImpl_1.UserRepositoryImpl,
            },
        ],
        exports: [
            'CategoryModelConverter',
            'CategoryModelRestorer',
            'ProductModelConverter',
            'ProductModelRestorer',
            'CategoryRepository',
            'ProductRepository',
            'RoleModelConverter',
            'RoleModelRestorer',
            'UserModelConverter',
            'UserModelRestorer',
            'RoleRepository',
            'UserRepository',
        ],
    })
], InfrastructureModule);
