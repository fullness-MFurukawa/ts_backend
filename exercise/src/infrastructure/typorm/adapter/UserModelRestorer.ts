import { Inject, Injectable } from "@nestjs/common";
import { Restorer } from "@src/shared/adapter/Restorer";
import { UserModel } from "../model/UserModel";
import { User } from "@src/application/domain/model/user/User";
import { RoleModelRestorer } from "./RoleModelRestorer";
import { UserId } from "@src/application/domain/model/user/UserId";
import { Username } from "@src/application/domain/model/user/Username";
import { Password } from "@src/application/domain/model/user/Password";
import { Email } from "@src/application/domain/model/user/Email";
import { IsActive } from "@src/application/domain/model/user/IsActive";
import { CreatedAt } from "@src/application/domain/model/user/CreatedAt";
import { UpdatedAt } from "@src/application/domain/model/user/UpdatedAt";
import { Role } from "@src/application/domain/model/role/Role";

/**
 * UserModelからUser エンティティを復元するクラス
 * @author Fullness,Inc.
 * @date 2025-03-22
 * @version 1.0.0
 */
@Injectable()
export class UserModelRestorer implements Restorer<UserModel, User> {
    /**
     * コントラクタ
     * @param roleRestorer RoleModelからRoleを復元 
     */
    constructor(
        @Inject('RoleModelRestorer')
        private readonly roleRestorer: RoleModelRestorer
    ){}

    /**
     * UserModelからUserエンティティを復元する
     * @param source UserModel
     * @returns 復元されたUserエンティティ
     */
    async restore(source: UserModel): Promise<User> {
        const id = UserId.fromString(source.id);
        const username = Username.fromString(source.username);
        const password = Password.fromHashed(source.password);
        const email = Email.fromString(source.email ?? "");
        const isActive = new IsActive(source.isActive);
        const createdAt = CreatedAt.fromDate(source.createdAt);
        const updatedAt = UpdatedAt.fromDate(source.updatedAt);
        // userRoles から RoleModel を抽出
        const roleModels = source.userRoles?.map(ur => ur.role) ?? [];
        const roles: Role[] = await this.roleRestorer.restoreAll(roleModels);
        return User.restore(
            id, username, password, email,
            isActive, createdAt, updatedAt, roles
        );
    }
    
    /**
     * UserModelの配列からUserエンティティ配列を復元する
     * @param sources UserModelモデルの配列
     * @returns 復元されたUserエンティティ配列
     */
    async restoreAll(sources: UserModel[]): Promise<User[]> {
        return Promise.all(sources.map(model => this.restore(model)));
    }
}