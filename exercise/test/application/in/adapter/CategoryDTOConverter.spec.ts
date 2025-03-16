import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing/test";
import { Category } from "@src/application/domain/model/category/Category";
import { CategoryName } from "@src/application/domain/model/category/CategoryName";
import { CategoryDTO } from "@src/application/in/dto/CategoryDTO";
import { AppModule } from "@src/AppModule";
import { Converter } from "@src/shared/adapter/Converter";

/**
 * CategoryDTOConverterの単体テストドライバ
 * [テスト実行コマンド]
 * npx jest test/application/in/adapter/CategoryDTOConverter.spec.ts
 * @author Fullness,Inc.
 * @date 2025-03-15
 * @version 1.0.0
 */
describe('CategoryDTOConverterの単体テスト', () => {
    let app: INestApplication;  // NestJSアプリケーションインスタンス
    let converter: Converter<Category, CategoryDTO>; // テスト対象

    /**
     * すべてのテストの前処理
     * - AppModuleを基にテスト用のNestJSアプリケーションを作成
     * - CategoryDTOConverterをDIコンテナから取得
     */
    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        app = moduleRef.createNestApplication();
        await app.init();
        converter = app.get<Converter<Category, CategoryDTO>>('CategoryDTOConverter');
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
            const category = Category.create(CategoryName.fromString('文房具'));
            const dto = await converter.convert(category);

            expect(dto).toBeInstanceOf(CategoryDTO);
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
                Category.create(CategoryName.fromString('文房具')),
                Category.create(CategoryName.fromString('家電'))
            ];
            const dtos = await converter.convertAll(categories);

            expect(dtos).toHaveLength(categories.length);
            dtos.forEach((dto, index) => {
                expect(dto).toBeInstanceOf(CategoryDTO);
                expect(dto.id).toBe(categories[index].getId().getValue());
                expect(dto.name).toBe(categories[index].getName().getValue());
            });
        });
    }); 
});