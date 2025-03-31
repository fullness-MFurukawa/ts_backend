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
exports.BlacklistedTokenModel = void 0;
const typeorm_1 = require("typeorm");
/**
 * アクセストークンのブラックリストモデル
 * - 無効化されたアクセストークンを管理するためのDBエンティティ
 * - トークンの存在有無によって認可制御に活用される
 * @author Fullness,Inc.
 * @date 2025-03-30
 * @version 1.0.0
 */
let BlacklistedTokenModel = class BlacklistedTokenModel {
};
exports.BlacklistedTokenModel = BlacklistedTokenModel;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], BlacklistedTokenModel.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 512, unique: true }),
    __metadata("design:type", String)
], BlacklistedTokenModel.prototype, "token", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: false }),
    __metadata("design:type", Date)
], BlacklistedTokenModel.prototype, "expiresAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'datetime' }),
    __metadata("design:type", Date)
], BlacklistedTokenModel.prototype, "createdAt", void 0);
exports.BlacklistedTokenModel = BlacklistedTokenModel = __decorate([
    (0, typeorm_1.Entity)('blacklisted_tokens'),
    (0, typeorm_1.Unique)(['token'])
], BlacklistedTokenModel);
