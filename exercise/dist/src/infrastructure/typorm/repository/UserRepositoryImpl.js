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
exports.UserRepositoryImpl = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const UserModel_1 = require("../model/UserModel");
/**
 * Userエンティティのリポジトリインターフェイス実装
 * 永続化と復元の責務を担うインフラストラクチャ層の実装
 * @author Fullness,Inc.
 * @date 2025-03-22
 * @version 1.0.0
 */
let UserRepositoryImpl = class UserRepositoryImpl {
    /**
     * コンストラクタ
     * @param repository UserModelのTypeORMリポジトリ
     * @param converter UserエンティティをUserModelへ変換
     * @param restorer UserModelからUserエンティティを復元
     */
    constructor(repository, converter, restorer) {
        this.repository = repository;
        this.converter = converter;
        this.restorer = restorer;
    }
    /**
     * ユーザーIdで検索する
     * @param id 検索対象のUserId
     * @param manager? 任意のトランザクション用EntityManager
     * @returns 該当ユーザーが存在すればUser、存在しなければnull
     */
    async findById(id, manager) {
        const repo = manager ? manager.getRepository(UserModel_1.UserModel) : this.repository;
        const model = await repo.findOne({
            where: { id: id.getValue() },
            relations: ['userRoles', 'userRoles.role'],
        });
        return model ? this.restorer.restore(model) : null;
    }
    /**
     * ユーザー名で検索する（ログイン認証などに利用）
     * @param username 検索対象のユーザー名
     * @param manager? 任意のトランザクション用EntityManager
     * @returns 該当ユーザーが存在すればUser、存在しなければnull
     */
    async findByUsername(username, manager) {
        const repo = manager ? manager.getRepository(UserModel_1.UserModel) : this.repository;
        const model = await repo.findOne({
            where: { username: username.getValue() },
            relations: ['userRoles', 'userRoles.role'],
        });
        return model ? this.restorer.restore(model) : null;
    }
    /**
     * メールアドレスで検索する
     * @param email 検索対象のメールアドレス
     * @param manager? 任意のトランザクション用EntityManager
     * @returns 該当ユーザーが存在すればUser、存在しなければnull
     */
    async findByEmail(email, manager) {
        const repo = manager ? manager.getRepository(UserModel_1.UserModel) : this.repository;
        const model = await repo.findOne({
            where: { email: email.getValue() },
            relations: ['userRoles', 'userRoles.role'],
        });
        return model ? this.restorer.restore(model) : null;
    }
    /**
     * ユーザー名が既に存在するかを判定する
     * @param username チェック対象のユーザー名
     * @param manager? 任意のトランザクション用EntityManager
     * @returns true: 存在する, false: 存在しない
     */
    async existsByUsername(username, manager) {
        const repo = manager ? manager.getRepository(UserModel_1.UserModel) : this.repository;
        const count = await repo.count({
            where: { username: username.getValue() },
        });
        return count > 0;
    }
    /**
     * メールアドレスが既に存在するかを判定する
     * @param email チェック対象のメールアドレス
     * @param manager? 任意のトランザクション用EntityManager
     * @returns true: 存在する, false: 存在しない
     */
    async existsByEmail(email, manager) {
        const repo = manager ? manager.getRepository(UserModel_1.UserModel) : this.repository;
        const count = await repo.count({
            where: { email: email.getValue() },
        });
        return count > 0;
    }
    /**
     * 新しいユーザーを永続化する
     * @param user 永続化対象のUserエンティティ
     * @param manager? 任意のトランザクション用EntityManager
     */
    async create(user, manager) {
        const repo = manager ? manager.getRepository(UserModel_1.UserModel) : this.repository;
        const model = await this.converter.convert(user);
        await repo.save(model);
    }
    /**
     * ユーザーIdでユーザー情報を更新する
     * @param user 更新対象のUserエンティティ
     * @param manager? 任意のトランザクション用EntityManager
     * @returns true: 更新成功, false: 該当ユーザーが存在しない
     */
    async updateById(user, manager) {
        const repo = manager ? manager.getRepository(UserModel_1.UserModel) : this.repository;
        const model = await this.converter.convert(user);
        const result = await repo.update({ id: user.getId().getValue() }, model);
        return result.affected !== 0;
    }
    /**
     * ユーザーIdでユーザー情報を削除する
     * @param id 削除対象のUserId
     * @param manager? 任意のトランザクション用EntityManager
     * @returns true: 削除成功, false: 該当ユーザーが存在しない
     */
    async deleteById(id, manager) {
        const repo = manager ? manager.getRepository(UserModel_1.UserModel) : this.repository;
        const result = await repo.delete({ id: id.getValue() });
        return result.affected !== 0;
    }
};
exports.UserRepositoryImpl = UserRepositoryImpl;
exports.UserRepositoryImpl = UserRepositoryImpl = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(UserModel_1.UserModel)),
    __param(1, (0, common_1.Inject)('UserModelConverter')),
    __param(2, (0, common_1.Inject)('UserModelRestorer')),
    __metadata("design:paramtypes", [typeorm_2.Repository, Object, Object])
], UserRepositoryImpl);
