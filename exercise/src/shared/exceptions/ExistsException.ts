/**
 * 登録対象データが存在することを表すエラークラス
 * @author Fullness,Inc.
 * @date 2025-03-10
 * @version 1.0.0
 */
export class ExistsException extends Error{
    /**
     * ExistsErrorのインスタンスを生成する
     * @param message エラーメッセージ
     */
    constructor(message: string = '既に存在するデータです。') {
        super(message);
        this.name = 'ExistsException';
    
        // TypeScriptのコンパイルターゲットがES5以下の場合、以下の行は必要です
        Object.setPrototypeOf(this, ExistsException.prototype);
    }
}