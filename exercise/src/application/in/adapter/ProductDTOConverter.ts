import { Inject, Injectable } from "@nestjs/common";
import { Product } from "@src/application/domain/model/product/Product";
import { Converter } from "@src/shared/adapter/Converter";
import { ProductDTO } from "../dto/ProductDTO";
import { Category } from "@src/application/domain/model/category/Category";
import { CategoryDTO } from "../dto/CategoryDTO";

/**
 * ProductエンティティからProductDTOへの変換クラス
 * @author Fullness,Inc.
 * @date 2025-03-14
 * @version 1.0.0
 */
@Injectable()
export class ProductDTOConverter implements Converter<Product , ProductDTO> {
    /**
     * コンストラクタ
     * @param categoryConverter CategoryOutputへ変換する
     */
    constructor(
        @Inject('CategoryDTOConverter')
        private readonly categoryConverter: Converter<Category , CategoryDTO>,){}
    /**
     * 商品からProductDTOに変換する
     * @param product Productエンティティ
     * @returns ProductDTO
     */    
    async convert(source: Product): Promise<ProductDTO> {
        let result = new ProductDTO();
        result.id = source.getId().getValue();
        result.name = source.getName().getValue();
        result.price = source.getPrice().getValue();
        if (source.getCategory() !== null){
            result.category = 
            await this.categoryConverter.convert(source.getCategory()!);
        }
        return result;
    }
    /**
     * 複数の商品からProductDTOの配列に変換する
     * @param products Productエンティティの配列
     * @returns ProductDTOの配列
     */
    async convertAll(sources: Product[]): Promise<ProductDTO[]> {
        return Promise.all(sources.map((product) => this.convert(product)));
    }
}