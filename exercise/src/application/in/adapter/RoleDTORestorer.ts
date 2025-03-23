import { Injectable } from "@nestjs/common";
import { Restorer } from "@src/shared/adapter/Restorer";
import { RoleDTO } from "../dto/RoleDTO";
import { Role } from "@src/application/domain/model/role/Role";
import { RoleId } from "@src/application/domain/model/role/RoleId";
import { RoleName } from "@src/application/domain/model/role/RoleName";

/**
 * RoleDTOからRoleエンティティを復元
 * - Roleエンティティの不変性を保ちながら復元する
 * @author Fullness
 * @date 2025-03-23
 * @version 1.0.0
 */
@Injectable()
export class RoleDTORestorer implements Restorer<RoleDTO, Role> {
    /**
     * RoleDTOからRoleエンティティを復元する
     * @param source RoleDTO
     * @returns Roleエンティティ
     */
    async restore(source: RoleDTO): Promise<Role> {
        const id = RoleId.fromString(source.id ?? '');
        const name = RoleName.fromString(source.name);
        return new Role(id, name);
    }
    /**
     * 複数のRoleDTOからRoleエンティティの配列を復元する
     * @param sources RoleDTOの配列
     * @returns Roleエンティティ配列
     */
    async restoreAll(sources: RoleDTO[]): Promise<Role[]> {
        return Promise.all(sources.map(dto => this.restore(dto)));
    }
}