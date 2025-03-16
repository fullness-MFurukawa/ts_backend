"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryDTOConverter = void 0;
const common_1 = require("@nestjs/common");
const CategoryDTO_1 = require("../dto/CategoryDTO");
/**
 * CategoryエンティティクラスからCategoryDTOへの変換クラス
 * @author Fullness,Inc.
 * @date 2025-03-14
 * @version 1.0.0
 */
let CategoryDTOConverter = class CategoryDTOConverter {
    /**
     * 商品カテゴリからCategoryDTOに変換する
     * @param category Categoryエンティティ
     * @returns CategoryDTO
     */
    async convert(source) {
        let result = new CategoryDTO_1.CategoryDTO();
        result.id = source.getId().getValue();
        result.name = source.getName().getValue();
        return result;
    }
    /**
     * 複数の商品カテゴリからCategoryDTOの配列に変換する
     * @param categories Categoryエンティティの配列
     * @returns CategoryDTOの配列
     */
    async convertAll(sources) {
        return Promise.all(sources.map((category) => this.convert(category)));
    }
};
exports.CategoryDTOConverter = CategoryDTOConverter;
exports.CategoryDTOConverter = CategoryDTOConverter = __decorate([
    (0, common_1.Injectable)()
], CategoryDTOConverter);
