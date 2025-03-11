import { INestApplication } from "@nestjs/common";
import { EntityManager } from "typeorm";
import { CategoryRepository } from "@src/application/out/repository/CategoryRepository";
import { Test } from "@nestjs/testing/test";
import { AppModule } from "@src/AppModule";
import { Category } from "@src/application/domain/model/category/Category";
import { CategoryId } from "@src/application/domain/model/category/CategoryId";


/**
 * CategoryRepositoryインターフェイス実装のテストドライバ
 * [テスト実行コマンド]
 * npx jest test/infrastructure/typeorm/repository/CategoryRepositoryImpl.spec.ts
 * @author Fullness,Inc.
 * @date 2025-03-11
 * @version 1.0.0
 */
describe('CategorRepositoryImplの単体テスト', () => {
    let app: INestApplication; // NestJSアプリケーションインスタンス
    let repository: CategoryRepository<EntityManager>;// テストターゲット
    let entityManager: EntityManager; // TypeORMのEntityManager
    /**
     * すべてのテストの前処理
     * - AppModuleを基にテスト用のNestJSアプリケーションを作成
     * - テスト対象のCategoryRepositoryをDIコンテナから取得
     */
    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule], 
        }).compile();
        app = moduleRef.createNestApplication();
        await app.init();
        // RepositoryとEntityManagerを取得
        repository = app.get<CategoryRepository<EntityManager>>('CategoryRepository');
        entityManager = app.get(EntityManager);
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
        const verifyCategory = (category: Category | null, expectedId: string, expectedName: string) => {
            expect(category).not.toBeNull();
            expect(category!.getId().getValue()).toBe(expectedId);
            expect(category!.getName().getValue()).toBe(expectedName);
        };

        it("存在する商品カテゴリIdを利用して、商品カテゴリを取得できる(Repository)", async () => {
            const id = CategoryId.fromString('b1524011-b6af-417e-8bf2-f449dd58b5c0');
            const category = await repository.findById(id);
            // 取得結果を検証する
            verifyCategory(category, 'b1524011-b6af-417e-8bf2-f449dd58b5c0', '文房具');
        });
        it("存在しない商品カテゴリIdを利用すると、nullが返される(Repository)", async () => {
            const id = CategoryId.fromString('b1524011-b6af-417e-8bf2-f449dd58b5c1');
            const category = await repository.findById(id);
            // 取得結果を検証する
            expect(category).toBeNull();
        });
        it("存在する商品カテゴリIdを利用して、商品カテゴリを取得できる(EntityManager)", async () => {
            const id = CategoryId.fromString('b1524011-b6af-417e-8bf2-f449dd58b5c0');
            const category = await repository.findById(id , entityManager);
            // 取得結果を検証する
            verifyCategory(category, 'b1524011-b6af-417e-8bf2-f449dd58b5c0', '文房具');
        });
        it("存在しない商品カテゴリIdを利用すると、nullが返される(EntityManager)", async () => {
            const id = CategoryId.fromString('b1524011-b6af-417e-8bf2-f449dd58b5c1');
            const category = await repository.findById(id , entityManager);
            // 取得結果を検証する
            expect(category).toBeNull();
        });
    });

    describe('findAll()メソッド', () => {    
        const verifyCategories = (categories: Category[], expectedNames: string[]) => {
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