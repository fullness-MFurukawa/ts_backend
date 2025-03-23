"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleDTORestorer = void 0;
const common_1 = require("@nestjs/common");
const Role_1 = require("../../domain/model/role/Role");
const RoleId_1 = require("../../domain/model/role/RoleId");
const RoleName_1 = require("../../domain/model/role/RoleName");
/**
 * RoleDTOからRoleエンティティを復元
 * - Roleエンティティの不変性を保ちながら復元する
 * @author Fullness
 * @date 2025-03-23
 * @version 1.0.0
 */
let RoleDTORestorer = class RoleDTORestorer {
    /**
     * RoleDTOからRoleエンティティを復元する
     * @param source RoleDTO
     * @returns Roleエンティティ
     */
    async restore(source) {
        const id = RoleId_1.RoleId.fromString(source.id ?? '');
        const name = RoleName_1.RoleName.fromString(source.name);
        return new Role_1.Role(id, name);
    }
    /**
     * 複数のRoleDTOからRoleエンティティの配列を復元する
     * @param sources RoleDTOの配列
     * @returns Roleエンティティ配列
     */
    async restoreAll(sources) {
        return Promise.all(sources.map(dto => this.restore(dto)));
    }
};
exports.RoleDTORestorer = RoleDTORestorer;
exports.RoleDTORestorer = RoleDTORestorer = __decorate([
    (0, common_1.Injectable)()
], RoleDTORestorer);
