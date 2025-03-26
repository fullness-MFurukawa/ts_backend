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
     * 利用可能なすべてのロールを取得する
     * @param manager? 任意のトランザクション用EntityManager
     * @returns Roleの配列、存在しない場合は null
     */
    async findAll(manager) {
        const repo = manager ? manager.getRepository(RoleModel_1.RoleModel) : this.repository;
        var models = await repo.find();
        if (!models) {
            return null;
        }
        return await this.restorer.restoreAll(models);
    }
    /**
     * 指定されたロールが継承しているすべてのロールを取得する
     * - 例: Admin → User → Guest のように継承されている場合、Admin を指定すると全てを取得
     * - 再帰的に親ロールをたどる
     * @param roleName 選択されたロール名
     * @param manager EntityManager（任意）
     * @returns 継承されたすべてのロールを含む配列（選択されたロール自身も含む）
     */
    async findAllInheritedRoles(roleName, manager) {
        const repo = manager ? manager.getRepository(RoleModel_1.RoleModel) : this.repository;
        // 指定されたロールを取得（継承関係も含める）
        const startRole = await repo.findOne({
            where: { name: roleName.getValue() },
            relations: ['inheritsFrom'],
        });
        if (!startRole) {
            return []; // 指定されたロールが存在しない場合は空配列
        }
        // 結果格納用のMap（重複排除のため）
        const resultMap = new Map();
        // 再帰探索用のスタック
        const stack = [startRole];
        while (stack.length > 0) {
            const current = stack.pop();
            if (!current || resultMap.has(current.id)) {
                continue; // null または すでに取得済みならスキップ
            }
            // 現在のロールを結果に追加
            resultMap.set(current.id, current);
            // 親ロールが存在する場合は取得してスタックに追加
            if (current.inheritsFrom) {
                const parent = await repo.findOne({
                    where: { id: current.inheritsFrom.id },
                    relations: ['inheritsFrom'],
                });
                if (parent) {
                    stack.push(parent);
                }
            }
        }
        // RoleModel → ドメインモデル Role に変換して返す
        const models = Array.from(resultMap.values());
        const roles = await this.restorer.restoreAll(models);
        return roles;
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
        return await this.restorer.restore(model);
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
