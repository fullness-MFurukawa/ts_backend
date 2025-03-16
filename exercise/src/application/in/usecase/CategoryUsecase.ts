import { CategoryDTO } from "../dto/CategoryDTO";

/**
 * 商品カテゴリユースケースインターフェイス
 * @author Fullness,Inc.
 * @date 2025-03-15
 * @version 1.0.0
 */
export interface CategoryUsecase {
    /**
     * すべての商品カテゴリを取得する
     * @returns CategoryOutputの配列
     * @throws InternalException 内部エラー
     */
    getCategories(): Promise<CategoryDTO[]>;

    /**
     * 指定された商品カテゴリIdの商品カテゴリを取得する
     * @param id 商品カテゴリId
     * @returns CategoryDTO
     * @throws NotFoundException 商品カテゴリが存在しない
     * @throws InternalException 内部エラー
     */
    getCategoryById(id: string): Promise<CategoryDTO>;
}