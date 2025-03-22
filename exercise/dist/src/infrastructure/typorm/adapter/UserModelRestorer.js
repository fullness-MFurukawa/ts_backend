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
exports.UserModelRestorer = void 0;
const common_1 = require("@nestjs/common");
const User_1 = require("../../../application/domain/model/user/User");
const RoleModelRestorer_1 = require("./RoleModelRestorer");
const UserId_1 = require("../../../application/domain/model/user/UserId");
const Username_1 = require("../../../application/domain/model/user/Username");
const Password_1 = require("../../../application/domain/model/user/Password");
const Email_1 = require("../../../application/domain/model/user/Email");
const IsActive_1 = require("../../../application/domain/model/user/IsActive");
const CreatedAt_1 = require("../../../application/domain/model/user/CreatedAt");
const UpdatedAt_1 = require("../../../application/domain/model/user/UpdatedAt");
/**
 * UserModelからUser エンティティを復元するクラス
 * @author Fullness,Inc.
 * @date 2025-03-22
 * @version 1.0.0
 */
let UserModelRestorer = class UserModelRestorer {
    /**
     * コントラクタ
     * @param roleRestorer RoleModelからRoleを復元
     */
    constructor(roleRestorer) {
        this.roleRestorer = roleRestorer;
    }
    /**
     * UserModelからUserエンティティを復元する
     * @param source UserModel
     * @returns 復元されたUserエンティティ
     */
    async restore(source) {
        const id = UserId_1.UserId.fromString(source.id);
        const username = Username_1.Username.fromString(source.username);
        const password = Password_1.Password.fromHashed(source.password);
        const email = Email_1.Email.fromString(source.email ?? "");
        const isActive = new IsActive_1.IsActive(source.isActive);
        const createdAt = CreatedAt_1.CreatedAt.fromDate(source.createdAt);
        const updatedAt = UpdatedAt_1.UpdatedAt.fromDate(source.updatedAt);
        // userRoles から RoleModel を抽出
        const roleModels = source.userRoles?.map(ur => ur.role) ?? [];
        const roles = await this.roleRestorer.restoreAll(roleModels);
        return User_1.User.restore(id, username, password, email, isActive, createdAt, updatedAt, roles);
    }
    /**
     * UserModelの配列からUserエンティティ配列を復元する
     * @param sources UserModelモデルの配列
     * @returns 復元されたUserエンティティ配列
     */
    async restoreAll(sources) {
        return Promise.all(sources.map(model => this.restore(model)));
    }
};
exports.UserModelRestorer = UserModelRestorer;
exports.UserModelRestorer = UserModelRestorer = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('RoleModelRestorer')),
    __metadata("design:paramtypes", [RoleModelRestorer_1.RoleModelRestorer])
], UserModelRestorer);
