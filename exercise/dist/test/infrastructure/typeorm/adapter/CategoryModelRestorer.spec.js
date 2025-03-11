"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const Category_1 = require("../../../../src/application/domain/model/category/Category");
const AppModule_1 = require("../../../../src/AppModule");
const CategoryModel_1 = require("../../../../src/infrastructure/typorm/model/CategoryModel");
/**
 * CategoryModelからCategoryエンティティを復元 単体テストドライバ
 * [テスト実行コマンド]
 * npx jest test/infrastructure/typeorm/adapter/CategoryModelRestorer.spec.ts
 * @author Fullness,Inc.
 * @date 2025-03-11
 * @version 1.0.0
 */
describe('CategorModelRestorerの単体テスト', () => {
    let app; // NestJSアプリケーションインスタンス
    let restorer; // テストターゲット
    /**
     * すべてのテストの前処理
     * - AppModuleを基にテスト用のNestJSアプリケーションを作成。
     * - テスト対象のCategoryModelRestorerをDIコンテナから取得
     */
    beforeAll(async () => {
        const moduleRef = await testing_1.Test.createTestingModule({
            imports: [AppModule_1.AppModule],
        }).compile();
        app = moduleRef.createNestApplication();
        await app.init();
        restorer = app.get('CategoryModelRestorer');
    });
    /**
     * すべてのテストの後処理
     */
    afterAll(async () => {
        if (app) {
            await app.close();
        }
    });
    describe('restore()メソッド', () => {
        it("CategoryModelからCategoryを復元できる", async () => {
            const model = new CategoryModel_1.CategoryModel();
            model.objId = 'b1524011-b6af-417e-8bf2-f449dd58b5c0';
            model.name = '文房具';
            const category = await restorer.restore(model);
            expect(category).toBeInstanceOf(Category_1.Category);
            expect(category.getId().getValue()).toBe(model.objId);
            expect(category.getName().getValue()).toBe(model.name);
        });
    });
    describe('restoreAll()メソッド', () => {
        it("CategoryModelの配列からCategoryの配列を復元できる", async () => {
            const models = [
                { objId: 'b1524011-b6af-417e-8bf2-f449dd58b5c0', name: '文房具' },
                { objId: 'c3524011-b6af-417e-8bf2-f449dd58b5c1', name: '家電' },
            ].map((data) => {
                const model = new CategoryModel_1.CategoryModel();
                model.objId = data.objId;
                model.name = data.name;
                return model;
            });
            const categories = await restorer.restoreAll(models);
            expect(categories).toHaveLength(models.length);
            categories.forEach((category, index) => {
                expect(category).toBeInstanceOf(Category_1.Category);
                expect(category.getId().getValue()).toBe(models[index].objId);
                expect(category.getName().getValue()).toBe(models[index].name);
            });
        });
    });
});
