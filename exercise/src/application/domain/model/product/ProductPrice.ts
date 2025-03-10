import { DomainException } from "../../exception/DomainException";

/**
 * 商品単価を表す値オブジェクト
 * @author Fullness,Inc.
 * @date 2025-03-10
 * @version 1.0.0
 */
export class ProductPrice {
    private readonly value: number;

    /**
     * 商品単価のコンストラクタ
     * @param price 商品の単価（必須、整数、50以上10000以下）
     */
    private constructor(price: number) {
        this.validateProductPrice(price);
        this.value = price;
    }
    /**
     * 既存の商品単価からProductPriceのインスタンスを生成
     * @param price 既存の商品単価
     * @returns ProductPriceインスタンス
     */
    static fromNumber(price: number): ProductPrice {
        // 引数の商品名を検証し、インスタンス化
        return new ProductPrice(price);
    }
    /**
     * 商品単価の有効性を検証
     * @param value 検証対象の商品単価
     * @throws DomainError 商品単価が不正な場合にスロー
     */
    private static readonly MIN_PRICE = 50;
    private static readonly MAX_PRICE = 10000;
    private validateProductPrice(value: number) {
        if (value == null) {
            throw new DomainException('商品単価は必須です。');
        }
        if (!Number.isInteger(value)) {
            throw new DomainException('商品単価は整数でなければなりません。');
        }
        if (value < ProductPrice.MIN_PRICE || value > ProductPrice.MAX_PRICE) {
            throw new DomainException(
            `商品単価は${ProductPrice.MIN_PRICE}以上${ProductPrice.MAX_PRICE}以下でなければなりません。`);
        }
    }
     /**
     * このProductPriceと他のProductPriceが等しいかどうかを判定する
     * @param other 比較対象のProductPrice
     * @returns 他のProductPriceと等しい場合はtrue、それ以外の場合はfalse
     */
     equals(other: ProductPrice): boolean {
        return other instanceof ProductPrice && this.value === other.value;
    }
    /**
     * 商品単価の数値を取得する
     * @returns 商品単価の値
     */
       getValue(): number {
        return this.value;
    }
    /**
     * 商品単価の文字列を返す
     * @returns 商品単価の値
     */
    toString(): string {
        return `ProductPrice=${this.value}`;
    }
}