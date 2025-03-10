"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalException = void 0;
/**
 * 内部エラークラス
 * @author Fullness,Inc.
 * @date 2025-03-10
 * @version 1.0.0
 */
class InternalException extends Error {
    /**
     * InternalErrorのインスタンスを生成する
     * @param message エラーメッセージ
     */
    constructor(message = '内部エラーが発生しました。') {
        super(message);
        this.name = 'InternalException';
        // TypeScriptのコンパイルターゲットがES5以下の場合、以下の行は必要です
        Object.setPrototypeOf(this, InternalException.prototype);
    }
}
exports.InternalException = InternalException;
