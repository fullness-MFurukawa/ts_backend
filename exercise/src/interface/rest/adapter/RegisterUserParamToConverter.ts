import { Injectable } from "@nestjs/common";
import { Converter } from "@src/shared/adapter/Converter";
import { RegisterUserParam } from "../param/RegisterUserParam";
import { UserDTO } from "@src/application/in/dto/UserDTO";
/**
 * RegisterUserParamからUserDTOへの変換
 * @author Fullness,Inc.
 * @date 2025-03-27
 * @version 1.0.0
 */
@Injectable()
export class RegisterUserParamConverter implements Converter<RegisterUserParam, UserDTO> {
    /**
     * RegisterUserParamをUserDTOに変換する
     * @param source RegisterUserParam
     * @returns UserDTO
     */
    async convert(source: RegisterUserParam): Promise<UserDTO> {
        const dto = new UserDTO();
        dto.id = null;
        dto.username = source.username;
        dto.email = source.email;
        dto.password = source.password;
        dto.isActive = true;
        // 単一のRoleParamをRoleDTO[]として設定
        dto.roles = [{
            id: source.role.id,
            name: source.role.name
        }];
        return dto;
    }
    /**
     * RegisterUserParamの配列をUserDTOの配列に変換する
     * @param sources RegisterUserParamの配列
     * @returns UserDTOの配列
     */
    convertAll(sources: RegisterUserParam[]): Promise<UserDTO[]> {
        return Promise.all(sources.map(p => this.convert(p)));
    }
}