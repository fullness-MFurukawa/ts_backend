import { ProductRepository } from "@/application/out/repository/ProductRepository.js";
import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Like, Repository } from "typeorm";
import { ProductModel } from "../model/ProductModel.js";
import { Converter } from "@/shared/adapter/Converter.js";
import { Restorer } from "@/shared/adapter/Restorer.js";
import { Product } from "@/application/domain/models/product/Product.js";
import { ProductId } from "@/application/domain/models/product/ProductId.js";
import { ProductName } from "@/application/domain/models/product/ProductName.js";

/**
 * Productエンティティのリポジトリインターフェイス実装
 * @author Fullness,Inc.
 * @date 2025-03-10
 * @version 1.0.0
 */
@Injectable()
export class ProductRepositoryImpl implements ProductRepository<EntityManager>{
    /**
     * コンストラクタ
     * @param repository  ProductModelを利用するTypeORMのリポジトリ
     * @param converter ProductエンティティからProductModelへの変換
     * @param restorer  ProductModelからProductエンティティを復元
     */
    constructor(
        @InjectRepository(ProductModel)
        private readonly repository: Repository<ProductModel> ,
        @Inject('ProductModelConverter')
        private readonly converter: Converter<Product , ProductModel>,
        @Inject('ProductModelRestorer')
        private readonly restorer: Restorer<ProductModel , Product>,
    ){}

    /**
     * Idで商品を取得する
     * @param id 取得するProductのProductId
     * @param manager? EntityManager
     * @returns Productインスタンス、存在しない場合はnull
     */
    async findById(id: ProductId , manager?: EntityManager): Promise<Product | null> {
        // 引数managerが指定された場合は、EntityManagerを利用する
        // 引数managerが指定されない場合は、Repositoryを利用する
        const repo = manager ? manager.getRepository(ProductModel) : this.repository;
        const model = await repo.findOne(
        {   where: { objId: id.getValue() },
            relations: ['category'],
        });
        if (!model) return null;
        return this.restorer.restore(model);
    }
    /**
     * キーワードで商品を部分一致で取得する
     * @param keyword 取得するProductのキーワード
     * @param manager? EntityManager
     * @returns Productインスタンスの配列、存在しない場合はnull
     */
    async findByKeyword(keyword: ProductName , manager?: EntityManager): Promise<Product[] | null> {
        // 引数managerが指定された場合は、EntityManagerを利用する
        // 引数managerが指定されない場合は、Repositoryを利用する
        const repo = manager ? manager.getRepository(ProductModel) : this.repository;
        const models = await repo.find({
            where: { name: Like(`%${keyword.getValue()}%`) },
            relations: ['category'],
        });
        if (models.length === 0) return null;
        return this.restorer.restoreAll(models);
    }
    /**
     * 指定された商品の有無を返す
     * @param name 有無を調べる商品名
     * @param manager? EntityManager
     * @returns true:存在する false:存在しない
     */
    async exists(name: ProductName , manager?: EntityManager): Promise<boolean> {
        // 引数managerが指定された場合は、EntityManagerを利用する
        // 引数managerが指定されない場合は、Repositoryを利用する
        const repo = manager ? manager.getRepository(ProductModel) : this.repository;
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
    async create(product: Product , manager?: EntityManager): Promise<void> {
        // 引数managerが指定された場合は、EntityManagerを利用する
        // 引数managerが指定されない場合は、Repositoryを利用する
        const repo = manager ? manager.getRepository(ProductModel) : this.repository;
        const model = await this.converter.convert(product);
        await repo.save(model);
    }
    /**
     * 指定された商品Idの商品を変更する
     * @param product 変更対象のProductのインスタンス
     * @param manager? EntityManager
     */
    async updateById(product: Product , manager?: EntityManager): Promise<boolean> {
        // 引数managerが指定された場合は、EntityManagerを利用する
        // 引数managerが指定されない場合は、Repositoryを利用する
        const repo = manager ? manager.getRepository(ProductModel) : this.repository;
        const model = await this.converter.convert(product);
        const updateResult = await repo.update({ objId: product.getId().getValue() }, model);
        var result = false;
        if (updateResult.affected !== 0){
            result = true;
        }
        return result;
    }
    /**
     * 指定された商品Idの商品を削除する
     * @param id 削除するProductIdのインスタンス
     * @param manager? EntityManager
     */
    async deleteById(id: ProductId , manager?: EntityManager): Promise<boolean> {
        // 引数managerが指定された場合は、EntityManagerを利用する
        // 引数managerが指定されない場合は、Repositoryを利用する
        const repo = manager ? manager.getRepository(ProductModel) : this.repository;
        const deleteResult = await repo.delete({ objId: id.getValue() });
        var result = false;
        if (deleteResult.affected !== 0){
            result = true;
        }
        return result;
    }
}