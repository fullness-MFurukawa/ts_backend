import { Inject, Injectable } from "@nestjs/common";
import { Product } from "@src/application/domain/model/product/Product";
import { Converter } from "@src/shared/adapter/Converter";
import { ProductModel } from "../model/ProductModel";
import { CategoryModelConverter } from "./CategoryModelConverter";

/**
 * ProductエンティティをProductModelへ変換する
 * @author Fullness,Inc.
 * @date 2025-03-10
 * @version 1.0.0
 */
@Injectable()
export class ProductModelConverter implements Converter<Product , ProductModel>{
    /**
     * コンストラクタ
     * @param categoryConverter CategoryエンティティをCategoryModelに変換
     */
    constructor(
        @Inject('CategoryModelConverter')
        private readonly categoryConverter: CategoryModelConverter,
    ){}
    /**
     * ProductからProductModelに変換する
     * @param source Product
     * @returns ProductModel
     */
    async convert(source: Product): Promise<ProductModel> {
        const model = new ProductModel();
        model.objId = source.getId().getValue();
        model.name = source.getName().getValue();
        model.price = source.getPrice().getValue();
        if (source.getCategory()) {
            model.category = 
            await this.categoryConverter.convert(source.getCategory()!);
        }
        return model;
    }
    /**
     * Productの配列をProductModelに配列に変換する
     * @param sources Productの配列
     * @returns ProductModelの配列
     */
    async convertAll(sources: Product[]): Promise<ProductModel[]> {
        return Promise.all(sources.map(product => this.convert(product)));
    }
}