"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsActive = void 0;
/**
 * アカウントの有効・無効を表す値オブジェクト
 * - 意味的なブール値として活用（論理削除や認証チェックに利用）
 * - true = 有効, false = 無効
 * @author Fullness,Inc.
 * @date 2025-03-21
 * @version 1.0.0
 */
class IsActive {
    /**
     * コンストラクタ
     * @param value 内部に保持する値（true: 有効, false: 無効）
     */
    constructor(value) {
        this.value = value;
    }
    /**
     * 有効状態（true）を示すインスタンスを生成
     * @returns IsActiveインスタンス（有効）
     */
    static active() {
        return new IsActive(true);
    }
    /**
     * 無効状態（false）を示すインスタンスを生成
     * @returns IsActiveインスタンス（無効）
     */
    static inactive() {
        return new IsActive(false);
    }
    /**
     * 有効状態かどうかを取得
     * @returns trueなら有効、falseなら無効
     */
    isActive() {
        return this.value;
    }
    /**
     * 他のIsActiveインスタンスと等価か判定
     * @param other 比較対象
     * @returns 等しい場合true
    */
    equals(other) {
        return other instanceof IsActive && this.value === other.value;
    }
    /**
     * @returns 状態の文字列表現
     */
    toString() {
        return `IsActive=${this.value}`;
    }
}
exports.IsActive = IsActive;
