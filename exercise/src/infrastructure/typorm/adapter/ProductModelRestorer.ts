import { Restorer } from "@/shared/adapter/Restorer.js";
import { Inject, Injectable } from "@nestjs/common";
import { ProductModel } from "../model/ProductModel.js";
import { Product } from "@/application/domain/models/product/Product.js";
import { CategoryModelRestorer } from "./CategoryModelRestorer.js";
import { ProductId } from "@/application/domain/models/product/ProductId.js";
import { ProductName } from "@/application/domain/models/product/ProductName.js";
import { ProductPrice } from "@/application/domain/models/product/ProductPrice.js";

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