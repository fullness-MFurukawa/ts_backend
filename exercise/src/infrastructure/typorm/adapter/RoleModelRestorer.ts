import { Injectable } from "@nestjs/common";
import { Restorer } from "@src/shared/adapter/Restorer";
import { RoleModel } from "../model/RoleModel";
import { Role } from "@src/application/domain/model/role/Role";
import { RoleId } from "@src/application/domain/model/role/RoleId";
import { RoleName } from "@src/application/domain/model/role/RoleName";

/**
 * RoleModelからRoleエンティティを復元する
 * @author Fullness,Inc.
 * @date 2025-03-22
 * @version 1.0.0
 */
@Injectable()
export class RoleModelRestorer implements Restorer<RoleModel, Role> {
    /**
     * RoleModelからRoleエンティティを復元する
     * @param source RoleModel
     * @returns 復元されたRoleエンティティ
     */
    async restore(source: RoleModel): Promise<Role> {
        const id = RoleId.fromString(source.id);
        const name = RoleName.fromString(source.name);
        return new Role(id, name);
    }
    /**
     * RoleModelの配列からRoleエンティティ配列を復元する
     * @param sources RoleModelモデルの配列
     * @returns 復元されたRoleエンティティ配列
     */
    async restoreAll(sources: RoleModel[]): Promise<Role[]> {
        return Promise.all(sources.map(model => this.restore(model)));
    }
}