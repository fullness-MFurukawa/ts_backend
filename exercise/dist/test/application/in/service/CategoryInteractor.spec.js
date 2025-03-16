"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@nestjs/testing/test");
const AppModule_1 = require("../../../../src/AppModule");
const NotFoundException_1 = require("../../../../src/shared/exceptions/NotFoundException");
/**
 * CategoryInteractorのテストドライバ
 * [テスト実行コマンド]
 * npx jest test/application/in/service/CategoryInteractor.spec.ts
 * @author Fullness,Inc.
 * @date 2025-03-15
 * @version 1.0.0
 */
describe('CategoryInteractorの単体テスト', () => {
    let app; // NestJSアプリケーションインスタンス
    let usecase; // 商品カテゴリユースケース
    /**
     * すべてのテストの前処理
     * - AppModuleを基にテスト用のNestJSアプリケーションを作成
     * - CategoryUsecaseをDIコンテナから取得
     */
    beforeAll(async () => {
        // テストモジュールの準備
        const moduleRef = await test_1.Test.createTestingModule({
            imports: [AppModule_1.AppModule], // 実際のモジュールを使用
        }).compile();
        app = moduleRef.createNestApplication();
        await app.init();
        // ユースケースを取得
        usecase = app.get('CategoryUsecase');
    });
    /**
     * すべてのテストの後処理
     */
    afterAll(async () => {
        if (app) {
            await app.close();
        }
    });
    describe('getCategories()メソッド', () => {
        it('すべての商品カテゴリを取得できる', async () => {
            // すべての商品カテゴリを取得する
            const categories = await usecase.getCategories();
            // 取得結果を検証する
            expect(categories).toHaveLength(3);
            const categoryNames = categories.map((category) => category.name);
            expect(categoryNames).toContain('文房具');
            expect(categoryNames).toContain('雑貨');
            expect(categoryNames).toContain('パソコン周辺機器');
        });
    });
    describe('getCategoryById()メソッド', () => {
        it('存在する商品カテゴリIdの商品カテゴリを取得できる', async () => {
            // 商品カテゴリを取得する
            const category = await usecase
                .getCategoryById('b1524011-b6af-417e-8bf2-f449dd58b5c0');
            // 取得した結果の検証
            expect(category.id).toBe('b1524011-b6af-417e-8bf2-f449dd58b5c0');
            expect(category.name).toBe('文房具');
        });
        it('商品カテゴリが存在しない場合、NotFoundExceptionがスローされる', async () => {
            const id = 'b1524011-b6af-417e-8bf2-f449dd58b5c1';
            // 結果の検証
            await expect(usecase.getCategoryById(id)).rejects.toThrow(NotFoundException_1.NotFoundException);
            await expect(usecase.getCategoryById(id)).rejects.toThrow(`商品カテゴリId:(b1524011-b6af-417e-8bf2-f449dd58b5c1)の商品カテゴリは存在しません。`);
        });
    });
});
