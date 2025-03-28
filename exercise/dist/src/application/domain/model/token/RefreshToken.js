"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshToken = void 0;
/**
 * リフレッシュトークン エンティティ
 * - ユーザーごとに発行されるリフレッシュトークンの状態を保持する
 * - 発行日時、有効期限、無効化日時などを管理
 * - ドメイン層のモデルとして、値オブジェクトと連携して状態と振る舞いを保持する
 * @author Fullness
 * @date 2025-03-28
 * @version 1.0.0
 */
class RefreshToken {
    /**
     * コンストラクタ
     * @param id リフレッシュトークンID（UUID形式）
     * @param userId トークンに紐づくユーザーID
     * @param token 実際にクライアントへ返すトークン文字列
     * @param issuedAt トークンの発行日時
     * @param expiresAt トークンの有効期限
     * @param revokedAt 無効化された日時（null = 有効）
     */
    constructor(id, userId, token, issuedAt, expiresAt, revokedAt = null) {
        this.id = id;
        this.userId = userId;
        this.token = token;
        this.issuedAt = issuedAt;
        this.expiresAt = expiresAt;
        this.revokedAt = revokedAt;
    }
    /**
     * リフレッシュトークンIDを取得
     */
    getId() {
        return this.id;
    }
    /**
     * 対象ユーザーIDを取得
     */
    getUserId() {
        return this.userId;
    }
    /**
     * トークン文字列を取得
     */
    getToken() {
        return this.token;
    }
    /**
     * 発行日時を取得
     */
    getIssuedAt() {
        return this.issuedAt;
    }
    /**
     * 有効期限を取得
     */
    getExpiresAt() {
        return this.expiresAt;
    }
    /**
     * 無効化された日時を取得（null = 有効）
     */
    getRevokedAt() {
        return this.revokedAt;
    }
    /**
     * このトークンが無効化されているか判定
     * @returns true: 無効化されている、false: 有効
     */
    isRevoked() {
        return this.revokedAt !== null;
    }
    /**
     * トークンを無効化する
     * @param date 無効化日時（省略時は現在日時）
     */
    revoke(date = new Date()) {
        this.revokedAt = date;
    }
    /**
     * トークンが有効期限切れかどうかを判定する
     * @returns true: 有効期限切れ、false: 有効
     */
    isExpired() {
        return new Date() > this.expiresAt;
    }
}
exports.RefreshToken = RefreshToken;
