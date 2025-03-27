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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
/**
 * JWT認証用のPassportストラテジークラス
 * - AuthorizationヘッダーのBearerトークンからJWTを抽出し、検証・デコードを行う
 * - 認証に成功した場合、validate()の戻り値がreq.userとして利用可能になる
 * @author Fullness,Inc.
 * @date 2025-03-27
 * @version 1.0.0
 */
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    /**
     * コンストラクタ
     * @param configService 環境変数を取得するためのサービス（JWT_SECRETなどを参照）
     */
    constructor(configService) {
        super({
            // JWTの取得元：AuthorizationヘッダーのBearerトークン
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            // トークンの有効期限を検証するかどうか（falseなら期限切れは拒否）
            ignoreExpiration: false,
            // JWT署名検証に使うシークレットキー
            secretOrKey: configService.get('JWT_SECRET'),
        });
        this.configService = configService;
    }
    /**
     * JWTのペイロードをバリデートし、認証情報として返す
     * - この戻り値は、自動的にreq.userにセットされ、後続の処理で利用可能
     * @param payload JWTのデコード済みペイロード
     * @returns 認証されたユーザー情報（任意のオブジェクト）
     */
    validate(payload) {
        // 認証成功後に req.user にセットされる値
        return {
            userId: payload.sub,
            username: payload.username,
            roles: payload.roles,
        };
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], JwtStrategy);
