import { RoleDTO } from "./RoleDTO";

/**
 * ユーザーDTOクラス
 * - 登録・表示用のデータ転送オブジェクト
 * @author Fullness
 * @date 2025-03-23
 * @version 1.0.0
 */
export class UserDTO {
    id: string | null;          // ユーザーId
    username!: string;          // ユーザー名 
    email!: string;             // メールアドレス
    password!: string;          // パスワード
    isActive?: boolean;         // 有効・無効
    roles!: RoleDTO[] | null;   // ロール 例: ['user', 'admin']
    createdAt?: Date;           // 作成日
    updatedAt?: Date;           // 更新日
}