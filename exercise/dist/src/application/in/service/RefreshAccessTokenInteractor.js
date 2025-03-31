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
exports.RefreshAccessTokenInteractor = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const RefreshTokenId_1 = require("../../domain/model/token/RefreshTokenId");
/**
 * リフレッシュトークンからアクセストークンを再発行するユースケース実装
 * - 有効なリフレッシュトークンであることを検証し、
 *   対応するユーザー情報から新しいアクセストークンを発行する
 * @author Fullness,Inc.
 * @date 2025-03-30
 * @version 1.0.0
 */
let RefreshAccessTokenInteractor = class RefreshAccessTokenInteractor {
    /**
     * コンストラクタ
     * @param entityManager TypeORMのEntityManager
     * @param refreshTokenRepository リフレッシュトークンリポジトリ
     * @param userRepository ユーザーリポジトリ
     * @param jwtService JWTサービス
     * @param configService 環境サービス
     */
    constructor(entityManager, refreshTokenRepository, userRepository, jwtService, configService) {
        this.entityManager = entityManager;
        this.refreshTokenRepository = refreshTokenRepository;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    /**
     * リフレッシュトークンからアクセストークンを再発行する
     * @param refreshToken リフレッシュトークン文字列
     * @returns アクセストークン
     * @throws UnauthorizedException トークンが無効または期限切れの場合
     */
    async refresh(refreshToken) {
        const refreshTokenId = RefreshTokenId_1.RefreshTokenId.fromString(refreshToken);
        // リフレッシュトークンが存在しており、無効化されておらず、有効期限内であることを確認
        const token = await this.refreshTokenRepository.findById(refreshTokenId, this.entityManager);
        if (!token || token.isRevoked() || token.isExpired()) {
            throw new common_1.UnauthorizedException('無効または期限切れのリフレッシュトークンです。');
        }
        // 該当ユーザーを取得
        const user = await this.userRepository.findById(token.getUserId(), this.entityManager);
        if (!user) {
            throw new common_1.UnauthorizedException('ユーザーが見つかりません。');
        }
        // 新しいアクセストークンの生成
        const payload = {
            sub: user.getId().getValue(),
            username: user.getUsername().getValue(),
            roles: user.getRoles().map((role) => role.getName().getValue()),
        };
        const expiresIn = this.configService.get('JWT_EXPIRES_IN', '1h');
        const secret = this.configService.get('JWT_SECRET', 'defaultSecret');
        return this.jwtService.sign(payload, {
            secret,
            expiresIn,
        });
    }
};
exports.RefreshAccessTokenInteractor = RefreshAccessTokenInteractor;
exports.RefreshAccessTokenInteractor = RefreshAccessTokenInteractor = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectEntityManager)()),
    __param(1, (0, common_1.Inject)('RefreshTokenRepository')),
    __param(2, (0, common_1.Inject)('UserRepository')),
    __metadata("design:paramtypes", [typeorm_2.EntityManager, Object, Object, jwt_1.JwtService,
        config_1.ConfigService])
], RefreshAccessTokenInteractor);
