/**
 * ログアウト用DTO
 * - アプリケーション層で使用する値オブジェクト
 * @author Fullness,Inc.
 * @date 2025-03-30
 * @version 1.0.0
 */
export class LogoutDTO {
    /**
     * コンストラクタ
     * @param refreshToken リフレッシュトークン
     * @param accessToken アクセストークン
     * @param expiresAt アクセストークンの有効期限
     */
    constructor(
      public readonly refreshToken: string,
      public readonly accessToken: string,
      public readonly expiresAt: Date,
    ) {}
}