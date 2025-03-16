import { Module } from "@nestjs/common";
import { InfrastructureModule } from "@src/infrastructure/InfrastructureModule";
import { CategoryDTOConverter } from "./in/adapter/CategoryDTOConverter";
import { ProductDTOConverter } from "./in/adapter/ProductDTOConverter";
import { ProductDTORestorer } from "./in/adapter/ProductDTORestorer";
import { CategoryInteractor } from "./in/service/CategoryInteractor";
import { ProductInteractor } from "./in/service/ProductInteractor";
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
    ],
    exports: [
        'CategoryDTOConverter'  ,  
        'ProductDTOConverter'   , 
        'ProductDTORestorer'    ,  
        'CategoryUsecase'       ,
        'ProductUsecase'        ,      
    ]
})
export class ApplicationModule {}