import { CategoryDTO } from "./CategoryDTO";

/**
 * プレゼンテーション層へ返却する商品
 * @author Fullness,Inc.
 * @date 2025-03-14
 * @version 1.0.0
 */
export class ProductDTO {
    id:         string;         // 商品Id
    name:       string;         // 商品名
    price:      number;         // 商品単価
    category:   CategoryDTO;    // 商品カテゴリ
}