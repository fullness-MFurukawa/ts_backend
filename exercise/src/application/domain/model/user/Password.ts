import * as bcrypt from 'bcrypt'; // bcrypt を使ってパスワードをハッシュ化・比較
import { DomainException } from "../../exception/DomainException";

/**
 * パスワードを表す値オブジェクト
 * - ハッシュ化機能あり
 * - パスワード照合機能あり
 * @author Fullness,Inc.
 * @date 2025-03-21
 * @version 1.0.0
 */
export class Password {
    private readonly value: string;

    /**
     * プライベートコンストラクタ
     * @param value パスワード
     */
    private constructor(value: string) {
        this.value = value;
    }

    /**
     * 平文パスワードからPasswordを生成する
     * @param plainPassword 平文のパスワード
     * @returns Passwordのインスタンス
     */
    static fromPlain(plainPassword: string): Password {
        return new Password(plainPassword);
    }

    /**
     * 既にハッシュ化されたパスワードからPasswordを生成する
     * @param hashedPassword ハッシュ化されたパスワード
     * @returns Passwordのインスタンス
     */
    static fromHashed(hashedPassword: string): Password {
        return new Password(hashedPassword);
    }

    /**
     * 平文のパスワードをハッシュ化してPasswordのインスタンスを生成する
     * @param plainPassword 平文パスワード
     * @returns Passwordのインスタンス
     */
    static async hash(plainPassword: string): Promise<Password> {
        if (plainPassword.length < 8) {
        throw new DomainException('パスワードは8文字以上でなければなりません。');
        }
        const hashed = await bcrypt.hash(plainPassword, 10);
        return new Password(hashed);
    }

    /**
     * 平文のパスワードがハッシュと一致するか確認する
     * @param plainPassword 平文のパスワード
     * @returns 一致する場合:true 一致しない場合:false
     */
    async matches(plainPassword: string): Promise<boolean> {
        return bcrypt.compare(plainPassword, this.value);
    }

    /**
     * ハッシュ化されたパスワードを取得する
     * @returns ハッシュ変換済みのパスワード
     */
    getValue(): string {
        return this.value;
    }

    /**
     * このPasswordと他のPasswordが等しいかどうかを判定する
     * @param other 比較対象のPassword
     * @returns 他のPasswordと等しい場合はtrue、それ以外の場合はfalse
     */
    equals(other: Password): boolean {
        return other instanceof Password && this.value === other.value;
    }

    /**
     * @returns パスワードの値を含む文字列
     */
    toString(): string {
        return `Password=${this.value}`;
    }
}