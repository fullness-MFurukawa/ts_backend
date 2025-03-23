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
exports.UserDTORestorer = void 0;
const common_1 = require("@nestjs/common");
const User_1 = require("../../domain/model/user/User");
const RoleDTORestorer_1 = require("./RoleDTORestorer");
const UserId_1 = require("../../domain/model/user/UserId");
const Username_1 = require("../../domain/model/user/Username");
const Password_1 = require("../../domain/model/user/Password");
const Email_1 = require("../../domain/model/user/Email");
const CreatedAt_1 = require("../../domain/model/user/CreatedAt");
const UpdatedAt_1 = require("../../domain/model/user/UpdatedAt");
const IsActive_1 = require("../../domain/model/user/IsActive");
/**
 * UserDTOからUserエンティティを復元する
 * - Idや日時、ロールなど値オブジェクトに変換して渡す
 * @author Fullness
 * @date 2025-03-23
 * @version 1.0.0
 */
let UserDTORestorer = class UserDTORestorer {
    /**
     * コンストラクタ
     * @param roleRestorer RoleDTOからRoleeエンティティへの復元
     */
    constructor(roleRestorer) {
        this.roleRestorer = roleRestorer;
    }
    /**
     * UserDTOからUserエンティティを復元する
     * @param dto UserDTO
     * @returns 復元されたUserエンティティ
     */
    async restore(source) {
        // RoleDTOの配列を復元（nullや空配列対応）
        const roles = source.roles
            ? await this.roleRestorer.restoreAll(source.roles) : [];
        // Userエンティティとして復元
        return User_1.User.restore(
        // DTOにIdがなければ新規生成
        UserId_1.UserId.fromString(source.id ?? crypto.randomUUID()), Username_1.Username.fromString(source.username), 
        // パスワードをハッシュ化して設定
        await Password_1.Password.hash(source.password), Email_1.Email.fromString(source.email), source.isActive ? IsActive_1.IsActive.active() : IsActive_1.IsActive.inactive(), CreatedAt_1.CreatedAt.fromDate(source.createdAt ?? new Date()), UpdatedAt_1.UpdatedAt.fromDate(source.updatedAt ?? new Date()), roles);
    }
    /**
     * UserDTOの配列からUserエンティティの配列を復元する
     * @param sources UserDTOの配列
     * @returns Userエンティティの配列
     */
    restoreAll(sources) {
        return Promise.all(sources.map(dto => this.restore(dto)));
    }
};
exports.UserDTORestorer = UserDTORestorer;
exports.UserDTORestorer = UserDTORestorer = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('RoleDTORestorer')),
    __metadata("design:paramtypes", [RoleDTORestorer_1.RoleDTORestorer])
], UserDTORestorer);
