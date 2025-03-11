import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { CategoryModel } from "../model/CategoryModel";
import { Restorer } from "@src/shared/adapter/Restorer";
import { Category } from "@src/application/domain/model/category/Category";
import { CategoryId } from "@src/application/domain/model/category/CategoryId";
import { CategoryRepository } from "@src/application/out/repository/CategoryRepository";



/**
 * Categoryエンティティのリポジトリインターフェイス実装
 * @author Fullness,Inc.
 * @date 2025-03-10
 * @version 1.0.0
 */
@Injectable()
export class CategoryRepositoryImpl implements CategoryRepository<EntityManager>{
    /**
     * コンストラクタ
     * @param repository TypeORMのRepository
     * @param restorer  CategoryModelからCategoryエンティティを復元
     */
    constructor(
        @InjectRepository(CategoryModel)
        private readonly repository: Repository<CategoryModel>,
        @Inject('CategoryModelRestorer')
        private readonly restorer: Restorer<CategoryModel , Category>,
    ){}
    /**
     * Idで商品カテゴリを取得する
     * @param id 取得するCategoryのCategoryId
     * @param manager? TypeORMのEntityManager
     * @returns Categoryインスタンス、存在しない場合はnull
     */
    async findById(id: CategoryId , manager?: EntityManager): Promise<Category | null> {
        // 引数managerが指定された場合は、EntityManagerを利用する
        // 引数managerが指定されない場合は、Repositoryを利用する
        const repo = manager ? manager.getRepository(CategoryModel) : this.repository;
        const model = await repo.findOne({ where: { objId: id.getValue() } });
        if (!model) {
            return null; // 見つからない場合はnullを返す
        }
        // モデルをエンティティに変換して返す
        return this.restorer.restore(model);
    }
    /**
     * すべての商品カテゴリを取得する
     * @param manager? TypeORMのEntityManager
     * @returns すべてのCategoryインスタンスの配列
     */
    async findAll(manager?: EntityManager): Promise<Category[]> {
        // 引数managerが指定された場合は、EntityManagerを利用する
        // 引数managerが指定されない場合は、Repositoryを利用する
        const repo = manager ? manager.getRepository(CategoryModel) : this.repository;
        // リポジトリを使用してすべてのモデルを取得
        const models = await repo.find();
        // モデルリストをエンティティリストに変換して返す
        return this.restorer.restoreAll(models);
    }
}