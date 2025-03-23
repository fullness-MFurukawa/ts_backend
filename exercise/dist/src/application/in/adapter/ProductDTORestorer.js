"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductDTORestorer = void 0;
const common_1 = require("@nestjs/common");
const Product_1 = require("../../domain/model/product/Product");
const Category_1 = require("../../domain/model/category/Category");
const CategoryId_1 = require("../../domain/model/category/CategoryId");
const CategoryName_1 = require("../../domain/model/category/CategoryName");
const ProductId_1 = require("../../domain/model/product/ProductId");
const ProductName_1 = require("../../domain/model/product/ProductName");
const ProductPrice_1 = require("../../domain/model/product/ProductPrice");
/**
 * プレゼンテーション層から受け取った商品からProductエンティティを復元する
 * @author Fullness,Inc.
 * @date 2025-03-14
 * @version 1.0.0
 */
let ProductDTORestorer = class ProductDTORestorer {
    /**
     * ProductDTOからProductエンティティを復元する
     * @param source ProductDTO
     */
    async restore(source) {
        const category = this.createCategoryIfNeeded(source.category);
        const product = source.id === null
            ? this.createNewProduct(source, category)
            : this.restoreExistingProduct(source, category);
        return product;
    }
    /**
     * categoryIdがnullでない場合、カテゴリを復元する
     * @param categoryId string | null
     * @returns Category | null
     */
    createCategoryIfNeeded(category) {
        if (category != null && category.id !== null) {
            return Category_1.Category.fromExisting(CategoryId_1.CategoryId.fromString(category.id), CategoryName_1.CategoryName.fromString('dummy'));
        }
        return null;
    }
    /**
     * 新しいProductを作成する
     * @param source ProductInput
     * @param category Category | null
     * @returns Product
     */
    createNewProduct(source, category) {
        const product = Product_1.Product.create(ProductName_1.ProductName.fromString(source.name), ProductPrice_1.ProductPrice.fromNumber(source.price));
        if (category !== null) {
            product.changeCategory(category);
        }
        return product;
    }
    /**
     * 既存のProductを復元する
     * @param source ProductDTO
     * @param category Category | null
     * @returns Product
     */
    restoreExistingProduct(source, category) {
        const product = Product_1.Product.fromExisting(ProductId_1.ProductId.fromString(source.id), ProductName_1.ProductName.fromString(source.name), ProductPrice_1.ProductPrice.fromNumber(source.price));
        if (category !== null) {
            product.changeCategory(category);
        }
        return product;
    }
    /**
     * ProductInputからProductエンティティを復元する
     * 不要なので未実装
     */
    restoreAll(sources) {
        throw new Error("Method not implemented.");
    }
};
exports.ProductDTORestorer = ProductDTORestorer;
exports.ProductDTORestorer = ProductDTORestorer = __decorate([
    (0, common_1.Injectable)()
], ProductDTORestorer);
