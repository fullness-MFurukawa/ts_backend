import { DomainException } from "../../exception/DomainException";

/**
 * メールアドレスと表す値オブジェクト
 * @author Fullness,Inc.
 * @date 2025-03-21
 * @version 1.0.0
 */
export class Email {
    private readonly value: string;
    
    /**
     * プライベートコンストラクタ
     * @param value メールアドレス
     */
    private constructor(value: string) {
        this.validateEmail(value);
        this.value = value;
    }

    /**
     * メールアドレスの妥当性を検証するプライベートメソッド
     * @param value 検証対象のメールアドレス
     * @throws DomainException メールアドレスが不正な場合にスロー
     */
    private validateEmail(value: string){
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            throw new DomainException(`無効なメールアドレス: ${value}`);
        }
    }

    /**
     * 既存のメールアドレスからEmailのインスタンスを生成
     * @param value 既存のメールアドレス
     * @returns Emailのインスタンス
     */
    static fromString(value: string): Email {
        return new Email(value);
    }

    /**
     * メールアドレスを取得する
     * @returns メールアドレスの値
     */
    getValue(): string {
        return this.value;
    }

    /**
     * このEmailと他のEmailが等しいかどうかを判定する
     * @param other 比較対象のEmail
     * @returns 他のEmailと等しい場合はtrue、それ以外の場合はfalse
     */
    equals(other: Email): boolean {
        return other instanceof Email && this.value === other.value;
    }

    /**
     * @returns メールアドレスの値を含む文字列
     */
    toString(): string {
        return `Email=${this.value}`;
    }
}