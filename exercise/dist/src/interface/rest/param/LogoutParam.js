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
exports.LogoutParam = void 0;
const class_validator_1 = require("class-validator");
/**
 * ログアウト用パラメータ
 * - クライアントが保持するリフレッシュトークンを送信する
 * @author Fullness,Inc.
 * @date 2025-03-30
 * @version 1.0.0
 */
class LogoutParam {
}
exports.LogoutParam = LogoutParam;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'リフレッシュトークンは必須です。' }),
    (0, class_validator_1.IsUUID)('4', { message: 'リフレッシュトークンはUUID形式である必要があります。' }),
    __metadata("design:type", String)
], LogoutParam.prototype, "refresh_token", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'アクセストークンは必須です。' }),
    __metadata("design:type", String)
], LogoutParam.prototype, "access_token", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'アクセストークンの有効期限は必須です。' }),
    (0, class_validator_1.IsDateString)({}, { message: '有効期限はISO8601形式の日付文字列である必要があります。' }),
    __metadata("design:type", String)
], LogoutParam.prototype, "expires_at", void 0);
