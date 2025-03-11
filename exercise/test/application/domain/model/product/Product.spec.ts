import { Category } from "@src/application/domain/model/category/Category";
import { CategoryName } from "@src/application/domain/model/category/CategoryName";
import { Product } from "@src/application/domain/model/product/Product";
import { ProductId } from "@src/application/domain/model/product/ProductId";
import { ProductName } from "@src/application/domain/model/product/ProductName";
import { ProductPrice } from "@src/application/domain/model/product/ProductPrice";

/**
 * Productクラスの単体テストドライバ
 * [テスト実行コマンド]
 * npx jest test/application/domain/model/product/Product.spec.ts
 * @author Fullness,Inc.
 * @date 2025-03-11
 * @version 1.0.0
 */
describe('エンティティ:Productの単体テスト', () => {
    describe('create()メソッド', () => {
        it('新しいProductインスタンスを生成する', () => {
            const name = ProductName.fromString('ボールペン');
            const price = ProductPrice.fromNumber(150);
            const product = Product.create(name, price);
            expect(product.getName().getValue()).toBe('ボールペン');
            expect(product.getPrice().toString()).toBe('ProductPrice=150');
            expect(product.getCategory()).toBeNull();
            expect(product.getId()).toBeInstanceOf(ProductId);
        });
    });
    describe('fromExisting()メソッド', () => {
        it('既存の商品データからProductインスタンスを生成する', () => {
            const id = ProductId.createNew();
            const name = ProductName.fromString('ボールペン');
            const price = ProductPrice.fromNumber(150);
            const categoryName = CategoryName.fromString('文房具');
            const category = Category.create(categoryName);
            const product = Product.fromExisting(id, name, price, category);
            expect(product.getId()).toBe(id);
            expect(product.getName()).toBe(name);
            expect(product.getPrice()).toBe(price);
            expect(product.getCategory()).toBe(category);
        });
    });
    describe('changeName()メソッド', () => {
        it('商品名を変更する', () => {
            const product = Product.create(
                ProductName.fromString('水性ボールペン(黒)'),
                ProductPrice.fromNumber(500)
            );
            const newName = ProductName.fromString('水性ボールペン(赤)');
            product.changeName(newName);
            expect(product.getName().getValue()).toBe('水性ボールペン(赤)');
        });
    });
    describe('changePrice()メソッド', () => {
        it('商品単価を変更する', () => {
            const product = Product.create(
                ProductName.fromString('水性ボールペン(黒)'),
                ProductPrice.fromNumber(150)
            );
            const newPrice = ProductPrice.fromNumber(160);
            product.changePrice(newPrice);
            expect(product.getPrice().toString()).toBe('ProductPrice=160');
        });
    });
    describe('changeCategory()メソッド', () => {
        it('カテゴリを設定する', () => {
            const product = Product.create(
                ProductName.fromString('水性ボールペン(黒)'),
                ProductPrice.fromNumber(150)
            );
            const category = Category.create(CategoryName.fromString('文房具'));
            product.changeCategory(category);
            expect(product.getCategory()).toBe(category);
        });
        it('カテゴリを解除する', () => {
            const product = Product.create(
                ProductName.fromString('水性ボールペン(黒)'),
                ProductPrice.fromNumber(150)
            );
            const category = Category.create(CategoryName.fromString('文房具'));
            product.changeCategory(category);
            product.changeCategory(null);
            expect(product.getCategory()).toBeNull();
        });
    });
    describe('equals()メソッド', () => {
        it('同じIdを持つ商品が等しいと判定される', () => {
            const id = ProductId.createNew();
            const name1 = ProductName.fromString('水性ボールペン(黒)');
            const name2 = ProductName.fromString('水性ボールペン(黒)');
            const price1 = ProductPrice.fromNumber(100);
            const price2 = ProductPrice.fromNumber(200);
            const product1 = Product.fromExisting(id, name1, price1);
            const product2 = Product.fromExisting(id, name2, price2);
            expect(product1.equals(product2)).toBe(true);
        });
        it('異なるIdを持つ商品が等しくないと判定される', () => {
            const product1 = Product.create(
                ProductName.fromString('水性ボールペン(黒)'),
                ProductPrice.fromNumber(100)
            );
            const product2 = Product.create(
                ProductName.fromString('水性ボールペン(黒)'),
                ProductPrice.fromNumber(200)
            );
            expect(product1.equals(product2)).toBe(false);
        });
    });
    describe('toString()メソッド', () => {
        it('商品情報の文字列を返す', () => {
            const product = Product.create(
                ProductName.fromString('水性ボールペン(黒)'),
                ProductPrice.fromNumber(150)
            );
            const result = product.toString();
            expect(result).toContain('Product [id=');
            expect(result).toContain('name=ProductName=水性ボールペン(黒)');
            expect(result).toContain('price=ProductPrice=150');
        });
    });
});