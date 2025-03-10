"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryName = void 0;
const DomainException_1 = require("../../exception/DomainException");
/**
 * 商品カテゴリ名を表す値オブジェクト
 * @author Fullness,Inc.
 * @date 2025-03-10
 * @version 1.0.0
 */
class CategoryName {
    /**
     * プライベートコンストラクタ
     * 外部から直接インスタンスを生成できないようにし、
     * fromString()を使用する
     * @param name 商品カテゴリ名
     */
    constructor(name) {
        this.validateCategoryName(name);
        this.value = name;
    }
    /**
     * 既存の商品カテゴリ名からCategoryNameのインスタンスを生成
     * @param name 既存の商品カテゴリ名
     * @returns CategoryNameインスタンス
     */
    static fromString(name) {
        // 引数の商品カテゴリ名を検証し、インスタンス化
        return new CategoryName(name);
    }
    validateCategoryName(value) {
        if (!value || value.trim() === '') {
            throw new DomainException_1.DomainException('商品カテゴリ名は必須です。');
        }
        if (value.length > CategoryName.MAX_LENGTH) {
            throw new DomainException_1.DomainException('商品カテゴリ名は20文字以内でなければなりません。');
        }
    }
    /**
     * 商品カテゴリ名を取得する
     * @returns 商品カテゴリ名の値
     */
    getValue() {
        return this.value;
    }
    /**
     * このCategoryNameと他のCategoryNameが等しいかどうかを判定する
     * @param other 比較対象のCategoryName
     * @returns 他のCategoryNameと等しい場合はtrue、それ以外の場合はfalse
     */
    equals(other) {
        return other instanceof CategoryName && this.value === other.value;
    }
    /**
     * 商品カテゴリ名の文字列を返す
     * @returns 商品カテゴリ名の値
     */
    toString() {
        return `CategoryName=${this.value}`;
    }
}
exports.CategoryName = CategoryName;
/**
 * 商品カテゴリ名の妥当性を検証するプライベートメソッド
 * @param value 検証対象の商品カテゴリ名
 * @throws DomainError 商品カテゴリ名が不正な場合にスロー
 */
CategoryName.MAX_LENGTH = 20;
