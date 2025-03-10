import * as uuid from 'uuid';
import { DomainException } from "../../exception/DomainException.js";
/**
 * 商品カテゴリを一意に識別するための値オブジェクト
 * 不変性を持ち、妥当性検証を内部で行う
 * @author Fullness,Inc.
 * @date 2025-03-10
 * @version 1.0.0
 */
export class CategoryId {
    /**
     * プライベートコンストラクタ
     * 外部から直接インスタンスを生成できないようにし、
     * createNew()またはfromString()を使用する
     * @param id UUID値
     */
    constructor(id) {
        this.validateCategoryId(id); // UUIDの妥当性を検証
        this.value = id; // 検証に成功したUUID値を設定
    }
    /**
     * 新しいUUIDを生成してCategoryIdのインスタンスを作成
     * @returns 新規作成されたCategoryId`
     */
    static createNew() {
        // ランダムなUUIDを生成してインスタンス化
        return new CategoryId(uuid.v4());
    }
    /**
     * 既存のUUIDからCategoryIdのインスタンスを生成
     * @param id 既存のUUID
     * @returns CategoryIdインスタンス
     */
    static fromString(id) {
        return new CategoryId(id); // 引数のUUIDを検証し、インスタンス化
    }
    /**
     * 内部的に保持しているUUID値を取得
     * @returns UUID値
     */
    getValue() {
        return this.value;
    }
    /**
     * UUIDの妥当性を検証するプライベートメソッド
     * @param value 検証対象のUUID値
     * @throws DomainError UUIDが不正な場合にスロー
     */
    validateCategoryId(value) {
        if (!value || value.trim() === "") {
            throw new DomainException('商品カテゴリId、は必須です。');
        }
        if (!uuid.validate(value)) {
            throw new DomainException('商品カテゴリIdは、UUID形式でなければなりません。');
        }
    }
    /**
     * このCategoryIdと他のCategoryIdが等しいかどうかを判定する
     * @param other 比較対象のCategoryId
     * @returns 他のCategoryIdと等しい場合はtrue、それ以外の場合はfalse
     */
    equals(other) {
        return other instanceof CategoryId && this.value === other.value;
    }
    /**
     * @returns 商品カテゴリIdの値を含む文字列
     */
    toString() {
        return `CategoryId=${this.value}`;
    }
}
