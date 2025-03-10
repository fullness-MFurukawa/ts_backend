import { Injectable } from "@nestjs/common";
import { Restorer } from "@src/shared/adapter/Restorer";
import { CategoryModel } from "../model/CategoryModel";
import { Category } from "@src/application/domain/model/category/Category";
import { CategoryId } from "@src/application/domain/model/category/CategoryId";
import { CategoryName } from "@src/application/domain/model/category/CategoryName";


/**
 * CategoryModelからCategoryエンティティを復元する
 * @author Fullness,Inc.
 * @date 2025-03-10
 * @version 1.0.0
 */
@Injectable()
export class CategoryModelRestorer implements Restorer<CategoryModel , Category>{
    /**
     * CategoryModelからCategoryエンティティを復元する
     * @param source CategoryModel
     * @returns 復元されたCategoryエンティティ
     */
    async restore(source: CategoryModel): Promise<Category> {
        const id = CategoryId.fromString(source.objId);
        const name = CategoryName.fromString(source.name);
        return Category.fromExisting(id, name);
    }
    /**
     * CategoryModelのリストからCategoryエンティティリストを復元する
     * @param sources CategoryModelモデルの配列
     * @returns 復元されたCategoryエンティティ配列
     */
    async restoreAll(sources: CategoryModel[]): Promise<Category[]> {
        return Promise.all(sources.map(source => this.restore(source)));
    }
}