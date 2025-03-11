"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DomainException_1 = require("../../../../../src/application/domain/exception/DomainException");
const ProductName_1 = require("../../../../../src/application/domain/model/product/ProductName");
/**
 * ProductNameクラスの単体テストドライバ
 * [テスト実行コマンド]
 * npx jest test/application/domain/model/product/ProductName.spec.ts
 * @author Fullness,Inc.
 * @date 2025-03-11
 * @version 1.0.0
 */
describe('値オブジェクト:ProductNameの単体テスト', () => {
    describe('fromString()メソッド', () => {
        it('有効な商品名からProductNameインスタンスを生成する', () => {
            const productName = ProductName_1.ProductName.fromString('Valid Product Name');
            // 値が正しいことを検証
            expect(productName.getValue()).toBe('Valid Product Name');
        });
        it('空文字列を指定した場合、DomainErrorをスローする', () => {
            expect(() => { ProductName_1.ProductName.fromString(''); })
                .toThrow(DomainException_1.DomainException);
            expect(() => { ProductName_1.ProductName.fromString(''); })
                .toThrow('商品名は必須です。');
        });
        it('30文字を超える商品名を指定した場合、DomainErrorをスローする', () => {
            const longName = 'A'.repeat(31); // 31文字の文字列
            expect(() => { ProductName_1.ProductName.fromString(longName); })
                .toThrow(DomainException_1.DomainException);
            expect(() => { ProductName_1.ProductName.fromString(longName); })
                .toThrow('商品名は30文字以内でなければなりません。');
        });
    });
    describe('equals()メソッド', () => {
        it('同じ値を持つProductNameインスタンスを等しいと判定する', () => {
            const productName1 = ProductName_1.ProductName.fromString('Product Name');
            const productName2 = ProductName_1.ProductName.fromString('Product Name');
            expect(productName1.equals(productName2)).toBe(true);
        });
        it('異なる値を持つProductNameインスタンスを等しくないと判定する', () => {
            const productName1 = ProductName_1.ProductName.fromString('Product Name 1');
            const productName2 = ProductName_1.ProductName.fromString('Product Name 2');
            expect(productName1.equals(productName2)).toBe(false);
        });
        it('nullやundefinedと比較した場合、falseを返す', () => {
            const productName = ProductName_1.ProductName.fromString('Product Name');
            expect(productName.equals(null)).toBe(false);
            expect(productName.equals(undefined)).toBe(false);
        });
    });
    describe('toString()メソッド', () => {
        it('ProductNameインスタンスの文字列表現を返す', () => {
            const productName = ProductName_1.ProductName.fromString('Product Name');
            expect(productName.toString()).toBe('ProductName=Product Name');
        });
    });
});
