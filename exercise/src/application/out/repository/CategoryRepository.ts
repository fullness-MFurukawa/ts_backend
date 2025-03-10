import { Category } from "@src/application/domain/model/category/Category";
import { CategoryId } from "@src/application/domain/model/category/CategoryId";

/**
 * Categoryエンティティのリポジトリインターフェイス
 * @author Fullness,Inc.
 * @date 2025-03-10
 * @version 1.0.0
 */
export interface CategoryRepository<T> {
    /**
     * Idで商品カテゴリを取得する
     * @param id 取得するCategoryのCategoryId
     * @param manager? CRUD操作機能
     * @returns Categoryインスタンス、存在しない場合はnull
     */
    findById(id: CategoryId , manager?: T): Promise<Category | null>;

    /**
     * すべての商品カテゴリを取得する
     * @param manager? CRUD操作機能
     * @returns すべてのCategoryインスタンスの配列
     */
    findAll(manager?: T): Promise<Category[]>;
}