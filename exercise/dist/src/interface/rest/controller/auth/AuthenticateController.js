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
     * @param paramConverter AuthenticateParamをAuthenticateDTOに変換
     */
    constructor(authenticateUserUsecase, paramConverter) {
        this.authenticateUserUsecase = authenticateUserUsecase;
        this.paramConverter = paramConverter;
    }
    /**
     * ログイン処理
     * @param param クライアントから送信されたログインパラメータ
     * @returns アクセストークン
     */
    async login(param) {
        const dto = await this.paramConverter.convert(param);
        const token = await this.authenticateUserUsecase.authenticate(dto);
        return { access_token: token };
    }
};
exports.AuthenticateController = AuthenticateController;
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    (0, swagger_1.ApiOperation)({ summary: 'ユーザーログイン（JWTトークンを取得）' }),
    (0, swagger_1.ApiBody)({ type: AuthenticateParam_1.AuthenticateParam }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '認証成功。JWTトークンを返却します。', schema: {
            example: {
                access_token: 'eyJhbGciOiJIUzI1NiIsInR...'
            }
        } }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AuthenticateParam_1.AuthenticateParam]),
    __metadata("design:returntype", Promise)
], AuthenticateController.prototype, "login", null);
exports.AuthenticateController = AuthenticateController = __decorate([
    (0, swagger_1.ApiTags)('認証'),
    (0, common_1.Controller)('auth'),
    __param(0, (0, common_1.Inject)('AuthenticateUserUsecase')),
    __param(1, (0, common_1.Inject)('AuthenticateParamConverter')),
    __metadata("design:paramtypes", [Object, Object])
], AuthenticateController);
