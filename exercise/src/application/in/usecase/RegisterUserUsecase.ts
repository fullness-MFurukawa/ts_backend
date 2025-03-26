import { RoleDTO } from "../dto/RoleDTO";
import { UserDTO } from "../dto/UserDTO";

/**
 * ユーザー登録ユースケースインターフェイス
 * - 登録前チェックと永続化を行う
 * @author Fullness,Inc.
 * @date 2025-03-23
 * @version 1.0.0
 */
export interface RegisterUserUsecase {
    /**
     * ユーザーを新規登録する
     * @param dto ユーザーDTO（入力データ）
     * @throws ExistsException ユーザー名またはメールアドレスが既に存在する
     * @throws NotFoundException 指定されたロールが存在しない
     * @throws InternalException その他内部エラー
     */
    register(dto: UserDTO): Promise<void>;
    /**
     * 利用可能なロールを取得する
     * @throws InternalException その他内部エラー
     * @returns RoleDTOの配列
     */
    fetchRoles(): Promise<RoleDTO[]>;
}