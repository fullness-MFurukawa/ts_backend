var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductModel } from "./typorm/model/ProductModel.js";
import { CategoryModel } from "./typorm/model/CategoryModel.js";
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
InfrastructureModule = __decorate([
    Module({
        imports: [
            // データベース接続情報を定義 (TypeORM設定)
            TypeOrmModule.forRoot({
                type: "mysql", // データベースの種類
                host: "ts_exercise_db", // ホスト名
                port: 3306, // ポート番号
                username: "user", // ユーザー名
                password: "password", // パスワード
                database: "exercise_db", // データベース名
                // 利用するエンティティ
                entities: [
                    ProductModel,
                    CategoryModel
                ],
                synchronize: false, // 本番環境では必ずfalseに設定
                logging: true, // SQLログの出力を有効化
            }),
            // TypeORMエンティティをモジュールに登録
            TypeOrmModule.forFeature([
                ProductModel,
                CategoryModel,
            ]),
        ],
        providers: [],
        exports: [],
    })
], InfrastructureModule);
export { InfrastructureModule };
