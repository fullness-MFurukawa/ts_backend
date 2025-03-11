"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@nestjs/testing/test");
const Category_1 = require("../../../../src/application/domain/model/category/Category");
const CategoryId_1 = require("../../../../src/application/domain/model/category/CategoryId");
const CategoryName_1 = require("../../../../src/application/domain/model/category/CategoryName");
const Product_1 = require("../../../../src/application/domain/model/product/Product");
const ProductId_1 = require("../../../../src/application/domain/model/product/ProductId");
const ProductName_1 = require("../../../../src/application/domain/model/product/ProductName");
const ProductPrice_1 = require("../../../../src/application/domain/model/product/ProductPrice");
const AppModule_1 = require("../../../../src/AppModule");
const ProductModel_1 = require("../../../../src/infrastructure/typorm/model/ProductModel");
/**
 * ProductエンティティからProductModelへの変換　単体テストドライバ
 * [テスト実行コマンド]
 * npx jest test/infrastructure/typeorm/adapter/ProductModelConverter.spec.ts
 * @author Fullness,Inc.
 * @date 2025-03-11
 * @version 1.0.0
 */
describe('ProductModelConverterの単体テスト', () => {
    let app; // NestJSアプリケーションインスタンス
    let converter; // テストターゲット
    /**
     * すべてのテストの前処理
     * - AppModuleを基にテスト用のNestJSアプリケーションを作成。
     * - テスト対象のProductModelConverterをDIコンテナから取得
     */
    beforeAll(async () => {
        const moduleRef = await test_1.Test.createTestingModule({
            imports: [AppModule_1.AppModule],
        }).compile();
        app = moduleRef.createNestApplication();
        await app.init();
        converter = app.get('ProductModelConverter');
    });
    /**
     * すべてのテストの後処理
     */
    afterAll(async () => {
        if (app) {
            await app.close();
        }
    });
    describe('convert()メソッド', () => {
        it("ProductをProductModelに変換できる", async () => {
            const category = Category_1.Category.fromExisting(CategoryId_1.CategoryId.fromString('b1524011-b6af-417e-8bf2-f449dd58b5c0'), CategoryName_1.CategoryName.fromString('文房具'));
            const product = Product_1.Product.fromExisting(ProductId_1.ProductId.fromString('ac413f22-0cf1-490a-9635-7e9ca810e544'), ProductName_1.ProductName.fromString('水性ボールペン(黒)'), ProductPrice_1.ProductPrice.fromNumber(150), category);
            const model = await converter.convert(product);
            expect(model).toBeInstanceOf(ProductModel_1.ProductModel);
            expect(model.objId).toBe(product.getId().getValue());
            expect(model.name).toBe(product.getName().getValue());
            expect(model.price).toBe(product.getPrice().getValue());
            expect(model.category.objId)
                .toBe(product.getCategory().getId().getValue());
            expect(model.category.name)
                .toBe(product.getCategory().getName().getValue());
        });
    });
    describe('convertAll()メソッド', () => {
        it("Productの配列をProductModelの配列に変換できる", async () => {
            const category = Category_1.Category.fromExisting(CategoryId_1.CategoryId.fromString('b1524011-b6af-417e-8bf2-f449dd58b5c0'), CategoryName_1.CategoryName.fromString('文房具'));
            const products = [
                Product_1.Product.fromExisting(ProductId_1.ProductId.fromString('ac413f22-0cf1-490a-9635-7e9ca810e544'), ProductName_1.ProductName.fromString('水性ボールペン(黒)'), ProductPrice_1.ProductPrice.fromNumber(120), category),
                Product_1.Product.fromExisting(ProductId_1.ProductId.fromString('8f81a72a-58ef-422b-b472-d982e8665292'), ProductName_1.ProductName.fromString('水性ボールペン(赤)'), ProductPrice_1.ProductPrice.fromNumber(120), category),
            ];
            const models = await converter.convertAll(products);
            expect(models).toHaveLength(products.length);
            models.forEach((model, index) => {
                expect(model).toBeInstanceOf(ProductModel_1.ProductModel);
                expect(model.objId).toBe(products[index].getId().getValue());
                expect(model.name).toBe(products[index].getName().getValue());
                expect(model.price).toBe(products[index].getPrice().getValue());
                expect(model.category.objId)
                    .toBe(products[index].getCategory().getId().getValue());
                expect(model.category.name)
                    .toBe(products[index].getCategory().getName().getValue());
            });
        });
    });
});
