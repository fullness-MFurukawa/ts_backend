import { RefreshToken } from "@src/application/domain/model/token/RefreshToken";
import { RefreshTokenId } from "@src/application/domain/model/token/RefreshTokenId";
import { UserId } from "@src/application/domain/model/user/UserId";

/**
 * リフレッシュトークン永続化用のリポジトリインターフェイス
 * - ドメイン層のエンティティとDBの橋渡し役
 * - 主にログイン・ログアウト・トークン更新などで使用
 * @template T トランザクションを扱う型（例: EntityManager）
 * @author Fullness
 * @date 2025-03-28
 * @version 1.0.0
 */
export interface RefreshTokenRepository<T> {
    /**
     * トークンを新規に保存する
     * @param token RefreshToken
     * @param manager TypeORMのEntityManagerなど
     */
    create(token: RefreshToken, manager?: T): Promise<void>;

    /**
     * 指定Idのトークンを取得する
     * @param id RefreshTokenId
     */
    findById(id: RefreshTokenId, manager?: T): Promise<RefreshToken | null>;

    /**
     * 特定ユーザーに紐づくすべてのリフレッシュトークンを取得する
     * @param userId UserId
     */
    findByUserId(userId: UserId, manager?: T): Promise<RefreshToken[]>;

    /**
     * 指定トークンIdのトークンを削除する
     * @param id RefreshTokenId
     */
    deleteById(id: RefreshTokenId, manager?: T): Promise<void>;

    /**
     * トークンを無効化（revokedAtを設定）
     * @param id RefreshTokenId
     */
    revoke(id: RefreshTokenId, manager?: T): Promise<void>;
}