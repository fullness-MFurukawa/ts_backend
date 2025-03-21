import { DomainException } from "../../exception/DomainException";

/**
 * ユーザー名を表す値オブジェクト
 * - 3～20文字の英数字のみ許可
 * - 一意の識別子として利用
 * @author Fullness,Inc.
 * @date 2025-03-21
 * @version 1.0.0
 */
export class Username {
    private readonly value: string;

    /**
     * プライベートコンストラクタ
     * @param value ユーザー名
     */
    private constructor(value: string) {
        this.validateUsername(value);
        this.value = value;
    }

    /**
     * ユーザー名の妥当性を検証するプライベートメソッド
     * @param value 検証対象のユーザー名
     * @throws DomainException ユーザー名が不正な場合にスロー
     */
    private validateUsername(value: string){
        if (!/^[a-zA-Z0-9]{3,20}$/.test(value)) {
            throw new DomainException(
            `無効なユーザー名: ${value}。長さは3～20 文字で、文字と数字のみを含める必要があります。`);
        }
    }

    /**
     * 既存のユーザー名からUsernameのインスタンスを生成
     * @param value 既存のユーザー名
     * @returns Usernameのインスタンス
     */
    static fromString(value: string): Username {
        return new Username(value);
    }

    /**
     * ユーザー名を取得する
     * @returns ユーザー名の値
     */
    getValue(): string {
        return this.value;
    }

    /**
     * このUsernameと他のUsernameが等しいかどうかを判定する
     * @param other 比較対象のUsername
     * @returns 他のUsernameと等しい場合はtrue、それ以外の場合はfalse
     */
    equals(other: Username): boolean {
        return other instanceof Username && this.value === other.value;
    }

    /**
     * @returns ユーザー名の値を含む文字列
     */
    toString(): string {
        return `Username=${this.value}`;
    }
}