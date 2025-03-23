/**
 * ロールDTOクラス
 * - 登録・表示用のデータ転送オブジェクト
 * @author Fullness
 * @date 2025-03-23
 * @version 1.0.0
 */
export class RoleDTO {
    id: string | null;      // ロールId
    name!: string;          // ロール名
    displayName?: string;   // 画面表示用の名称
    description?: string;   // ロールの説明
    isDefault?: boolean;    // デフォルトロールかどうか
}
  