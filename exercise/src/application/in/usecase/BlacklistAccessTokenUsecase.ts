/**
 * アクセストークンのブラックリスト追加ユースケース
 * - JWTトークンを無効化する処理を定義
 * @author Fullness,Inc.
 * @date 2025-03-30
 * @version 1.0.0
 */
export interface BlacklistAccessTokenUsecase {
    /**
     * 指定されたアクセストークンをブラックリストに追加する
     * @param token JWTトークン（アクセストークン）
     * @param expiresAt トークンの有効期限（Date型）
     * @throws ExistsException トークンがすでにブラックリストに存在する場合
     * @throws InternalException その他の内部処理エラー
     */
    blacklist(token: string, expiresAt: Date): Promise<void>;
    /**
     * 指定されたトークンがブラックリストに存在するか判定する
     * @param token JWTトークン
     * @returns true: ブラックリストに存在する / false: 存在しない
     */
    isBlacklisted(token: string): Promise<boolean>;
}