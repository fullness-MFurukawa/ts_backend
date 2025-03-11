import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CategoryModelConverter } from "./typorm/adapter/CategoryModelConverter";
import { ProductModel } from "./typorm/model/ProductModel";
import { CategoryModel } from "./typorm/model/CategoryModel";
import { CategoryModelRestorer } from "./typorm/adapter/CategoryModelRestorer";
import { ProductModelConverter } from "./typorm/adapter/ProductModelConverter";
import { ProductModelRestorer } from "./typorm/adapter/ProductModelRestorer";
import { CategoryRepositoryImpl } from "./typorm/repository/CategoryRepositoryImpl";
import { ProductRepositoryImpl } from "./typorm/repository/ProductRepositoryImpl";

/**
 * インフラストラクチャ層のモジュール定義
 * - データベース接続情報
 * - TypeORMエンティティおよびリポジトリ
 * - データモデルアダプタの登録
 * @author Fullness
 * @date 2025-03-10
 * @version 1.0.0
 */
@Module({
    imports: [
        // データベース接続情報を定義 (TypeORM設定)
        TypeOrmModule.forRoot({
            type: "mysql",                      // データベースの種類
            host: "ts_exercise_db",             // ホスト名
            port: 3306,                         // ポート番号
            username: "user",                   // ユーザー名
            password: "password",               // パスワード
            database: "exercise_db",            // データベース名
            // 利用するエンティティ
            entities: [
                ProductModel, 
                CategoryModel
            ], 
            synchronize: false,                 // 本番環境では必ずfalseに設定
            logging: true,                      // SQLログの出力を有効化
        }),
        // TypeORMエンティティをモジュールに登録
        TypeOrmModule.forFeature([
            ProductModel, 
            CategoryModel,
        ]),
    ],
    providers: [
        // CategoryエンティティからCategoryModelへの変換
        {
            provide: 'CategoryModelConverter',
            useClass: CategoryModelConverter,
        },
        // CategoryModelからCategoryエンティティを復元
        {
            provide: 'CategoryModelRestorer',
            useClass: CategoryModelRestorer,
        },
        // ProductエンティティからProductModelへの変換
        {
            provide: 'ProductModelConverter',
            useClass: ProductModelConverter,
        },
        // ProductModelからProductエンティティを復元
        {
            provide: 'ProductModelRestorer',
            useClass: ProductModelRestorer,
        },
        // 商品カテゴリリポジトリ
        {
            provide: 'CategoryRepository' ,
            useClass: CategoryRepositoryImpl,
        },
        // 商品リポジトリ
        {
            provide: 'ProductRepository' ,
            useClass: ProductRepositoryImpl,
        },
    ],
    exports: [
        'CategoryModelConverter',
        'CategoryModelRestorer' ,
        'ProductModelConverter' ,
        'ProductModelRestorer'  ,
        'CategoryRepository'    ,
        'ProductRepository'     ,
    ],
})
export class InfrastructureModule {}