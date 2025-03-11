import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { Category } from "@src/application/domain/model/category/Category";
import { AppModule } from "@src/AppModule";
import { CategoryModel } from "@src/infrastructure/typorm/model/CategoryModel";
import { Restorer } from "@src/shared/adapter/Restorer";

/**
 * CategoryModelからCategoryエンティティを復元 単体テストドライバ
 * [テスト実行コマンド]
 * npx jest test/infrastructure/typeorm/adapter/CategoryModelRestorer.spec.ts
 * @author Fullness,Inc.
 * @date 2025-03-11
 * @version 1.0.0
 */
describe('CategorModelRestorerの単体テスト', () => {
    let app: INestApplication;  // NestJSアプリケーションインスタンス
    let restorer: Restorer<CategoryModel , Category>; // テストターゲット
    /**
     * すべてのテストの前処理
     * - AppModuleを基にテスト用のNestJSアプリケーションを作成。
     * - テスト対象のCategoryModelRestorerをDIコンテナから取得
     */
    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule], 
        }).compile();
        app = moduleRef.createNestApplication();
        await app.init();
        restorer = app.get<Restorer<CategoryModel , Category>>('CategoryModelRestorer');
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
            const model = new CategoryModel();
            model.objId = 'b1524011-b6af-417e-8bf2-f449dd58b5c0';
            model.name = '文房具';
            const category = await restorer.restore(model);
            expect(category).toBeInstanceOf(Category);
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
                const model = new CategoryModel();
                model.objId = data.objId;
                model.name = data.name;
                return model;
            });
            const categories = await restorer.restoreAll(models);
            expect(categories).toHaveLength(models.length);
            categories.forEach((category, index) => {
                expect(category).toBeInstanceOf(Category);
                expect(category.getId().getValue()).toBe(models[index].objId);
                expect(category.getName().getValue()).toBe(models[index].name);
            });
        });
    });
})