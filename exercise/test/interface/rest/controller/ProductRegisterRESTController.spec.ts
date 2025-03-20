import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing/test";
import { AppModule } from "@src/AppModule";
import { ProductModel } from "@src/infrastructure/typorm/model/ProductModel";
import { HttpExceptionFilter } from "@src/interface/filter/HttpExceptionFilter";
import request from 'supertest';
import { DataSource } from "typeorm";

/**
 * 新商品登録コントローラのテストドライバ
 * [テスト実行コマンド]
 * npx jest test/interface/rest/controller/ProductRegisterRESTController.spec.ts
 * @author Fullness,Inc.
 * @date 2025-03-20
 * @version 1.0.0
 */
describe('新商品登録(ProductRegisterRESTController)テスト', () => {
    let app: INestApplication;  // NestJSアプリケーションインスタンス
    /**
     * すべてのテストの前処理
     */
    beforeAll(async () => {
         // 実際のモジュールを使用してアプリケーションを構築
         const moduleFixture = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        // ValidationPipe を明示的に適用
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
                transform: true,
            }),
        );
        // 例外フィルターを適用
        app.useGlobalFilters(new HttpExceptionFilter());
        await app.init();
    });
    /**
     * すべてのテストの後処理
     */
    afterAll(async () => {
        await app.close();
    });

    describe('正常系', () => {
        it('すべての商品カテゴリを取得する', async () => {
            const response = await request(app.getHttpServer())
            .get('/products/register/categories')
            .expect(200); // ステータスコード200を検証
            // 配列形式であることを検証
            expect(response.body).toBeInstanceOf(Array);
            // 取得できた件数を検証
            expect(response.body).toHaveLength(3);
            // 取得した商品カテゴリの名称を検証
            const categoryNames = response.body.map((category: any) => category.name);
            expect(categoryNames).toEqual(expect.arrayContaining([
                '文房具',
                '雑貨',
                'パソコン周辺機器',
            ]));
        });
        it('指定されたIdの商品カテゴリを取得する', async () => {
            const categoryId = 'b1524011-b6af-417e-8bf2-f449dd58b5c0'; 
            const response = await request(app.getHttpServer())
                .get(`/products/register/${categoryId}`)
                .expect(200); // ステータスコード200を検証
            // レスポンスの構造を検証
            expect(response.body).toHaveProperty('id', categoryId);
            expect(response.body).toHaveProperty('name', '文房具');
        });
        it("商品を登録する", async () => {
            const registerProductParam = {
                name: '新商品',price: 500,
                categoryId: 'b1524011-b6af-417e-8bf2-f449dd58b5c0', 
            };
            const response = await request(app.getHttpServer())
                .post('/products/register')
                .send(registerProductParam) // リクエストボディを送信
                .expect(201);
            // レスポンスメッセージを検証
            expect(response.body.message).toBe(
                `新商品:(${registerProductParam.name})を登録しました。`
            );
            // クリーンアップ:追加された商品レコードを削除する
            // TypeORMのデータソース
            const dataSource = app.get<DataSource>(DataSource);
            await dataSource
                .createQueryBuilder()
                .delete()
                .from(ProductModel)
                .where("name = :name", { name: "新商品" })
                .execute();
        });
    });

    describe('異常系', () => {
        it('存在しない商品カテゴリIdを指定した場合404エラーを返す', async () => {
            // 存在しない商品カテゴリId
            const categoryId = 'b1524011-b6af-417e-8bf2-f449dd58b5c1'; 
            const response = await request(app.getHttpServer())
                .get(`/products/register/${categoryId}`)
                .expect(404); // ステータスコード 404 を期待
            
            // エラーレスポンスの構造を検証
            expect(response.body).toEqual({
                statusCode: 404,
                timestamp: expect.any(String),
                path: `/products/register/${categoryId}`,
                message: `商品カテゴリId:(${categoryId})の商品カテゴリは存在しません。`,
            });
        });
        it('無効なUUID形式を指定した場合400エラーを返す', async () => {
            // 無効なUUID
            const categoryId = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; 
            const response = await request(app.getHttpServer())
                .get(`/products/register/${categoryId}`)
                .expect(400); // ステータスコード400を検証
            // エラーレスポンスの構造を検証
            expect(response.body).toEqual({
                statusCode: 400,
                timestamp: expect.any(String),
                path: `/products/register/${categoryId}`,
                message: expect.arrayContaining(['商品カテゴリIdは、UUIDです。']),
            });
        });
        it('登録済みの商品を登録しようとした場合は400エラーを返す', async () => {
            const registerProductParam = {
                name: '水性ボールペン(黒)',
                price: 120,
                categoryId: 'b1524011-b6af-417e-8bf2-f449dd58b5c0', 
            };
            const response = await request(app.getHttpServer())
                .post('/products/register')
                .send(registerProductParam) // リクエストボディを送信
                .expect(400);// ステータスコード400を検証
            // レスポンスメッセージを検証
            expect(response.body.message).toBe(
                `商品名:(${registerProductParam.name})は既に登録済みです。`
            );
        });
    });
    describe('バリデーションエラー', () => {
        it("商品登録 - 商品名が空の場合は400エラーを返す", async () => {
            const registerProductParam = {
                name: "",
                price: 500,
                categoryId: "b1524011-b6af-417e-8bf2-f449dd58b5c0",
            };
            const response = await request(app.getHttpServer())
                .post("/products/register")
                .query({ register: "true" }) // クエリパラメータを設定
                .send(registerProductParam) // リクエストボディを送信
                .expect(400); // ステータスコード400を検証
            expect(response.body.message).toContain("商品名は、必須です。");
        });
        it('商品登録 - 商品カテゴリIdがUUID形式でない場合は400エラーを返す', async () => {
            const registerProductParam = {
                name: '新商品',
                price: 500,
                categoryId: 'invalid-uuid', // UUID形式でない
            };
            const response = await request(app.getHttpServer())
                .post('/products/register')
                .send(registerProductParam) // リクエストボディを送信
                .expect(400); // ステータスコード400を検証
            // エラーレスポンスを検証
            expect(response.body).toEqual({
                statusCode: 400,
                timestamp: expect.any(String),
                path: '/products/register',
                message: expect.arrayContaining(['商品カテゴリIdは、UUIDです。']),
            });
        });
    });
});