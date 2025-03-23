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
exports.UserDTOConverter = void 0;
const common_1 = require("@nestjs/common");
const UserDTO_1 = require("../dto/UserDTO");
const RoleDTOConverter_1 = require("./RoleDTOConverter");
/**
 * UserエンティティからUserDTOへの変換
 * @author Fullness
 * @date 2025-03-23
 * @version 1.0.0
 */
let UserDTOConverter = class UserDTOConverter {
    /**
     * コンストラクタ
     * @param roleDTOConverter RoleエンティティからRoleDTOへ変換
     */
    constructor(roleDTOConverter) {
        this.roleDTOConverter = roleDTOConverter;
    }
    /**
     * UserからUserDTOに変換する
     * @param source Userエンティティ
     * @returns UserDTO
     */
    async convert(source) {
        const dto = new UserDTO_1.UserDTO();
        dto.id = source.getId().getValue();
        dto.username = source.getUsername().getValue();
        dto.email = source.getEmail().getValue();
        dto.password = source.getPassword().getValue();
        dto.isActive = source.isUserActive();
        dto.createdAt = source.getCreatedAt().getValue();
        dto.updatedAt = source.getUpdatedAt().getValue();
        dto.roles = await this.roleDTOConverter.convertAll(source.getRoles());
        return dto;
    }
    /**
     * 複数のUserからUserDTOの配列に変換する
     * @param sources Userエンティティの配列
     * @returns UserDTOの配列
     */
    async convertAll(sources) {
        return Promise.all(sources.map(user => this.convert(user)));
    }
};
exports.UserDTOConverter = UserDTOConverter;
exports.UserDTOConverter = UserDTOConverter = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('RoleDTOConverter')),
    __metadata("design:paramtypes", [RoleDTOConverter_1.RoleDTOConverter])
], UserDTOConverter);
