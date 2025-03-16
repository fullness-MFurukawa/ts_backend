import { Inject, Injectable, Logger } from "@nestjs/common";
import { CategoryUsecase } from "../usecase/CategoryUsecase";
import { CategoryDTO } from "../dto/CategoryDTO";
import { InjectEntityManager } from "@nestjs/typeorm";
import { EntityManager } from "typeorm";
import { Converter } from "@src/shared/adapter/Converter";
import { Category } from "@src/application/domain/model/category/Category";
import { CategoryRepository } from "@src/application/out/repository/CategoryRepository";
import { InternalException } from "@src/shared/exceptions/InternalException";
import { NotFoundException } from "@src/shared/exceptions/NotFoundException";
import { CategoryId } from "@src/application/domain/model/category/CategoryId";

/**
 * 商品カテゴリユースケースインターフェイスの実装
 * @author Fullness,Inc.
 * @date 2025-03-15
 * @version 1.0.0
 */
@Injectable()
export class CategoryInteractor implements CategoryUsecase{
    private readonly logger = new Logger('CategoryInteractor');
    /**
     * コンストラクタ
     * @param manager TypeORMのEntityManager
     * @param categoryConverter CategoryエンティティをCategoryDTOに変換する
     * @param repository CategoryRepositoryインターフェイス
     */
    constructor(
        @InjectEntityManager()
        private readonly manager: EntityManager,
        @Inject('CategoryDTOConverter')
        private readonly categoryConverter: Converter<Category , CategoryDTO>,
        @Inject('CategoryRepository')
        private readonly repository: CategoryRepository<EntityManager>,
    ) {}

    /**
     * すべての商品カテゴリを取得する
     * @returns CategoryDTOの配列
     * @throws InternalException
     */
    async getCategories(): Promise<CategoryDTO[]> {
        try{
            var results = await this.repository.findAll(this.manager);
            return await this.categoryConverter.convertAll(results);
        }catch(error){
            this.logger.error(`getAll() 失敗: ${error}` , error);
            throw new InternalException('すべての商品カテゴリの取得に失敗しました。');
        }
    }

    /**
     * 指定された商品カテゴリIdの商品カテゴリを取得する
     * @param id 商品カテゴリId
     * @returns CategoryDTO
     * @throws NotFoundException
     * @throws InternalException
     */
    async getCategoryById(id: string): Promise<CategoryDTO> {
        try{
            const result = await this.repository.findById(
                CategoryId.fromString(id) , this.manager);
            if (!result){
                throw new NotFoundException(
                `商品カテゴリId:(${id})の商品カテゴリは存在しません。`);
            }
            return await this.categoryConverter.convert(result);
        }catch(error){
            if (error instanceof NotFoundException) throw error;
            this.logger.error(`getById() 失敗: ${error}` , error);
            throw new InternalException(
                `商品カテゴリId(${id})の取得に失敗しました。`);
        }
    }
}