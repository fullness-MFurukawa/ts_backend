import { Module } from "@nestjs/common";
import { InfrastructureModule } from "@src/infrastructure/InfrastructureModule";
import { CategoryDTOConverter } from "./in/adapter/CategoryDTOConverter";
import { ProductDTOConverter } from "./in/adapter/ProductDTOConverter";
import { ProductDTORestorer } from "./in/adapter/ProductDTORestorer";
import { CategoryInteractor } from "./in/service/CategoryInteractor";
import { ProductInteractor } from "./in/service/ProductInteractor";
import { RoleDTOConverter } from "./in/adapter/RoleDTOConverter";
import { RoleDTORestorer } from "./in/adapter/RoleDTORestorer";
import { UserDTOConverter } from "./in/adapter/UserDTOConverter";
import { UserDTORestorer } from "./in/adapter/UserDTORestorer";
import { RegisterUserInteractor } from "./in/service/RegisterUserInteractor";
import { AuthenticateUserInteractor } from "./in/service/AuthenticateUserInteractor";
import { JwtModule } from "@nestjs/jwt";
/**
 * サービス層のモジュール定義
 * - 商品カテゴリサービス、商品サービスを登録
 * - ユースケース層から呼び出されるビジネスロジックを提供
 * - ドメインモデルやリポジトリと連携して具体的な操作を実行
 * @author Fullness
 * @date 2025-03-14
 * @version 1.0.0
 */
@Module({
    imports: [
        InfrastructureModule, // インフラストラクチャ層のモジュールをインポート
        JwtModule, 
    ],
    providers: [
        // CategoryエンティティからCategoryDTOへ変換する
        {
            provide:    'CategoryDTOConverter',  
            useClass:   CategoryDTOConverter,      
        },
        // ProductエンティティからProductDTOへ変換する
        {
            provide:    'ProductDTOConverter',  
            useClass:   ProductDTOConverter,   
        },
        // ProductDTOからProductエンティティを復元する
        {
            provide:    'ProductDTORestorer',    
            useClass:   ProductDTORestorer,     
        },
        // 商品カテゴリユースケースインターフェイスの実装
        {
            provide:    'CategoryUsecase',    
            useClass:   CategoryInteractor,     
        },
        // 商品ユースケースインターフェイスの実装
        {
            provide:    'ProductUsecase',    
            useClass:   ProductInteractor,     
        },
        /***********************************/
        /* 認証・認可機能   2025-03-23      */
        /***********************************/
        // RoleエンティティからRoleDTOへ変換する
        {
            provide:    'RoleDTOConverter'  ,
            useClass:   RoleDTOConverter    ,
        },
        // RoleDTOからRoleエンティティを復元する
        {
            provide:    'RoleDTORestorer'   ,    
            useClass:   RoleDTORestorer     ,     
        },
        // UserエンティティからUserDTOへ変換する
        {
            provide:    'UserDTOConverter'  ,
            useClass:   UserDTOConverter    ,
        },
        // UserDTOからUserエンティティを復元する
        {
            provide:    'UserDTORestorer'   ,    
            useClass:   UserDTORestorer     ,     
        },
        // ユーザー登録ユースケースインターフェイスの実装
        {
            provide:    'RegisterUserUsecase',    
            useClass:   RegisterUserInteractor,     
        },
        // ユーザー認証ユースケースインターフェイスの実装
        {
            provide:    'AuthenticateUserUsecase' ,
            useClass:   AuthenticateUserInteractor,
        },
    ],
    exports: [
        'CategoryDTOConverter'      ,  
        'ProductDTOConverter'       , 
        'ProductDTORestorer'        ,  
        'CategoryUsecase'           ,
        'ProductUsecase'            ,  
        'RoleDTOConverter'          ,  
        'RoleDTORestorer'           ,    
        'UserDTOConverter'          ,
        'UserDTORestorer'           , 
        'RegisterUserUsecase'       ,
        'AuthenticateUserUsecase'   ,    
    ]
})
export class ApplicationModule {}