"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const CreatedAt_1 = require("./CreatedAt");
const IsActive_1 = require("./IsActive");
const UpdatedAt_1 = require("./UpdatedAt");
const UserId_1 = require("./UserId");
/**
 * ユーザーエンティティ
 * - 認証・認可におけるユーザー情報を集約する
 * - 不変な値オブジェクトを中心に管理される
 * - ロールのリストを保持し、複数ロールを持つことが可能
 * @author Fullness,Inc.
 * @date 2025-03-21
 * @version 1.0.0
 */
class User {
    /**
     * コンストラクタ（プライベート）
     * ファクトリメソッドを通してインスタンスを作成する
     */
    constructor(id, // ユーザーId
    username, // ユーザー名
    password, // パスワード
    email, // メールアドレス
    isActive, // 有効/無効
    createdAt, // 登録日
    updatedAt, // 更新日
    roles // ロール
    ) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.roles = roles;
    }
    /**
     * 新規ユーザーを作成するファクトリメソッド
     * @param username ユーザー名
     * @param password ハッシュ済みパスワード
     * @param email メールアドレス
     * @param roles 所属するロールの配列
     * @returns 作成されたUserエンティティ
     */
    static createNew(username, password, email, roles) {
        return new User(UserId_1.UserId.createNew(), username, password, email, IsActive_1.IsActive.active(), CreatedAt_1.CreatedAt.now(), UpdatedAt_1.UpdatedAt.now(), roles);
    }
    /**
     * 永続化されたユーザー情報から復元するファクトリメソッド
     * @param id ユーザーID
     * @param username ユーザー名
     * @param password パスワード（ハッシュ化済み）
     * @param email メールアドレス
     * @param isActive アカウント有効状態
     * @param createdAt 作成日時
     * @param updatedAt 更新日時
     * @param roles 所属するロールの配列
     * @returns 復元されたUserエンティティ
     */
    static restore(id, username, password, email, isActive, createdAt, updatedAt, roles) {
        return new User(id, username, password, email, isActive, createdAt, updatedAt, roles);
    }
    /**
     * ユーザーIDを取得する
     */
    getId() {
        return this.id;
    }
    /**
     * ユーザー名を取得する
     */
    getUsername() {
        return this.username;
    }
    /**
     * パスワード(ハッシュ済み)を取得する
     */
    getPassword() {
        return this.password;
    }
    /**
     * メールアドレスを取得する
     */
    getEmail() {
        return this.email;
    }
    /**
     * 作成日時を取得する
     */
    getCreatedAt() {
        return this.createdAt;
    }
    /**
     * 更新日時を取得する
     */
    getUpdatedAt() {
        return this.updatedAt;
    }
    /**
     * アカウントが有効かどうかを判定する
     */
    isUserActive() {
        return this.isActive.isActive();
    }
    /**
     * ユーザーに紐づくロール一覧を取得する
     */
    getRoles() {
        return this.roles;
    }
    /**
     * 指定されたロールを保持しているか判定する
     * @param role ロール
     * @returns ロールを保持していればtrue
     */
    hasRole(role) {
        return this.roles.some(r => r.equals(role));
    }
    /**
     * ロール名で保持しているかを判定する
     * @param roleName ロール名（例: "admin"）
     * @returns 保持していればtrue
     */
    hasRoleByName(roleName) {
        return this.roles.some(r => r.getName().getValue() === roleName);
    }
    /**
     * ロールを追加する（既に追加済みでない場合）
     * @param role 追加するロール
     */
    addRole(role) {
        if (!this.hasRole(role)) {
            this.roles.push(role);
            this.touch(); // 更新日時を更新
        }
    }
    /**
     * 指定されたロールを削除する
     * @param role 削除対象のロール
     */
    removeRole(role) {
        this.roles = this.roles.filter(r => !r.equals(role));
        this.touch(); // 更新日時を更新
    }
    /**
     * メールアドレスを変更する
     * @param newEmail 新しいメールアドレス
     */
    changeEmail(newEmail) {
        this.email = newEmail;
        this.touch();
    }
    /**
     * パスワードを変更する（ハッシュ済み）
     * @param newPassword 新しいハッシュ済みパスワード
     */
    changePassword(newPassword) {
        this.password = newPassword;
        this.touch();
    }
    /**
     * ユーザーを無効化する（論理削除などに利用）
     */
    deactivate() {
        this.isActive = IsActive_1.IsActive.inactive();
        this.touch();
    }
    /**
     * ユーザーを有効化する
     */
    activate() {
        this.isActive = IsActive_1.IsActive.active();
        this.touch();
    }
    /**
     * 更新日時を現在の時刻に更新する（内部使用）
     */
    touch() {
        this.updatedAt = UpdatedAt_1.UpdatedAt.now();
    }
    /**
     * エンティティの等価性を判定する
     * @param other 比較対象のUserエンティティ
     * @returns 同一のユーザーIDを持つ場合true
     */
    equals(other) {
        return other instanceof User && this.id.equals(other.getId());
    }
}
exports.User = User;
