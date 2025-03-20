import { Inject, Injectable } from "@nestjs/common";
import { Restorer } from "@src/shared/adapter/Restorer";
import { Product } from "@src/application/domain/model/product/Product";
import { CategoryModelRestorer } from "./CategoryModelRestorer";
import { ProductId } from "@src/application/domain/model/product/ProductId";
import { ProductName } from "@src/application/domain/model/product/ProductName";
import { ProductPrice } from "@src/application/domain/model/product/ProductPrice";
import { ProductModel } from "../model/ProductModel";


/**
 * ProductModelからProductエンティティを復元する
 * @author Fullness,Inc.
 * @date 2025-03-10
 * @version 1.0.0
 */
@Injectable()
export class ProductModelRestorer implements Restorer<ProductModel , Product>{
    /**
     * コンストラクタ
     * @param categoryRestorer CategoryModelからCategoryを復元する
     */
    constructor(
        @Inject('CategoryModelRestorer')
        private readonly categoryRestorer: CategoryModelRestorer,
    ){}
    /**
     * ProductModelからProductエンティティを復元する
     * @param source ProductModel
     * @returns 復元されたProductエンティティ
     */
    async restore(source: ProductModel): Promise<Product> {
        const id = ProductId.fromString(source.objId);
        const name = ProductName.fromString(source.name);
        const price = ProductPrice.fromNumber(source.price);
        const category = source.category ? 
            await this.categoryRestorer.restore(source.category) : null;
        return Product.fromExisting(id, name, price, category);
    }
    /**
     * ProductModelのリストからProductエンティティのリストを復元する
     * @param sources ProductModelモデルの配列
     * @returns 復元されたProductエンティティ配列
     */
    async restoreAll(sources: ProductModel[]): Promise<Product[]> {
        return Promise.all(sources.map(source => this.restore(source)));
    }
}