"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Category_1 = require("../../../../../src/application/domain/model/category/Category");
const CategoryId_1 = require("../../../../../src/application/domain/model/category/CategoryId");
const CategoryName_1 = require("../../../../../src/application/domain/model/category/CategoryName");
/**
 * Categoryクラスの単体テストドライバ
 * [テスト実行コマンド]
 * npx jest test/application/domain/model/category/Category.spec.ts
 * @author Fullness,Inc.
 * @date 2025-03-11
 * @version 1.0.0
 */
describe('エンティティ:Categoryの単体テスト', () => {
    describe('create()メソッド', () => {
        it('新しいCategoryインスタンスを生成する', () => {
            const name = CategoryName_1.CategoryName.fromString('文房具');
            const category = Category_1.Category.create(name);
            expect(category.getName().getValue()).toBe('文房具');
            expect(category.getId()).toBeInstanceOf(CategoryId_1.CategoryId);
        });
    });
    describe('fromExisting()メソッド', () => {
        it('既存のデータからCategoryインスタンスを生成する', () => {
            const id = CategoryId_1.CategoryId.createNew();
            const name = CategoryName_1.CategoryName.fromString('書籍');
            const category = Category_1.Category.fromExisting(id, name);
            expect(category.getId()).toBe(id);
            expect(category.getName()).toBe(name);
        });
    });
    describe('changeName()メソッド', () => {
        it('商品カテゴリ名を変更する', () => {
            const name = CategoryName_1.CategoryName.fromString('文房具');
            const category = Category_1.Category.create(name);
            const newName = CategoryName_1.CategoryName.fromString('PC周辺機器');
            category.changeName(newName);
            expect(category.getName().getValue()).toBe('PC周辺機器');
        });
    });
    describe('equals()メソッド', () => {
        it('同じIdを持つ商品カテゴリが等しいと判定される', () => {
            const id = CategoryId_1.CategoryId.createNew();
            const name1 = CategoryName_1.CategoryName.fromString('文房具');
            const name2 = CategoryName_1.CategoryName.fromString('文房具');
            const category1 = Category_1.Category.fromExisting(id, name1);
            const category2 = Category_1.Category.fromExisting(id, name2);
            expect(category1.equals(category2)).toBe(true);
        });
        it('異なるIdを持つ商品カテゴリが等しくないと判定される', () => {
            const category1 = Category_1.Category.create(CategoryName_1.CategoryName.fromString('文房具'));
            const category2 = Category_1.Category.create(CategoryName_1.CategoryName.fromString('パソコン'));
            expect(category1.equals(category2)).toBe(false);
        });
    });
    describe('toString()メソッド', () => {
        it('商品カテゴリ情報の文字列を返す', () => {
            const categoryName = CategoryName_1.CategoryName.fromString('Electronics');
            const category = Category_1.Category.create(categoryName);
            const result = category.toString();
            expect(result).toContain('Category [id=');
            expect(result).toContain('name=CategoryName=Electronics');
        });
    });
});
