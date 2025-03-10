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
const ProductModel_js_1 = require("./typorm/model/ProductModel.js");
const CategoryModel_js_1 = require("./typorm/model/CategoryModel.js");
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
                    ProductModel_js_1.ProductModel,
                    CategoryModel_js_1.CategoryModel
                ],
                synchronize: false, // 本番環境では必ずfalseに設定
                logging: true, // SQLログの出力を有効化
            }),
            // TypeORMエンティティをモジュールに登録
            typeorm_1.TypeOrmModule.forFeature([
                ProductModel_js_1.ProductModel,
                CategoryModel_js_1.CategoryModel,
            ]),
        ],
        providers: [],
        exports: [],
    })
], InfrastructureModule);
