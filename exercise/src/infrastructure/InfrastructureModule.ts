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
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RoleModelConverter } from "./typorm/adapter/RoleModelConverter";
import { RoleModelRestorer } from "./typorm/adapter/RoleModelRestorer";
import { RoleModel } from "./typorm/model/RoleModel";
import { UserModel } from "./typorm/model/UserModel";
import { UserRoleModel } from "./typorm/model/UserRoleModel";
import { RefreshTokenModel } from "./typorm/model/RefreshTokenModel";
import { UserModelConverter } from "./typorm/adapter/UserModelConverter";
import { UserModelRestorer } from "./typorm/adapter/UserModelRestorer";
import { RoleRepositoryImpl } from "./typorm/repository/RoleRepositoryImpl";
import { UserRepositoryImpl } from "./typorm/repository/UserRepositoryImpl";


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
        // 環境変数を利用するために ConfigModule をロード
        ConfigModule.forRoot({
            isGlobal: true, // アプリケーション全体で利用可能にする
            envFilePath: ".env",
        }),
        
        // データベース接続情報を環境変数から設定 (TypeORM設定)
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: configService.get<string>("DB_TYPE") as any, // データベースの種類
                host: configService.get<string>("DB_HOST"),// ホスト名
                port: configService.get<number>("DB_PORT"),// ポート番号
                username: configService.get<string>("DB_USERNAME"),// ユーザー名
                password: configService.get<string>("DB_PASSWORD"),// パスワード
                database: configService.get<string>("DB_DATABASE"),// データベース名
                // 利用するエンティティ
                entities: [
                    ProductModel, 
                    CategoryModel,
                    //RoleModel,
                    //UserModel,
                    // UserRoleModel,
                    // RefreshTokenModel
                ],
                synchronize: configService.get<boolean>("DB_SYNCHRONIZE"),// 本番環境では必ずfalseに設定
                logging: configService.get<boolean>("DB_LOGGING"),// SQLログの出力を有効化
            }),    
        }),
        // TypeORMエンティティをモジュールに登録
        TypeOrmModule.forFeature([
            ProductModel, 
            CategoryModel,
            //RoleModel,
            //UserModel,
            // UserRoleModel,
            // RefreshTokenModel
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
        /***********************************/
        /* 認証・認可機能                   */
        /***********************************/ 
        // RoleエンティティからRoleModelへの変換
        {
            provide: 'RoleModelConverter'   ,
            useClass: RoleModelConverter    ,
        },  
        // RoleModelからRoleエンティティを復元
        {
            provide: 'RoleModelRestorer'   ,
            useClass: RoleModelRestorer    ,
        },
        // UserエンティティからUserModelへの変換
        {
            provide:   'UserModelConverter' ,
            useClass:   UserModelConverter  ,
        },
        // UserModelからUserエンティティを復元
        {
            provide:  'UserModelRestorer'   ,
            useClass: UserModelRestorer     ,
        },
        // ロールリポジトリ
        {
            provide:    'RoleRepository'    ,
            useClass:   RoleRepositoryImpl  ,
        },
        // ユーザーリポジトリ
        {
            provide:    'UserRepository'    ,
            useClass:   UserRepositoryImpl  ,
        },
    ],
    exports: [
        'CategoryModelConverter',
        'CategoryModelRestorer' ,
        'ProductModelConverter' ,
        'ProductModelRestorer'  ,
        'CategoryRepository'    ,
        'ProductRepository'     ,
        'RoleModelConverter'    ,
        'RoleModelRestorer'     ,
        'UserModelConverter'    ,
        'UserModelRestorer'     ,
        'RoleRepository'        ,
        'UserRepository'        ,
    ],
})
export class InfrastructureModule {}