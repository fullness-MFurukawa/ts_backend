"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticateUserInteractor = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const Username_1 = require("../../domain/model/user/Username");
const Password_1 = require("../../domain/model/user/Password");
const config_1 = require("@nestjs/config");
const typeorm_2 = require("@nestjs/typeorm");
const RefreshTokenId_1 = require("../../domain/model/token/RefreshTokenId");
const RefreshToken_1 = require("../../domain/model/token/RefreshToken");
const InternalException_1 = require("../../../shared/exceptions/InternalException");
const date_fns_1 = require("date-fns");
const AuthenticateResultDTO_1 = require("../dto/AuthenticateResultDTO");
/**
 * ユーザー認証ユースケースの実装クラス
 * - ユーザー名とパスワードを検証し、JWTを発行する
 * @author Fullness,Inc.
 * @date 2025-03-24
 * @version 1.0.0
 */
let AuthenticateUserInteractor = class AuthenticateUserInteractor {
    /**
     * コンストラクタ
     * @param userRepository ユーザーリポジトリ
     * @param refreshTokenRepository リフレッシュトークントークンリポジトリ
     * @param jwtService JWTトークン生成サービス
     * @param configService .envサービス
     */
    constructor(entityManager, userRepository, refreshTokenRepository, jwtService, configService) {
        this.entityManager = entityManager;
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.jwtService = jwtService;
        this.configService = configService;
        this.logger = new common_1.Logger('AuthenticateUserInteractor');
    }
    /**
     * 認証処理の実行
     * @param dto 認証DTO（ユーザー名・パスワード）
     * @returns JWTトークン（認証成功時）
     * @throws UnauthorizedException 認証失敗時
     */
    async authenticate(dto) {
        // 値オブジェクトを生成する
        const username = Username_1.Username.fromString(dto.username);
        const password = Password_1.Password.fromPlain(dto.password);
        // ユーザ名で対象ユーザーを取得する
        const user = await this.userRepository.findByUsername(username, this.entityManager);
        if (!user) {
            throw new common_1.UnauthorizedException('認証に失敗しました（ユーザーが存在しません）。');
        }
        // パスワードを照合する
        const isMatch = await user.getPassword().matches(password.getValue());
        if (!isMatch) {
            throw new common_1.UnauthorizedException('認証に失敗しました（パスワード不一致）。');
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
        const expiresIn = this.configService.get('JWT_EXPIRES_IN', '1h');
        // 環境変数からJWTシークレットを取得
        const secret = this.configService.get('JWT_SECRET', 'defaultSecret');
        // JWTトークンを生成する
        const token = this.jwtService.sign(payload, {
            secret,
            expiresIn,
        });
        return new AuthenticateResultDTO_1.AuthenticateResultDTO(token, refreshTokenValue);
    }
    /**
     * リフレッシュトークンを生成して保存する
     * @param username ユーザー名
     */
    async generateAndSaveRefreshToken(username) {
        // リフレッシュトークンの値を設定
        const refreshTokenId = RefreshTokenId_1.RefreshTokenId.new();
        const refreshTokenValue = refreshTokenId.getValue(); // UUIDとしてそのまま利用
        const issuedAt = new Date();
        const expiresAt = (0, date_fns_1.addMinutes)(issuedAt, parseInt(this.configService.get('REFRESH_TOKEN_EXPIRES_MINUTES', '1440')));
        await this.entityManager.transaction(async (manager) => {
            try {
                // ユーザー情報の取得
                const user = await this.userRepository.findByUsername(username, manager);
                if (!user) {
                    throw new InternalException_1.InternalException(`ユーザー情報の再取得に失敗しました。`);
                }
                // リフレッシュトークンの生成
                const refreshToken = new RefreshToken_1.RefreshToken(refreshTokenId, user.getId(), refreshTokenValue, issuedAt, expiresAt);
                // DBへリフレッシュトークンを保存
                await this.refreshTokenRepository.create(refreshToken, manager);
            }
            catch (error) {
                this.logger.error(`リフレッシュトークン登録失敗: ${error}`, error.stack);
                throw new InternalException_1.InternalException(`リフレッシュトークンの登録処理中に予期せぬエラーが発生しました。`);
            }
        });
        return refreshTokenValue;
    }
};
exports.AuthenticateUserInteractor = AuthenticateUserInteractor;
exports.AuthenticateUserInteractor = AuthenticateUserInteractor = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectEntityManager)()),
    __param(1, (0, common_1.Inject)('UserRepository')),
    __param(2, (0, common_1.Inject)('RefreshTokenRepository')),
    __metadata("design:paramtypes", [typeorm_1.EntityManager, Object, Object, jwt_1.JwtService,
        config_1.ConfigService])
], AuthenticateUserInteractor);
