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
            // データベース接続情報を定義 (TypeORM設定)
            typeorm_1.TypeOrmModule.forRoot({
                type: "mysql", // データベースの種類
                host: "ts_exercise_db", // ホスト名
                port: 3306, // ポート番号
                username: "user", // ユーザー名
                password: "password", // パスワード
                database: "exercise_db", // データベース名
                // 利用するエンティティ
                entities: [
                    ProductModel_1.ProductModel,
                    CategoryModel_1.CategoryModel
                ],
                synchronize: false, // 本番環境では必ずfalseに設定
                logging: true, // SQLログの出力を有効化
            }),
            // TypeORMエンティティをモジュールに登録
            typeorm_1.TypeOrmModule.forFeature([
                ProductModel_1.ProductModel,
                CategoryModel_1.CategoryModel,
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
        ],
        exports: [
            'CategoryModelConverter',
            'CategoryModelRestorer',
            'ProductModelConverter',
            'ProductModelRestorer',
            'CategoryRepository',
            'ProductRepository',
        ],
    })
], InfrastructureModule);
