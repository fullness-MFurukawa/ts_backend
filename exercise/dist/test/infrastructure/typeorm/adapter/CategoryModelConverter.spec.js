"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const Category_1 = require("../../../../src/application/domain/model/category/Category");
const CategoryName_1 = require("../../../../src/application/domain/model/category/CategoryName");
const AppModule_1 = require("../../../../src/AppModule");
const CategoryModel_1 = require("../../../../src/infrastructure/typorm/model/CategoryModel");
/**
 * CategoryエンティティからCategoryModelへの変換 単体テストドライバ
 * [テスト実行コマンド]
 * npx jest test/infrastructure/typeorm/adapter/CategoryModelConverter.spec.ts
 * @author Fullness,Inc.
 * @date 2025-03-11
 * @version 1.0.0
 */
describe('CategorModelConverterの単体テスト', () => {
    let app; // NestJSアプリケーションインスタンス
    let converter; // テストターゲット
    /**
     * すべてのテストの前処理
     * - AppModuleを基にテスト用のNestJSアプリケーションを作成。
     * - テスト対象のCategoryModelConverterをDIコンテナから取得
     */
    beforeAll(async () => {
        const moduleRef = await testing_1.Test.createTestingModule({
            imports: [AppModule_1.AppModule],
        }).compile();
        app = moduleRef.createNestApplication();
        await app.init();
        converter = app.get('CategoryModelConverter');
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
     * convert()メソッドのテスト
     * - CategoryをCategoryModelに正しく変換できることを検証する
     */
    describe('convert()メソッド', () => {
        it("CategoryをCategoryModelに変換できる", async () => {
            const category = Category_1.Category.create(CategoryName_1.CategoryName.fromString('文房具'));
            const model = await converter.convert(category);
            expect(model).toBeInstanceOf(CategoryModel_1.CategoryModel);
            expect(model.objId).toBe(category.getId().getValue());
            expect(model.name).toBe(category.getName().getValue());
        });
    });
    /**
     * convertAll()メソッドのテスト
     * - 複数のCategoryをCategoryModelの配列に正しく変換できることを検証する
     */
    describe('convertAll()メソッド', () => {
        it("Categoryの配列をCategoryModelの配列に変換できる", async () => {
            const categories = [
                Category_1.Category.create(CategoryName_1.CategoryName.fromString('文房具')),
                Category_1.Category.create(CategoryName_1.CategoryName.fromString('家電'))
            ];
            const models = await converter.convertAll(categories);
            expect(models).toHaveLength(categories.length);
            models.forEach((model, index) => {
                expect(model).toBeInstanceOf(CategoryModel_1.CategoryModel);
                expect(model.objId).toBe(categories[index].getId().getValue());
                expect(model.name).toBe(categories[index].getName().getValue());
            });
        });
    });
});
