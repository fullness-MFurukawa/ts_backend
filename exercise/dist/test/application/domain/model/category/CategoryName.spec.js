"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DomainException_1 = require("../../../../../src/application/domain/exception/DomainException");
const CategoryName_1 = require("../../../../../src/application/domain/model/category/CategoryName");
/**
 * CategoryNameクラスの単体テストドライバ
 * [テスト実行コマンド]
 * npx jest test/application/domain/model/category/CategoryName.spec.ts
 * @author Fullness,Inc.
 * @date 2025-03-11
 * @version 1.0.0
 */
describe('値オブジェクト: CategoryName', () => {
    describe('fromString()メソッド', () => {
        it('有効なカテゴリ名を使用してCategoryNameインスタンスを生成する', () => {
            const validName = '電子機器';
            const categoryName = CategoryName_1.CategoryName.fromString(validName);
            expect(categoryName.getValue()).toBe(validName);
        });
        it('空文字列を指定した場合、DomainErrorをスローする', () => {
            expect(() => { CategoryName_1.CategoryName.fromString(''); })
                .toThrow(DomainException_1.DomainException);
            expect(() => { CategoryName_1.CategoryName.fromString(''); })
                .toThrow('商品カテゴリ名は必須です。');
        });
        it('カテゴリ名が空白のみの場合、DomainErrorをスローする', () => {
            expect(() => { CategoryName_1.CategoryName.fromString('   '); })
                .toThrow(DomainException_1.DomainException);
            expect(() => { CategoryName_1.CategoryName.fromString('   '); })
                .toThrow('商品カテゴリ名は必須です。');
        });
        it('カテゴリ名が20文字を超える場合、DomainErrorをスローする', () => {
            const longName = '非常に長いカテゴリ名で20文字を超えています。';
            expect(() => { CategoryName_1.CategoryName.fromString(longName); })
                .toThrow(DomainException_1.DomainException);
            expect(() => { CategoryName_1.CategoryName.fromString(longName); })
                .toThrow('商品カテゴリ名は20文字以内でなければなりません。');
        });
    });
    describe('equals()メソッド', () => {
        it('同じ値を持つCategoryNameインスタンスを等しいと判定する', () => {
            const name1 = CategoryName_1.CategoryName.fromString('食品');
            const name2 = CategoryName_1.CategoryName.fromString('食品');
            expect(name1.equals(name2)).toBe(true);
        });
        it('異なる値を持つCategoryNameインスタンスを等しくないと判定する', () => {
            const name1 = CategoryName_1.CategoryName.fromString('食品');
            const name2 = CategoryName_1.CategoryName.fromString('電子機器');
            expect(name1.equals(name2)).toBe(false);
        });
        it('nullやundefinedと比較した場合、falseを返す', () => {
            const name = CategoryName_1.CategoryName.fromString('食品');
            expect(name.equals(null)).toBe(false);
            expect(name.equals(undefined)).toBe(false);
        });
    });
    describe('toString()メソッド', () => {
        it('CategoryNameインスタンスの文字列表現を返す', () => {
            const name = '食品';
            const categoryName = CategoryName_1.CategoryName.fromString(name);
            expect(categoryName.toString()).toBe(`CategoryName=${name}`);
        });
    });
});
