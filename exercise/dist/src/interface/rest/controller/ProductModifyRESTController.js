"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ProductModifyRESTController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModifyRESTController = void 0;
const common_1 = require("@nestjs/common");
const ProductDTO_1 = require("../../../application/in/dto/ProductDTO");
const ProductIdSearchParam_1 = require("../param/ProductIdSearchParam");
const ModifyProductParam_1 = require("../param/ModifyProductParam");
const swagger_1 = require("@nestjs/swagger");
/**
 * 既存商品の変更RESTAPIコントローラ
 * @author Fullness,Inc.
 * @date 2025-03-20
 * @version 1.0.0
 */
let ProductModifyRESTController = ProductModifyRESTController_1 = class ProductModifyRESTController {
    /**
     * コンストラクタ
     * @param productUsecase 商品ユースケース
     * @param converter ModifyProductParamからProductDTOへの変換クラス
     */
    constructor(productUsecase, converter) {
        this.productUsecase = productUsecase;
        this.converter = converter;
        this.logger = new common_1.Logger(ProductModifyRESTController_1.name);
    }
    /**
     * 指定された商品Idの商品を取得するリクエストハンドラ
     * @url http://xxx/api/products/modify/{productId}
     * @returns ProductResult
     */
    async getProduct(param) {
        this.logger.log(`受信した商品Id: ${param.productId} 開始`);
        return await this.productUsecase.getByProductId(param.productId);
    }
    /**
     * 商品を変更するリクエストハンドラ
     * @url http://xxx/api/products/modify
     * @param ModifyProductParam 変更する商品のパラメータ
     * @returns 変更成功メッセージ
     */
    async modifyProduct(param) {
        this.logger.log(`受信した変更商品: ${param.name}`);
        // ModifyProductParamをProductDTOに変換する
        const product = await this.converter.convert(param);
        // 商品を変更する
        await this.productUsecase.modify(product);
        const message = `商品Id:${param.productId}の商品名を${param.name},単価を${param.price}に変更しました。`;
        return { message: message };
    }
};
exports.ProductModifyRESTController = ProductModifyRESTController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "商品Idで商品情報を取得", description: "指定された商品Idの商品を取得" }),
    (0, swagger_1.ApiParam)({ name: "productId", description: "取得する商品のId", example: "550e8400-e29b-41d4-a716-446655440000" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "成功", type: ProductDTO_1.ProductDTO }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "商品が見つからない" }),
    (0, common_1.Get)(':productId'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ProductIdSearchParam_1.ProductIdSearchParam]),
    __metadata("design:returntype", Promise)
], ProductModifyRESTController.prototype, "getProduct", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "商品情報を変更", description: "指定された商品の情報を更新" }),
    (0, swagger_1.ApiBody)({
        description: "変更する商品情報",
        type: ModifyProductParam_1.ModifyProductParam,
        examples: {
            example1: {
                summary: "正常なリクエスト",
                value: {
                    productId: "550e8400-e29b-41d4-a716-446655440000",
                    name: "ゲルインクボールペン(青)",
                    price: 300
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "変更成功" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "バリデーションエラー" }),
    (0, common_1.Put)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK) // ステータスコードを200に設定
    ,
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ModifyProductParam_1.ModifyProductParam]),
    __metadata("design:returntype", Promise)
], ProductModifyRESTController.prototype, "modifyProduct", null);
exports.ProductModifyRESTController = ProductModifyRESTController = ProductModifyRESTController_1 = __decorate([
    (0, swagger_1.ApiTags)("商品変更(商品名、単価)") // Swaggerのカテゴリ設定
    ,
    (0, common_1.Controller)('products/modify'),
    __param(0, (0, common_1.Inject)('ProductUsecase')),
    __param(1, (0, common_1.Inject)('ModifyProductParamConverter')),
    __metadata("design:paramtypes", [Object, Object])
], ProductModifyRESTController);
