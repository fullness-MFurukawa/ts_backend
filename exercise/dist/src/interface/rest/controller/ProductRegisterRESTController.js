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
var ProductRegisterRESTController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRegisterRESTController = void 0;
const common_1 = require("@nestjs/common");
const CategoryDTO_1 = require("../../../application/in/dto/CategoryDTO");
const CategoryIdSearchParam_1 = require("../param/CategoryIdSearchParam");
const RegisterProductParam_1 = require("../param/RegisterProductParam");
const swagger_1 = require("@nestjs/swagger");
/**
 * 新商品登録RESTAPIコントローラ
 * @author Fullness,Inc.
 * @date 2025-03-20
 * @version 1.0.0
 */
let ProductRegisterRESTController = ProductRegisterRESTController_1 = class ProductRegisterRESTController {
    /**
     * コンストラクタ
     * @param productUsecase 商品ユースケース
     * @param categoryUsecase 商品カテゴリユースケース
     * @param converter RegisterProductParamからProductDTOへの変換クラス
     */
    constructor(productUsecase, categoryUsecase, converter) {
        this.productUsecase = productUsecase;
        this.categoryUsecase = categoryUsecase;
        this.converter = converter;
        this.logger = new common_1.Logger(ProductRegisterRESTController_1.name);
    }
    /**
     * すべての商品カテゴリを取得するリクエストハンドラ
     * @url http://xxx/api/products/register/categories
     * @returns CategoryOutputの配列
     */
    async getCategories() {
        this.logger.log('すべての商品カテゴリを取得 開始');
        return this.categoryUsecase.getCategories();
    }
    /**
     * 指定された商品カテゴリIdの商品カテゴリを取得するリクエストハンドラ
     * @url http://xxx/api/products/register/{categoryId}
     * @returns CategoryResult
     */
    async getCategoryById(param) {
        this.logger.log(`受信した商品カテゴリId: ${param.categoryId} 開始`);
        return this.categoryUsecase.getCategoryById(param.categoryId);
    }
    /**
     * 商品を登録するリクエストハンドラ
     * @url http://xxx/api/products/register
     * @param RegisterProductParam 登録する商品のリクエストパラメータ
     * @returns 登録成功メッセージ
     */
    async registerProduct(param) {
        this.logger.log(`受信した登録商品: ${param.name} 開始`);
        // 同一商品の有無を検証
        await this.productUsecase.exists(param.name);
        // RegisterProductParamからProductDTOへ変換
        const product = await this.converter.convert(param);
        // 商品の永続化
        await this.productUsecase.register(product);
        return { message: `新商品:(${param.name})を登録しました。` };
    }
};
exports.ProductRegisterRESTController = ProductRegisterRESTController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "全ての商品カテゴリを取得", description: "登録可能な商品カテゴリ一覧を取得" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "成功", type: [CategoryDTO_1.CategoryDTO] }),
    (0, common_1.Get)('categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductRegisterRESTController.prototype, "getCategories", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "カテゴリIDでカテゴリ情報を取得", description: "指定されたカテゴリIdの商品カテゴリを取得" }),
    (0, swagger_1.ApiParam)({ name: "categoryId", required: true, description: "取得する商品カテゴリのId", example: "12345" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "成功", type: CategoryDTO_1.CategoryDTO }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "カテゴリが見つからない" }),
    (0, common_1.Get)(':categoryId'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CategoryIdSearchParam_1.CategoryIdSearchParam]),
    __metadata("design:returntype", Promise)
], ProductRegisterRESTController.prototype, "getCategoryById", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "新商品登録", description: "新しい商品を登録" }),
    (0, swagger_1.ApiBody)({
        description: "登録する商品情報",
        type: RegisterProductParam_1.RegisterProductParam,
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
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "登録成功" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "バリデーションエラー" }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe({ transform: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RegisterProductParam_1.RegisterProductParam]),
    __metadata("design:returntype", Promise)
], ProductRegisterRESTController.prototype, "registerProduct", null);
exports.ProductRegisterRESTController = ProductRegisterRESTController = ProductRegisterRESTController_1 = __decorate([
    (0, swagger_1.ApiTags)("商品登録") // Swagger のカテゴリ設定
    ,
    (0, common_1.Controller)('products/register'),
    __param(0, (0, common_1.Inject)('ProductUsecase')),
    __param(1, (0, common_1.Inject)('CategoryUsecase')),
    __param(2, (0, common_1.Inject)('RegisterProductParamConverter')),
    __metadata("design:paramtypes", [Object, Object, Object])
], ProductRegisterRESTController);
