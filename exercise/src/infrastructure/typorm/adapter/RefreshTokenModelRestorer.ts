import { Injectable } from "@nestjs/common";
import { Restorer } from "@src/shared/adapter/Restorer";
import { RefreshTokenModel } from "../model/RefreshTokenModel";
import { RefreshToken } from "@src/application/domain/model/token/RefreshToken";
import { RefreshTokenId } from "@src/application/domain/model/token/RefreshTokenId";
import { UserId } from "@src/application/domain/model/user/UserId";

/**
 * RefreshTokenModelからRefreshToken エンティティを復元する
 * - DBエンティティからドメインエンティティへ変換する
 * @author Fullness
 * @date 2025-03-28
 * @version 1.0.0
 */
@Injectable()
export class RefreshTokenModelRestorer implements Restorer<RefreshTokenModel, RefreshToken> {
    
    /**
     * RefreshTokenModelからRefreshTokenを復元する
     * @param model RefreshTokenModel
     * @returns RefreshToken
     */
    async restore(source: RefreshTokenModel): Promise<RefreshToken> {
        return new RefreshToken(
            RefreshTokenId.fromString(source.id),
            UserId.fromString(source.userId),
            source.token,
            source.issuedAt,
            source.expiresAt,
            source.revokedAt ?? null,
        );
    }
    /**
     * RefreshTokenModelの配列からRefreshTokenの配列を復元する
     * @param model RefreshTokenModelの配列
     * @returns RefreshTokenの配列
     */
    async restoreAll(sources: RefreshTokenModel[]): Promise<RefreshToken[]> {
        return Promise.all(sources.map(m => this.restore(m)));
    }
}