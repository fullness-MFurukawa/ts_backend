"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticateResultDTO = void 0;
/**
 * 認証結果を表すDTO
 * - アプリケーション層のユースケースで使用
 * @author Fullness,Inc.
 * @date 2025-03-28
 * @version 1.0.0
 */
class AuthenticateResultDTO {
    /**
     * コンストラクタ
     * @param access_token アクセストークン
     * @param refresh_token リフレッシュトークン
     */
    constructor(access_token, refresh_token) {
        this.access_token = access_token;
        this.refresh_token = refresh_token;
    }
}
exports.AuthenticateResultDTO = AuthenticateResultDTO;
