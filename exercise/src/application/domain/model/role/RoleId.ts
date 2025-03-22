import * as uuid from 'uuid';
import { DomainException } from "../../exception/DomainException";

/**
 * ロールを一意に識別するための値オブジェクト
 * UUID形式で不変性を持ち、妥当性検証を内部で行う
 * @author Fullness,Inc.
 * @date 2025-03-21
 * @version 1.0.0
 */
export class RoleId {
    // 内部的に保持するUUID値（不変）
    private readonly value: string;

    /**
     * プライベートコンストラクタ
     * createNew()またはfromString()からのみインスタンス化可能
     * @param id UUID値
     */
    private constructor(id: string) {
        this.validateRoleId(id);  // 妥当性検証
        this.value = id;
    }

    /**
     * UUID形式の妥当性検証
     * @param value チェック対象のUUID
     * @throws DomainException UUIDが不正な場合
     */
    private validateRoleId(value: string) {
        if (!value || value.trim() === "") {
          throw new DomainException('ロールIdは、必須です。');
        }
        if (!uuid.validate(value)) {
          throw new DomainException('ロールIdは、UUID形式である必要があります。');
      }
    }

    /**
     * 新しいUUIDを生成してRoleIdを作成
     * @returns 新規RoleIdインスタンス
     */
    static createNew(): RoleId {
        return new RoleId(uuid.v4());
    }

    /**
     * 既存のUUIDからRoleIdを生成
     * @param id 既存のUUID
     * @returns RoleIdインスタンス
     */
    static fromString(id: string): RoleId {
        return new RoleId(id);
    }

    /**
     * 保持しているUUID値を返す
     * @returns UUID文字列
     */
    getValue(): string {
        return this.value;
    }

    /**
     * 他のRoleIdと同一かどうか比較
     * @param other 比較対象のRoleId
     * @returns 同一であればtrue
     */
    equals(other: RoleId): boolean {
        return other instanceof RoleId && this.value === other.value;
    }

    /**
     * 文字列表現を返す
     * @returns ロールIdの文字列表現
     */
    toString(): string {
        return `RoleId=${this.value}`;
    }
}
