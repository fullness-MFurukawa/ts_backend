"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticateParamConverter = void 0;
const AuthenticateDTO_1 = require("../../../application/in/dto/AuthenticateDTO");
const common_1 = require("@nestjs/common");
/**
 * AuthenticateParamからAuthenticateDTOへの変換
 * @author Fullness,Inc.
 * @date 2025-03-27
 * @version 1.0.0
 */
let AuthenticateParamConverter = class AuthenticateParamConverter {
    /**
     * AuthenticateParamをAuthenticateDTOに変換する
     * @param source AuthenticateParam
     * @returns AuthenticateDTO
     */
    async convert(source) {
        return new AuthenticateDTO_1.AuthenticateDTO(source.username, source.password);
    }
    /**
     * AuthenticateParamの配列をAuthenticateDTOの配列に変換する
     * @param sources AuthenticateParamの配列
     * @returns AuthenticateDTOの配列
     */
    convertAll(sources) {
        return Promise.all(sources.map(p => this.convert(p)));
    }
};
exports.AuthenticateParamConverter = AuthenticateParamConverter;
exports.AuthenticateParamConverter = AuthenticateParamConverter = __decorate([
    (0, common_1.Injectable)()
], AuthenticateParamConverter);
