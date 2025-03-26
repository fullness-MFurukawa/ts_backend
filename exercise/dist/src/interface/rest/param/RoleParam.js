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
exports.RoleParam = void 0;
const class_validator_1 = require("class-validator");
/**
 * ユーザー登録リクエストパラメータ（ロール情報）
 * @author Fullness,Inc.
 * @date 2025-03-26
 * @version 1.0.0
 */
class RoleParam {
}
exports.RoleParam = RoleParam;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'ロールIdは必須です。' }),
    (0, class_validator_1.IsString)({ message: 'ロールIdは文字列である必要があります。' }),
    __metadata("design:type", String)
], RoleParam.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'ロール名は必須です。' }),
    (0, class_validator_1.IsString)({ message: 'ロール名は文字列である必要があります。' }),
    __metadata("design:type", String)
], RoleParam.prototype, "name", void 0);
