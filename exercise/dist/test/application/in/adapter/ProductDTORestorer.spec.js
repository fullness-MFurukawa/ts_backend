"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@nestjs/testing/test");
const Category_1 = require("../../../../src/application/domain/model/category/Category");
const Product_1 = require("../../../../src/application/domain/model/product/Product");
const AppModule_1 = require("../../../../src/AppModule");
/**
 * ProductDTORestorerの単体テストドライバ
 * [テスト実行コマンド]
 * npx jest test/application/in/adapter/ProductDTORestorer.spec.ts
 * @author Fullness,Inc.
 * @date 2025-03-15
 * @version 1.0.0
 */
describe("ProductDTORestorerの単体テスト", () => {
    let app; // NestJSアプリケーションインスタンス
    let restorer; // テスト対象
    /**
     * すべてのテストの前処理
     * - AppModuleを基にテスト用のNestJSアプリケーションを作成
     * - ProductDTORestorerをDIコンテナから取得
     */
    beforeAll(async () => {
        const moduleRef = await test_1.Test.createTestingModule({
            imports: [AppModule_1.AppModule],
        }).compile();
        app = moduleRef.createNestApplication();
        await app.init();
        // DI コンテナから取得
        restorer = app.get('ProductDTORestorer');
    });
    /**
     * すべてのテストの後処理
     * - NestJSアプリケーションのクリーンアップ
     */
    afterAll(async () => {
        if (app) {
            await app.close();
        }
    });
    /**
     * restore() メソッドのテスト
     * - 新規 Product を正しく復元できることを検証
     */
    describe("restore() メソッド - 新規作成", () => {
        it("ProductDTO から新規 Product を作成できる（カテゴリなし）", async () => {
            const dto = {
                id: null, // 新規作成
                name: "ノート",
                price: 500,
                category: null,
            };
            const product = await restorer.restore(dto);
            expect(product).toBeInstanceOf(Product_1.Product);
            expect(product.getName().getValue()).toBe(dto.name);
            expect(product.getPrice().getValue()).toBe(dto.price);
            expect(product.getCategory()).toBeNull(); // カテゴリなし
        });
        it("ProductDTO から新規 Product を作成できる（カテゴリあり）", async () => {
            const dto = {
                id: null, // 新規作成
                name: "ノート",
                price: 500,
                category: {
                    id: "b1524011-b6af-417e-8bf2-f449dd58b5c0",
                    name: "文房具",
                },
            };
            const product = await restorer.restore(dto);
            expect(product).toBeInstanceOf(Product_1.Product);
            expect(product.getName().getValue()).toBe(dto.name);
            expect(product.getPrice().getValue()).toBe(dto.price);
            // カテゴリの復元確認
            expect(product.getCategory()).toBeInstanceOf(Category_1.Category);
            expect(product.getCategory()?.getId().getValue()).toBe(dto.category?.id);
            expect(product.getCategory()?.getName().getValue()).toBe("dummy"); // `dummy` 名で作成される
        });
    });
});
