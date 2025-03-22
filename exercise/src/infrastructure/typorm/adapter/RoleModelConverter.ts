import { Injectable } from "@nestjs/common";
import { Role } from "@src/application/domain/model/role/Role";
import { Converter } from "@src/shared/adapter/Converter";
import { RoleModel } from "../model/RoleModel";

/**
 * RoleエンティティをRoleModelに変換
 * @author Fullness,Inc.
 * @date 2025-03-22
 * @version 1.0.0
 */
@Injectable()
export class RoleModelConverter implements Converter<Role, RoleModel> {
    /**
     * RoleからRoleModelに変換する
     * @param source Roleンティティ
     * @returns RoleModel
     */
    async convert(source: Role): Promise<RoleModel> {
        const model = 
        new RoleModel(source.getId().getValue(), source.getName().getValue());
        return model;
    }
    /**
     * Roleの配列をRoleModelに配列に変換する
     * @param sources Roleエンティティの配列
     * @returns RoleModelの配列
     */
    async convertAll(sources: Role[]): Promise<RoleModel[]> {
        return Promise.all(sources.map(role => this.convert(role)));
    }
}