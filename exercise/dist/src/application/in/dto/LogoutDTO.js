"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogoutDTO = void 0;
/**
 * ログアウト用DTO
 * - アプリケーション層で使用する値オブジェクト
 * @author Fullness,Inc.
 * @date 2025-03-30
 * @version 1.0.0
 */
class LogoutDTO {
    /**
     * コンストラクタ
     * @param refreshToken リフレッシュトークン
     * @param accessToken アクセストークン
     * @param expiresAt アクセストークンの有効期限
     */
    constructor(refreshToken, accessToken, expiresAt) {
        this.refreshToken = refreshToken;
        this.accessToken = accessToken;
        this.expiresAt = expiresAt;
    }
}
exports.LogoutDTO = LogoutDTO;
