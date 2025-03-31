/**
 * リフレッシュトークンを使ったアクセストークン再発行ユースケース
 * @author Fullness,Inc.
 * @date 2025-03-30
 * @version 1.0.0
 */
export interface RefreshAccessTokenUsecase {
    /**
     * リフレッシュトークンからアクセストークンを再発行する
     * @param refreshToken リフレッシュトークン文字列
     * @returns 新しいアクセストークン
     */
    refresh(refreshToken: string): Promise<string>;
}