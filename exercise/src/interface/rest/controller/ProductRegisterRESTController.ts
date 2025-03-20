import {    Body, 
            Controller, 
            Get, 
            Inject, 
            Logger, 
            Param, 
            Post, 
            ValidationPipe} from "@nestjs/common";
import { CategoryDTO } from "@src/application/in/dto/CategoryDTO";
import { CategoryUsecase } from "@src/application/in/usecase/CategoryUsecase";
import { ProductUsecase } from "@src/application/in/usecase/ProductUsecase";
import { CategoryIdSearchParam } from "../param/CategoryIdSearchParam";
import { RegisterProductParam } from "../param/RegisterProductParam";
import { ProductDTO } from "@src/application/in/dto/ProductDTO";
import { Converter } from "@src/shared/adapter/Converter";
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

/**
 * 新商品登録RESTAPIコントローラ
 * @author Fullness,Inc.
 * @date 2025-03-20
 * @version 1.0.0
 */
@ApiTags("商品登録") // Swagger のカテゴリ設定
@Controller('products/register')
export class ProductRegisterRESTController {
    private readonly logger = new Logger(ProductRegisterRESTController.name);
    /**
     * コンストラクタ
     * @param productUsecase 商品ユースケース
     * @param categoryUsecase 商品カテゴリユースケース
     * @param converter RegisterProductParamからProductDTOへの変換クラス
     */
    constructor(
        @Inject('ProductUsecase')
        private readonly productUsecase: ProductUsecase,
        @Inject('CategoryUsecase')
        private readonly categoryUsecase: CategoryUsecase,
        @Inject('RegisterProductParamConverter')
        private readonly converter: Converter<RegisterProductParam , ProductDTO>
    ) {}

    /**
     * すべての商品カテゴリを取得するリクエストハンドラ
     * @url http://xxx/api/products/register/categories
     * @returns CategoryOutputの配列 
     */
    @ApiOperation({ summary: "全ての商品カテゴリを取得", description: "登録可能な商品カテゴリ一覧を取得" })
    @ApiResponse({ status: 200, description: "成功", type: [CategoryDTO] })
    @Get('categories')
    async getCategories(): Promise<CategoryDTO[]>{
        this.logger.log('すべての商品カテゴリを取得 開始');
        return this.categoryUsecase.getCategories();
    }
    
    /**
     * 指定された商品カテゴリIdの商品カテゴリを取得するリクエストハンドラ
     * @url http://xxx/api/products/register/{categoryId}
     * @returns CategoryResult
     */
    @ApiOperation({ summary: "カテゴリIDでカテゴリ情報を取得", description: "指定されたカテゴリIdの商品カテゴリを取得" })
    @ApiParam({ name: "categoryId", required: true, description: "取得する商品カテゴリのId", example: "12345" })
    @ApiResponse({ status: 200, description: "成功", type: CategoryDTO })
    @ApiResponse({ status: 404, description: "カテゴリが見つからない" })
    @Get(':categoryId')
    async getCategoryById(@Param() param: CategoryIdSearchParam): Promise<CategoryDTO> {
        this.logger.log(`受信した商品カテゴリId: ${param.categoryId} 開始`);
        return this.categoryUsecase.getCategoryById(param.categoryId);
    }

    /**
     * 商品を登録するリクエストハンドラ
     * @url http://xxx/api/products/register
     * @param RegisterProductParam 登録する商品のリクエストパラメータ
     * @returns 登録成功メッセージ
     */
    @ApiOperation({ summary: "新商品登録", description: "新しい商品を登録" })
    @ApiBody({
        description: "登録する商品情報",
        type: RegisterProductParam,
        examples: {
            example1: {
                summary: "正常なリクエスト",
                value: {
                    name: "ボールペン(黒)",
                    price: 200,
                    categoryId: "b1524011-b6af-417e-8bf2-f449dd58b5c0"
                },
            },
        },
    })
    @ApiResponse({ status: 201, description: "登録成功" })
    @ApiResponse({ status: 400, description: "バリデーションエラー" })
    @Post()
    async registerProduct(
            @Body(new ValidationPipe({ transform: true })) param: RegisterProductParam): Promise<{ message: string }> {
        this.logger.log(`受信した登録商品: ${param.name} 開始`);
        // 同一商品の有無を検証
        await this.productUsecase.  exists(param.name);
        // RegisterProductParamからProductDTOへ変換
        const product = await this.converter.convert(param);
        // 商品の永続化
        await this.productUsecase.register(product);
        return { message: `新商品:(${param.name})を登録しました。` };
    }
}