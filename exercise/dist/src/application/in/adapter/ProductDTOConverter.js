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
exports.ProductDTOConverter = void 0;
const common_1 = require("@nestjs/common");
const ProductDTO_1 = require("../dto/ProductDTO");
/**
 * ProductエンティティからProductDTOへの変換クラス
 * @author Fullness,Inc.
 * @date 2025-03-14
 * @version 1.0.0
 */
let ProductDTOConverter = class ProductDTOConverter {
    /**
     * コンストラクタ
     * @param categoryConverter CategoryOutputへ変換する
     */
    constructor(categoryConverter) {
        this.categoryConverter = categoryConverter;
    }
    /**
     * 商品からProductDTOに変換する
     * @param product Productエンティティ
     * @returns ProductDTO
     */
    async convert(source) {
        let result = new ProductDTO_1.ProductDTO();
        result.id = source.getId().getValue();
        result.name = source.getName().getValue();
        result.price = source.getPrice().getValue();
        if (source.getCategory() !== null) {
            result.category =
                await this.categoryConverter.convert(source.getCategory());
        }
        return result;
    }
    /**
     * 複数の商品からProductDTOの配列に変換する
     * @param products Productエンティティの配列
     * @returns ProductDTOの配列
     */
    async convertAll(sources) {
        return Promise.all(sources.map((product) => this.convert(product)));
    }
};
exports.ProductDTOConverter = ProductDTOConverter;
exports.ProductDTOConverter = ProductDTOConverter = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('CategoryDTOConverter')),
    __metadata("design:paramtypes", [Object])
], ProductDTOConverter);
