import { DomainException } from "../../exception/DomainException";

/**
 * ロール名を表す値オブジェクト
 * - 権限名の管理（admin,user,guest）
 * @author Fullness,Inc.
 * @date 2025-03-21
 * @version 1.0.0
 */
export class RoleName {
    private readonly value: string;
    /**
     * プライベートコンストラクタ
     * @param value ロール名
     */
    private constructor(value: string) {
        this.validateRoleName(value);
        this.value = value;
    }

    /**
     * ロール名の妥当性を検証するプライベートメソッド
     * @param value 検証対象のロール名
     * @throws DomainException ロール名が不正な場合にスロー
     */
    private validateRoleName(value: string){
        if (!/^[a-zA-Z]{3,20}$/.test(value)) {
            throw new DomainException(`無効なロール名: ${value}`);
        }
    }

    /**
     * 既存のメールアドレスからEmailのインスタンスを生成
     * @param value 既存のメールアドレス
     * @returns Emailのインスタンス
     */
    static fromString(value: string): RoleName {
        return new RoleName(value);
    }

    /**
     * ロール名を取得する
     * @returns ロール名の値
     */
    getValue(): string {
        return this.value;
    }

    /**
     * このRoleNameと他のRoleNameが等しいかどうかを判定する
     * @param other 比較対象のRoleName
     * @returns 他のRoleNameと等しい場合はtrue、それ以外の場合はfalse
     */
    equals(other: RoleName): boolean {
        return other instanceof RoleName && this.value === other.value;
    }

    /**
     * @returns ロール名の値を含む文字列
     */
    toString(): string {
        return `RoleName=${this.value}`;
    }
}