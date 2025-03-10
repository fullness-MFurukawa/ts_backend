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
exports.ProductModelRestorer = void 0;
const common_1 = require("@nestjs/common");
const Product_1 = require("../../../application/domain/model/product/Product");
const CategoryModelRestorer_1 = require("./CategoryModelRestorer");
const ProductId_1 = require("../../../application/domain/model/product/ProductId");
const ProductName_1 = require("../../../application/domain/model/product/ProductName");
const ProductPrice_1 = require("../../../application/domain/model/product/ProductPrice");
/**
 * ProductModelからProductエンティティを復元する
 * @author Fullness,Inc.
 * @date 2025-03-10
 * @version 1.0.0
 */
let ProductModelRestorer = class ProductModelRestorer {
    /**
     * コンストラクタ
     * @param categoryRestorer CategoryModelからCategoryを復元する
     */
    constructor(categoryRestorer) {
        this.categoryRestorer = categoryRestorer;
    }
    /**
     * ProductModelからProductエンティティを復元する
     * @param source ProductModel
     * @returns 復元されたProductエンティティ
     */
    async restore(source) {
        const id = ProductId_1.ProductId.fromString(source.objId);
        const name = ProductName_1.ProductName.fromString(source.name);
        const price = ProductPrice_1.ProductPrice.fromNumber(source.price);
        const category = source.category ?
            await this.categoryRestorer.restore(source.category) : null;
        return Product_1.Product.fromExisting(id, name, price, category);
    }
    /**
     * ProductModelのリストからProductエンティティのリストを復元する
     * @param sources ProductModelモデルの配列
     * @returns 復元されたProductエンティティ配列
     */
    async restoreAll(sources) {
        return Promise.all(sources.map(source => this.restore(source)));
    }
};
exports.ProductModelRestorer = ProductModelRestorer;
exports.ProductModelRestorer = ProductModelRestorer = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('CategoryModelRestorer')),
    __metadata("design:paramtypes", [CategoryModelRestorer_1.CategoryModelRestorer])
], ProductModelRestorer);
