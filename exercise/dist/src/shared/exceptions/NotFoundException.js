"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundException = void 0;
/**
 * 取得したいデータが見つからないことを表すエラークラス
 * @author Fullness,Inc.
 * @date 2025-03-10
 * @version 1.0.0
 */
class NotFoundException extends Error {
    /**
     * NotFoundErrorのインスタンスを生成する
     * @param message エラーメッセージ
     */
    constructor(message = '指定されたデータが見つかりません。') {
        super(message);
        this.name = 'NotFoundException';
        // TypeScriptのコンパイルターゲットがES5以下の場合、以下の行は必要です
        Object.setPrototypeOf(this, NotFoundException.prototype);
    }
}
exports.NotFoundException = NotFoundException;
