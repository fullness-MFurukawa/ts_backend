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
exports.UserModel = void 0;
const typeorm_1 = require("typeorm");
const UserRoleModel_1 = require("./UserRoleModel");
const RefreshTokenModel_1 = require("./RefreshTokenModel");
/**
 * usersテーブルにマッピングされるエンティティクラス
 * @author Fullness,Inc.
 * @date 2025-03-21
 * @version 1.0.0
 */
let UserModel = class UserModel {
};
exports.UserModel = UserModel;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'char', length: 36, comment: 'ユーザーID（UUID形式）' }),
    __metadata("design:type", String)
], UserModel.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, unique: true, comment: 'ログイン用ユーザー名（一意制約）' }),
    __metadata("design:type", String)
], UserModel.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, comment: 'ハッシュ化されたパスワード' }),
    __metadata("design:type", String)
], UserModel.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, unique: true, nullable: true, comment: 'メールアドレス（NULL許可、一意制約）' }),
    __metadata("design:type", Object)
], UserModel.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true, comment: '有効フラグ（論理削除用などに利用）' }),
    __metadata("design:type", Boolean)
], UserModel.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp', comment: 'レコード作成日時' }),
    __metadata("design:type", Date)
], UserModel.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamp', comment: 'レコード更新日時（自動更新）' }),
    __metadata("design:type", Date)
], UserModel.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => UserRoleModel_1.UserRoleModel, userRole => userRole.user, {
        cascade: true, // 重要
    }),
    __metadata("design:type", Array)
], UserModel.prototype, "userRoles", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => RefreshTokenModel_1.RefreshTokenModel, refreshToken => refreshToken.user),
    __metadata("design:type", Array)
], UserModel.prototype, "refreshTokens", void 0);
exports.UserModel = UserModel = __decorate([
    (0, typeorm_1.Entity)('users')
], UserModel);
