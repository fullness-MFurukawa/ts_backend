"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleModelConverter = void 0;
const common_1 = require("@nestjs/common");
const RoleModel_1 = require("../model/RoleModel");
/**
 * RoleエンティティをRoleModelに変換
 * @author Fullness,Inc.
 * @date 2025-03-22
 * @version 1.0.0
 */
let RoleModelConverter = class RoleModelConverter {
    /**
     * RoleからRoleModelに変換する
     * @param source Roleンティティ
     * @returns RoleModel
     */
    async convert(source) {
        const model = new RoleModel_1.RoleModel(source.getId().getValue(), source.getName().getValue());
        return model;
    }
    /**
     * Roleの配列をRoleModelに配列に変換する
     * @param sources Roleエンティティの配列
     * @returns RoleModelの配列
     */
    async convertAll(sources) {
        return Promise.all(sources.map(role => this.convert(role)));
    }
};
exports.RoleModelConverter = RoleModelConverter;
exports.RoleModelConverter = RoleModelConverter = __decorate([
    (0, common_1.Injectable)()
], RoleModelConverter);
