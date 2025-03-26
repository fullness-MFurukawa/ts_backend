"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticateDTO = void 0;
/**
 * ユーザー認証用のDTO（Data Transfer Object）
 * - アプリケーション層のユースケースで使用
 * @author Fullness,Inc.
 * @date 2025-03-24
 * @version 1.0.0
 */
class AuthenticateDTO {
    /**
     * コンストラクタ
     * @param username UIで入力されたユーザー名
     * @param password UIで入力されたパスワード
     */
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
}
exports.AuthenticateDTO = AuthenticateDTO;
