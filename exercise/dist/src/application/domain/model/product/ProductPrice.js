"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductPrice = void 0;
const DomainException_1 = require("../../exception/DomainException");
/**
 * 商品単価を表す値オブジェクト
 * @author Fullness,Inc.
 * @date 2025-03-10
 * @version 1.0.0
 */
class ProductPrice {
    /**
     * 商品単価のコンストラクタ
     * @param price 商品の単価（必須、整数、50以上10000以下）
     */
    constructor(price) {
        this.validateProductPrice(price);
        this.value = price;
    }
    /**
     * 既存の商品単価からProductPriceのインスタンスを生成
     * @param price 既存の商品単価
     * @returns ProductPriceインスタンス
     */
    static fromNumber(price) {
        // 引数の商品名を検証し、インスタンス化
        return new ProductPrice(price);
    }
    validateProductPrice(value) {
        if (value == null) {
            throw new DomainException_1.DomainException('商品単価は必須です。');
        }
        if (!Number.isInteger(value)) {
            throw new DomainException_1.DomainException('商品単価は整数でなければなりません。');
        }
        if (value < ProductPrice.MIN_PRICE || value > ProductPrice.MAX_PRICE) {
            throw new DomainException_1.DomainException(`商品単価は${ProductPrice.MIN_PRICE}以上${ProductPrice.MAX_PRICE}以下でなければなりません。`);
        }
    }
    /**
    * このProductPriceと他のProductPriceが等しいかどうかを判定する
    * @param other 比較対象のProductPrice
    * @returns 他のProductPriceと等しい場合はtrue、それ以外の場合はfalse
    */
    equals(other) {
        return other instanceof ProductPrice && this.value === other.value;
    }
    /**
     * 商品単価の数値を取得する
     * @returns 商品単価の値
     */
    getValue() {
        return this.value;
    }
    /**
     * 商品単価の文字列を返す
     * @returns 商品単価の値
     */
    toString() {
        return `ProductPrice=${this.value}`;
    }
}
exports.ProductPrice = ProductPrice;
/**
 * 商品単価の有効性を検証
 * @param value 検証対象の商品単価
 * @throws DomainError 商品単価が不正な場合にスロー
 */
ProductPrice.MIN_PRICE = 50;
ProductPrice.MAX_PRICE = 10000;
