"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = void 0;
/**
 * ロールエンティティ
 * - 権限情報を管理
 * @author Fullness,Inc.
 * @date 2025-03-21
 * @version 1.0.0
 */
class Role {
    /**
     * コンストラクタ
     * @param id    ロールIdを表す値オブジェクト
     * @param name  ロール名を表す値オブジェクト
     */
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
    /**
     * ロールIDを取得する
     * @returns RoleId インスタンス
     */
    getId() {
        return this.id;
    }
    /**
     * ロール名を取得する
     * @returns ロール名を表す値オブジェクト
     */
    getName() {
        return this.name;
    }
    /**
     * ロール名を変更する
     * @param newName 新しいロール名
     */
    changeName(newName) {
        this.name = newName;
    }
    /**
     * 他のロールと等価であるかどうかを判定
     * @param other 比較対象のロール
     * @returns 等価であればtrue
     */
    equals(other) {
        return other instanceof Role && this.id.equals(other.getId());
    }
    /**
     * 文字列表現を取得
     * @returns Roleの文字列表現
     */
    toString() {
        return `Role[id=${this.id.getValue()}, name=${this.name.getValue()}]`;
    }
}
exports.Role = Role;
