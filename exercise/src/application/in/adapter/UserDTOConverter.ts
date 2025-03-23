import { Inject, Injectable } from "@nestjs/common";
import { User } from "@src/application/domain/model/user/User";
import { Converter } from "@src/shared/adapter/Converter";
import { UserDTO } from "../dto/UserDTO";
import { RoleDTOConverter } from "./RoleDTOConverter";

/**
 * UserエンティティからUserDTOへの変換
 * @author Fullness
 * @date 2025-03-23
 * @version 1.0.0
 */
@Injectable()
export class UserDTOConverter implements Converter<User, UserDTO> {
    /**
     * コンストラクタ
     * @param roleDTOConverter RoleエンティティからRoleDTOへ変換 
     */
    constructor(
        @Inject('RoleDTOConverter')
        private readonly roleDTOConverter: RoleDTOConverter
    ){}

    /**
     * UserからUserDTOに変換する
     * @param source Userエンティティ
     * @returns UserDTO
     */  
    async convert(source: User): Promise<UserDTO> {
        const dto = new UserDTO();
        dto.id = source.getId().getValue();
        dto.username = source.getUsername().getValue();
        dto.email = source.getEmail().getValue();
        dto.password = source.getPassword().getValue();
        dto.isActive = source.isUserActive();
        dto.createdAt = source.getCreatedAt().getValue();
        dto.updatedAt = source.getUpdatedAt().getValue();
        dto.roles = await this.roleDTOConverter.convertAll(source.getRoles());
        return dto;
    }
    /**
     * 複数のUserからUserDTOの配列に変換する
     * @param sources Userエンティティの配列
     * @returns UserDTOの配列
     */
    async convertAll(sources: User[]): Promise<UserDTO[]> {
        return Promise.all(sources.map(user => this.convert(user)));
    }
}