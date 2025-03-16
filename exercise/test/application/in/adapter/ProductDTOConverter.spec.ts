import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing/test";
import { Category } from "@src/application/domain/model/category/Category";
import { CategoryName } from "@src/application/domain/model/category/CategoryName";
import { Product } from "@src/application/domain/model/product/Product";
import { ProductName } from "@src/application/domain/model/product/ProductName";
import { ProductPrice } from "@src/application/domain/model/product/ProductPrice";
import { ProductDTO } from "@src/application/in/dto/ProductDTO";
import { AppModule } from "@src/AppModule";
import { Converter } from "@src/shared/adapter/Converter";

/**
 * ProductDTOConverterの単体テストドライバ
 * [テスト実行コマンド]
 * npx jest test/application/in/adapter/ProductDTOConverter.spec.ts
 * @author Fullness,Inc.
 * @date 2025-03-15
 * @version 1.0.0
 */
describe("ProductDTOConverterの単体テスト", () => {
    let app: INestApplication;  // NestJSアプリケーションインスタンス
    let productConverter: Converter<Product, ProductDTO>; // テスト対象
    /**
     * すべてのテストの前処理
     * - AppModuleを基にテスト用のNestJSアプリケーションを作成
     * - ProductDTOConverterをDIコンテナから取得
     */
    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        app = moduleRef.createNestApplication();
        await app.init();

        // DI コンテナから取得
        productConverter = 
        app.get<Converter<Product, ProductDTO>>('ProductDTOConverter');
        //categoryConverter = app.get<Converter<Category, CategoryDTO>>(CategoryDTOConverter);
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
     * - Product を ProductDTO に正しく変換できることを検証
     */
    describe("convert() メソッド", () => {
        it("Product を ProductDTO に変換できる", async () => {
            const category = Category.create(CategoryName.fromString("文房具"));
            const product = Product.create(ProductName.fromString("ノート"), 
                ProductPrice.fromNumber(500));
            product.changeCategory(category);
            const dto = await productConverter.convert(product);

            expect(dto).toBeInstanceOf(ProductDTO);
            expect(dto.id).toBe(product.getId().getValue());
            expect(dto.name).toBe(product.getName().getValue());
            expect(dto.price).toBe(product.getPrice().getValue());

            // Category の変換結果も検証
            expect(dto.category).toBeDefined();
            expect(dto.category?.id).toBe(category.getId().getValue());
            expect(dto.category?.name).toBe(category.getName().getValue());
        });

        it("Productのcategoryが無いの場合でも正しく変換できる", async () => {
            const product = Product.create(
                ProductName.fromString("ノート"), 
                ProductPrice.fromNumber(500));
            const dto = await productConverter.convert(product);

            expect(dto).toBeInstanceOf(ProductDTO);
            expect(dto.id).toBe(product.getId().getValue());
            expect(dto.name).toBe(product.getName().getValue());
            expect(dto.price).toBe(product.getPrice().getValue());
            expect(dto.category).toBeUndefined(); // カテゴリーがない場合
        });
    });

    /**
     * convertAll() メソッドのテスト
     * - 複数の Product を ProductDTO の配列に正しく変換できることを検証
     */
    describe("convertAll() メソッド", () => {
        it("Product の配列を ProductDTO の配列に変換できる", async () => {
            const category1 = Category.create(CategoryName.fromString("文房具"));
            const category2 = Category.create(CategoryName.fromString("家電"));

            const products = [
                Product.create(
                    ProductName.fromString("ノート"), ProductPrice.fromNumber(500)),
                Product.create(
                    ProductName.fromString("マウス"), ProductPrice.fromNumber(10000)),
            ];
            products[0].changeCategory(category1);
            products[1].changeCategory(category2);

            const dtos = await productConverter.convertAll(products);

            expect(dtos).toHaveLength(products.length);
            dtos.forEach((dto, index) => {
                expect(dto).toBeInstanceOf(ProductDTO);
                expect(dto.id).toBe(products[index].getId().getValue());
                expect(dto.name).toBe(products[index].getName().getValue());
                expect(dto.price).toBe(products[index].getPrice().getValue());

                // Category の変換結果も検証
                expect(dto.category).toBeDefined();
                expect(dto.category?.id).toBe(products[index].getCategory()?.getId().getValue());
                expect(dto.category?.name).toBe(products[index].getCategory()?.getName().getValue());
            });
        });

        it("Productのcategoryが無い場合でも正しく変換できる", async () => {
            const products = [
                Product.create(ProductName.fromString("ノート"), ProductPrice.fromNumber(500)),
                Product.create(ProductName.fromString("マウス"), ProductPrice.fromNumber(10000)),
            ];
            const dtos = await productConverter.convertAll(products);

            expect(dtos).toHaveLength(products.length);
            dtos.forEach((dto, index) => {
                expect(dto).toBeInstanceOf(ProductDTO);
                expect(dto.id).toBe(products[index].getId().getValue());
                expect(dto.name).toBe(products[index].getName().getValue());
                expect(dto.price).toBe(products[index].getPrice().getValue());
                expect(dto.category).toBeUndefined(); // カテゴリーが null の場合
            });
        });
    });    

});