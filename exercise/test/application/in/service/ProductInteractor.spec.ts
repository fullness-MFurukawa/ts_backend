import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing/test";
import { ProductDTO } from "@src/application/in/dto/ProductDTO";
import { ProductUsecase } from "@src/application/in/usecase/ProductUsecase";
import { AppModule } from "@src/AppModule";
import { ExistsException } from "@src/shared/exceptions/ExistsException";
import { NotFoundException } from "@src/shared/exceptions/NotFoundException";

/**
 * ProductInteractorのテストドライバ
 * [テスト実行コマンド]
 * npx jest test/application/in/service/ProductInteractor.spec.ts
 * @author Fullness,Inc.
 * @date 2025-03-15
 * @version 1.0.0
 */
describe('ProductInteractorの単体テスト', () => {
    let app: INestApplication;// NestJSアプリケーションインスタンス
    let usecase: ProductUsecase; // 商品ユースケース
    /**
     * すべてのテストの前処理
     * - AppModuleを基にテスト用のNestJSアプリケーションを作成
     * - ProductUsecaseをDIコンテナから取得
     */
    beforeAll(async () => {
        // テストモジュールの準備
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule], // 実際のモジュールを使用
        }).compile();
        app = moduleRef.createNestApplication();
        await app.init();
        // ユースケースを取得
        usecase = app.get<ProductUsecase>('ProductUsecase');
    });
    /**
     * すべてのテストの後処理
     */
    afterAll(async () => {
        if (app) {
            await app.close();
        }
    });

    describe('getByKeyowrd()メソッド', () => {
        it('キーワードボールペンで検索した場合、対応する商品を取得できる', async () => {
            // キーワード検索を実行する
            const products = await usecase.getByKeyword('ボールペン');
            // 取得した結果の検証
            expect(products).toBeInstanceOf(Array); 
            expect(products.length).toBeGreaterThan(0);
            const productNames = products.map((product) => product.name);
            expect(productNames).toContain('水性ボールペン(赤)');
            expect(productNames).toContain('水性ボールペン(黒)');
            expect(productNames).toContain('水性ボールペン(青)');
            expect(productNames).toContain('油性ボールペン(赤)');
            expect(productNames).toContain('油性ボールペン(黒)');
            expect(productNames).toContain('油性ボールペン(青)');    
        });
        it("キーワードを含む商品が存在しない場合、NotFoundExceptionがスローされる", async () => {
            await expect(usecase.getByKeyword('存在しない商品名')).rejects.toThrow(NotFoundException);
            await expect(usecase.getByKeyword('存在しない商品名')).rejects.toThrow(
            `キーワード:(存在しない商品名)を含む商品は見つかりませんでした`);
        });
    });

    describe('getByProductId()メソッドのテスト', () => {
        it('存在する商品Idで商品を正常に取得できる', async () => {
            const id = 'ac413f22-0cf1-490a-9635-7e9ca810e544';
            const product = await usecase.getByProductId(id);
            // 取得した商品データを検証
            expect(product.id)
                .toBe('ac413f22-0cf1-490a-9635-7e9ca810e544');
            expect(product.name).toBe('水性ボールペン(黒)'); 
            expect(product.price).toBe(120); 
            expect(product.category!.id)
                .toBe('b1524011-b6af-417e-8bf2-f449dd58b5c0'); 
        });
    });

    it('存在しない商品Idの場合、NotFoundExceptionがスローされる', async () => {
        const id = 'ac413f22-0cf1-490a-9635-7e9ca810e545';
        // エラーをスローすることを検証
        await expect(usecase.getByProductId(id)).rejects.toThrow(NotFoundException);
        await expect(usecase.getByProductId(id)).rejects.toThrow(
        `商品Id:(ac413f22-0cf1-490a-9635-7e9ca810e545)の商品は存在しません。`);
    });

    describe('exists()メソッドのテスト', () => {
        it('商品が存在しない場合、ExistsExceptionをスローしない', async () => {
            await expect(usecase.exists('消しゴム')).resolves.not.toThrow();
        });
        it('商品が存在する場合、ExistsExceptionをスローする', async () => {
            const name = '水性ボールペン(赤)'; 
            // テスト対象メソッドの実行と例外の検証
            await expect(usecase.exists(name)).rejects.toThrow(ExistsException);
            await expect(usecase.exists(name)).rejects.toThrow(
                `商品名:(水性ボールペン(赤))は既に登録済みです。`);
        });
    });

    describe('register()メソッド', () => {
        it('正常に商品が登録できる', async () => {
            const newProduct: ProductDTO = {
                id: null, // 新規作成
                name: "ノート",
                price: 500,
                category: {
                    id: "b1524011-b6af-417e-8bf2-f449dd58b5c0",
                    name: "文房具",
                },
            };
            await usecase.register(newProduct);
            // 登録結果を検証
            const resulrts = await usecase.getByKeyword('ノート');
            expect(resulrts).toHaveLength(1);
            expect(resulrts[0].name).toBe('ノート');
            expect(resulrts[0].price).toBe(500);
            expect(resulrts[0].category!.id).toBe('b1524011-b6af-417e-8bf2-f449dd58b5c0');
            // 後処理: 登録した商品を削除
            await usecase.delete(resulrts[0].id!);
        });
    });

    describe('modify()メソッドのテスト', () => {
        it('商品が存在する場合、商品を変更できる', async () => {
            const updateProduct: ProductDTO = {
                id: 'ac413f22-0cf1-490a-9635-7e9ca810e544', 
                name: '更新後のボールペン',
                price: 150,
                category: null,
            };
            await usecase.modify(updateProduct);
            const result = await usecase.getByProductId('ac413f22-0cf1-490a-9635-7e9ca810e544');
            // 更新結果を検証
            expect(result.name).toBe(updateProduct.name);
            expect(result.price).toBe(updateProduct.price);
            // データを復元する
            const restoreProduct: ProductDTO = {
                id: 'ac413f22-0cf1-490a-9635-7e9ca810e544', 
                name: '水性ボールペン(黒)',
                price: 120,
                category: null,
            };
            await usecase.modify(restoreProduct);
        });
        it('存在しない商品を変更した場合、NotFoundExceptionがスローされる', async () => {
            const updateProduct: ProductDTO = {
                id: 'ac413f22-0cf1-490a-9635-7e9ca810e545', 
                name: '更新後のボールペン',
                price: 150,
                category: null,
            };
            await expect(usecase.modify(updateProduct)).rejects.toThrow(NotFoundException);
            await expect(usecase.modify(updateProduct)).rejects.toThrow(
            `商品Id:(${updateProduct.id})の商品は存在しないため変更できませんでした。`);
        })
    });
});