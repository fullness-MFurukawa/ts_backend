import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Email } from "@src/application/domain/model/user/Email";
import { User } from "@src/application/domain/model/user/User";
import { UserId } from "@src/application/domain/model/user/UserId";
import { Username } from "@src/application/domain/model/user/Username";
import { UserRepository } from "@src/application/out/repository/UserRepository";
import { EntityManager, Repository } from "typeorm";
import { UserModel } from "../model/UserModel";
import { Converter } from "@src/shared/adapter/Converter";
import { Restorer } from "@src/shared/adapter/Restorer";

/**
 * Userエンティティのリポジトリインターフェイス実装
 * 永続化と復元の責務を担うインフラストラクチャ層の実装
 * @author Fullness,Inc.
 * @date 2025-03-22
 * @version 1.0.0
 */
@Injectable()
export class UserRepositoryImpl implements UserRepository<EntityManager> {

    /**
     * コンストラクタ
     * @param repository UserModelのTypeORMリポジトリ
     * @param converter UserエンティティをUserModelへ変換
     * @param restorer UserModelからUserエンティティを復元
     */
    constructor(
        @InjectRepository(UserModel)
        private readonly repository: Repository<UserModel>,
        @Inject('UserModelConverter')
        private readonly converter: Converter<User, UserModel>,
        @Inject('UserModelRestorer')
        private readonly restorer: Restorer<UserModel, User>,
    ) {}

    /**
     * ユーザーIdで検索する
     * @param id 検索対象のUserId
     * @param manager? 任意のトランザクション用EntityManager
     * @returns 該当ユーザーが存在すればUser、存在しなければnull
     */
    async findById(id: UserId, manager?: EntityManager | undefined): Promise<User | null> {
        const repo = manager ? manager.getRepository(UserModel) : this.repository;
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
    async findByUsername(username: Username, manager?: EntityManager | undefined): Promise<User | null> {
        const repo = manager ? manager.getRepository(UserModel) : this.repository;
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
    async findByEmail(email: Email, manager?: EntityManager | undefined): Promise<User | null> {
        const repo = manager ? manager.getRepository(UserModel) : this.repository;
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
    async existsByUsername(username: Username, manager?: EntityManager | undefined): Promise<boolean> {
        const repo = manager ? manager.getRepository(UserModel) : this.repository;
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
    async existsByEmail(email: Email, manager?: EntityManager | undefined): Promise<boolean> {
        const repo = manager ? manager.getRepository(UserModel) : this.repository;
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
    async create(user: User, manager?: EntityManager | undefined): Promise<void> {
        const repo = manager ? manager.getRepository(UserModel) : this.repository;
        const model = await this.converter.convert(user);
        await repo.save(model);
    }
    /**
     * ユーザーIdでユーザー情報を更新する
     * @param user 更新対象のUserエンティティ
     * @param manager? 任意のトランザクション用EntityManager
     * @returns true: 更新成功, false: 該当ユーザーが存在しない
     */
    async updateById(user: User, manager?: EntityManager | undefined): Promise<boolean> {
        const repo = manager ? manager.getRepository(UserModel) : this.repository;
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
    async deleteById(id: UserId, manager?: EntityManager | undefined): Promise<boolean> {
        const repo = manager ? manager.getRepository(UserModel) : this.repository;
        const result = await repo.delete({ id: id.getValue() });
        return result.affected !== 0;
    }
}

