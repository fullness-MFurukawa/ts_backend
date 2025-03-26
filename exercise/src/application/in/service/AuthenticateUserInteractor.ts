import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthenticateUserUsecase } from "../usecase/AuthenticateUserUsecase";
import { AuthenticateDTO } from "../dto/AuthenticateDTO";
import { UserRepository } from "@src/application/out/repository/UserRepository";
import { EntityManager } from "typeorm";
import { JwtService } from '@nestjs/jwt';
import { Username } from "@src/application/domain/model/user/Username";
import { Password } from "@src/application/domain/model/user/Password";
import { ConfigService } from "@nestjs/config";
import { InjectEntityManager } from "@nestjs/typeorm";

/**
 * ユーザー認証ユースケースの実装クラス
 * - ユーザー名とパスワードを検証し、JWTを発行する
 * @author Fullness,Inc.
 * @date 2025-03-24
 * @version 1.0.0
 */
@Injectable()
export class AuthenticateUserInteractor implements AuthenticateUserUsecase {

    /**
     * コンストラクタ
     * @param userRepository ユーザーリポジトリ
     * @param jwtService JWTトークン生成サービス
     * @param configService .envサービス
     */
    constructor(
        @InjectEntityManager()
        private readonly manager: EntityManager,
        @Inject('UserRepository')
        private readonly userRepository: UserRepository<EntityManager>,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ){}

    /**
     * 認証処理の実行
     * @param dto 認証DTO（ユーザー名・パスワード）
     * @returns JWTトークン（認証成功時）
     * @throws UnauthorizedException 認証失敗時
     */
    async authenticate(dto: AuthenticateDTO): Promise<string> {
        // 値オブジェクトを生成する
        const username = Username.fromString(dto.username);
        const password = Password.fromPlain(dto.password);
        
        // ユーザ名で対象ユーザーを取得する
        const user = await this.userRepository.findByUsername(username,this.manager);
        if (!user) {
            throw new UnauthorizedException('認証に失敗しました（ユーザーが存在しません）。');
        }
        // パスワードを照合する
        const isMatch = await user.getPassword().matches(password.getValue());
        if (!isMatch) {
            throw new UnauthorizedException('認証に失敗しました（パスワード不一致）。');
        }
        // JWTペイロードと署名を生成する
        const payload = {
            sub: user.getId().getValue(),
            username: user.getUsername().getValue(),
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
        return token;
    }
}