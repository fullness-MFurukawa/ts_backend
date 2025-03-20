import { Injectable } from "@nestjs/common";
import { Converter } from "@src/shared/adapter/Converter";
import { ModifyProductParam } from "../param/ModifyProductParam";
import { ProductDTO } from "@src/application/in/dto/ProductDTO";

/**
 * ModifyProductParamからProductDTOへの変換クラス
 * @author Fullness,Inc.
 * @date 2025-03-20
 * @version 1.0.0
 */
@Injectable()
export class ModifyProductParamConverter implements Converter<ModifyProductParam , ProductDTO> {
    /**
     * ModifyProductParam型の値をProductDTO型に変換する
     * @param source 変換対象
     * @returns 変換結果
     */
    async convert(source: ModifyProductParam): Promise<ProductDTO> {
        const product: ProductDTO = {
            id: source.productId,
            name: source.name,
            price: source.price,
            category: null
        };
        return product;
    }
    /**
     * 使用しないため実装
     * @param sources 
     */
    convertAll(sources: ModifyProductParam[]): Promise<ProductDTO[]> {
        throw new Error("Method not implemented.");
    }
}