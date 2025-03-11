import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { Category } from "@src/application/domain/model/category/Category";
import { CategoryName } from "@src/application/domain/model/category/CategoryName";
import { AppModule } from "@src/AppModule";
import { CategoryModel } from "@src/infrastructure/typorm/model/CategoryModel";
import { Converter } from "@src/shared/adapter/Converter";

/**
 * CategoryエンティティからCategoryModelへの変換 単体テストドライバ
 * [テスト実行コマンド]
 * npx jest test/infrastructure/typeorm/adapter/CategoryModelConverter.spec.ts
 * @author Fullness,Inc.
 * @date 2025-03-11
 * @version 1.0.0
 */
describe('CategorModelConverterの単体テスト', () => {
    let app: INestApplication;  // NestJSアプリケーションインスタンス
    let converter: Converter<Category , CategoryModel>;// テストターゲット
    /**
     * すべてのテストの前処理
     * - AppModuleを基にテスト用のNestJSアプリケーションを作成。
     * - テスト対象のCategoryModelConverterをDIコンテナから取得
     */
    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule], 
        }).compile();
        app = moduleRef.createNestApplication();
        await app.init();
        converter = app.get<Converter<Category,CategoryModel>>('CategoryModelConverter');
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
            const category = Category.create(CategoryName.fromString('文房具'));
            const model = await converter.convert(category);
            expect(model).toBeInstanceOf(CategoryModel);
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
                Category.create(CategoryName.fromString('文房具')),
                Category.create(CategoryName.fromString('家電'))
            ];
            const models = await converter.convertAll(categories);
            expect(models).toHaveLength(categories.length);
            models.forEach((model, index) => {
                expect(model).toBeInstanceOf(CategoryModel);
                expect(model.objId).toBe(categories[index].getId().getValue());
                expect(model.name).toBe(categories[index].getName().getValue());
            });
        });
    }); 
})