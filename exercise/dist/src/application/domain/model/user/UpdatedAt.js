"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatedAt = void 0;
const DomainException_1 = require("../../exception/DomainException");
/**
 * 更新日時を表す値オブジェクト
 * - 不変で信頼性のあるタイムスタンプを提供
 * - ドメインモデル内で日時の比較・検証にも使用可能
 * @author Fullness,Inc.
 * @date 2025-03-21
 * @version 1.0.0
 */
class UpdatedAt {
    /**
     * コンストラクタ（直接Dateを渡す）
     * @param value 更新日時（Date型）を内部に保持
     */
    constructor(value) {
        this.validateUpdatedAt(value);
        this.value = value;
    }
    /**
     * 更新日の妥当性を検証するプライベートメソッド
     * @param value 検証対象の更新日
     * @throws DomainException 不正な場合にスロー
     */
    validateUpdatedAt(value) {
        if (!value) {
            throw new DomainException_1.DomainException('更新日時は必須です。');
        }
    }
    /**
     * 現在の時刻を使ってインスタンスを生成
     * @returns 現在日時のCreatedAtインスタンス
     */
    static now() {
        return new UpdatedAt(new Date());
    }
    /**
     * 既存の Date 値から UpdatedAt を生成するファクトリメソッド
     * @param date 更新日時として使用するDateオブジェクト
     * @returns UpdatedAt インスタンス
     */
    static fromDate(date) {
        return new UpdatedAt(date);
    }
    /**
     * 内部に保持している Date 値を取得する
     * @returns Date オブジェクト
     */
    getValue() {
        return this.value;
    }
    /**
     * 指定された日時より前かどうかを判定する
     * @param date 比較対象の日時
     * @returns 自身の日時が指定日時より前であれば true
     */
    isBefore(date) {
        return this.value.getTime() < date.getTime();
    }
    /**
     * 指定された日時より後かどうかを判定する
     * @param date 比較対象の日時
     * @returns 自身の日時が指定日時より後であれば true
     */
    isAfter(date) {
        return this.value.getTime() > date.getTime();
    }
    /**
     * 同じ UpdatedAt 値かどうかを比較する
     * @param other 比較対象の UpdatedAt
     * @returns 同一の日時を保持していれば true
     */
    equals(other) {
        return other instanceof UpdatedAt &&
            this.value.getTime() === other.getValue().getTime();
    }
    /**
     * ISO 形式の文字列に変換する
     * @returns ISO 形式の日時文字列
     */
    toString() {
        return `UpdatedAt=${this.value.toISOString()}`;
    }
}
exports.UpdatedAt = UpdatedAt;
