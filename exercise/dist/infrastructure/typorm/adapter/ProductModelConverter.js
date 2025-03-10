var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Inject, Injectable } from "@nestjs/common";
import { ProductModel } from "../model/ProductModel.js";
import { CategoryModelConverter } from "./CategoryModelConverter.js";
/**
 * ProductエンティティをProductModelへ変換する
 * @author Fullness,Inc.
 * @date 2025-03-10
 * @version 1.0.0
 */
let ProductModelConverter = class ProductModelConverter {
    /**
     * コンストラクタ
     * @param categoryConverter CategoryエンティティをCategoryModelに変換
     */
    constructor(categoryConverter) {
        this.categoryConverter = categoryConverter;
    }
    /**
     * ProductからProductModelに変換する
     * @param source Product
     * @returns ProductModel
     */
    async convert(source) {
        const model = new ProductModel();
        model.objId = source.getId().getValue();
        model.name = source.getName().getValue();
        model.price = source.getPrice().getValue();
        if (source.getCategory()) {
            model.category =
                await this.categoryConverter.convert(source.getCategory());
        }
        return model;
    }
    /**
     * Productの配列をProductModelに配列に変換する
     * @param sources Productの配列
     * @returns ProductModelの配列
     */
    async convertAll(sources) {
        return Promise.all(sources.map(product => this.convert(product)));
    }
};
ProductModelConverter = __decorate([
    Injectable(),
    __param(0, Inject('CategoryModelConverter')),
    __metadata("design:paramtypes", [CategoryModelConverter])
], ProductModelConverter);
export { ProductModelConverter };
