import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BlacklistedTokenRepository } from "@src/application/out/repository/BlacklistedTokenRepository";
import { EntityManager, LessThan, Repository } from "typeorm";
import { BlacklistedTokenModel } from "../model/BlacklistedTokenModel";
import { ExistsException } from "@src/shared/exceptions/ExistsException";
import { InternalException } from "@src/shared/exceptions/InternalException";

/**
 * アクセストークンブラックリストの永続化リポジトリ実装
 * - TypeORMによるDB操作を担うクラス
 * @author Fullness,Inc.
 * @date 2025-03-30
 * @version 1.0.0
 */
@Injectable()
export class BlacklistedTokenRepositoryImpl implements BlacklistedTokenRepository<EntityManager> {
     private readonly logger = new Logger('BlacklistedTokenRepositoryImpl');
    /**
     * コンストラクタ
     * @param repository TypeORMのリポジトリ（DIにより注入）
     */
    constructor(
        @InjectRepository(BlacklistedTokenModel)
        private readonly repository: Repository<BlacklistedTokenModel>,
    ) {}

    /**
     * トークンをブラックリストに追加
     * @param token JWTトークン文字列
     * @param expiresAt トークンの有効期限
     * @param manager 任意のEntityManager（トランザクション対応用）
     */
    async add(token: string, expiresAt: Date, manager?: EntityManager | undefined): Promise<void> {
        const repo = manager ? manager.getRepository(BlacklistedTokenModel) : this.repository;
        const entity = new BlacklistedTokenModel();
        entity.token = token;
        entity.expiresAt = expiresAt;
        try{
            await repo.save(entity);
        }catch(error){
            if (typeof error === 'object' && error !== null && 'code' in error) {
                const code = (error as any).code;
                if (code === 'ER_DUP_ENTRY') {
                  throw new ExistsException(`トークン:${token}が重複しています。`);
                }
            }
            this.logger.error(`トークンのブラックリスト追加失敗: ${error}`, (error as Error).stack);
            throw new InternalException(
                `トークンのブラックリスト追加で予期せぬエラーが発生しました。`);
        }
    }

    /**
     * 指定トークンがブラックリストに存在するか判定
     * @param token JWTトークン
     * @param manager 任意のEntityManager
     * @returns true: 無効トークン, false: 有効トークン
     */
    async isBlacklisted(token: string, manager?: EntityManager | undefined): Promise<boolean> {
        const repo = manager ? manager.getRepository(BlacklistedTokenModel) : this.repository;
        const count = await repo.count({ where: { token } });
        return count > 0;
    }
    /**
     * 有効期限切れのブラックリストトークンを削除
     * @param now 現在時刻
     * @param manager 任意のEntityManager
     * @returns 削除された件数
     */
    async deleteExpired(now: Date, manager?: EntityManager | undefined): Promise<number> {
        const repo = manager ? manager.getRepository(BlacklistedTokenModel) : this.repository;
        const result = await repo.delete({ expiresAt: LessThan(now) });
        return result.affected || 0;
    }
}