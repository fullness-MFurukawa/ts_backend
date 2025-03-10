"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryModelConverter = void 0;
const common_1 = require("@nestjs/common");
const CategoryModel_1 = require("../model/CategoryModel");
/**
 * CategoryエンティティをCategoryModelに変換
 * @author Fullness,Inc.
 * @date 2025-03-10
 * @version 1.0.0
 */
let CategoryModelConverter = class CategoryModelConverter {
    /**
     * CategoryからCategoryModelに変換する
     * @param source Category
     * @returns CategoryModel
     */
    async convert(source) {
        const model = new CategoryModel_1.CategoryModel();
        model.objId = source.getId().getValue();
        model.name = source.getName().getValue();
        return model;
    }
    /**
     * Categoryの配列をCategoryModelに配列に変換する
     * @param sources Categoryの配列
     * @returns CategoryModelの配列
     */
    convertAll(sources) {
        return Promise.all(sources.map(category => this.convert(category)));
    }
};
exports.CategoryModelConverter = CategoryModelConverter;
exports.CategoryModelConverter = CategoryModelConverter = __decorate([
    (0, common_1.Injectable)()
], CategoryModelConverter);
