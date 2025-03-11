"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const test_1 = require("@nestjs/testing/test");
const AppModule_1 = require("../../../../src/AppModule");
const CategoryId_1 = require("../../../../src/application/domain/model/category/CategoryId");
/**
 * CategoryRepositoryインターフェイス実装のテストドライバ
 * [テスト実行コマンド]
 * npx jest test/infrastructure/typeorm/repository/CategoryRepositoryImpl.spec.ts
 * @author Fullness,Inc.
 * @date 2025-03-11
 * @version 1.0.0
 */
describe('CategorRepositoryImplの単体テスト', () => {
    let app; // NestJSアプリケーションインスタンス
    let repository; // テストターゲット
    let entityManager; // TypeORMのEntityManager
    /**
     * すべてのテストの前処理
     * - AppModuleを基にテスト用のNestJSアプリケーションを作成
     * - テスト対象のCategoryRepositoryをDIコンテナから取得
     */
    beforeAll(async () => {
        const moduleRef = await test_1.Test.createTestingModule({
            imports: [AppModule_1.AppModule],
        }).compile();
        app = moduleRef.createNestApplication();
        await app.init();
        // RepositoryとEntityManagerを取得
        repository = app.get('CategoryRepository');
        entityManager = app.get(typeorm_1.EntityManager);
    });
    /**
     * すべてのテストの後処理
     */
    afterAll(async () => {
        if (app) {
            await app.close();
        }
    });
    describe('findById()メソッド', () => {
        /**
         * 取得結果を検証する
         * @param category 商品カテゴリ
         * @param expectedId 商品カテゴリId
         * @param expectedName 商品カテゴリ名
         */
        const verifyCategory = (category, expectedId, expectedName) => {
            expect(category).not.toBeNull();
            expect(category.getId().getValue()).toBe(expectedId);
            expect(category.getName().getValue()).toBe(expectedName);
        };
        it("存在する商品カテゴリIdを利用して、商品カテゴリを取得できる(Repository)", async () => {
            const id = CategoryId_1.CategoryId.fromString('b1524011-b6af-417e-8bf2-f449dd58b5c0');
            const category = await repository.findById(id);
            // 取得結果を検証する
            verifyCategory(category, 'b1524011-b6af-417e-8bf2-f449dd58b5c0', '文房具');
        });
        it("存在しない商品カテゴリIdを利用すると、nullが返される(Repository)", async () => {
            const id = CategoryId_1.CategoryId.fromString('b1524011-b6af-417e-8bf2-f449dd58b5c1');
            const category = await repository.findById(id);
            // 取得結果を検証する
            expect(category).toBeNull();
        });
        it("存在する商品カテゴリIdを利用して、商品カテゴリを取得できる(EntityManager)", async () => {
            const id = CategoryId_1.CategoryId.fromString('b1524011-b6af-417e-8bf2-f449dd58b5c0');
            const category = await repository.findById(id, entityManager);
            // 取得結果を検証する
            verifyCategory(category, 'b1524011-b6af-417e-8bf2-f449dd58b5c0', '文房具');
        });
        it("存在しない商品カテゴリIdを利用すると、nullが返される(EntityManager)", async () => {
            const id = CategoryId_1.CategoryId.fromString('b1524011-b6af-417e-8bf2-f449dd58b5c1');
            const category = await repository.findById(id, entityManager);
            // 取得結果を検証する
            expect(category).toBeNull();
        });
    });
    describe('findAll()メソッド', () => {
        const verifyCategories = (categories, expectedNames) => {
            expect(categories).toHaveLength(expectedNames.length);
            const categoryNames = categories.map((category) => category.getName().getValue());
            expectedNames.forEach((name) => expect(categoryNames).toContain(name));
        };
        it("すべての商品カテゴリを取得できる(Repository)", async () => {
            const categories = await repository.findAll();
            // 取得した結果を検証する
            verifyCategories(categories, ['文房具', '雑貨', 'パソコン周辺機器']);
        });
        it("すべての商品カテゴリを取得できる(EntityManager)", async () => {
            const categories = await repository.findAll(entityManager);
            // 取得した結果を検証する
            verifyCategories(categories, ['文房具', '雑貨', 'パソコン周辺機器']);
        });
    });
});
