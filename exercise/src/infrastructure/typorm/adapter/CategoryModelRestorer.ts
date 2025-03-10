import { Restorer } from "@/shared/adapter/Restorer.js";
import { Injectable } from "@nestjs/common";
import { CategoryModel } from "../model/CategoryModel.js";
import { Category } from "@/application/domain/models/category/Category.js";
import { CategoryId } from "@/application/domain/models/category/CategoryId.js";
import { CategoryName } from "@/application/domain/models/category/CategoryName.js";

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