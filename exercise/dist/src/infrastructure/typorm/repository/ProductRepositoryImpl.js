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
exports.ProductRepositoryImpl = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ProductModel_1 = require("../model/ProductModel");
/**
 * Productエンティティのリポジトリインターフェイス実装
 * @author Fullness,Inc.
 * @date 2025-03-10
 * @version 1.0.0
 */
let ProductRepositoryImpl = class ProductRepositoryImpl {
    /**
     * コンストラクタ
     * @param repository  ProductModelを利用するTypeORMのリポジトリ
     * @param converter ProductエンティティからProductModelへの変換
     * @param restorer  ProductModelからProductエンティティを復元
     */
    constructor(repository, converter, restorer) {
        this.repository = repository;
        this.converter = converter;
        this.restorer = restorer;
    }
    /**
     * Idで商品を取得する
     * @param id 取得するProductのProductId
     * @param manager? EntityManager
     * @returns Productインスタンス、存在しない場合はnull
     */
    async findById(id, manager) {
        // 引数managerが指定された場合は、EntityManagerを利用する
        // 引数managerが指定されない場合は、Repositoryを利用する
        const repo = manager ? manager.getRepository(ProductModel_1.ProductModel) : this.repository;
        const model = await repo.findOne({ where: { objId: id.getValue() },
            relations: ['category'],
        });
        if (!model)
            return null;
        return this.restorer.restore(model);
    }
    /**
     * キーワードで商品を部分一致で取得する
     * @param keyword 取得するProductのキーワード
     * @param manager? EntityManager
     * @returns Productインスタンスの配列、存在しない場合はnull
     */
    async findByKeyword(keyword, manager) {
        // 引数managerが指定された場合は、EntityManagerを利用する
        // 引数managerが指定されない場合は、Repositoryを利用する
        const repo = manager ? manager.getRepository(ProductModel_1.ProductModel) : this.repository;
        const models = await repo.find({
            where: { name: (0, typeorm_2.Like)(`%${keyword.getValue()}%`) },
            relations: ['category'],
        });
        if (models.length === 0)
            return null;
        return this.restorer.restoreAll(models);
    }
    /**
     * 指定された商品の有無を返す
     * @param name 有無を調べる商品名
     * @param manager? EntityManager
     * @returns true:存在する false:存在しない
     */
    async exists(name, manager) {
        // 引数managerが指定された場合は、EntityManagerを利用する
        // 引数managerが指定されない場合は、Repositoryを利用する
        const repo = manager ? manager.getRepository(ProductModel_1.ProductModel) : this.repository;
        const count = await repo.count({
            where: { name: name.getValue() },
        });
        return count > 0;
    }
    /**
     * 商品を永続化する
     * @param product 永続化するProductのインスタンス
     * @param manager? EntityManager
     */
    async create(product, manager) {
        // 引数managerが指定された場合は、EntityManagerを利用する
        // 引数managerが指定されない場合は、Repositoryを利用する
        const repo = manager ? manager.getRepository(ProductModel_1.ProductModel) : this.repository;
        const model = await this.converter.convert(product);
        await repo.save(model);
    }
    /**
     * 指定された商品Idの商品を変更する
     * @param product 変更対象のProductのインスタンス
     * @param manager? EntityManager
     */
    async updateById(product, manager) {
        // 引数managerが指定された場合は、EntityManagerを利用する
        // 引数managerが指定されない場合は、Repositoryを利用する
        const repo = manager ? manager.getRepository(ProductModel_1.ProductModel) : this.repository;
        const model = await this.converter.convert(product);
        const updateResult = await repo.update({ objId: product.getId().getValue() }, model);
        var result = false;
        if (updateResult.affected !== 0) {
            result = true;
        }
        return result;
    }
    /**
     * 指定された商品Idの商品を削除する
     * @param id 削除するProductIdのインスタンス
     * @param manager? EntityManager
     */
    async deleteById(id, manager) {
        // 引数managerが指定された場合は、EntityManagerを利用する
        // 引数managerが指定されない場合は、Repositoryを利用する
        const repo = manager ? manager.getRepository(ProductModel_1.ProductModel) : this.repository;
        const deleteResult = await repo.delete({ objId: id.getValue() });
        var result = false;
        if (deleteResult.affected !== 0) {
            result = true;
        }
        return result;
    }
};
exports.ProductRepositoryImpl = ProductRepositoryImpl;
exports.ProductRepositoryImpl = ProductRepositoryImpl = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ProductModel_1.ProductModel)),
    __param(1, (0, common_1.Inject)('ProductModelConverter')),
    __param(2, (0, common_1.Inject)('ProductModelRestorer')),
    __metadata("design:paramtypes", [typeorm_2.Repository, Object, Object])
], ProductRepositoryImpl);
