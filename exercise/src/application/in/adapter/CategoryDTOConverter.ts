import { Injectable } from "@nestjs/common";
import { Category } from "@src/application/domain/model/category/Category";
import { Converter } from "@src/shared/adapter/Converter";
import { CategoryDTO } from "../dto/CategoryDTO";

/**
 * CategoryエンティティクラスからCategoryDTOへの変換クラス
 * @author Fullness,Inc.
 * @date 2025-03-14
 * @version 1.0.0
 */
@Injectable()
export class CategoryDTOConverter implements Converter<Category , CategoryDTO> {
    /**
     * 商品カテゴリからCategoryDTOに変換する
     * @param category Categoryエンティティ
     * @returns CategoryDTO
     */
    async convert(source: Category): Promise<CategoryDTO> {
        let result  = new CategoryDTO();
        result.id   = source.getId().getValue();
        result.name = source.getName().getValue();
        return result;
    }
    /**
     * 複数の商品カテゴリからCategoryDTOの配列に変換する
     * @param categories Categoryエンティティの配列
     * @returns CategoryDTOの配列
     */
    async convertAll(sources: Category[]): Promise<CategoryDTO[]> {
        return Promise.all(sources.map((category) => this.convert(category)));
    }
}