import { Product } from "@src/application/domain/model/product/Product";
import { ProductId } from "@src/application/domain/model/product/ProductId";
import { ProductName } from "@src/application/domain/model/product/ProductName";

/**
 * Productエンティティのリポジトリインターフェイス
 * @author Fullness,Inc.
 * @date 2025-01-08
 * @version 1.0.0
 */
export interface ProductRepository<T> {
    /**
     * Idで商品を取得する
     * @param id 取得するProductのProductId
     * @param manager? CRUD操作機能
     * @returns Productインスタンス、存在しない場合はnull
     */
    findById(id: ProductId , manager?: T): Promise<Product | null>;
    /**
     * キーワードで商品を部分一致で取得する
     * @param keyword 取得するProductのキーワード
     * @param manager? CRUD操作機能
     * @returns Productインスタンスの配列、存在しない場合はnull
     */
    findByKeyword(keyword: ProductName , manager?: T): Promise<Product[] | null>;
    /**
     * 指定された商品の有無を返す
     * @param name 有無を調べる商品名
     * @param manager? CRUD操作機能
     * @returns true:存在する false:存在しない
     */
    exists(name: ProductName , manager?: T): Promise<boolean>
    /**
     * 商品を永続化する
     * @param product 永続化するProductのインスタンス
     * @param manager? CRUD操作機能
     */
    create(product: Product , manager?: T): Promise<void>;
    /**
     * 指定された商品Idの商品を変更する
     * @param product 変更対象のProductのインスタンス
     * @param manager? CRUD操作機能
     */
    updateById(product: Product , manager?: T): Promise<boolean>;
    /**
     * 指定された商品Idの商品を削除する
     * @param id 削除するProductIdのインスタンス
     * @param manager? CRUD操作機能
     */
    deleteById(id: ProductId , manager?: T): Promise<boolean>;
}