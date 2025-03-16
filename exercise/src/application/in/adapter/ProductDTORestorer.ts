import { Injectable } from "@nestjs/common";
import { Restorer } from "@src/shared/adapter/Restorer";
import { ProductDTO } from "../dto/ProductDTO";
import { Product } from "@src/application/domain/model/product/Product";
import { Category } from "@src/application/domain/model/category/Category";
import { CategoryId } from "@src/application/domain/model/category/CategoryId";
import { CategoryName } from "@src/application/domain/model/category/CategoryName";
import { ProductId } from "@src/application/domain/model/product/ProductId";
import { ProductName } from "@src/application/domain/model/product/ProductName";
import { ProductPrice } from "@src/application/domain/model/product/ProductPrice";
import { CategoryDTO } from "../dto/CategoryDTO";

/**
 * プレゼンテーション層から受け取った商品からProductエンティティを復元する
 * @author Fullness,Inc.
 * @date 2025-03-14
 * @version 1.0.0
 */
@Injectable()
export class ProductDTORestorer implements Restorer<ProductDTO , Product> {
    /**
     * ProductDTOからProductエンティティを復元する
     * @param source ProductInput
     */
    async restore(source: ProductDTO): Promise<Product> {
        const category = this.createCategoryIfNeeded(source.category);
        const product = source.id === null 
            ? this.createNewProduct(source, category)
            : this.restoreExistingProduct(source, category);
        return product;
    }
    /**
     * categoryIdがnullでない場合、カテゴリを復元する
     * @param categoryId string | null
     * @returns Category | null
     */
    private createCategoryIfNeeded(category: CategoryDTO | null): Category | null {
        if ( category != null && category.id !== null) {
            return Category.fromExisting(
                CategoryId.fromString(category.id),
                CategoryName.fromString('dummy')
            );
        }    
        return null;
    } 
    /**
     * 新しいProductを作成する
     * @param source ProductInput
     * @param category Category | null
     * @returns Product
     */
    private createNewProduct(source: ProductDTO, category: Category | null): Product {
        const product = Product.create(
            ProductName.fromString(source.name),
            ProductPrice.fromNumber(source.price)
        );
        if (category !== null) {
            product.changeCategory(category);
        }
        return product;
    }
    /**
     * 既存のProductを復元する
     * @param source ProductInput
     * @param category Category | null
     * @returns Product
     */
    private restoreExistingProduct(source: ProductDTO, category: Category | null): Product {
        const product = Product.fromExisting(
            ProductId.fromString(source.id!),
            ProductName.fromString(source.name),
            ProductPrice.fromNumber(source.price)
        );
        if (category !== null) {
            product.changeCategory(category);
        }
        return product;
    }
    
    /**
     * ProductInputからProductエンティティを復元する
     * 不要なので未実装
     */
    restoreAll(sources: ProductDTO[]): Promise<Product[]> {
        throw new Error("Method not implemented.");
    }
}
