import { Converter } from "@src/shared/adapter/Converter";
import { AuthenticateParam } from "../param/AuthenticateParam";
import { AuthenticateDTO } from "@src/application/in/dto/AuthenticateDTO";
import { Injectable } from "@nestjs/common";

/**
 * AuthenticateParamからAuthenticateDTOへの変換
 * @author Fullness,Inc.
 * @date 2025-03-27
 * @version 1.0.0
 */
@Injectable()
export class AuthenticateParamConverter implements Converter<AuthenticateParam,AuthenticateDTO>{
    /**
     * AuthenticateParamをAuthenticateDTOに変換する
     * @param source AuthenticateParam
     * @returns AuthenticateDTO
     */
    async convert(source: AuthenticateParam): Promise<AuthenticateDTO> {
        return new AuthenticateDTO(source.username,source.password);
    }
    /**
     * AuthenticateParamの配列をAuthenticateDTOの配列に変換する
     * @param sources AuthenticateParamの配列
     * @returns AuthenticateDTOの配列
     */
    convertAll(sources: AuthenticateParam[]): Promise<AuthenticateDTO[]> {
        return Promise.all(sources.map(p => this.convert(p)));
    }
}