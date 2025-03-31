"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogoutParamConverter = void 0;
const common_1 = require("@nestjs/common");
const LogoutDTO_1 = require("../../../application/in/dto/LogoutDTO");
/**
 * LogoutParam → LogoutDTO 変換用コンバータ
 * - 日付文字列をDate型に変換してDTOに渡す
 * @author Fullness,Inc.
 * @date 2025-03-30
 * @version 1.0.0
 */
let LogoutParamConverter = class LogoutParamConverter {
    /**
     * LogoutParamをLogoutDTOに変換する
     * @param source LogoutParam
     * @returns LogoutDTO
     */
    async convert(param) {
        return new LogoutDTO_1.LogoutDTO(param.refresh_token, param.access_token, new Date(param.expires_at) // ISO8601 → Date型へ変換
        );
    }
    /**
     * LogoutParamの配列をLogoutDTOの配列に変換する
     * @param sources LogoutParamの配列
     * @returns LogoutDTOの配列
     */
    async convertAll(params) {
        return Promise.all(params.map(p => this.convert(p)));
    }
};
exports.LogoutParamConverter = LogoutParamConverter;
exports.LogoutParamConverter = LogoutParamConverter = __decorate([
    (0, common_1.Injectable)()
], LogoutParamConverter);
