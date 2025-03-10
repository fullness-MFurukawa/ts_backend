"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainException = void 0;
/**
 * 業務データエラークラス
 * @author Fullness,Inc.
 * @date 2025-03-10
 * @version 1.0.0
 */
class DomainException extends Error {
    /**
     * コンストラクタ
     * @param message エラーメッセージ
     * @param context コンテキスト情報(エンティティ名やプロパティ名）
     */
    constructor(message = '無効な値が指定されました。', context) {
        super(message);
        this.context = context;
        this.name = 'DomainException';
        Object.setPrototypeOf(this, DomainException.prototype);
    }
    toJSON() {
        return {
            name: this.name,
            message: this.message,
            context: this.context,
            stack: this.stack
        };
    }
}
exports.DomainException = DomainException;
