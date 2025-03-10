/**
 * 内部エラークラス
 * @author Fullness,Inc.
 * @date 2025-03-10
 * @version 1.0.0
 */
export class InternalException extends Error{
    /**
     * InternalErrorのインスタンスを生成する
     * @param message エラーメッセージ
     */
    constructor(message: string = '内部エラーが発生しました。') {
        super(message);
        this.name = 'InternalException';
    
        // TypeScriptのコンパイルターゲットがES5以下の場合、以下の行は必要です
        Object.setPrototypeOf(this, InternalException.prototype);
    }
}