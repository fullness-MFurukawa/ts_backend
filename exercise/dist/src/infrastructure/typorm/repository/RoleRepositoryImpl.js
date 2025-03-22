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
exports.RoleRepositoryImpl = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const RoleModel_1 = require("../model/RoleModel");
/**
 * Roleエンティティのリポジトリインターフェイス実装
 * 永続化と復元の責務を担うインフラストラクチャ層の実装
 * @author Fullness,Inc.
 * @date 2025-03-22
 * @version 1.0.0
 */
let RoleRepositoryImpl = class RoleRepositoryImpl {
    /**
     * コンストラクタ
     * @param repository RoleModelに対応するTypeORMのリポジトリ
     * @param converter RoleエンティティからRoleModelへの変換
     * @param restorer RoleModelからRoleエンティティの復元
     */
    constructor(repository, converter, restorer) {
        this.repository = repository;
        this.converter = converter;
        this.restorer = restorer;
    }
    /**
     * 指定されたロール名でロールを検索する
     * @param roleName 検索対象のロール名
     * @param manager 任意のEntityManager（トランザクション用）
     * @returns 該当ロールが存在すればRoleエンティティ、存在しなければnull
     */
    async findByName(roleName, manager) {
        const repo = manager ? manager.getRepository(RoleModel_1.RoleModel) : this.repository;
        const model = await repo.findOne({ where: { name: roleName.getValue() } });
        if (!model)
            return null;
        return this.restorer.restore(model);
    }
    /**
     * 指定されたロール名が存在するかを判定する
     * @param roleName 存在確認対象のロール名
     * @param manager 任意のEntityManager
     * @returns 存在すればtrue、存在しなければfalse
     */
    async exists(roleName, manager) {
        const repo = manager ? manager.getRepository(RoleModel_1.RoleModel) : this.repository;
        const count = await repo.count({ where: { name: roleName.getValue() } });
        return count > 0;
    }
    /**
     * 指定されたRoleエンティティを永続化する
     * @param role 永続化するRoleエンティティ
     * @param manager 任意のEntityManager
     */
    async create(role, manager) {
        const repo = manager ? manager.getRepository(RoleModel_1.RoleModel) : this.repository;
        const model = await this.converter.convert(role);
        await repo.save(model);
    }
    /**
     * 指定されたロール名に一致するロールを削除する
     * @param roleName 削除対象のロール名
     * @param manager 任意のEntityManager
     * @returns 削除が成功すればtrue、該当データがなければfalse
     */
    async deleteByName(roleName, manager) {
        const repo = manager ? manager.getRepository(RoleModel_1.RoleModel) : this.repository;
        const deleteResult = await repo.delete({ name: roleName.getValue() });
        return deleteResult.affected !== 0;
    }
};
exports.RoleRepositoryImpl = RoleRepositoryImpl;
exports.RoleRepositoryImpl = RoleRepositoryImpl = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(RoleModel_1.RoleModel)),
    __param(1, (0, common_1.Inject)("RoleModelConverter")),
    __param(2, (0, common_1.Inject)("RoleModelRestorer")),
    __metadata("design:paramtypes", [typeorm_2.Repository, Object, Object])
], RoleRepositoryImpl);
