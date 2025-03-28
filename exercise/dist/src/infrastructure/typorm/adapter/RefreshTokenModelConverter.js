"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenModelConverter = void 0;
const common_1 = require("@nestjs/common");
const RefreshTokenModel_1 = require("../model/RefreshTokenModel");
/**
 * RefreshTokenをRefreshTokenModelに変換
 * - ドメインエンティティからDB保存用のエンティティに変換する
 * @author Fullness
 * @date 2025-03-28
 * @version 1.0.0
 */
let RefreshTokenModelConverter = class RefreshTokenModelConverter {
    /**
     * RefreshTokenをRefreshTokenModelに変換する
     * @param source リフレッシュトークンエンティティ
     * @returns RefreshTokenModel
     */
    async convert(source) {
        const model = new RefreshTokenModel_1.RefreshTokenModel();
        model.id = source.getId().getValue();
        model.userId = source.getUserId().getValue();
        model.token = source.getToken();
        model.issuedAt = source.getIssuedAt();
        model.expiresAt = source.getExpiresAt();
        model.revokedAt = source.getRevokedAt() ?? null;
        // createdAt / updatedAt はDBで自動設定されるため未設定
        return model;
    }
    /**
     * RefreshTokenの配列をRefreshTokenModelの配列に変換する
     * @param sources RefreshTokenの配列
     * @returns RefreshTokenModelの配列
     */
    async convertAll(sources) {
        return Promise.all(sources.map(source => this.convert(source)));
    }
};
exports.RefreshTokenModelConverter = RefreshTokenModelConverter;
exports.RefreshTokenModelConverter = RefreshTokenModelConverter = __decorate([
    (0, common_1.Injectable)()
], RefreshTokenModelConverter);
