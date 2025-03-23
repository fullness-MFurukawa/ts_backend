import { Inject, Injectable } from "@nestjs/common";
import { Restorer } from "@src/shared/adapter/Restorer";
import { UserDTO } from "../dto/UserDTO";
import { User } from "@src/application/domain/model/user/User";
import { RoleDTORestorer } from "./RoleDTORestorer";
import { Role } from "@src/application/domain/model/role/Role";
import { UserId } from "@src/application/domain/model/user/UserId";
import { Username } from "@src/application/domain/model/user/Username";
import { Password } from "@src/application/domain/model/user/Password";
import { Email } from "@src/application/domain/model/user/Email";
import { CreatedAt } from "@src/application/domain/model/user/CreatedAt";
import { UpdatedAt } from "@src/application/domain/model/user/UpdatedAt";
import { IsActive } from "@src/application/domain/model/user/IsActive";

/**
 * UserDTOからUserエンティティを復元する
 * - Idや日時、ロールなど値オブジェクトに変換して渡す
 * @author Fullness
 * @date 2025-03-23
 * @version 1.0.0
 */
@Injectable()
export class UserDTORestorer implements Restorer<UserDTO, User> {
    /**
     * コンストラクタ
     * @param roleRestorer RoleDTOからRoleeエンティティへの復元
     */
    constructor(
        @Inject('RoleDTORestorer')
        private readonly roleRestorer: RoleDTORestorer
    ){}

    /**
     * UserDTOからUserエンティティを復元する
     * @param dto UserDTO
     * @returns 復元されたUserエンティティ
     */
    async restore(source: UserDTO): Promise<User> {
        // RoleDTOの配列を復元（nullや空配列対応）
        const roles: Role[] = source.roles
        ? await this.roleRestorer.restoreAll(source.roles) : [];
        // Userエンティティとして復元
        return User.restore(
            // DTOにIdがなければ新規生成
            UserId.fromString(source.id ?? crypto.randomUUID()),
            Username.fromString(source.username),
            // パスワードをハッシュ化して設定
            await Password.hash(source.password),
            Email.fromString(source.email),
            source.isActive ? IsActive.active() : IsActive.inactive(),
            CreatedAt.fromDate(source.createdAt ?? new Date()),
            UpdatedAt.fromDate(source.updatedAt ?? new Date()),
            roles
        );
    }
    /**
     * UserDTOの配列からUserエンティティの配列を復元する
     * @param sources UserDTOの配列
     * @returns Userエンティティの配列
     */
    restoreAll(sources: UserDTO[]): Promise<User[]> {
        return Promise.all(sources.map(dto => this.restore(dto)));
    }
}