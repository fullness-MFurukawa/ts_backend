"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryModelRestorer = void 0;
const common_1 = require("@nestjs/common");
const Category_1 = require("../../../application/domain/model/category/Category");
const CategoryId_1 = require("../../../application/domain/model/category/CategoryId");
const CategoryName_1 = require("../../../application/domain/model/category/CategoryName");
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
        const id = CategoryId_1.CategoryId.fromString(source.objId);
        const name = CategoryName_1.CategoryName.fromString(source.name);
        return Category_1.Category.fromExisting(id, name);
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
exports.CategoryModelRestorer = CategoryModelRestorer;
exports.CategoryModelRestorer = CategoryModelRestorer = __decorate([
    (0, common_1.Injectable)()
], CategoryModelRestorer);
