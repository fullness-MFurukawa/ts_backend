import { Inject, Injectable, Logger } from "@nestjs/common";
import { ProductUsecase } from "../usecase/ProductUsecase";
import { ProductDTO } from "../dto/ProductDTO";
import { InjectEntityManager } from "@nestjs/typeorm";
import { EntityManager } from "typeorm";
import { Converter } from "@src/shared/adapter/Converter";
import { Product } from "@src/application/domain/model/product/Product";
import { ProductRepository } from "@src/application/out/repository/ProductRepository";
import { ProductName } from "@src/application/domain/model/product/ProductName";
import { NotFoundException } from "@src/shared/exceptions/NotFoundException";
import { InternalException } from "@src/shared/exceptions/InternalException";
import { ProductId } from "@src/application/domain/model/product/ProductId";
import { ExistsException } from "@src/shared/exceptions/ExistsException";
import { Restorer } from "@src/shared/adapter/Restorer";

/**
 * 商品ユースケースインターフェイスの実装
 * @author Fullness,Inc.
 * @date 2025-03-15
 * @version 1.0.0
 */
@Injectable()
export class ProductInteractor implements ProductUsecase{
    private readonly logger = new Logger('ProductInteractor');
    /**
     * コンストラクタ
     * @param manager TypeORMのEntityManager
     * @param productConverter ProductエンティティをProductDTOに変換する
     * @param productRestorer ProductDTOからProductエンティティを復元する
     * @param repository ProductRepositoryインターフェイス
     */
    constructor(
        @InjectEntityManager()
        private readonly manager: EntityManager,
        @Inject('ProductDTOConverter')
        private readonly productConverter: Converter<Product , ProductDTO>,
        @Inject('ProductDTORestorer')
        private readonly productRestorer: Restorer<ProductDTO , Product>,
        @Inject('ProductRepository')
        private readonly repository: ProductRepository<EntityManager>,
    ) {}

    /**
     * 指定されたキーワードを含む商品の取得結果を返す
     * @param keyword 商品キーワード
     * @returns ProductDTOの配列
     * @throws NotFoundException 商品が存在しない
     * @throws InternalException 内部エラー
     */
    async getByKeyword(keyword: string): Promise<ProductDTO[]> {
        try{
            const results = 
            await this.repository.findByKeyword(ProductName.fromString(keyword), this.manager);
            if (!results || results.length === 0){
                throw new NotFoundException(
                `キーワード:(${keyword})を含む商品は見つかりませんでした。`);
            }
            return await this.productConverter.convertAll(results); 
        }catch(error){
            if (error instanceof NotFoundException) throw error;
            this.logger.error(`getByKeyword() 失敗: ${error}` , error);
            throw new InternalException(
                    `商品キーワード(${keyword})の検索に失敗しました。`);
        }
    }

    /**
     * 指定された商品Idのエンティティを取得する
     * @param id 商品Id
     * @returns ProductDTO
     * @throws NotFoundException 商品が存在しない
     * @throws InternalException 内部エラー
     */
    async getByProductId(id: string): Promise<ProductDTO> {
        try{
            var result = 
            await this.repository.findById(ProductId.fromString(id) , this.manager);
            if (!result){
                throw new NotFoundException(
                `商品Id:(${id})の商品は存在しません。`);
            }
            return await this.productConverter.convert(result);
        }catch(error){
            if (error instanceof NotFoundException) throw error;
            this.logger.error(`getByProductId() 失敗: ${error}` , error);
            throw new InternalException(
                    `商品Id(${id})の検索に失敗しました。`);
        }
    }

    /**
     * 指定された商品の存在有無を調べる
     * @param name 商品名
     * @throws InternalError 内部エラー
     * @throws ExistsError 指定された商品が存在する
     */
    async exists(name: string): Promise<void> {
        try{
            var result = 
            await this.repository.exists(ProductName.fromString(name) , this.manager);
            if (result){
                throw new ExistsException(
                `商品名:(${name})は既に登録済みです。`);
            }
        }catch(error){
            if (error instanceof ExistsException) throw error;
            this.logger.error(`exists() 失敗: ${error}` , error);
            throw new InternalException(
                    `商品名(${name})の存在有無チェックに失敗しました。`);
        }
    }

    /**
     * 新商品を登録する
     * @param product 登録対象のProductDTO
     * @throws InternalError 内部エラー
     */
    async register(product: ProductDTO): Promise<void> {
        try{
            const newProduct = await this.productRestorer.restore(product);
            await this.repository.create(newProduct , this.manager);
        }catch(error){
            this.logger.error(`register() 失敗: ${error}` , error);
            throw new InternalException(
                    `商品(${product.name})の登録に失敗しました。`);
        }
    }

    /**
     * 商品名または単価を変更する
     * @param product ProductDTO
     * @throws NotFoundException 商品が存在しない
     * @throws InternalError 内部エラー
     */
    async modify(product: ProductDTO): Promise<void> {
        try{
            var updateProduct = await this.productRestorer.restore(product);
            var result = await this.repository.updateById(updateProduct,this.manager);
            if (!result){
                throw new NotFoundException(
                    `商品Id:(${product.id})の商品は存在しないため変更できませんでした。`);
            }
        }catch(error){
            if (error instanceof NotFoundException) throw error;
            this.logger.error(`modify() 失敗: ${error}` , error);
            throw new InternalException(
                    `商品Id(${product.id})の変更に失敗しました。`);
        }
    }

    /**
     * 商品を削除する
     * @param id 商品Id
     * @throws NotFoundException 商品が存在しない
     * @throws InternalException 内部エラー
     */
    async delete(id: string): Promise<void>{
        try{
            var result = 
            await this.repository.deleteById(ProductId.fromString(id),this.manager);
            if (!result){
                throw new NotFoundException(
                    `商品Id:(${id})の商品は存在しないため削除できませんでした。`);
            }
        }catch(error){
            if (error instanceof NotFoundException) throw error;
            this.logger.error(`delete() 失敗: ${error}` , error);
            throw new InternalException(
                    `商品Id(${id})の削除に失敗しました。`);
        }
    }
}