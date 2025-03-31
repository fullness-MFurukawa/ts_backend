import { Inject, Injectable, Logger } from "@nestjs/common";
import { BlacklistAccessTokenUsecase } from "../usecase/BlacklistAccessTokenUsecase";
import { InjectEntityManager } from "@nestjs/typeorm";
import { EntityManager } from "typeorm";
import { BlacklistedTokenRepository } from "@src/application/out/repository/BlacklistedTokenRepository";
import { ExistsException } from "@src/shared/exceptions/ExistsException";
import { InternalException } from "@src/shared/exceptions/InternalException";

/**
 * アクセストークンをブラックリストに追加するユースケース実装
 * - 有効期限付きでトークンを無効化
 * @author Fullness,Inc.
 * @date 2025-03-30
 * @version 1.0.0
 */
@Injectable()
export class BlacklistAccessTokenInteractor implements BlacklistAccessTokenUsecase {

    private readonly logger = new Logger(BlacklistAccessTokenInteractor.name);
    
    /**
     * コンストラクタ
     * @param entityManager TypeORMのEntityManager
     * @param repository アクセストークンブラックリストリポジトリ
    */
    constructor(
        @InjectEntityManager()
        private readonly entityManager: EntityManager,
        @Inject('BlacklistedTokenRepository')
        private readonly repository: BlacklistedTokenRepository<EntityManager>
    ) {}
    
    /**
     * トークンをブラックリストに追加する
     * @param token JWTトークン（アクセストークン）
     * @param expiresAt トークンの有効期限
     */
    async blacklist(token: string, expiresAt: Date): Promise<void> {
        await this.entityManager.transaction(async (manager) => {
            try {
                await this.repository.add(token, expiresAt, manager);
            } catch (error) {
                if (error instanceof ExistsException) {
                    throw error;
                }
                this.logger.error('ブラックリスト登録失敗', error instanceof Error ? error.stack : String(error));
                throw new InternalException('トークンのブラックリスト化に失敗しました');
            }
        });
    }

    /**
     * 指定されたトークンがブラックリストに存在するか判定する
     * @param token JWTトークン
     * @returns true: ブラックリストに存在する / false: 存在しない
     */
    async isBlacklisted(token: string): Promise<boolean> {
        return await this.repository.isBlacklisted(token, this.entityManager);
    }
}