import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing/test";
import { Category } from "@src/application/domain/model/category/Category";
import { CategoryId } from "@src/application/domain/model/category/CategoryId";
import { CategoryName } from "@src/application/domain/model/category/CategoryName";
import { Product } from "@src/application/domain/model/product/Product";
import { ProductId } from "@src/application/domain/model/product/ProductId";
import { ProductName } from "@src/application/domain/model/product/ProductName";
import { ProductPrice } from "@src/application/domain/model/product/ProductPrice";
import { AppModule } from "@src/AppModule";
import { ProductModel } from "@src/infrastructure/typorm/model/ProductModel";
import { Converter } from "@src/shared/adapter/Converter";

/**
 * ProductエンティティからProductModelへの変換　単体テストドライバ
 * [テスト実行コマンド]
 * npx jest test/infrastructure/typeorm/adapter/ProductModelConverter.spec.ts
 * @author Fullness,Inc.
 * @date 2025-03-11
 * @version 1.0.0
 */
describe('ProductModelConverterの単体テスト', () => {
    let app: INestApplication;// NestJSアプリケーションインスタンス
    let converter: Converter<Product , ProductModel>;// テストターゲット
    /**
     * すべてのテストの前処理
     * - AppModuleを基にテスト用のNestJSアプリケーションを作成。
     * - テスト対象のProductModelConverterをDIコンテナから取得
     */
    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule], 
        }).compile();
        app = moduleRef.createNestApplication();
        await app.init();
        converter = app.get<Converter<Product,ProductModel>>('ProductModelConverter');
    });
    /**
     * すべてのテストの後処理
     */
    afterAll(async () => {
        if (app) {
            await app.close();
        }
    });
    describe('convert()メソッド', () => {
        it("ProductをProductModelに変換できる", async () => {
            const category = Category.fromExisting(
                CategoryId.fromString('b1524011-b6af-417e-8bf2-f449dd58b5c0'),
                CategoryName.fromString('文房具'));
            const product = Product.fromExisting(
                ProductId.fromString('ac413f22-0cf1-490a-9635-7e9ca810e544'),
                ProductName.fromString('水性ボールペン(黒)'),
                ProductPrice.fromNumber(150),category); 
            const model = await converter.convert(product);
            expect(model).toBeInstanceOf(ProductModel);
            expect(model.objId).toBe(product.getId().getValue());
            expect(model.name).toBe(product.getName().getValue());
            expect(model.price).toBe(product.getPrice().getValue());
            expect(model.category.objId)
                .toBe(product.getCategory()!.getId().getValue());
            expect(model.category.name)
                .toBe(product.getCategory()!.getName().getValue());
        });
    });
    describe('convertAll()メソッド', () => {
        it("Productの配列をProductModelの配列に変換できる", async () => {
            const category = Category.fromExisting(
                CategoryId.fromString('b1524011-b6af-417e-8bf2-f449dd58b5c0'),
                CategoryName.fromString('文房具'));
            const products = [
                Product.fromExisting(
                    ProductId.fromString('ac413f22-0cf1-490a-9635-7e9ca810e544'),
                    ProductName.fromString('水性ボールペン(黒)'),
                    ProductPrice.fromNumber(120),category
                ),
                Product.fromExisting(
                    ProductId.fromString('8f81a72a-58ef-422b-b472-d982e8665292'),
                    ProductName.fromString('水性ボールペン(赤)'),
                    ProductPrice.fromNumber(120),category
                ),
            ];
            const models = await converter.convertAll(products);
            expect(models).toHaveLength(products.length);
            models.forEach((model, index) => {
                expect(model).toBeInstanceOf(ProductModel);
                expect(model.objId).toBe(products[index].getId().getValue());
                expect(model.name).toBe(products[index].getName().getValue());
                expect(model.price).toBe(products[index].getPrice().getValue());
                expect(model.category.objId)
                    .toBe(products[index].getCategory()!.getId().getValue());
                expect(model.category.name)
                    .toBe(products[index].getCategory()!.getName().getValue());
            });
        });
    }); 
});