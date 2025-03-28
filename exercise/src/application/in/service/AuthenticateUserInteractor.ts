import { Inject, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { AuthenticateUserUsecase } from "../usecase/AuthenticateUserUsecase";
import { AuthenticateDTO } from "../dto/AuthenticateDTO";
import { UserRepository } from "@src/application/out/repository/UserRepository";
import { EntityManager } from "typeorm";
import { JwtService } from '@nestjs/jwt';
import { Username } from "@src/application/domain/model/user/Username";
import { Password } from "@src/application/domain/model/user/Password";
import { ConfigService } from "@nestjs/config";
import { InjectEntityManager } from "@nestjs/typeorm";
import { RefreshTokenRepository } from "@src/application/out/repository/RefreshTokenRepository";
import { RefreshTokenId } from "@src/application/domain/model/token/RefreshTokenId";
import { RefreshToken } from "@src/application/domain/model/token/RefreshToken";
import { InternalException } from "@src/shared/exceptions/InternalException";
import { addMinutes } from 'date-fns'; 
import { AuthenticateResultDTO } from "../dto/AuthenticateResultDTO";
/**
 * ユーザー認証ユースケースの実装クラス
 * - ユーザー名とパスワードを検証し、JWTを発行する
 * @author Fullness,Inc.
 * @date 2025-03-24
 * @version 1.0.0
 */
@Injectable()
export class AuthenticateUserInteractor implements AuthenticateUserUsecase {
    private readonly logger = new Logger('AuthenticateUserInteractor');
    /**
     * コンストラクタ
     * @param userRepository ユーザーリポジトリ
     * @param refreshTokenRepository リフレッシュトークントークンリポジトリ
     * @param jwtService JWTトークン生成サービス
     * @param configService .envサービス
     */
    constructor(
        @InjectEntityManager()
        private readonly entityManager: EntityManager,
        @Inject('UserRepository')
        private readonly userRepository: UserRepository<EntityManager>,
        @Inject('RefreshTokenRepository')
        private readonly refreshTokenRepository: RefreshTokenRepository<EntityManager>,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ){}

    /**
     * 認証処理の実行
     * @param dto 認証DTO（ユーザー名・パスワード）
     * @returns JWTトークン（認証成功時）
     * @throws UnauthorizedException 認証失敗時
     */
    async authenticate(dto: AuthenticateDTO): Promise<AuthenticateResultDTO> {
        // 値オブジェクトを生成する
        const username = Username.fromString(dto.username);
        const password = Password.fromPlain(dto.password);
        
        // ユーザ名で対象ユーザーを取得する
        const user = await this.userRepository.findByUsername(username,this.entityManager);
        if (!user) {
            throw new UnauthorizedException('認証に失敗しました（ユーザーが存在しません）。');
        }
        // パスワードを照合する
        const isMatch = await user.getPassword().matches(password.getValue());
        if (!isMatch) {
            throw new UnauthorizedException('認証に失敗しました（パスワード不一致）。');
        }

        // リフレッシュトークンを生成して保存する
        const refreshTokenValue = await this.generateAndSaveRefreshToken(username);

        // JWTペイロードと署名を生成する
        const payload = {
            sub: user.getId().getValue(),
            username: user.getUsername().getValue(),    
            roles: user.getRoles().map(role => role.getName().getValue()),
        };
        // 環境変数からトークンの有効期限を取得する
        const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN', '1h');
        // 環境変数からJWTシークレットを取得
        const secret = this.configService.get<string>('JWT_SECRET', 'defaultSecret');
        // JWTトークンを生成する
        const token = this.jwtService.sign(payload, {
            secret,
            expiresIn,
        });
        return new AuthenticateResultDTO(token , refreshTokenValue);
    }

    /**
     * リフレッシュトークンを生成して保存する
     * @param username ユーザー名
     */
    private async generateAndSaveRefreshToken(username: Username):Promise<string> {
        // リフレッシュトークンの値を設定
        const refreshTokenId = RefreshTokenId.new();
        const refreshTokenValue = refreshTokenId.getValue(); // UUIDとしてそのまま利用
        const issuedAt = new Date();
        const expiresAt = addMinutes(issuedAt, 
            parseInt(this.configService.get('REFRESH_TOKEN_EXPIRES_MINUTES', '1440')));

        await this.entityManager.transaction(async (manager) => { 
            try{
                // ユーザー情報の取得
                const user = await this.userRepository.findByUsername(username,manager);
                if (!user) {
                    throw new InternalException(`ユーザー情報の再取得に失敗しました。`);
                } 
                // リフレッシュトークンの生成
                const refreshToken = new RefreshToken(
                    refreshTokenId,
                    user!.getId(),
                    refreshTokenValue,
                    issuedAt,
                    expiresAt);
                // DBへリフレッシュトークンを保存
                await this.refreshTokenRepository.create(refreshToken, manager);
            }catch(error){
                this.logger.error(`リフレッシュトークン登録失敗: ${error}`, (error as Error).stack);
                throw new InternalException(`リフレッシュトークンの登録処理中に予期せぬエラーが発生しました。`);
            }
        }); 
        return refreshTokenValue;
    }
}