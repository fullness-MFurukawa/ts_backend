"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModelConverter = void 0;
const common_1 = require("@nestjs/common");
const ProductModel_1 = require("../model/ProductModel");
const CategoryModelConverter_1 = require("./CategoryModelConverter");
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
        const model = new ProductModel_1.ProductModel();
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
exports.ProductModelConverter = ProductModelConverter;
exports.ProductModelConverter = ProductModelConverter = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('CategoryModelConverter')),
    __metadata("design:paramtypes", [CategoryModelConverter_1.CategoryModelConverter])
], ProductModelConverter);
