"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const CategoryId_1 = require("./CategoryId");
/**
 * 商品カテゴリを表すエンティティクラス
 * @author Fullness,Inc.
 * @date 2025-03-10
 * @version 1.0.0
 */
class Category {
    /**
     * コンストラクタ
     * 新規カテゴリまたは既存カテゴリの復元に使用
     * @param id 商品カテゴリId（値オブジェクト）
     * @param name 商品カテゴリ名（値オブジェクト）
     */
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
    /**
     * 新しいカテゴリを作成するための静的ファクトリメソッド
     * @param name 商品カテゴリ名
     * @returns 新しいCategoryインスタンス
     */
    static create(name) {
        return new Category(CategoryId_1.CategoryId.createNew(), name);
    }
    /**
     * 既存のカテゴリデータからインスタンスを生成するための静的ファクトリメソッド
     * @param id 既存のカテゴリID
     * @param name 既存のカテゴリ名
     * @returns 既存のCategoryインスタンス
     */
    static fromExisting(id, name) {
        return new Category(id, name);
    }
    /**
     * 商品カテゴリIdを取得
     * @returns 商品カテゴリId（値オブジェクト）
     */
    getId() {
        return this.id;
    }
    /**
     * 商品カテゴリ名を取得
     * @returns 商品カテゴリ名（値オブジェクト）
     */
    getName() {
        return this.name;
    }
    /**
     * 商品カテゴリ名を変更
     * @param name 新しい商品カテゴリ名
     */
    changeName(name) {
        this.name = name;
    }
    /**
     * この商品カテゴリと他の商品カテゴリが等しいかどうかを判定する
     * @param other 比較対象の商品カテゴリ
     * @returns 他の商品カテゴリと等しい場合はtrue、それ以外の場合はfalse
     */
    equals(other) {
        return other instanceof Category && this.id.equals(other.getId());
    }
    /**
     * カテゴリ情報の文字列を返す（デバッグ用）
     * @returns 商品カテゴリIdと名称を含む文字列
     */
    toString() {
        return `Category [id=${this.id.toString()}, name=${this.name.toString()}]`;
    }
}
exports.Category = Category;
