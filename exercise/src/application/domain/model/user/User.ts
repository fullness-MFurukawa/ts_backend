import { Role } from "../role/Role";
import { CreatedAt } from "./CreatedAt";
import { Email } from "./Email";
import { IsActive } from "./IsActive";
import { Password } from "./Password";
import { UpdatedAt } from "./UpdatedAt";
import { UserId } from "./UserId";
import { Username } from "./Username";

/**
 * ユーザーエンティティ
 * - 認証・認可におけるユーザー情報を集約する
 * - 不変な値オブジェクトを中心に管理される
 * - ロールのリストを保持し、複数ロールを持つことが可能
 * @author Fullness,Inc.
 * @date 2025-03-21
 * @version 1.0.0
 */
export class User {
    /**
     * コンストラクタ（プライベート）
     * ファクトリメソッドを通してインスタンスを作成する
     */
    private constructor(
        private readonly id: UserId,    // ユーザーId
        private username: Username,     // ユーザー名
        private password: Password,     // パスワード
        private email: Email,           // メールアドレス
        private isActive: IsActive,     // 有効/無効
        private readonly createdAt: CreatedAt,  // 登録日
        private updatedAt: UpdatedAt,           // 更新日
        private roles: Role[]           // ロール
    ){}

    /**
     * 新規ユーザーを作成するファクトリメソッド
     * @param username ユーザー名
     * @param password ハッシュ済みパスワード
     * @param email メールアドレス
     * @param roles 所属するロールの配列
     * @returns 作成されたUserエンティティ
     */
    static createNew(
        username: Username,password: Password,email: Email,roles: Role[]): User {
        return new User(
            UserId.createNew(),username,password,email,
            IsActive.active(),CreatedAt.now(),UpdatedAt.now(),roles);
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
    static restore(
        id: UserId,username: Username,password: Password,email: Email,
        isActive: IsActive,createdAt: CreatedAt,updatedAt: UpdatedAt,roles: Role[]): User {
        return new User(
            id, username, password, email, 
            isActive, createdAt, updatedAt, roles);
    }

    /** 
     * ユーザーIDを取得する 
     */
    getId(): UserId {
        return this.id;
    }
    /** 
     * ユーザー名を取得する 
     */
    getUsername(): Username {
        return this.username;
    }
    /** 
     * パスワード(ハッシュ済み)を取得する 
     */
    getPassword(): Password {
        return this.password;
    }
    /** 
     * メールアドレスを取得する 
     */
    getEmail(): Email {
        return this.email;
    }
    /** 
     * 作成日時を取得する 
     */
    getCreatedAt(): CreatedAt {
        return this.createdAt;
    }
    /** 
     * 更新日時を取得する 
     */
    getUpdatedAt(): UpdatedAt {
        return this.updatedAt;
    }
    /** 
     * アカウントが有効かどうかを判定する 
     */
    isUserActive(): boolean {
        return this.isActive.isActive();
    }
    /** 
     * ユーザーに紐づくロール一覧を取得する 
     */
    getRoles(): Role[] {
        return this.roles;
    }

    /**
     * 指定されたロールを保持しているか判定する
     * @param role ロール
     * @returns ロールを保持していればtrue
     */
    hasRole(role: Role): boolean {
        return this.roles.some(r => r.equals(role));
    }
    /**
     * ロール名で保持しているかを判定する
     * @param roleName ロール名（例: "admin"）
     * @returns 保持していればtrue
     */
    hasRoleByName(roleName: string): boolean {
        return this.roles.some(r => r.getName().getValue() === roleName);
    }
    /**
     * ロールを追加する（既に追加済みでない場合）
     * @param role 追加するロール
     */
    addRole(role: Role): void {
        if (!this.hasRole(role)) {
            this.roles.push(role);
            this.touch(); // 更新日時を更新
        }
    }
    /**
     * 指定されたロールを削除する
     * @param role 削除対象のロール
     */
    removeRole(role: Role): void {
        this.roles = this.roles.filter(r => !r.equals(role));
        this.touch(); // 更新日時を更新
    }

    /**
     * メールアドレスを変更する
     * @param newEmail 新しいメールアドレス
     */
    changeEmail(newEmail: Email) {
        this.email = newEmail;
        this.touch();
    }
    /**
     * パスワードを変更する（ハッシュ済み）
     * @param newPassword 新しいハッシュ済みパスワード
     */
    changePassword(newPassword: Password) {
        this.password = newPassword;
        this.touch();
    }
    /**
     * ユーザーを無効化する（論理削除などに利用）
     */
    deactivate() {
        this.isActive = IsActive.inactive();
        this.touch();
    }
    /**
     * ユーザーを有効化する
     */
    activate() {
        this.isActive = IsActive.active();
        this.touch();
    }
    /**
     * 更新日時を現在の時刻に更新する（内部使用）
     */
    private touch() {
        this.updatedAt = UpdatedAt.now();
    }
    /**
     * エンティティの等価性を判定する
     * @param other 比較対象のUserエンティティ
     * @returns 同一のユーザーIDを持つ場合true
     */
    equals(other: User): boolean {
        return other instanceof User && this.id.equals(other.getId());
    }
}