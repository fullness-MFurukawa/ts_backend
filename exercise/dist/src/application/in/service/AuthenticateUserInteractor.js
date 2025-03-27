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
     * @param jwtService JWTトークン生成サービス
     * @param configService .envサービス
     */
    constructor(manager, userRepository, jwtService, configService) {
        this.manager = manager;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.configService = configService;
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
        const user = await this.userRepository.findByUsername(username, this.manager);
        if (!user) {
            throw new common_1.UnauthorizedException('認証に失敗しました（ユーザーが存在しません）。');
        }
        // パスワードを照合する
        const isMatch = await user.getPassword().matches(password.getValue());
        if (!isMatch) {
            throw new common_1.UnauthorizedException('認証に失敗しました（パスワード不一致）。');
        }
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
        return token;
    }
};
exports.AuthenticateUserInteractor = AuthenticateUserInteractor;
exports.AuthenticateUserInteractor = AuthenticateUserInteractor = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectEntityManager)()),
    __param(1, (0, common_1.Inject)('UserRepository')),
    __metadata("design:paramtypes", [typeorm_1.EntityManager, Object, jwt_1.JwtService,
        config_1.ConfigService])
], AuthenticateUserInteractor);
