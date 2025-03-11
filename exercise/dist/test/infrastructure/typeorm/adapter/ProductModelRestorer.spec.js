"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@nestjs/testing/test");
const Product_1 = require("../../../../src/application/domain/model/product/Product");
const AppModule_1 = require("../../../../src/AppModule");
const CategoryModel_1 = require("../../../../src/infrastructure/typorm/model/CategoryModel");
const ProductModel_1 = require("../../../../src/infrastructure/typorm/model/ProductModel");
/**
 * ProductModelからProductエンティティを復元 単体テストドライバ
 * [テスト実行コマンド]
 * npx jest test/infrastructure/typeorm/adapter/ProductModelRestorer.spec.ts
 * @author Fullness,Inc.
 * @date 2025-03-11
 * @version 1.0.0
 */
describe('ProductModelRestorerの単体テスト', () => {
    let app; // NestJSアプリケーションインスタンス
    let restorer; // テストターゲット
    /**
     * すべてのテストの前処理
     * - AppModuleを基にテスト用のNestJSアプリケーションを作成。
     * - テスト対象のProductModelRestorerをDIコンテナから取得
     */
    beforeAll(async () => {
        const moduleRef = await test_1.Test.createTestingModule({
            imports: [AppModule_1.AppModule],
        }).compile();
        app = moduleRef.createNestApplication();
        await app.init();
        restorer = app.get('ProductModelRestorer');
    });
    /**
     * すべてのテストの後処理
     */
    afterAll(async () => {
        if (app) {
            await app.close();
        }
    });
    describe('restorer()メソッド', () => {
        it("ProductModelからProductを復元できる", async () => {
            const cmodel = new CategoryModel_1.CategoryModel();
            cmodel.objId = 'b1524011-b6af-417e-8bf2-f449dd58b5c0';
            cmodel.name = '文房具';
            const model = new ProductModel_1.ProductModel();
            model.objId = 'ac413f22-0cf1-490a-9635-7e9ca810e544';
            model.name = '水性ボールペン(黒)';
            model.price = 150;
            model.category = cmodel;
            const product = await restorer.restore(model);
            expect(product).toBeInstanceOf(Product_1.Product);
            expect(product.getId().getValue()).toBe(model.objId);
            expect(product.getName().getValue()).toBe(model.name);
            expect(product.getPrice().getValue()).toBe(model.price);
            expect(product.getCategory()?.getId().getValue()).toBe(model.category.objId);
            expect(product.getCategory()?.getName().getValue()).toBe(model.category.name);
        });
    });
    describe('restorerAll()メソッド', () => {
        it("ProductModelの配列からProductの配列を復元できる", async () => {
            const cmodel = new CategoryModel_1.CategoryModel();
            cmodel.objId = 'b1524011-b6af-417e-8bf2-f449dd58b5c0';
            cmodel.name = '文房具';
            const models = [
                { objId: 'ac413f22-0cf1-490a-9635-7e9ca810e544',
                    name: '水性ボールペン(黒)', price: 120, category: cmodel },
                { objId: '8f81a72a-58ef-422b-b472-d982e8665292',
                    name: '水性ボールペン(赤)', price: 120, category: cmodel },
            ].map((data) => {
                const model = new ProductModel_1.ProductModel();
                model.objId = data.objId;
                model.name = data.name;
                model.price = data.price;
                model.category = data.category;
                return model;
            });
            const products = await restorer.restoreAll(models);
            expect(products).toHaveLength(models.length);
            products.forEach((product, index) => {
                expect(product).toBeInstanceOf(Product_1.Product);
                expect(product.getId().getValue()).toBe(models[index].objId);
                expect(product.getName().getValue()).toBe(models[index].name);
                expect(product.getPrice().getValue()).toBe(models[index].price);
                expect(product.getCategory()?.getId().getValue()).toBe(models[index].category.objId);
                expect(product.getCategory()?.getName().getValue()).toBe(models[index].category.name);
            });
        });
    });
});
