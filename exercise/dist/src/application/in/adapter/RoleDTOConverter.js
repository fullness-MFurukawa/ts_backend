"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleDTOConverter = void 0;
const common_1 = require("@nestjs/common");
/**
 * RoleエンティティからRoleDTOへの変換
 * @author Fullness
 * @date 2025-03-23
 * @version 1.0.0
 */
let RoleDTOConverter = class RoleDTOConverter {
    /**
     * RoleからProductDTOに変換する
     * @param source Roleエンティティ
     * @returns RoleDTO
     */
    async convert(source) {
        return {
            id: source.getId().getValue(),
            name: source.getName().getValue(),
        };
    }
    /**
     * 複数のRoleからRoleDTOの配列に変換する
     * @param sources Roleエンティティの配列
     * @returns RoleDTOの配列
     */
    async convertAll(sources) {
        return Promise.all(sources.map(role => this.convert(role)));
    }
};
exports.RoleDTOConverter = RoleDTOConverter;
exports.RoleDTOConverter = RoleDTOConverter = __decorate([
    (0, common_1.Injectable)()
], RoleDTOConverter);
