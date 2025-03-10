var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { CategoryModel } from "../model/CategoryModel.js";
import { Injectable } from "@nestjs/common";
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
    convertAll(sources) {
        return Promise.all(sources.map(category => this.convert(category)));
    }
};
CategoryModelConverter = __decorate([
    Injectable()
], CategoryModelConverter);
export { CategoryModelConverter };
