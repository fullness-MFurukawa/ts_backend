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
exports.RefreshTokenModel = void 0;
const typeorm_1 = require("typeorm");
const UserModel_1 = require("./UserModel");
/**
 * refresh_tokensテーブルにマッピングされるエンティティクラス
 * - 各ユーザーごとに複数のリフレッシュトークンを発行可能
 * @author Fullness,Inc.
 * @date 2025-03-21
 * @version 1.0.0
 */
//@Entity('refresh_tokens')
class RefreshTokenModel {
}
exports.RefreshTokenModel = RefreshTokenModel;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'char', length: 36, comment: '主キー: リフレッシュトークンのUUID' }),
    __metadata("design:type", String)
], RefreshTokenModel.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'char', length: 36, name: 'user_id', comment: '対象のユーザーID(UUID)' }),
    __metadata("design:type", String)
], RefreshTokenModel.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 512, unique: true, comment: 'リフレッシュトークン文字列' }),
    __metadata("design:type", String)
], RefreshTokenModel.prototype, "token", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', name: 'issued_at', comment: 'トークンの発行日時' }),
    __metadata("design:type", Date)
], RefreshTokenModel.prototype, "issuedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', name: 'expires_at', comment: 'トークンの有効期限' }),
    __metadata("design:type", Date)
], RefreshTokenModel.prototype, "expiresAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', name: 'revoked_at', nullable: true, comment: '無効化日時（nullなら有効）' }),
    __metadata("design:type", Object)
], RefreshTokenModel.prototype, "revokedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'datetime', comment: '作成日時' }),
    __metadata("design:type", Date)
], RefreshTokenModel.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'datetime', comment: '更新日時' }),
    __metadata("design:type", Date)
], RefreshTokenModel.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => UserModel_1.UserModel, user => user.refreshTokens),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", UserModel_1.UserModel)
], RefreshTokenModel.prototype, "user", void 0);
