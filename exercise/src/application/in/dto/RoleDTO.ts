import { ApiProperty } from "@nestjs/swagger";

/**
 * ロールDTOクラス
 * - 登録・表示用のデータ転送オブジェクト
 * @author Fullness
 * @date 2025-03-23
 * @version 1.0.0
 */
export class RoleDTO {
    @ApiProperty({ description: 'ロールId', example: 'uuid-1234-5678', nullable: true })
    id: string | null;      // ロールId
    @ApiProperty({ description: 'ロール名', example: 'admin' })
    name!: string;          // ロール名
    displayName?: string;   // 画面表示用の名称
    description?: string;   // ロールの説明
    isDefault?: boolean;    // デフォルトロールかどうか
}
  