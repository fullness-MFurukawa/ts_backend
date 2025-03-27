"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUserParamConverter = void 0;
const common_1 = require("@nestjs/common");
const UserDTO_1 = require("../../../application/in/dto/UserDTO");
/**
 * RegisterUserParamからUserDTOへの変換
 * @author Fullness,Inc.
 * @date 2025-03-27
 * @version 1.0.0
 */
let RegisterUserParamConverter = class RegisterUserParamConverter {
    /**
     * RegisterUserParamをUserDTOに変換する
     * @param source RegisterUserParam
     * @returns UserDTO
     */
    async convert(source) {
        const dto = new UserDTO_1.UserDTO();
        dto.id = null;
        dto.username = source.username;
        dto.email = source.email;
        dto.password = source.password;
        dto.isActive = true;
        // 単一のRoleParamをRoleDTO[]として設定
        dto.roles = [{
                id: source.role.id,
                name: source.role.name
            }];
        return dto;
    }
    /**
     * RegisterUserParamの配列をUserDTOの配列に変換する
     * @param sources RegisterUserParamの配列
     * @returns UserDTOの配列
     */
    convertAll(sources) {
        return Promise.all(sources.map(p => this.convert(p)));
    }
};
exports.RegisterUserParamConverter = RegisterUserParamConverter;
exports.RegisterUserParamConverter = RegisterUserParamConverter = __decorate([
    (0, common_1.Injectable)()
], RegisterUserParamConverter);
