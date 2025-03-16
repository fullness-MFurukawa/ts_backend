"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@nestjs/testing/test");
const Category_1 = require("../../../../src/application/domain/model/category/Category");
const CategoryName_1 = require("../../../../src/application/domain/model/category/CategoryName");
const CategoryDTO_1 = require("../../../../src/application/in/dto/CategoryDTO");
const AppModule_1 = require("../../../../src/AppModule");
/**
 * CategoryDTOConverterの単体テストドライバ
 * [テスト実行コマンド]
 * npx jest test/application/in/adapter/CategoryDTOConverter.spec.ts
 * @author Fullness,Inc.
 * @date 2025-03-15
 * @version 1.0.0
 */
describe('CategoryDTOConverterの単体テスト', () => {
    let app; // NestJSアプリケーションインスタンス
    let converter; // テスト対象
    /**
     * すべてのテストの前処理
     * - AppModuleを基にテスト用のNestJSアプリケーションを作成
     * - CategoryDTOConverterをDIコンテナから取得
     */
    beforeAll(async () => {
        const moduleRef = await test_1.Test.createTestingModule({
            imports: [AppModule_1.AppModule],
        }).compile();
        app = moduleRef.createNestApplication();
        await app.init();
        converter = app.get('CategoryDTOConverter');
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
     * convert() メソッドのテスト
     * - Category を CategoryDTO に正しく変換できることを検証
     */
    describe('convert() メソッド', () => {
        it("Category を CategoryDTO に変換できる", async () => {
            const category = Category_1.Category.create(CategoryName_1.CategoryName.fromString('文房具'));
            const dto = await converter.convert(category);
            expect(dto).toBeInstanceOf(CategoryDTO_1.CategoryDTO);
            expect(dto.id).toBe(category.getId().getValue());
            expect(dto.name).toBe(category.getName().getValue());
        });
    });
    /**
     * convertAll() メソッドのテスト
     * - 複数の Category を CategoryDTO の配列に正しく変換できることを検証
     */
    describe('convertAll() メソッド', () => {
        it("Category の配列を CategoryDTO の配列に変換できる", async () => {
            const categories = [
                Category_1.Category.create(CategoryName_1.CategoryName.fromString('文房具')),
                Category_1.Category.create(CategoryName_1.CategoryName.fromString('家電'))
            ];
            const dtos = await converter.convertAll(categories);
            expect(dtos).toHaveLength(categories.length);
            dtos.forEach((dto, index) => {
                expect(dto).toBeInstanceOf(CategoryDTO_1.CategoryDTO);
                expect(dto.id).toBe(categories[index].getId().getValue());
                expect(dto.name).toBe(categories[index].getName().getValue());
            });
        });
    });
});
