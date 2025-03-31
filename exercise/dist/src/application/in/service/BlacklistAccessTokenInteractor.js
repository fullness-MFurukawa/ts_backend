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
var BlacklistAccessTokenInteractor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlacklistAccessTokenInteractor = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ExistsException_1 = require("../../../shared/exceptions/ExistsException");
const InternalException_1 = require("../../../shared/exceptions/InternalException");
/**
 * アクセストークンをブラックリストに追加するユースケース実装
 * - 有効期限付きでトークンを無効化
 * @author Fullness,Inc.
 * @date 2025-03-30
 * @version 1.0.0
 */
let BlacklistAccessTokenInteractor = BlacklistAccessTokenInteractor_1 = class BlacklistAccessTokenInteractor {
    /**
     * コンストラクタ
     * @param entityManager TypeORMのEntityManager
     * @param repository アクセストークンブラックリストリポジトリ
    */
    constructor(entityManager, repository) {
        this.entityManager = entityManager;
        this.repository = repository;
        this.logger = new common_1.Logger(BlacklistAccessTokenInteractor_1.name);
    }
    /**
     * トークンをブラックリストに追加する
     * @param token JWTトークン（アクセストークン）
     * @param expiresAt トークンの有効期限
     */
    async blacklist(token, expiresAt) {
        await this.entityManager.transaction(async (manager) => {
            try {
                await this.repository.add(token, expiresAt, manager);
            }
            catch (error) {
                if (error instanceof ExistsException_1.ExistsException) {
                    throw error;
                }
                this.logger.error('ブラックリスト登録失敗', error instanceof Error ? error.stack : String(error));
                throw new InternalException_1.InternalException('トークンのブラックリスト化に失敗しました');
            }
        });
    }
    /**
     * 指定されたトークンがブラックリストに存在するか判定する
     * @param token JWTトークン
     * @returns true: ブラックリストに存在する / false: 存在しない
     */
    async isBlacklisted(token) {
        return await this.repository.isBlacklisted(token, this.entityManager);
    }
};
exports.BlacklistAccessTokenInteractor = BlacklistAccessTokenInteractor;
exports.BlacklistAccessTokenInteractor = BlacklistAccessTokenInteractor = BlacklistAccessTokenInteractor_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectEntityManager)()),
    __param(1, (0, common_1.Inject)('BlacklistedTokenRepository')),
    __metadata("design:paramtypes", [typeorm_2.EntityManager, Object])
], BlacklistAccessTokenInteractor);
