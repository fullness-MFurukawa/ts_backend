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
exports.UserRoleModel = void 0;
const typeorm_1 = require("typeorm");
const UserModel_1 = require("./UserModel");
const RoleModel_1 = require("./RoleModel");
/**
 * user_rolesテーブルにマッピングされるエンティティクラス（多対多のリレーション）
 * @author Fullness,Inc.
 * @date 2025-03-21
 * @version 1.0.0
 */
let UserRoleModel = class UserRoleModel {
};
exports.UserRoleModel = UserRoleModel;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'char', length: 36, name: 'user_id', comment: 'ユーザーID（外部キー）' }),
    __metadata("design:type", String)
], UserRoleModel.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'char', length: 36, name: 'role_id', comment: 'ロールID（外部キー）' }),
    __metadata("design:type", String)
], UserRoleModel.prototype, "roleId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', name: 'assigned_at', default: () => 'CURRENT_TIMESTAMP', comment: 'ロールが付与された日時' }),
    __metadata("design:type", Date)
], UserRoleModel.prototype, "assignedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => UserModel_1.UserModel, user => user.userRoles, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", UserModel_1.UserModel)
], UserRoleModel.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => RoleModel_1.RoleModel, role => role.userRoles, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'role_id' }),
    __metadata("design:type", RoleModel_1.RoleModel)
], UserRoleModel.prototype, "role", void 0);
exports.UserRoleModel = UserRoleModel = __decorate([
    (0, typeorm_1.Entity)('user_roles')
], UserRoleModel);
