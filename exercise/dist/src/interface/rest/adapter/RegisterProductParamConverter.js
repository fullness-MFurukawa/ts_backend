"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterProductParamConverter = void 0;
const common_1 = require("@nestjs/common");
/**
 * RegisterProductParamからProductDTOへの変換クラス
 * @author Fullness,Inc.
 * @date 2025-03-20
 * @version 1.0.0
 */
let RegisterProductParamConverter = class RegisterProductParamConverter {
    /**
     * RegisterProductParam型の値をProductDTO型に変換する
     * @param source 変換対象
     * @returns 変換結果
     */
    async convert(source) {
        const category = {
            id: source.categoryId,
            name: 'dummy'
        };
        const product = {
            id: null,
            name: source.name,
            price: source.price,
            category: category
        };
        return product;
    }
    /**
     * 使用しないため実装
     * @param sources
     */
    convertAll(sources) {
        throw new Error("Method not implemented.");
    }
};
exports.RegisterProductParamConverter = RegisterProductParamConverter;
exports.RegisterProductParamConverter = RegisterProductParamConverter = __decorate([
    (0, common_1.Injectable)()
], RegisterProductParamConverter);
