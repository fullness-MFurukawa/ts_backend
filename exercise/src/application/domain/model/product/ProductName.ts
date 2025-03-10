import { DomainException } from "../../exception/DomainException";

/**
 * 商品名を表す値オブジェクト
 * @author Fullness,Inc.
 * @date 2025-03-10
 * @version 1.0.0
 */
export class ProductName{
    private readonly value: string;
    /**
     * プライベートコンストラクタ
     * 外部から直接インスタンスを生成できないようにし、
     * fromString()を使用する
     * @param name 商品カテゴリ名
     */
    private constructor(name: string) {
        this.validateProductName(name);
        this.value = name;
    }
    /**
     * 既存の商品名からProductNameのインスタンスを生成
     * @param name 既存の商品名
     * @returns ProductNameインスタンス
     */
     static fromString(name: string): ProductName {
        // 引数の商品名を検証し、インスタンス化
       return new ProductName(name);
    }
    /**
     * 商品名の妥当性を検証するプライベートメソッド
     * @param value 検証対象の商品名
     * @throws DomainError 商品名が不正な場合にスロー
     */
    private static readonly MAX_LENGTH = 30;
    private validateProductName(value: string) {
        if (!value || value.trim() === '') {
            throw new DomainException('商品名は必須です。');
        }
        if (value.length > ProductName.MAX_LENGTH) {
            throw new DomainException('商品名は30文字以内でなければなりません。');
        }
    }
    /**
     * 商品名を取得する
     * @returns 商品名の値
     */
     getValue(): string {
        return this.value;
    }
    /**
     * このProductNameと他のProductNameが等しいかどうかを判定する
     * @param other 比較対象のProductName
     * @returns 他のProductNameと等しい場合はtrue、それ以外の場合はfalse
     */
    equals(other: ProductName): boolean {
        return other instanceof ProductName && this.value === other.value;
    }
    /**
     * 商品名の文字列を返す
     * @returns 商品名の値
     */
    toString(): string {
        return `ProductName=${this.value}`;
    }
}