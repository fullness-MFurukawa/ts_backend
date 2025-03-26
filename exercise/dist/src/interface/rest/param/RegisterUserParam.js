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
exports.RegisterUserParam = void 0;
const class_validator_1 = require("class-validator");
/**
 * ユーザー登録リクエストパラメータ
 * - クライアントからのユーザー登録リクエストを受け取るためのDTO
 * @author Fullness,Inc.
 * @date 2025-  03-26
 * @version 1.0.0
 */
class RegisterUserParam {
}
exports.RegisterUserParam = RegisterUserParam;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'ユーザー名は必須です。' }),
    (0, class_validator_1.IsString)({ message: 'ユーザー名は文字列である必要があります。' }),
    __metadata("design:type", String)
], RegisterUserParam.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'メールアドレスは必須です。' }),
    (0, class_validator_1.IsEmail)({}, { message: '正しいメールアドレス形式である必要があります。' }),
    __metadata("design:type", String)
], RegisterUserParam.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'パスワードは必須です。' }),
    (0, class_validator_1.IsString)({ message: 'パスワードは文字列である必要があります。' }),
    (0, class_validator_1.MinLength)(8, { message: 'パスワードは8文字以上である必要があります。' }),
    __metadata("design:type", String)
], RegisterUserParam.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsArray)({ message: 'ロールは配列で指定してください。' }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_validator_1.IsNotEmpty)({ message: 'ロールは必須です。' }),
    __metadata("design:type", Array)
], RegisterUserParam.prototype, "roles", void 0);
