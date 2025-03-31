
/**
 * アクセストークンのブラックリストリポジトリ
 * - アクセストークンの無効化および検査処理を提供
 * - JWTトークンの文字列そのものを扱う
 * @template T トランザクションコンテキスト（例: EntityManager）
 * @author Fullness,Inc.
 * @date 2025-03-30
 * @version 1.0.0
 */
export interface BlacklistedTokenRepository<T> {
    /**
     * トークンをブラックリストに追加
     * @param token JWTトークン（アクセストークン）
     * @param expiresAt 有効期限（Date形式）
     * @param manager トランザクション用EntityManagerなど（任意）
     */
    add(token: string, expiresAt: Date, manager?: T): Promise<void>;

    /**
     * 指定されたトークンがブラックリストに存在するかを確認
     * @param token JWTトークン
     * @param manager トランザクション用EntityManagerなど（任意）
     * @returns true: 無効トークン（存在する）, false: 有効トークン
     */
    isBlacklisted(token: string, manager?: T): Promise<boolean>;

    /**
     * 有効期限が過ぎたブラックリストのトークンを一括削除する
     * @param now 現在日時
     * @param manager トランザクション用EntityManagerなど（任意）
     * @returns 削除件数
    */
    deleteExpired(now: Date, manager?: T): Promise<number>;
}