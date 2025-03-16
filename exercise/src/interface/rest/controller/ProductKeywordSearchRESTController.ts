import { Controller, Get, Inject, Logger, Query, ValidationPipe } from "@nestjs/common";
import { KeywordSearchParam } from "../param/KeywordSearchParam";
import { ProductDTO } from "@src/application/in/dto/ProductDTO";
import { ProductUsecase } from "@src/application/in/usecase/ProductUsecase";

/**
 * 商品キーワード検索RESTAPIコントローラ
 * @author Fullness,Inc.
 * @date 2025-03-16
 * @version 1.0.0
 */
@Controller('products/search')
export class ProductKeywordSearchRESTController {
    private readonly logger = new Logger(ProductKeywordSearchRESTController.name);
    /**
     * コンストラクタ
     * @param usecase 商品ユースケース
     */
    constructor(
        @Inject('ProductUsecase')
        private readonly usecase: ProductUsecase,){}
    
    /**
     * 商品キーワード検索リクエストハンドラ
     * @param keyword 商品キーワード
     */
    @Get()
    async searchByKeyword(
    @Query(new ValidationPipe({ transform: true })) param: KeywordSearchParam): Promise<ProductDTO[]> {
        this.logger.log(`受信した商品キーワード:${param.keyword} 開始`);
        // 受信したキーワードで商品検索する
        return await this.usecase.getByKeyword(param.keyword);
    }
}