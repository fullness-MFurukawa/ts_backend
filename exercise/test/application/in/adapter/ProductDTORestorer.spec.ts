import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing/test";
import { Category } from "@src/application/domain/model/category/Category";
import { Product } from "@src/application/domain/model/product/Product";
import { ProductDTO } from "@src/application/in/dto/ProductDTO";
import { AppModule } from "@src/AppModule";
import { Restorer } from "@src/shared/adapter/Restorer";

/**
 * ProductDTORestorerの単体テストドライバ
 * [テスト実行コマンド]
 * npx jest test/application/in/adapter/ProductDTORestorer.spec.ts
 * @author Fullness,Inc.
 * @date 2025-03-15
 * @version 1.0.0
 */
describe("ProductDTORestorerの単体テスト", () => {
    let app: INestApplication;  // NestJSアプリケーションインスタンス
    let restorer: Restorer<ProductDTO, Product>; // テスト対象
    /**
     * すべてのテストの前処理
     * - AppModuleを基にテスト用のNestJSアプリケーションを作成
     * - ProductDTORestorerをDIコンテナから取得
     */
    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        app = moduleRef.createNestApplication();
        await app.init();

        // DI コンテナから取得
        restorer = app.get<Restorer<ProductDTO, Product>>('ProductDTORestorer');
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
            const dto: ProductDTO = {
                id: null, // 新規作成
                name: "ノート",
                price: 500,
                category: null,
            };
            const product = await restorer.restore(dto);

            expect(product).toBeInstanceOf(Product);
            expect(product.getName().getValue()).toBe(dto.name);
            expect(product.getPrice().getValue()).toBe(dto.price);
            expect(product.getCategory()).toBeNull(); // カテゴリなし
        });

        it("ProductDTO から新規 Product を作成できる（カテゴリあり）", async () => {
            const dto: ProductDTO = {
                id: null, // 新規作成
                name: "ノート",
                price: 500,
                category: {
                    id: "b1524011-b6af-417e-8bf2-f449dd58b5c0",
                    name: "文房具",
                },
            };
            const product = await restorer.restore(dto);

            expect(product).toBeInstanceOf(Product);
            expect(product.getName().getValue()).toBe(dto.name);
            expect(product.getPrice().getValue()).toBe(dto.price);

            // カテゴリの復元確認
            expect(product.getCategory()).toBeInstanceOf(Category);
            expect(product.getCategory()?.getId().getValue()).toBe(dto.category?.id);
            expect(product.getCategory()?.getName().getValue()).toBe("dummy"); // `dummy` 名で作成される
        });
    });

});