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
exports.BlacklistedTokenRepositoryImpl = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const BlacklistedTokenModel_1 = require("../model/BlacklistedTokenModel");
const ExistsException_1 = require("../../../shared/exceptions/ExistsException");
const InternalException_1 = require("../../../shared/exceptions/InternalException");
/**
 * アクセストークンブラックリストの永続化リポジトリ実装
 * - TypeORMによるDB操作を担うクラス
 * @author Fullness,Inc.
 * @date 2025-03-30
 * @version 1.0.0
 */
let BlacklistedTokenRepositoryImpl = class BlacklistedTokenRepositoryImpl {
    /**
     * コンストラクタ
     * @param repository TypeORMのリポジトリ（DIにより注入）
     */
    constructor(repository) {
        this.repository = repository;
        this.logger = new common_1.Logger('BlacklistedTokenRepositoryImpl');
    }
    /**
     * トークンをブラックリストに追加
     * @param token JWTトークン文字列
     * @param expiresAt トークンの有効期限
     * @param manager 任意のEntityManager（トランザクション対応用）
     */
    async add(token, expiresAt, manager) {
        const repo = manager ? manager.getRepository(BlacklistedTokenModel_1.BlacklistedTokenModel) : this.repository;
        const entity = new BlacklistedTokenModel_1.BlacklistedTokenModel();
        entity.token = token;
        entity.expiresAt = expiresAt;
        try {
            await repo.save(entity);
        }
        catch (error) {
            if (typeof error === 'object' && error !== null && 'code' in error) {
                const code = error.code;
                if (code === 'ER_DUP_ENTRY') {
                    throw new ExistsException_1.ExistsException(`トークン:${token}が重複しています。`);
                }
            }
            this.logger.error(`トークンのブラックリスト追加失敗: ${error}`, error.stack);
            throw new InternalException_1.InternalException(`トークンのブラックリスト追加で予期せぬエラーが発生しました。`);
        }
    }
    /**
     * 指定トークンがブラックリストに存在するか判定
     * @param token JWTトークン
     * @param manager 任意のEntityManager
     * @returns true: 無効トークン, false: 有効トークン
     */
    async isBlacklisted(token, manager) {
        const repo = manager ? manager.getRepository(BlacklistedTokenModel_1.BlacklistedTokenModel) : this.repository;
        const count = await repo.count({ where: { token } });
        return count > 0;
    }
    /**
     * 有効期限切れのブラックリストトークンを削除
     * @param now 現在時刻
     * @param manager 任意のEntityManager
     * @returns 削除された件数
     */
    async deleteExpired(now, manager) {
        const repo = manager ? manager.getRepository(BlacklistedTokenModel_1.BlacklistedTokenModel) : this.repository;
        const result = await repo.delete({ expiresAt: (0, typeorm_2.LessThan)(now) });
        return result.affected || 0;
    }
};
exports.BlacklistedTokenRepositoryImpl = BlacklistedTokenRepositoryImpl;
exports.BlacklistedTokenRepositoryImpl = BlacklistedTokenRepositoryImpl = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(BlacklistedTokenModel_1.BlacklistedTokenModel)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], BlacklistedTokenRepositoryImpl);
