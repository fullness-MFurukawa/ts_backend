"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModelConverter = void 0;
const common_1 = require("@nestjs/common");
const UserModel_1 = require("../model/UserModel");
/**
 * UserエンティティをUserModelに変換する
 * @author Fullness,Inc.
 * @date 2025-03-22
 * @version 1.0.0
 */
let UserModelConverter = class UserModelConverter {
    /**
     * UserからUserModelに変換する
     * @param source Userンティティ
     * @returns UserModel
     */
    async convert(source) {
        const model = new UserModel_1.UserModel();
        model.id = source.getId().getValue();
        model.username = source.getUsername().getValue();
        model.password = source.getPassword().getValue();
        model.email = source.getEmail().getValue();
        model.isActive = source.isUserActive();
        model.createdAt = source.getCreatedAt().getValue();
        model.updatedAt = source.getUpdatedAt().getValue();
        // userRoles は中間テーブル経由で別途設定するため、ここでは設定しない
        // model.userRoles = [];
        return model;
    }
    /**
     * Userの配列をUserModelに配列に変換する
     * @param sources Userエンティティの配列
     * @returns UserModelの配列
     */
    convertAll(sources) {
        return Promise.all(sources.map(user => this.convert(user)));
    }
};
exports.UserModelConverter = UserModelConverter;
exports.UserModelConverter = UserModelConverter = __decorate([
    (0, common_1.Injectable)()
], UserModelConverter);
