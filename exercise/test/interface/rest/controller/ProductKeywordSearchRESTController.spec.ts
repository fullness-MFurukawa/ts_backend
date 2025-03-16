import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing/test";
import { AppModule } from "@src/AppModule";
import { HttpExceptionFilter } from "@src/interface/filter/HttpExceptionFilter";
import request from 'supertest';

/**
 * 商品キーワード検索コントローラのテストドライバ
 * [テスト実行コマンド]
 * npx jest test/interface/rest/controller/ProductKeywordSearchRESTController.spec.ts
 * @author Fullness,Inc.
 * @date 2025-03-16
 * @version 1.0.0
 */
describe('商品キーワード検索(ProductKeywordSearchRESTController)のテスト', () => {
    let app: INestApplication; // NestJSアプリケーションインスタンス
    /**
     * すべてのテストの前処理
     */
    beforeAll(async () => {
        const moduleFixture = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        app.useGlobalFilters(new HttpExceptionFilter()); // 例外フィルターを適用
        await app.init();
    });
    /**
     * すべてのテストの後処理
     */
    afterAll(async () => {
        if (app) {
            await app.close();
        }
    });

    /**
     * 共通のGETリクエスト関数
     */
    const sendSearchRequest = (keyword: string) => 
        request(app.getHttpServer()).get('/products/search').query({ keyword });

    describe('正常系', () => {
        it('商品キーワード検索で正しい結果を返す', async () => {
            const keyword = 'ボールペン';
            const response = await sendSearchRequest(keyword).expect(200);

            // 配列形式であることを検証
            expect(response.body).toBeInstanceOf(Array);
            // 取得できた件数を検証
            expect(response.body).toHaveLength(6);
            // 取得した商品の名称を検証
            const productNames = response.body.map((product: any) => product.name);
            expect(productNames).toEqual(expect.arrayContaining([
                '水性ボールペン(黒)',
                '水性ボールペン(赤)',
                '水性ボールペン(青)',
                '油性ボールペン(黒)',
                '油性ボールペン(赤)',
                '油性ボールペン(青)',
            ]));
        });
    });

    describe('異常系', () => {
        it('無効なキーワードの場合は404が返される', async () => {
            const keyword = '存在しない商品';
            const response = await sendSearchRequest(keyword).expect(404);
            // エラーレスポンスの構造を検証
            expect(response.body).toEqual({
                statusCode: 404,
                timestamp: expect.any(String), // タイムスタンプの検証
                path: `/products/search?keyword=${encodeURIComponent(keyword)}`, 
                message: `キーワード:(${keyword})を含む商品は見つかりませんでした。`,
            });
        });
        it('空のキーワードの場合は400が返される', async () => {
            const keyword = '';
            const response = await sendSearchRequest(keyword).expect(400);
            // エラーレスポンスの構造を検証
            expect(response.body).toEqual({
                statusCode: 400,
                timestamp: expect.any(String),
                path: `/products/search?keyword=${encodeURIComponent(keyword)}`, 
                message: ['キーワードは必須です。'],
            });
        });    
    });
});