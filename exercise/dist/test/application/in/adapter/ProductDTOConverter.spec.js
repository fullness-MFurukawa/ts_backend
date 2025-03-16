"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@nestjs/testing/test");
const Category_1 = require("../../../../src/application/domain/model/category/Category");
const CategoryName_1 = require("../../../../src/application/domain/model/category/CategoryName");
const Product_1 = require("../../../../src/application/domain/model/product/Product");
const ProductName_1 = require("../../../../src/application/domain/model/product/ProductName");
const ProductPrice_1 = require("../../../../src/application/domain/model/product/ProductPrice");
const ProductDTO_1 = require("../../../../src/application/in/dto/ProductDTO");
const AppModule_1 = require("../../../../src/AppModule");
/**
 * ProductDTOConverterの単体テストドライバ
 * [テスト実行コマンド]
 * npx jest test/application/in/adapter/ProductDTOConverter.spec.ts
 * @author Fullness,Inc.
 * @date 2025-03-15
 * @version 1.0.0
 */
describe("ProductDTOConverterの単体テスト", () => {
    let app; // NestJSアプリケーションインスタンス
    let productConverter; // テスト対象
    /**
     * すべてのテストの前処理
     * - AppModuleを基にテスト用のNestJSアプリケーションを作成
     * - ProductDTOConverterをDIコンテナから取得
     */
    beforeAll(async () => {
        const moduleRef = await test_1.Test.createTestingModule({
            imports: [AppModule_1.AppModule],
        }).compile();
        app = moduleRef.createNestApplication();
        await app.init();
        // DI コンテナから取得
        productConverter =
            app.get('ProductDTOConverter');
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
            const category = Category_1.Category.create(CategoryName_1.CategoryName.fromString("文房具"));
            const product = Product_1.Product.create(ProductName_1.ProductName.fromString("ノート"), ProductPrice_1.ProductPrice.fromNumber(500));
            product.changeCategory(category);
            const dto = await productConverter.convert(product);
            expect(dto).toBeInstanceOf(ProductDTO_1.ProductDTO);
            expect(dto.id).toBe(product.getId().getValue());
            expect(dto.name).toBe(product.getName().getValue());
            expect(dto.price).toBe(product.getPrice().getValue());
            // Category の変換結果も検証
            expect(dto.category).toBeDefined();
            expect(dto.category?.id).toBe(category.getId().getValue());
            expect(dto.category?.name).toBe(category.getName().getValue());
        });
        it("Productのcategoryが無いの場合でも正しく変換できる", async () => {
            const product = Product_1.Product.create(ProductName_1.ProductName.fromString("ノート"), ProductPrice_1.ProductPrice.fromNumber(500));
            const dto = await productConverter.convert(product);
            expect(dto).toBeInstanceOf(ProductDTO_1.ProductDTO);
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
            const category1 = Category_1.Category.create(CategoryName_1.CategoryName.fromString("文房具"));
            const category2 = Category_1.Category.create(CategoryName_1.CategoryName.fromString("家電"));
            const products = [
                Product_1.Product.create(ProductName_1.ProductName.fromString("ノート"), ProductPrice_1.ProductPrice.fromNumber(500)),
                Product_1.Product.create(ProductName_1.ProductName.fromString("マウス"), ProductPrice_1.ProductPrice.fromNumber(10000)),
            ];
            products[0].changeCategory(category1);
            products[1].changeCategory(category2);
            const dtos = await productConverter.convertAll(products);
            expect(dtos).toHaveLength(products.length);
            dtos.forEach((dto, index) => {
                expect(dto).toBeInstanceOf(ProductDTO_1.ProductDTO);
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
                Product_1.Product.create(ProductName_1.ProductName.fromString("ノート"), ProductPrice_1.ProductPrice.fromNumber(500)),
                Product_1.Product.create(ProductName_1.ProductName.fromString("マウス"), ProductPrice_1.ProductPrice.fromNumber(10000)),
            ];
            const dtos = await productConverter.convertAll(products);
            expect(dtos).toHaveLength(products.length);
            dtos.forEach((dto, index) => {
                expect(dto).toBeInstanceOf(ProductDTO_1.ProductDTO);
                expect(dto.id).toBe(products[index].getId().getValue());
                expect(dto.name).toBe(products[index].getName().getValue());
                expect(dto.price).toBe(products[index].getPrice().getValue());
                expect(dto.category).toBeUndefined(); // カテゴリーが null の場合
            });
        });
    });
});
