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
exports.RoleModel = void 0;
const typeorm_1 = require("typeorm");
const UserRoleModel_1 = require("./UserRoleModel");
/**
 * rolesテーブルにマッピングされるエンティティクラス
 * @author Fullness,Inc.
 * @date 2025-03-21
 * @version 1.0.0
 */
//@Entity('roles')
class RoleModel {
    /**
     * コンストラクタ
     * @param id    ロールId
     * @param name  ロール名
     */
    constructor(id, name) {
        if (id)
            this.id = id;
        if (name)
            this.name = name;
    }
}
exports.RoleModel = RoleModel;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'char', length: 36, comment: 'ロールID（UUID形式）' }),
    __metadata("design:type", String)
], RoleModel.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, unique: true, comment: 'ロール名（Admin, Userなど）' }),
    __metadata("design:type", String)
], RoleModel.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => UserRoleModel_1.UserRoleModel, userRole => userRole.role),
    __metadata("design:type", Array)
], RoleModel.prototype, "userRoles", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => RoleModel, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'inherits_from' }) // DB上のカラム名
    ,
    __metadata("design:type", Object)
], RoleModel.prototype, "inheritsFrom", void 0);
