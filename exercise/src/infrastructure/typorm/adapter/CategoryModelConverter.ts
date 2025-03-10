import { Injectable } from "@nestjs/common";
import { Category } from "@src/application/domain/model/category/Category";
import { Converter } from "@src/shared/adapter/Converter";
import { CategoryModel } from "../model/CategoryModel";

/**
 * CategoryエンティティをCategoryModelに変換
 * @author Fullness,Inc.
 * @date 2025-03-10
 * @version 1.0.0
 */
@Injectable()
export class CategoryModelConverter implements Converter<Category , CategoryModel> {
    /**
     * CategoryからCategoryModelに変換する
     * @param source Category
     * @returns CategoryModel
     */
    async convert(source: Category): Promise<CategoryModel> {
        const model = new CategoryModel();
        model.objId = source.getId().getValue();
        model.name = source.getName().getValue();
        return model;
    }
    /**
     * Categoryの配列をCategoryModelに配列に変換する
     * @param sources Categoryの配列
     * @returns CategoryModelの配列
     */
    convertAll(sources: Category[]): Promise<CategoryModel[]> {
        return Promise.all(sources.map(category => this.convert(category)));
    }
}