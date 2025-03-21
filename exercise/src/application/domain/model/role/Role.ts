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
     * @param name ロール名を表す値オブジェクト
     * @param id ロールId
     */
    constructor(
        private readonly name: RoleName,
        private readonly id?: number){}

    /**
     * ロール名を取得する
     * @returns ロール名を表す値オブジェクト
     */
    getName(): RoleName {
      return this.name;
    }

    /**
     * ロールIdを取得する
     * @returns ロールId
     */
    getId(): number | null{
        return this.id ?? null;
    }
}