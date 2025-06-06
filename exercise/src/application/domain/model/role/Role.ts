import { RoleId } from "./RoleId";
import { RoleName } from "./RoleName";

/**
 * ロールエンティティ
 * - 権限情報を管理
 * @author Fullness,Inc.
 * @date 2025-03-21
 * @version 1.0.0
 */
export class Role {
    /**
     * コンストラクタ
     * @param id    ロールIdを表す値オブジェクト
     * @param name  ロール名を表す値オブジェクト
     */
    constructor(
        private readonly id: RoleId,
        private name: RoleName){}

    /**
     * ロールIDを取得する
     * @returns RoleId インスタンス
     */
    getId(): RoleId {
        return this.id;
    }
    /**
     * ロール名を取得する
     * @returns ロール名を表す値オブジェクト
     */
    getName(): RoleName {
      return this.name;
    }
    /**
     * ロール名を変更する
     * @param newName 新しいロール名
     */
    changeName(newName: RoleName): void {
        this.name = newName;
    }
    /**
     * 他のロールと等価であるかどうかを判定
     * @param other 比較対象のロール
     * @returns 等価であればtrue
     */
    equals(other: Role): boolean {
        return other instanceof Role && this.id.equals(other.getId());
    }
    /**
     * 文字列表現を取得
     * @returns Roleの文字列表現
     */
    toString(): string {
        return `Role[id=${this.id.getValue()}, name=${this.name.getValue()}]`;
    }
}