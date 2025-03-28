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
exports.RefreshTokenRepositoryImpl = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const RefreshTokenModel_1 = require("../model/RefreshTokenModel");
/**
 * RefreshToken エンティティのリポジトリ実装
 * - 永続化と復元を担当するインフラ層の実装クラス
 * @author Fullness
 * @date 2025-03-28
 * @version 1.0.0
 */
let RefreshTokenRepositoryImpl = class RefreshTokenRepositoryImpl {
    /**
     * コンストラクタ
     * @param repository    RefreshTokenModelのTypeORMリポジトリ
     * @param converter     RefreshTokenをRefreshTokenModelに換する
     * @param restorer      RefreshTokenModelからRefreshTokenを復元する
     */
    constructor(repository, converter, restorer) {
        this.repository = repository;
        this.converter = converter;
        this.restorer = restorer;
    }
    /**
     * トークンを新規に保存する
     * @param token RefreshToken
     * @param manager TypeORMのEntityManagerなど
     */
    async create(token, manager) {
        const repo = manager ? manager.getRepository(RefreshTokenModel_1.RefreshTokenModel) : this.repository;
        const model = await this.converter.convert(token);
        await repo.save(model);
    }
    /**
     * 指定Idのトークンを取得する
     * @param id RefreshTokenId
     */
    async findById(id, manager) {
        const repo = manager ? manager.getRepository(RefreshTokenModel_1.RefreshTokenModel) : this.repository;
        const model = await repo.findOne({ where: { id: id.getValue() } });
        return model ? this.restorer.restore(model) : null;
    }
    /**
     * 特定ユーザーに紐づくすべてのリフレッシュトークンを取得する
     * @param userId UserId
     */
    async findByUserId(userId, manager) {
        const repo = manager ? manager.getRepository(RefreshTokenModel_1.RefreshTokenModel) : this.repository;
        const models = await repo.find({ where: { userId: userId.getValue() } });
        return this.restorer.restoreAll(models);
    }
    /**
     * 指定トークンIdのトークンを削除する
     * @param id RefreshTokenId
     */
    async deleteById(id, manager) {
        const repo = manager ? manager.getRepository(RefreshTokenModel_1.RefreshTokenModel) : this.repository;
        await repo.delete({ id: id.getValue() });
    }
    /**
     * トークンを無効化する（revokedAtを設定）
     * @param id RefreshTokenId
     */
    async revoke(id, manager) {
        const repo = manager ? manager.getRepository(RefreshTokenModel_1.RefreshTokenModel) : this.repository;
        const now = new Date();
        await repo.update({ id: id.getValue() }, { revokedAt: now });
    }
};
exports.RefreshTokenRepositoryImpl = RefreshTokenRepositoryImpl;
exports.RefreshTokenRepositoryImpl = RefreshTokenRepositoryImpl = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(RefreshTokenModel_1.RefreshTokenModel)),
    __param(1, (0, common_1.Inject)('RefreshTokenModelConverter')),
    __param(2, (0, common_1.Inject)('RefreshTokenModelRestorer')),
    __metadata("design:paramtypes", [typeorm_2.Repository, Object, Object])
], RefreshTokenRepositoryImpl);
