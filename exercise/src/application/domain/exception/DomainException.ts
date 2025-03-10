/**
 * 業務データエラークラス
 * @author Fullness,Inc.
 * @date 2025-03-10
 * @version 1.0.0
 */
export class DomainException extends Error{
    /**
     * コンストラクタ
     * @param message エラーメッセージ
     * @param context コンテキスト情報(エンティティ名やプロパティ名）
     */ 
    constructor(message: string = '無効な値が指定されました。', public context?: string) {
        super(message);
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