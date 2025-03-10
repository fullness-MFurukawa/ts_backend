import * as uuid from 'uuid';
import { DomainException } from "../../exception/DomainException.js";
/**
 * 商品を一意に識別するための値オブジェクト
 * 不変性を持ち、妥当性検証を内部で行う
 * @author Fullness,Inc.
 * @date 2025-03-10
 * @version 1.0.0
 */
export class ProductId {
    /**
     * プライベートコンストラクタ
     * 外部から直接インスタンスを生成できないようにし、
     * createNew()またはfromString()を使用する
     * @param id UUID値
     */
    constructor(id) {
        this.validateProductId(id); // UUIDの妥当性を検証
        this.value = id; // 検証に成功したUUID値を設定
    }
    /**
     * 新しいUUIDを生成してProductIdのインスタンスを作成
     * @returns 新規作成されたProductId
     */
    static createNew() {
        // ランダムなUUIDを生成してインスタンス化
        return new ProductId(uuid.v4());
    }
    /**
     * 既存のUUIDからProductIdのインスタンスを生成
     * @param id 既存のUUID
     * @returns ProductIdインスタンス
     */
    static fromString(id) {
        return new ProductId(id); // 引数のUUIDを検証し、インスタンス化
    }
    /**
     * UUIDの妥当性を検証するプライベートメソッド
     * @param value 検証対象のUUID値
     * @throws DomainError UUIDが不正な場合にスロー
     */
    validateProductId(value) {
        if (!value || value.trim() === '') {
            throw new DomainException('商品Idは必須です。');
        }
        if (!uuid.validate(value)) {
            throw new DomainException('商品IdはUUID形式でなければなりません。');
        }
    }
    /**
     * 商品Idを取得する
     * @returns 商品Idの値
     */
    getValue() {
        return this.value;
    }
    /**
     * このProductIdと他のProductIdが等しいかどうかを判定する
     * @param other 比較対象のProductId
     * @returns 他のProductIdと等しい場合はtrue、それ以外の場合はfalse
     */
    equals(other) {
        return other instanceof ProductId && this.value === other.value;
    }
    /**
     * @returns 商品Idの値を含む文字列
     */
    toString() {
        return `ProductId=${this.value}`;
    }
}
