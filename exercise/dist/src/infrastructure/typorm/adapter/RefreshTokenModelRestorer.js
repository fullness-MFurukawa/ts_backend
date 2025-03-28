"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenModelRestorer = void 0;
const common_1 = require("@nestjs/common");
const RefreshToken_1 = require("../../../application/domain/model/token/RefreshToken");
const RefreshTokenId_1 = require("../../../application/domain/model/token/RefreshTokenId");
const UserId_1 = require("../../../application/domain/model/user/UserId");
/**
 * RefreshTokenModelからRefreshToken エンティティを復元する
 * - DBエンティティからドメインエンティティへ変換する
 * @author Fullness
 * @date 2025-03-28
 * @version 1.0.0
 */
let RefreshTokenModelRestorer = class RefreshTokenModelRestorer {
    /**
     * RefreshTokenModelからRefreshTokenを復元する
     * @param model RefreshTokenModel
     * @returns RefreshToken
     */
    async restore(source) {
        return new RefreshToken_1.RefreshToken(RefreshTokenId_1.RefreshTokenId.fromString(source.id), UserId_1.UserId.fromString(source.userId), source.token, source.issuedAt, source.expiresAt, source.revokedAt ?? null);
    }
    /**
     * RefreshTokenModelの配列からRefreshTokenの配列を復元する
     * @param model RefreshTokenModelの配列
     * @returns RefreshTokenの配列
     */
    async restoreAll(sources) {
        return Promise.all(sources.map(m => this.restore(m)));
    }
};
exports.RefreshTokenModelRestorer = RefreshTokenModelRestorer;
exports.RefreshTokenModelRestorer = RefreshTokenModelRestorer = __decorate([
    (0, common_1.Injectable)()
], RefreshTokenModelRestorer);
