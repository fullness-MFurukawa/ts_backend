import { Inject, Injectable, Logger } from "@nestjs/common";
import { LogoutUserUsecase } from "../usecase/LogoutUserUsecase";
import { InjectEntityManager } from "@nestjs/typeorm";
import { EntityManager } from "typeorm";
import { RefreshTokenRepository } from "@src/application/out/repository/RefreshTokenRepository";
import { RefreshTokenId } from "@src/application/domain/model/token/RefreshTokenId";
import { NotFoundException } from "@src/shared/exceptions/NotFoundException";
import { InternalException } from "@src/shared/exceptions/InternalException";
import { LogoutDTO } from "../dto/LogoutDTO";
import { BlacklistedTokenRepository } from "@src/application/out/repository/BlacklistedTokenRepository";

/**
 * ユーザーログアウトユースケースの実装クラス
 * - クライアントから送信されたリフレッシュトークンを無効化する
 * - 不正なトークンや存在しないトークンには例外を投げる
 *
 * @author Fullness
 * @date 2025-03-28
 * @version 1.0.0
 */
@Injectable()
export class LogoutUserInteractor implements LogoutUserUsecase {
    private readonly logger = new Logger(LogoutUserInteractor.name);
    /**
     * コンストラクタ
     * @param entityManager TypeORMのEntityManager
     * @param refreshTokenRepository リフレッシュトークンリポジトリ
     * @param blacklistedTokenRepository アクセストークンブラックリストの永続化リポジトリ
     */
    constructor(
        @InjectEntityManager()
        private readonly entityManager: EntityManager,
        @Inject('RefreshTokenRepository')
        private readonly refreshTokenRepository: RefreshTokenRepository<EntityManager>,
        @Inject('BlacklistedTokenRepository')
        private readonly blacklistedTokenRepository: BlacklistedTokenRepository<EntityManager>,
    ){}

    /**
     * リフレッシュトークンを無効化してログアウト処理を行う
     * @param refreshToken クライアントが保持するリフレッシュトークン（UUID形式の文字列）
     */
    async logout(logoutDTO: LogoutDTO): Promise<void> {
        // UUID形式のチェックとオブジェクト生成（バリデーション含む）
        const refreshTokenId = RefreshTokenId.fromString(logoutDTO.refreshToken);
        await this.entityManager.transaction(async (manager) => {
            try {
                // トークンの存在確認
                const token = await this.refreshTokenRepository.findById(refreshTokenId, manager);
                if (!token) {
                    throw new NotFoundException("指定されたリフレッシュトークンは存在しません。");
                }
                // すでに無効化済みでなければ、無効化する
                if (!token.isRevoked()) {
                    token.revoke(); // revoke日時を設定
                    await this.refreshTokenRepository.revoke(refreshTokenId, manager); // DB反映
                }
                // トークンをブラックリストに追加する 2025-03-30
                await this.blacklistedTokenRepository
                    .add(logoutDTO.accessToken, logoutDTO.expiresAt, manager);
            } catch (error) {
                this.logger.error(`ログアウト処理中にエラーが発生しました: ${error}`, (error as Error).stack);
                throw new InternalException("ログアウト処理に失敗しました。");
            }
        });
    }
}