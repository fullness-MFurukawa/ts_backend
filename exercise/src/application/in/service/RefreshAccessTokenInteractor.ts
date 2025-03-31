import { Inject, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { RefreshAccessTokenUsecase } from "../usecase/RefreshAccessTokenUsecase";
import { InjectEntityManager } from "@nestjs/typeorm";
import { EntityManager } from "typeorm";
import { RefreshTokenRepository } from "@src/application/out/repository/RefreshTokenRepository";
import { UserRepository } from "@src/application/out/repository/UserRepository";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { RefreshTokenId } from "@src/application/domain/model/token/RefreshTokenId";

/**
 * リフレッシュトークンからアクセストークンを再発行するユースケース実装
 * - 有効なリフレッシュトークンであることを検証し、
 *   対応するユーザー情報から新しいアクセストークンを発行する
 * @author Fullness,Inc.
 * @date 2025-03-30
 * @version 1.0.0
 */
@Injectable()
export class RefreshAccessTokenInteractor implements RefreshAccessTokenUsecase {
    /**
     * コンストラクタ
     * @param entityManager TypeORMのEntityManager
     * @param refreshTokenRepository リフレッシュトークンリポジトリ
     * @param userRepository ユーザーリポジトリ
     * @param jwtService JWTサービス
     * @param configService 環境サービス
     */
    constructor(
        @InjectEntityManager()
        private readonly entityManager: EntityManager,
        @Inject('RefreshTokenRepository')
        private readonly refreshTokenRepository: RefreshTokenRepository<EntityManager>,
        @Inject('UserRepository')
        private readonly userRepository: UserRepository<EntityManager>,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    /**
     * リフレッシュトークンからアクセストークンを再発行する
     * @param refreshToken リフレッシュトークン文字列
     * @returns アクセストークン
     * @throws UnauthorizedException トークンが無効または期限切れの場合
     */
    async refresh(refreshToken: string): Promise<string> {
        const refreshTokenId = RefreshTokenId.fromString(refreshToken);
        // リフレッシュトークンが存在しており、無効化されておらず、有効期限内であることを確認
        const token = await this.refreshTokenRepository.findById(refreshTokenId, this.entityManager);
        if (!token || token.isRevoked() || token.isExpired()) {
            throw new UnauthorizedException('無効または期限切れのリフレッシュトークンです。');
        }
        // 該当ユーザーを取得
        const user = await this.userRepository.findById(token.getUserId(), this.entityManager);
        if (!user) {
            throw new UnauthorizedException('ユーザーが見つかりません。');
        }
        // 新しいアクセストークンの生成
        const payload = {
            sub: user.getId().getValue(),
            username: user.getUsername().getValue(),
            roles: user.getRoles().map((role) => role.getName().getValue()),
        };
        const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN', '1h');
        const secret = this.configService.get<string>('JWT_SECRET', 'defaultSecret');
        return this.jwtService.sign(payload, {
            secret,
            expiresIn,
        });
    }
}