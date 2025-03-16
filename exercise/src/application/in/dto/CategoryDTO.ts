/**
 * プレゼンテーション層へ返却する商品カテゴリ
 * @author Fullness,Inc.
 * @date 2025-03-14
 * @version 1.0.0
 */
export class CategoryDTO {
    id:     string | null;  // 商品カテゴリId(不要な場合null)
    name:   string;         // 商品カテゴリ名
}