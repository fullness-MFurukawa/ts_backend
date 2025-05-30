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
     * 利用可能なすべてのロールを取得する
     * @param manager? 任意のトランザクション用EntityManager
     * @returns Roleの配列、存在しない場合は null
     */
    async findAll(manager?: EntityManager | undefined): Promise<Role[] | null>{
        const repo = manager ? manager.getRepository(RoleModel) : this.repository;
        var models = await repo.find();
        if (! models){
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
    async findAllInheritedRoles(roleName: RoleName, manager?: EntityManager | undefined): Promise<Role[]> {
        const repo = manager ? manager.getRepository(RoleModel) : this.repository;
        // 指定されたロールを取得（継承関係も含める）
        const startRole = await repo.findOne({
            where: { name: roleName.getValue() },
            relations: ['inheritsFrom'],
        });
        if (!startRole) {
            return []; // 指定されたロールが存在しない場合は空配列
        }
        // 結果格納用のMap（重複排除のため）
        const resultMap = new Map<string, RoleModel>();
        // 再帰探索用のスタック
        const stack: RoleModel[] = [startRole];
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
    async findByName(roleName: RoleName, manager?: EntityManager | undefined): Promise<Role | null> {
        const repo = manager ? manager.getRepository(RoleModel) : this.repository;
        const model = await repo.findOne({ where: { name: roleName.getValue() } });
        if (!model) return null;
        return await this.restorer.restore(model);
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