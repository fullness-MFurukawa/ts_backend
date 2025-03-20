import { ProductDTO } from "@src/application/in/dto/ProductDTO";
import { RegisterProductParam } from "../param/RegisterProductParam";
import { CategoryDTO } from "@src/application/in/dto/CategoryDTO";
import { Converter } from "@src/shared/adapter/Converter";
import { Injectable } from "@nestjs/common";

/**
 * RegisterProductParamからProductDTOへの変換クラス
 * @author Fullness,Inc.
 * @date 2025-03-20
 * @version 1.0.0
 */
@Injectable()
export class RegisterProductParamConverter implements Converter<RegisterProductParam , ProductDTO> {
    
    /**
     * RegisterProductParam型の値をProductDTO型に変換する
     * @param source 変換対象
     * @returns 変換結果
     */
    async convert(source: RegisterProductParam): Promise<ProductDTO> {
        const category: CategoryDTO = {
            id: source.categoryId,
            name: 'dummy'
        };
        const product: ProductDTO = {
            id: null,
            name: source.name,
            price: source.price,
            category: category
        };
        return product;
    }

    /**
     * 使用しないため実装
     * @param sources 
     */
    convertAll(sources: RegisterProductParam[]): Promise<ProductDTO[]> {
        throw new Error("Method not implemented.");
    }
}