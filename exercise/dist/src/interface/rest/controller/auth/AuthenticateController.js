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
exports.AuthenticateController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const AuthenticateParam_1 = require("../../param/AuthenticateParam");
const LogoutParam_1 = require("../../param/LogoutParam");
const RefreshTokenParam_1 = require("../../param/RefreshTokenParam");
/**
 * 認証APIコントローラ
 * - ユーザーのログイン処理を提供する
 * @author Fullness,Inc.
 * @date 2025-03-27
 * @version 1.0.0
 */
let AuthenticateController = class AuthenticateController {
    /**
     * コンストラクタ
     * @param authenticateUserUsecase 認証ユースケース
     * @param logoutUserUsecase ログアウトユースケース
     * @param refreshAccessTokenUsecase リフレッシュトークンからアクセストークンを再発行するユースケース
     * @param paramConverter AuthenticateParamをAuthenticateDTOに変換
     */
    constructor(authenticateUserUsecase, logoutUserUsecase, refreshAccessTokenUsecase, paramConverter, logoutParamConverter) {
        this.authenticateUserUsecase = authenticateUserUsecase;
        this.logoutUserUsecase = logoutUserUsecase;
        this.refreshAccessTokenUsecase = refreshAccessTokenUsecase;
        this.paramConverter = paramConverter;
        this.logoutParamConverter = logoutParamConverter;
    }
    /**
     * ログイン処理
     * @param param クライアントから送信されたログインパラメータ
     * @returns アクセストークン
     */
    async login(param) {
        const dto = await this.paramConverter.convert(param);
        return await this.authenticateUserUsecase.authenticate(dto);
    }
    async logout(param) {
        const dto = await this.logoutParamConverter.convert(param);
        await this.logoutUserUsecase.logout(dto);
    }
    /**
     * アクセストークン再発行（リフレッシュトークン使用）
     */
    async refresh(param) {
        const newToken = await this.refreshAccessTokenUsecase.refresh(param.refresh_token);
        return { access_token: newToken };
    }
};
exports.AuthenticateController = AuthenticateController;
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    (0, swagger_1.ApiOperation)({ summary: 'ユーザーログイン（JWTトークンを取得）' }),
    (0, swagger_1.ApiBody)({ type: AuthenticateParam_1.AuthenticateParam }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '認証成功。アクセストークンとリフレッシュトークンを返却します。',
        schema: {
            example: {
                access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                refresh_token: '93d3f768-1d1e-4760-94a6-abc123456789'
            }
        }
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AuthenticateParam_1.AuthenticateParam]),
    __metadata("design:returntype", Promise)
], AuthenticateController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    (0, swagger_1.ApiOperation)({ summary: 'ユーザーログアウト（リフレッシュトークン無効化）' }),
    (0, swagger_1.ApiBody)({ type: LogoutParam_1.LogoutParam }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'ログアウト成功。リフレッシュトークンを無効化しました。' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'リフレッシュトークンが存在しない場合のエラー。' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'サーバー内部エラー。' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LogoutParam_1.LogoutParam]),
    __metadata("design:returntype", Promise)
], AuthenticateController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    (0, swagger_1.ApiOperation)({ summary: 'アクセストークン再発行', description: 'リフレッシュトークンを用いて新しいアクセストークンを取得します。' }),
    (0, swagger_1.ApiBody)({ type: RefreshTokenParam_1.RefreshTokenParam }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'アクセストークン再発行成功',
        schema: {
            example: {
                access_token: 'new.jwt.access.token'
            }
        }
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RefreshTokenParam_1.RefreshTokenParam]),
    __metadata("design:returntype", Promise)
], AuthenticateController.prototype, "refresh", null);
exports.AuthenticateController = AuthenticateController = __decorate([
    (0, swagger_1.ApiTags)('認証'),
    (0, common_1.Controller)('auth'),
    __param(0, (0, common_1.Inject)('AuthenticateUserUsecase')),
    __param(1, (0, common_1.Inject)('LogoutUserUsecase')),
    __param(2, (0, common_1.Inject)('RefreshAccessTokenUsecase')),
    __param(3, (0, common_1.Inject)('AuthenticateParamConverter')),
    __param(4, (0, common_1.Inject)('LogoutParamConverter')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], AuthenticateController);
