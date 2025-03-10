import { DomainException } from "../../exception/DomainException";

/**
 * 商品カテゴリ名を表す値オブジェクト
 * @author Fullness,Inc.
 * @date 2025-03-10
 * @version 1.0.0
 */
export class CategoryName {
    private readonly value: string;
    /**
     * プライベートコンストラクタ
     * 外部から直接インスタンスを生成できないようにし、
     * fromString()を使用する
     * @param name 商品カテゴリ名
     */
    private constructor(name: string) {
        this.validateCategoryName(name);
        this.value = name;
    }
    /**
     * 既存の商品カテゴリ名からCategoryNameのインスタンスを生成
     * @param name 既存の商品カテゴリ名
     * @returns CategoryNameインスタンス
     */
    static fromString(name: string): CategoryName {
         // 引数の商品カテゴリ名を検証し、インスタンス化
        return new CategoryName(name);
    }
    /**
     * 商品カテゴリ名の妥当性を検証するプライベートメソッド
     * @param value 検証対象の商品カテゴリ名
     * @throws DomainError 商品カテゴリ名が不正な場合にスロー
     */
    private static readonly MAX_LENGTH = 20;
    private validateCategoryName(value: string) {
        if (!value || value.trim() === '') {
            throw new DomainException('商品カテゴリ名は必須です。');
        }
        if (value.length > CategoryName.MAX_LENGTH) {
            throw new DomainException(
                '商品カテゴリ名は20文字以内でなければなりません。');
        }
    }
    /**
     * 商品カテゴリ名を取得する
     * @returns 商品カテゴリ名の値
     */
    getValue(): string {
        return this.value;
    }
    /**
     * このCategoryNameと他のCategoryNameが等しいかどうかを判定する
     * @param other 比較対象のCategoryName
     * @returns 他のCategoryNameと等しい場合はtrue、それ以外の場合はfalse
     */
    equals(other: CategoryName): boolean {
        return other instanceof CategoryName && this.value === other.value;
    }
    /**
     * 商品カテゴリ名の文字列を返す
     * @returns 商品カテゴリ名の値
     */
    toString(): string {
        return `CategoryName=${this.value}`;
    }
}