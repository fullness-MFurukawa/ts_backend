"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@nestjs/testing/test");
const Category_1 = require("../../../../src/application/domain/model/category/Category");
const CategoryId_1 = require("../../../../src/application/domain/model/category/CategoryId");
const CategoryName_1 = require("../../../../src/application/domain/model/category/CategoryName");
const Product_1 = require("../../../../src/application/domain/model/product/Product");
const ProductId_1 = require("../../../../src/application/domain/model/product/ProductId");
const ProductName_1 = require("../../../../src/application/domain/model/product/ProductName");
const ProductPrice_1 = require("../../../../src/application/domain/model/product/ProductPrice");
const AppModule_1 = require("../../../../src/AppModule");
const typeorm_1 = require("typeorm");
/**
 * ProductRepositoryインターフェイス実装のテストドライバ
 * [テスト実行コマンド]
 * npx jest test/infrastructure/typeorm/repository/ProductRepositoryImpl.spec.ts
 * @author Fullness,Inc.
 * @date 2025-03-11
 * @version 1.0.0
 */
describe('ProductRepositoryImplの単体テスト', () => {
    let app; // NestJSアプリケーションインスタンス
    let repository; // テストターゲット
    let dataSource; // TypeORMのDataSource
    /**
     * すべてのテストの前処理
     * - AppModuleを基にテスト用のNestJSアプリケーションを作成
     * - テスト対象のProductRepositoryをDIコンテナから取得
     */
    beforeAll(async () => {
        const moduleRef = await test_1.Test.createTestingModule({
            imports: [AppModule_1.AppModule],
        }).compile();
        app = moduleRef.createNestApplication();
        await app.init();
        // RepositoryとDataSourceを取得
        repository = app.get('ProductRepository');
        dataSource = app.get(typeorm_1.DataSource);
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
        it("存在する商品Idを利用すると、商品を取得できる", async () => {
            const id = ProductId_1.ProductId.fromString("8f81a72a-58ef-422b-b472-d982e8665292");
            const product = await repository.findById(id);
            // 取得した結果を検証する
            expect(product.getId().getValue())
                .toBe("8f81a72a-58ef-422b-b472-d982e8665292");
            expect(product.getName().getValue()).toBe("水性ボールペン(赤)");
            expect(product.getPrice().getValue()).toBe(120);
            expect(product.getCategory().getId().getValue())
                .toBe("b1524011-b6af-417e-8bf2-f449dd58b5c0");
        });
        it("存在しない商品Idを利用すると、nullが返される", async () => {
            const id = ProductId_1.ProductId.fromString("8f81a72a-58ef-422b-b472-d982e8665293");
            const product = await repository.findById(id);
            // 取得結果を検証する
            expect(product).toBeNull();
        });
    });
    describe("findByKeyword()メソッド", () => {
        it("キーワード'ボールペン'で検索した場合、対応する商品を取得できる", async () => {
            const keyword = ProductName_1.ProductName.fromString("ボールペン");
            const products = await repository.findByKeyword(keyword);
            // 取得結果を検証する
            expect(products).toBeInstanceOf(Array);
            expect(products.length).toBeGreaterThan(0);
            const productNames = products.map((product) => product.getName().getValue());
            expect(productNames).toContain("水性ボールペン(黒)");
            expect(productNames).toContain("水性ボールペン(赤)");
            expect(productNames).toContain("水性ボールペン(青)");
            expect(productNames).toContain("油性ボールペン(黒)");
            expect(productNames).toContain("油性ボールペン(赤)");
            expect(productNames).toContain("油性ボールペン(青)");
        });
        it("キーワードに一致する商品が存在しない場合、nullが返される", async () => {
            const keyword = ProductName_1.ProductName.fromString("存在しない仕様品名");
            const products = await repository.findByKeyword(keyword);
            expect(products).toBeNull();
        });
    });
    describe("exists()メソッド", () => {
        it("商品が存在する場合はtrueを返す", async () => {
            const productName = ProductName_1.ProductName.fromString("水性ボールペン(黒)");
            const exists = await repository.exists(productName);
            expect(exists).toBe(true);
        });
        it("商品が存在しない場合はfalseを返す", async () => {
            const productName = ProductName_1.ProductName.fromString("存在しない商品名");
            const exists = await repository.exists(productName);
            expect(exists).toBe(false);
        });
    });
    describe("create()メソッド", () => {
        it("新しい商品を登録できる", async () => {
            // DataSourceからQueryRunnerを取得する
            const queryRunner = dataSource.createQueryRunner();
            // データベース接続する
            await queryRunner.connect();
            // トランザクションを開始する
            await queryRunner.startTransaction();
            // EntityManagerを取得する
            const entityManager = queryRunner.manager;
            // 永続化する商品の準備
            const category = Category_1.Category.fromExisting(CategoryId_1.CategoryId.fromString("b1524011-b6af-417e-8bf2-f449dd58b5c0"), CategoryName_1.CategoryName.fromString("文房具"));
            const product = Product_1.Product.create(ProductName_1.ProductName.fromString("新商品"), ProductPrice_1.ProductPrice.fromNumber(300));
            product.changeCategory(category);
            try {
                // 商品を永続化する
                await repository.create(product, entityManager);
                // 永続化された商品を取得する
                const saveProduct = await repository.findById(product.getId(), entityManager);
                // 永続化データと取得結果を評価する
                expect(saveProduct.getId().getValue()).toBe(product.getId().getValue());
                expect(saveProduct.getName().getValue()).toBe(product.getName().getValue());
                expect(saveProduct.getPrice().getValue()).toBe(product.getPrice().getValue());
            }
            finally {
                // トランザクションをロールバックする
                await queryRunner.rollbackTransaction();
                // QueryRunnerを解放する
                await queryRunner.release();
            }
        });
    });
    describe("updateById()メソッド", () => {
        it("存在する商品の場合、商品名と商品単価を変更できtrueを返す", async () => {
            // 変更データを準備する
            const productId = ProductId_1.ProductId.fromString("ac413f22-0cf1-490a-9635-7e9ca810e544");
            const updatedName = ProductName_1.ProductName.fromString("更新後のボールペン");
            const updatedPrice = ProductPrice_1.ProductPrice.fromNumber(150);
            const category = Category_1.Category.fromExisting(CategoryId_1.CategoryId.fromString("b1524011-b6af-417e-8bf2-f449dd58b5c0"), CategoryName_1.CategoryName.fromString("文房具"));
            const product = Product_1.Product.fromExisting(productId, updatedName, updatedPrice);
            product.changeCategory(category);
            // DataSourceからQueryRunnerを取得する
            const queryRunner = dataSource.createQueryRunner();
            await queryRunner.connect(); // データベース接続する
            await queryRunner.startTransaction(); // トランザクションを開始する
            const entityManager = queryRunner.manager; // EntityManagerを取得する
            try {
                const result = await repository.updateById(product, entityManager);
                expect(result).toBe(true);
            }
            finally {
                await queryRunner.rollbackTransaction(); // トランザクションをロールバックする
                await queryRunner.release(); // QueryRunnerを解放する
            }
        });
        it("存在しない商品の場合、商品名と商品単価を変更できずfalseを返す", async () => {
            // 変更データを準備する
            const productId = ProductId_1.ProductId.fromString("ac413f22-0cf1-490a-9635-7e9ca810e545");
            const updatedName = ProductName_1.ProductName.fromString("更新後のボールペン");
            const updatedPrice = ProductPrice_1.ProductPrice.fromNumber(150);
            const category = Category_1.Category.fromExisting(CategoryId_1.CategoryId.fromString("b1524011-b6af-417e-8bf2-f449dd58b5c0"), CategoryName_1.CategoryName.fromString("文房具"));
            const product = Product_1.Product.fromExisting(productId, updatedName, updatedPrice);
            product.changeCategory(category);
            // DataSourceからQueryRunnerを取得する
            const queryRunner = dataSource.createQueryRunner();
            await queryRunner.connect(); // データベース接続する
            await queryRunner.startTransaction(); // トランザクションを開始する
            const entityManager = queryRunner.manager; // EntityManagerを取得する
            try {
                const result = await repository.updateById(product, entityManager);
                expect(result).toBe(false);
            }
            finally {
                await queryRunner.rollbackTransaction(); // トランザクションをロールバックする
                await queryRunner.release(); // QueryRunnerを解放する
            }
        });
    });
    describe("deleteById()メソッド", () => {
        it("存在する商品は削除できtrueを返す", async () => {
            // 変更データを準備する
            const productId = ProductId_1.ProductId.fromString("ac413f22-0cf1-490a-9635-7e9ca810e544");
            // DataSourceからQueryRunnerを取得する
            const queryRunner = dataSource.createQueryRunner();
            await queryRunner.connect(); // データベース接続する
            await queryRunner.startTransaction(); // トランザクションを開始する
            const entityManager = queryRunner.manager; // EntityManagerを取得する
            try {
                const result = await repository.deleteById(productId, entityManager);
                expect(result).toBe(true);
            }
            finally {
                await queryRunner.rollbackTransaction(); // トランザクションをロールバックする
                await queryRunner.release(); // QueryRunnerを解放する
            }
        });
        it("存在しない商品は削除できずfalseを返す", async () => {
            // 変更データを準備する
            const productId = ProductId_1.ProductId.fromString("ac413f22-0cf1-490a-9635-7e9ca810e555");
            // DataSourceからQueryRunnerを取得する
            const queryRunner = dataSource.createQueryRunner();
            await queryRunner.connect(); // データベース接続する
            await queryRunner.startTransaction(); // トランザクションを開始する
            const entityManager = queryRunner.manager; // EntityManagerを取得する
            try {
                const result = await repository.deleteById(productId, entityManager);
                expect(result).toBe(false);
            }
            finally {
                await queryRunner.rollbackTransaction(); // トランザクションをロールバックする
                await queryRunner.release(); // QueryRunnerを解放する
            }
        });
    });
});
