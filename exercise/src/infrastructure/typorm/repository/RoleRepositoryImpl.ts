import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Role } from "@src/application/domain/model/role/Role";
import { RoleName } from "@src/application/domain/model/role/RoleName";
import { RoleRepository } from "@src/application/out/repository/RoleRepository";
import { EntityManager, Repository } from "typeorm";
import { RoleModel } from "../model/RoleModel";
import { Converter } from "@src/shared/adapter/Converter";
import { Restorer } from "@src/shared/adapter/Restorer";

/**
 * Roleエンティティのリポジトリインターフェイス実装
 * 永続化と復元の責務を担うインフラストラクチャ層の実装
 * @author Fullness,Inc.
 * @date 2025-03-22
 * @version 1.0.0
 */
@Injectable()
export class RoleRepositoryImpl implements RoleRepository<EntityManager> {
    /**
     * コンストラクタ
     * @param repository RoleModelに対応するTypeORMのリポジトリ
     * @param converter RoleエンティティからRoleModelへの変換
     * @param restorer RoleModelからRoleエンティティの復元
     */
    constructor(
        @InjectRepository(RoleModel)
        private readonly repository: Repository<RoleModel>,
        @Inject("RoleModelConverter")
        private readonly converter: Converter<Role, RoleModel>,
        @Inject("RoleModelRestorer")
        private readonly restorer: Restorer<RoleModel, Role>,
    ){}

    /**
     * 指定されたロール名でロールを検索する
     * @param roleName 検索対象のロール名
     * @param manager 任意のEntityManager（トランザクション用）
     * @returns 該当ロールが存在すればRoleエンティティ、存在しなければnull
     */
    async findByName(roleName: RoleName, manager?: EntityManager | undefined): Promise<Role | null> {
        const repo = manager ? manager.getRepository(RoleModel) : this.repository;
        const model = await repo.findOne({ where: { name: roleName.getValue() } });
        if (!model) return null;
        return this.restorer.restore(model);
    }

    /**
     * 指定されたロール名が存在するかを判定する
     * @param roleName 存在確認対象のロール名
     * @param manager 任意のEntityManager
     * @returns 存在すればtrue、存在しなければfalse
     */
    async exists(roleName: RoleName, manager?: EntityManager | undefined): Promise<boolean> {
        const repo = manager ? manager.getRepository(RoleModel) : this.repository;
        const count = await repo.count({ where: { name: roleName.getValue() } });
        return count > 0;
    }

    /**
     * 指定されたRoleエンティティを永続化する
     * @param role 永続化するRoleエンティティ
     * @param manager 任意のEntityManager
     */
    async create(role: Role, manager?: EntityManager | undefined): Promise<void> {
        const repo = manager ? manager.getRepository(RoleModel) : this.repository;
        const model = await this.converter.convert(role);
        await repo.save(model);
    }

    /**
     * 指定されたロール名に一致するロールを削除する
     * @param roleName 削除対象のロール名
     * @param manager 任意のEntityManager
     * @returns 削除が成功すればtrue、該当データがなければfalse
     */
    async deleteByName(roleName: RoleName, manager?: EntityManager | undefined): Promise<boolean> {
        const repo = manager ? manager.getRepository(RoleModel) : this.repository;
        const deleteResult = await repo.delete({ name: roleName.getValue() });
        return deleteResult.affected !== 0;
    }
}