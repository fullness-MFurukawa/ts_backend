import { Category } from "../category/Category";
import { ProductId } from "./ProductId";
import { ProductName } from "./ProductName";
import { ProductPrice } from "./ProductPrice";

/**
 * 商品を表すエンティティ
 * 1つの商品は1つの商品カテゴリに属する (1:1 関係)
 * @author Fullness,Inc.
 * @date 2025-03-10
 * @version 1.0.0
 */
export class Product {
    private readonly id: ProductId; // 商品Id（不変）
    private name: ProductName;      // 商品名（可変）
    private price: ProductPrice;    // 商品単価（可変）
    private category: Category | null;// 関連付けられたカテゴリ (nullable)

     /**
     * プライベートコンストラクタ
     * 外部から直接インスタンスを生成させず、静的メソッドを通じて作成
     * @param id 商品ID
     * @param name 商品名
     * @param price 商品単価
     * @param category 関連付けられたカテゴリ（省略可能）
     */
     private constructor(id: ProductId, name: ProductName, price: ProductPrice, category: Category | null = null) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.category = category;
    }

    /**
     * 新しい商品を作成するための静的ファクトリメソッド
     * @param name 商品名
     * @param price 商品単価
     * @returns 新しいProductインスタンス
     */
    static create(name: ProductName, price: ProductPrice): Product {
        return new Product(ProductId.createNew(), name, price);
    }

    /**
     * 既存の商品データからインスタンスを生成するための静的ファクトリメソッド
     * @param id 既存の商品ID
     * @param name 既存の商品名
     * @param price 既存の商品単価
     * @param category 関連付けられたカテゴリ（省略可能）
     * @returns 既存のProductインスタンス
     */
    static fromExisting(id: ProductId,name: ProductName,
        price: ProductPrice,category: Category | null = null
    ): Product {
        return new Product(id, name, price, category);
    }

    /**
     * 既存商品を復元
     * @param id 商品Id
     * @param name 商品名
     * @param price 商品単価
     * @returns 復元された商品インスタンス
     */
    static reconstruct(id: ProductId, name: ProductName, price: ProductPrice): Product {
        return new Product(id, name, price);
    }

    /**
     * 商品Idを取得
     * @returns 商品ID（値オブジェクト）
     */
    getId(): ProductId {
        return this.id;
    }

    /**
     * 商品名を取得
     * @returns 商品名（値オブジェクト）
     */
    getName(): ProductName {
        return this.name;
    }

    /**
     * 商品名を変更
     * @param name 新しい商品名
     */
    changeName(name: ProductName): void {
        this.name = name;
    }

    /**
     * 商品単価を取得
     * @returns 商品単価（値オブジェクト）
     */
    getPrice(): ProductPrice {
        return this.price;
    }

    /**
     * 商品単価を変更
     * @param price 新しい商品単価
     */
    changePrice(price: ProductPrice): void {
        this.price = price;
    }

    /**
     * 関連付けられたカテゴリを取得
     * @returns カテゴリまたはnull
     */
    getCategory(): Category | null {
        return this.category;
    }

    /**
     * 商品にカテゴリを設定または解除
     * @param category 関連付けるカテゴリまたはnull
     */
    changeCategory(category: Category | null): void {
        this.category = category;
    }


    /**
     * この商品と他の商品の同一性を判定する
     * @param other 比較対象の商品
     * @returns 他の商品と等しい場合はtrue、それ以外の場合はfalse
     */
    equals(other: Product): boolean {
        return other instanceof Product && this.id.equals(other.getId());
    }

    /**
     * 商品情報の文字列を返す（デバッグ用）
     * @returns 商品ID、名前、価格を含む文字列
     */
    toString(): string {
        return `Product [id=${this.id.toString()}, name=${this.name.toString()}, price=${this.price.toString()}]`;
    }
}
