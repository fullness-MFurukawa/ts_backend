var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from "@nestjs/common";
import { Category } from "@/application/domain/models/category/Category.js";
import { CategoryId } from "@/application/domain/models/category/CategoryId.js";
import { CategoryName } from "@/application/domain/models/category/CategoryName.js";
/**
 * CategoryModelからCategoryエンティティを復元する
 * @author Fullness,Inc.
 * @date 2025-03-10
 * @version 1.0.0
 */
let CategoryModelRestorer = class CategoryModelRestorer {
    /**
     * CategoryModelからCategoryエンティティを復元する
     * @param source CategoryModel
     * @returns 復元されたCategoryエンティティ
     */
    async restore(source) {
        const id = CategoryId.fromString(source.objId);
        const name = CategoryName.fromString(source.name);
        return Category.fromExisting(id, name);
    }
    /**
     * CategoryModelのリストからCategoryエンティティリストを復元する
     * @param sources CategoryModelモデルの配列
     * @returns 復元されたCategoryエンティティ配列
     */
    async restoreAll(sources) {
        return Promise.all(sources.map(source => this.restore(source)));
    }
};
CategoryModelRestorer = __decorate([
    Injectable()
], CategoryModelRestorer);
export { CategoryModelRestorer };
