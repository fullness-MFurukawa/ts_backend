import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing/test";
import { AppModule } from "@src/AppModule";
import { HttpExceptionFilter } from "@src/interface/filter/HttpExceptionFilter";
import { ModifyProductParam } from "@src/interface/rest/param/ModifyProductParam";
import request from 'supertest';

/**
 * 商品変更コントローラのテストドライバ
 * [テスト実行コマンド]
 * npx jest test/interface/rest/controller/ProductModifyRESTController.spec.ts
 * @author Fullness,Inc.
 * @date 2025-03-20
 * @version 1.0.0
 */
describe('既存商品変更(ProductModifyRESTController)のテスト', () => {
    let app: INestApplication; // NestJSアプリケーションインスタンス
    /**
     * すべてのテストの前処理
     */
    beforeAll(async () => {
        const moduleFixture =  await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        // ValidationPipe を設定
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
                transform: true,
            }),
        );
        // 例外フィルターをグローバルに適用
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
        it('指定された商品Idの商品を取得する', async () => {
            // 存在する商品Idを指定
            const productId = '8f81a72a-58ef-422b-b472-d982e8665292'; 
            const response = await request(app.getHttpServer())
                .get(`/products/modify/${productId}`)
                .expect(200); // ステータスコード200を検証
            // レスポンスの検証
            expect(response.body).toMatchObject({
                id: productId,
                name: '水性ボールペン(赤)',
                price: 120,
            });
        });
        it('商品を更新する', async () => {
            var param = new ModifyProductParam();
            param.productId = 'ac413f22-0cf1-490a-9635-7e9ca810e544';
            param.name = '更新後の商品名';
            param.price = 150;
            const response = await request(app.getHttpServer())
                .put('/products/modify')
                .send(param) // リクエストボディを送信
                .expect(200); // ステータスコード200を検証
            // レスポンスメッセージを検証
            expect(response.body.message).toBe(
                `商品Id:${param.productId}の商品名を${param.name},単価を${param.price}に変更しました。`
            );
            //
            // テスト後にデータを復元
            //
            const restoreProductParam = {
                productId: param.productId,
                name: '水性ボールペン(黒)',
                price: 120,
            };
            await request(app.getHttpServer())
                .put('/products/modify')
                .send(restoreProductParam) // 復元データを送信
                .expect(200);
            // 復元されたデータを検証
            const restoredProductResponse = await request(app.getHttpServer())
                .get(`/products/modify/${restoreProductParam.productId}`)
                .expect(200);
            expect(restoredProductResponse.body.name).toBe(restoreProductParam.name);
            expect(restoredProductResponse.body.price).toBe(restoreProductParam.price);
        });
    });

    describe('異常系', () => {
        it("商品取得 - 存在しない商品Idの場合は404エラーを返す", async () => {
            // 存在しない商品Id
            const productId = '8f81a72a-58ef-422b-b472-d982e8665295'; 
            const response = await request(app.getHttpServer())
                .get(`/products/modify/${productId}`)
                .expect(404); // ステータスコード 404 を期待
            // エラーメッセージの検証
            expect(response.body.message)
            .toBe(`商品Id:(${productId})の商品は存在しません。`);
        });
        it("商品取得 - 無効な商品Idの場合は400エラーを返す", async () => {
            // 無効なUUID
            const invalidProductId = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; 
            const response = await request(app.getHttpServer())
                .get(`/products/modify/${invalidProductId}`)
                .expect(400); // ステータスコード 400 を期待
            
            // エラーメッセージの検証
            expect(response.body.message).toContain('商品Idは、UUIDです。');
        });

        it("商品変更 - 無効な商品Id(UUID)の場合は400エラーを返す", async () => {
            const invalidProductId = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
            const param = {
                productId: invalidProductId,
                name: '無効な商品',
                price: 800,
            };
            const response = await request(app.getHttpServer())
                .put('/products/modify')
                .send(param) // リクエストボディを送信
                .expect(400); // ステータスコード 400 を期待
            // エラーメッセージを検証
            expect(response.body.message).toContain('商品Idは、UUIDです。');
        });

        it("商品変更 - 存在しない商品Idの場合は404エラーを返す", async () => {
            const productId = 'ac413f22-0cf1-490a-9635-7e9ca810e548';
            const param = {
                productId: productId,
                name: '存在しない商品',
                price: 800,
            };
            const response = await request(app.getHttpServer())
                .put('/products/modify')
                .send(param) // リクエストボディを送信
                .expect(404); // ステータスコード 404 を期待
            // エラーレスポンスを検証
            expect(response.body).toEqual({
                statusCode: 404,
                timestamp: expect.any(String),
                path: '/products/modify',
                message: `商品Id:(${productId})の商品は存在しないため変更できませんでした。`,
            });
        });
    });

    describe('バリデーションエラー', () => {
        it('バリデーションエラーの場合は400エラーを返す', async () => {
            const param = {
                productId: 'b1524011-b6af-417e-8bf2-f449dd58b5c0',
                name: '', // 無効な商品名
                price: -1, // 無効な価格
            };
            const response = await request(app.getHttpServer())
                .put('/products/modify')
                .send(param) // リクエストボディを送信
                .expect(400); // ステータスコード 400 を期待
            // エラーレスポンスを検証
            expect(response.body).toEqual({
                statusCode: 400,
                timestamp: expect.any(String),
                path: '/products/modify',
                message: expect.arrayContaining([
                    '商品名は、必須です。',
                    '商品単価は50以上である必要があります。',
                ]),
            });
        });
    });
});