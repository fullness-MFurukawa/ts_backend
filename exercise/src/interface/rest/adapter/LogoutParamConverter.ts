import { Injectable } from "@nestjs/common";
import { Converter } from "@src/shared/adapter/Converter";
import { LogoutParam } from "../param/LogoutParam";
import { LogoutDTO } from "@src/application/in/dto/LogoutDTO";

/**
 * LogoutParam → LogoutDTO 変換用コンバータ
 * - 日付文字列をDate型に変換してDTOに渡す
 * @author Fullness,Inc.
 * @date 2025-03-30
 * @version 1.0.0
 */
@Injectable()
export class LogoutParamConverter implements Converter<LogoutParam, LogoutDTO> {
    /**
     * LogoutParamをLogoutDTOに変換する
     * @param source LogoutParam
     * @returns LogoutDTO
     */
    async convert(param: LogoutParam): Promise<LogoutDTO> {
        return new LogoutDTO(
            param.refresh_token,
            param.access_token,
            new Date(param.expires_at)  // ISO8601 → Date型へ変換
        );
    }
    /**
     * LogoutParamの配列をLogoutDTOの配列に変換する
     * @param sources LogoutParamの配列
     * @returns LogoutDTOの配列
     */
    async convertAll(params: LogoutParam[]): Promise<LogoutDTO[]> {
        return Promise.all(params.map(p => this.convert(p)));
    }
}