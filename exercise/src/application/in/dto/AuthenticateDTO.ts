/**
 * ユーザー認証用のDTO（Data Transfer Object）
 * - アプリケーション層のユースケースで使用
 * @author Fullness,Inc.
 * @date 2025-03-24
 * @version 1.0.0
 */
export class AuthenticateDTO {
    /**
     * ログイン用ユーザー名
     */
    readonly username: string;
    /**
     * パスワード（ハッシュ化前の平文）
     */
    readonly password: string;

    /**
     * コンストラクタ
     * @param username UIで入力されたユーザー名 
     * @param password UIで入力されたパスワード
     */
    constructor(username: string, password: string) {
        this.username = username;
        this.password = password;
    }
}