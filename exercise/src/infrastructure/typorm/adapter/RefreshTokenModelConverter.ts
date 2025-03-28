import { Injectable } from "@nestjs/common";
import { RefreshToken } from "@src/application/domain/model/token/RefreshToken";
import { Converter } from "@src/shared/adapter/Converter";
import { RefreshTokenModel } from "../model/RefreshTokenModel";

/**
 * RefreshTokenをRefreshTokenModelに変換
 * - ドメインエンティティからDB保存用のエンティティに変換する
 * @author Fullness
 * @date 2025-03-28
 * @version 1.0.0
 */
@Injectable()
export class RefreshTokenModelConverter implements Converter<RefreshToken, RefreshTokenModel> {
    /**
     * RefreshTokenをRefreshTokenModelに変換する
     * @param source リフレッシュトークンエンティティ
     * @returns RefreshTokenModel
     */
    async convert(source: RefreshToken): Promise<RefreshTokenModel> {
        const model = new RefreshTokenModel();
        model.id = source.getId().getValue();
        model.userId = source.getUserId().getValue();
        model.token = source.getToken();
        model.issuedAt = source.getIssuedAt();
        model.expiresAt = source.getExpiresAt();
        model.revokedAt = source.getRevokedAt() ?? null;
        // createdAt / updatedAt はDBで自動設定されるため未設定
        return model;
    }
    /**
     * RefreshTokenの配列をRefreshTokenModelの配列に変換する
     * @param sources RefreshTokenの配列
     * @returns RefreshTokenModelの配列
     */
    async convertAll(sources: RefreshToken[]): Promise<RefreshTokenModel[]> {
        return Promise.all(sources.map(source => this.convert(source)));
    }
}