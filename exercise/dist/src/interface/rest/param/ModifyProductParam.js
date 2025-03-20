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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModifyProductParam = void 0;
const class_validator_1 = require("class-validator");
const IsNumberCustom_1 = require("./IsNumberCustom");
/**
 * 商品変更パラメータ
 * @author Fullness,Inc.
 * @date 2025-03-20
 * @version 1.0.0
 */
class ModifyProductParam {
}
exports.ModifyProductParam = ModifyProductParam;
__decorate([
    (0, class_validator_1.IsString)({ message: '商品Idは、文字列である必要があります。' })
    // 空白でないことを検証
    ,
    (0, class_validator_1.IsNotEmpty)({ message: '商品Idは、必須です。' })
    // UUIDでることを検証する
    ,
    (0, class_validator_1.IsUUID)(4, { message: '商品Idは、UUIDです。' })
    // 最大30文字以内であることを検証
    ,
    (0, class_validator_1.Length)(36, 36, { message: '商品Idは、36文字にしてください。' }),
    __metadata("design:type", String)
], ModifyProductParam.prototype, "productId", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: '商品名は、文字列である必要があります。' })
    // 空白でないことを検証
    ,
    (0, class_validator_1.IsNotEmpty)({ message: '商品名は、必須です。' })
    // 最大30文字以内であることを検証
    ,
    (0, class_validator_1.MaxLength)(30, { message: '商品名は、30文字以内にしてください。' }),
    __metadata("design:type", String)
], ModifyProductParam.prototype, "name", void 0);
__decorate([
    (0, IsNumberCustom_1.IsNumberCustom)({ message: '商品単価は数値である必要があります。' })
    // 空白でないことを検証
    ,
    (0, class_validator_1.IsNotEmpty)({ message: '商品単価は、必須です。' })
    // 最小金額以内であることを検証する
    ,
    (0, class_validator_1.Min)(50, { message: '商品単価は50以上である必要があります。' })
    // 最大金額であることを検証する
    ,
    (0, class_validator_1.Max)(10000, { message: '商品単価は10000以下である必要があります。' }),
    __metadata("design:type", Number)
], ModifyProductParam.prototype, "price", void 0);
