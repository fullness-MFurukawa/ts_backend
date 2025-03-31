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
exports.JwtBlacklistGuard = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
/**
 * JWT認証ガード（ブラックリスト対応）
 * - 通常のJWT認証に加え、トークンがブラックリストに登録されていないことを確認
 * - 無効トークンの場合はUnauthorizedExceptionをスロー
 * @author Fullness,Inc
 * @date 2025-03-30
 * @version 1.0.0
 */
let JwtBlacklistGuard = class JwtBlacklistGuard extends (0, passport_1.AuthGuard)('jwt') {
    /**
     * コンストラクタで依存関係を注入
     * @param reflector メタデータリフレクター（必要に応じて使用）
     * @param entityManager TypeORMのEntityManager（トランザクション可能）
     * @param blacklistedTokenRepo ブラックリストリポジトリ
     */
    constructor(blacklistAccessTokenUsecase) {
        super(); // AuthGuard('jwt') を継承して基本認証処理を利用
        this.blacklistAccessTokenUsecase = blacklistAccessTokenUsecase;
    }
    /**
     * アクセス可否を判定（ガード本体）
     * - JWT認証に加えてブラックリスト照会を行う
     * @param context Nestの実行コンテキスト
     * @returns アクセス可能ならtrue、拒否なら例外スロー
     */
    async canActivate(context) {
        // Step 1: 通常のJWT認証を実行（失敗時はfalseを返す）
        const can = await super.canActivate(context);
        if (!can)
            return false;
        // Step 2: HTTPリクエストからトークンを抽出
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new common_1.UnauthorizedException('アクセストークンが指定されていません。');
        }
        const token = authHeader.replace('Bearer ', '').trim();
        // Step 3: トークンがブラックリストに存在するかを確認
        const isBlacklisted = await this.blacklistAccessTokenUsecase.isBlacklisted(token);
        if (isBlacklisted) {
            throw new common_1.UnauthorizedException('このトークンは無効化されています。');
        }
        // 認証OK + ブラックリスト未登録 → アクセス許可
        return true;
    }
};
exports.JwtBlacklistGuard = JwtBlacklistGuard;
exports.JwtBlacklistGuard = JwtBlacklistGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('BlacklistAccessTokenUsecase')),
    __metadata("design:paramtypes", [Object])
], JwtBlacklistGuard);
