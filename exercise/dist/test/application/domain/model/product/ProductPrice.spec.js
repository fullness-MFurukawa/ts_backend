"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DomainException_1 = require("../../../../../src/application/domain/exception/DomainException");
const ProductPrice_1 = require("../../../../../src/application/domain/model/product/ProductPrice");
/**
 * ProductPriceクラスの単体テストドライバ
 * [テスト実行コマンド]
 * npx jest test/application/domain/model/product/ProductPrice.spec.ts
 * @author Fullness,Inc.
 * @date 2025-03-10
 * @version 1.0.0
 */
describe('値オブジェクト:ProductPriceの単体テスト', () => {
    describe('fromNumber()メソッド', () => {
        it('有効な商品単価からProductPriceインスタンスを生成する', () => {
            const productPrice = ProductPrice_1.ProductPrice.fromNumber(500);
            expect(productPrice.toString()).toBe('ProductPrice=500');
        });
        it('商品単価がnullの場合、DomainErrorをスローする', () => {
            expect(() => { ProductPrice_1.ProductPrice.fromNumber(null); })
                .toThrow(DomainException_1.DomainException);
            expect(() => { ProductPrice_1.ProductPrice.fromNumber(null); })
                .toThrow('商品単価は必須です。');
        });
        it('商品単価が整数でない場合、DomainErrorをスローする', () => {
            expect(() => { ProductPrice_1.ProductPrice.fromNumber(99.99); })
                .toThrow(DomainException_1.DomainException);
            expect(() => { ProductPrice_1.ProductPrice.fromNumber(99.99); })
                .toThrow('商品単価は整数でなければなりません。');
        });
        it('商品単価が50未満の場合、DomainErrorをスローする', () => {
            expect(() => { ProductPrice_1.ProductPrice.fromNumber(49); })
                .toThrow(DomainException_1.DomainException);
            expect(() => { ProductPrice_1.ProductPrice.fromNumber(49); })
                .toThrow('商品単価は50以上10000以下でなければなりません。');
        });
        it('商品単価が10000を超える場合、DomainErrorをスローする', () => {
            expect(() => { ProductPrice_1.ProductPrice.fromNumber(10001); })
                .toThrow(DomainException_1.DomainException);
            expect(() => { ProductPrice_1.ProductPrice.fromNumber(10001); })
                .toThrow('商品単価は50以上10000以下でなければなりません。');
        });
    });
    describe('equals()メソッド', () => {
        it('同じ値を持つProductPriceインスタンスが等しいと判断される', () => {
            const price1 = ProductPrice_1.ProductPrice.fromNumber(100);
            const price2 = ProductPrice_1.ProductPrice.fromNumber(100);
            expect(price1.equals(price2)).toBe(true);
        });
        it('異なる値を持つProductPriceインスタンスが等しくないと判断される', () => {
            const price1 = ProductPrice_1.ProductPrice.fromNumber(100);
            const price2 = ProductPrice_1.ProductPrice.fromNumber(200);
            expect(price1.equals(price2)).toBe(false);
        });
    });
    describe('toString()メソッド', () => {
        it('商品単価の文字列表現を返す', () => {
            const productPrice = ProductPrice_1.ProductPrice.fromNumber(500);
            expect(productPrice.toString()).toBe('ProductPrice=500');
        });
    });
});
