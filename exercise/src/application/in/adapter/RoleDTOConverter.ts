import { Injectable } from "@nestjs/common";
import { Role } from "@src/application/domain/model/role/Role";
import { Converter } from "@src/shared/adapter/Converter";
import { RoleDTO } from "../dto/RoleDTO";

/**
 * RoleエンティティからRoleDTOへの変換
 * @author Fullness
 * @date 2025-03-23
 * @version 1.0.0
 */
@Injectable()
export class RoleDTOConverter implements Converter<Role, RoleDTO> {
    /**
     * RoleからProductDTOに変換する
     * @param source Roleエンティティ
     * @returns RoleDTO
     */  
    async convert(source: Role): Promise<RoleDTO> {
        return {
            id: source.getId().getValue(),
            name: source.getName().getValue(),
        };
    }
    /**
     * 複数のRoleからRoleDTOの配列に変換する
     * @param sources Roleエンティティの配列
     * @returns RoleDTOの配列
     */
    async convertAll(sources: Role[]): Promise<RoleDTO[]> {
        return Promise.all(sources.map(role => this.convert(role)));
    }
}