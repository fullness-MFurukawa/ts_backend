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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryInteractor = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const InternalException_1 = require("../../../shared/exceptions/InternalException");
const NotFoundException_1 = require("../../../shared/exceptions/NotFoundException");
const CategoryId_1 = require("../../domain/model/category/CategoryId");
/**
 * 商品カテゴリユースケースインターフェイスの実装
 * @author Fullness,Inc.
 * @date 2025-03-15
 * @version 1.0.0
 */
let CategoryInteractor = class CategoryInteractor {
    /**
     * コンストラクタ
     * @param manager TypeORMのEntityManager
     * @param categoryConverter CategoryエンティティをCategoryDTOに変換する
     * @param repository CategoryRepositoryインターフェイス
     */
    constructor(manager, categoryConverter, repository) {
        this.manager = manager;
        this.categoryConverter = categoryConverter;
        this.repository = repository;
        this.logger = new common_1.Logger('CategoryInteractor');
    }
    /**
     * すべての商品カテゴリを取得する
     * @returns CategoryDTOの配列
     * @throws InternalException
     */
    async getCategories() {
        try {
            var results = await this.repository.findAll(this.manager);
            return await this.categoryConverter.convertAll(results);
        }
        catch (error) {
            this.logger.error(`getAll() 失敗: ${error}`, error);
            throw new InternalException_1.InternalException('すべての商品カテゴリの取得に失敗しました。');
        }
    }
    /**
     * 指定された商品カテゴリIdの商品カテゴリを取得する
     * @param id 商品カテゴリId
     * @returns CategoryDTO
     * @throws NotFoundException
     * @throws InternalException
     */
    async getCategoryById(id) {
        try {
            const result = await this.repository.findById(CategoryId_1.CategoryId.fromString(id), this.manager);
            if (!result) {
                throw new NotFoundException_1.NotFoundException(`商品カテゴリId:(${id})の商品カテゴリは存在しません。`);
            }
            return await this.categoryConverter.convert(result);
        }
        catch (error) {
            if (error instanceof NotFoundException_1.NotFoundException)
                throw error;
            this.logger.error(`getById() 失敗: ${error}`, error);
            throw new InternalException_1.InternalException(`商品カテゴリId(${id})の取得に失敗しました。`);
        }
    }
};
exports.CategoryInteractor = CategoryInteractor;
exports.CategoryInteractor = CategoryInteractor = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectEntityManager)()),
    __param(1, (0, common_1.Inject)('CategoryDTOConverter')),
    __param(2, (0, common_1.Inject)('CategoryRepository')),
    __metadata("design:paramtypes", [typeorm_2.EntityManager, Object, Object])
], CategoryInteractor);
