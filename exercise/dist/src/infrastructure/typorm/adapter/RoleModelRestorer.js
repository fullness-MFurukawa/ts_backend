"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleModelRestorer = void 0;
const common_1 = require("@nestjs/common");
const Role_1 = require("../../../application/domain/model/role/Role");
const RoleId_1 = require("../../../application/domain/model/role/RoleId");
const RoleName_1 = require("../../../application/domain/model/role/RoleName");
/**
 * RoleModelからRoleエンティティを復元する
 * @author Fullness,Inc.
 * @date 2025-03-22
 * @version 1.0.0
 */
let RoleModelRestorer = class RoleModelRestorer {
    /**
     * RoleModelからRoleエンティティを復元する
     * @param source RoleModel
     * @returns 復元されたRoleエンティティ
     */
    async restore(source) {
        const id = RoleId_1.RoleId.fromString(source.id);
        const name = RoleName_1.RoleName.fromString(source.name);
        return new Role_1.Role(id, name);
    }
    /**
     * RoleModelの配列からRoleエンティティ配列を復元する
     * @param sources RoleModelモデルの配列
     * @returns 復元されたRoleエンティティ配列
     */
    async restoreAll(sources) {
        return Promise.all(sources.map(model => this.restore(model)));
    }
};
exports.RoleModelRestorer = RoleModelRestorer;
exports.RoleModelRestorer = RoleModelRestorer = __decorate([
    (0, common_1.Injectable)()
], RoleModelRestorer);
