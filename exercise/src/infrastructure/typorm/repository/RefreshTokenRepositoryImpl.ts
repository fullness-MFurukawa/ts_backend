import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RefreshToken } from "@src/application/domain/model/token/RefreshToken";
import { RefreshTokenId } from "@src/application/domain/model/token/RefreshTokenId";
import { UserId } from "@src/application/domain/model/user/UserId";
import { RefreshTokenRepository } from "@src/application/out/repository/RefreshTokenRepository";
import { EntityManager, Repository } from "typeorm";
import { RefreshTokenModel } from "../model/RefreshTokenModel";
import { Converter } from "@src/shared/adapter/Converter";
import { Restorer } from "@src/shared/adapter/Restorer";

/**
 * RefreshToken エンティティのリポジトリ実装
 * - 永続化と復元を担当するインフラ層の実装クラス
 * @author Fullness
 * @date 2025-03-28
 * @version 1.0.0
 */
@Injectable()
export class RefreshTokenRepositoryImpl implements RefreshTokenRepository<EntityManager> {
    /**
     * コンストラクタ
     * @param repository    RefreshTokenModelのTypeORMリポジトリ
     * @param converter     RefreshTokenをRefreshTokenModelに換する   
     * @param restorer      RefreshTokenModelからRefreshTokenを復元する
     */
    constructor(
        @InjectRepository(RefreshTokenModel)
        private readonly repository: Repository<RefreshTokenModel>,
        @Inject('RefreshTokenModelConverter')
        private readonly converter: Converter<RefreshToken, RefreshTokenModel>,
        @Inject('RefreshTokenModelRestorer')
        private readonly restorer: Restorer<RefreshTokenModel, RefreshToken>,
    ) {}
   
    /**
     * トークンを新規に保存する
     * @param token RefreshToken
     * @param manager TypeORMのEntityManagerなど
     */
    async create(token: RefreshToken, manager?: EntityManager | undefined): Promise<void> {
        const repo = manager ? manager.getRepository(RefreshTokenModel) : this.repository;
        const model = await this.converter.convert(token);
        await repo.save(model);
    }
    /**
     * 指定Idのトークンを取得する
     * @param id RefreshTokenId
     */
    async findById(id: RefreshTokenId, manager?: EntityManager | undefined): Promise<RefreshToken | null> {
        const repo = manager ? manager.getRepository(RefreshTokenModel) : this.repository;
        const model = await repo.findOne({ where: { id: id.getValue() } });
        return model ? this.restorer.restore(model) : null;
    }
    /**
     * 特定ユーザーに紐づくすべてのリフレッシュトークンを取得する
     * @param userId UserId
     */
    async findByUserId(userId: UserId, manager?: EntityManager | undefined): Promise<RefreshToken[]> {
        const repo = manager ? manager.getRepository(RefreshTokenModel) : this.repository;
        const models = await repo.find({ where: { userId: userId.getValue() } });
        return this.restorer.restoreAll(models);
    }
    /**
     * 指定トークンIdのトークンを削除する
     * @param id RefreshTokenId
     */
    async deleteById(id: RefreshTokenId, manager?: EntityManager | undefined): Promise<void> {
        const repo = manager ? manager.getRepository(RefreshTokenModel) : this.repository;
        await repo.delete({ id: id.getValue() });
    }
    /**
     * トークンを無効化する（revokedAtを設定）
     * @param id RefreshTokenId
     */
    async revoke(id: RefreshTokenId, manager?: EntityManager | undefined): Promise<void> {
        const repo = manager ? manager.getRepository(RefreshTokenModel) : this.repository;
        const now = new Date();
        await repo.update({ id: id.getValue() }, { revokedAt: now });
    }
}