import { IsUUID } from 'class-validator';

/**
 * アクセストークン再発行用のリクエストパラメータ
 * - リフレッシュトークンをUUID形式で受け取る
 * @author Fullness,Inc.
 * @date 2025-03-30
 * @version 1.0.0
 */
export class RefreshTokenParam {
  /**
   * リフレッシュトークン（UUID形式）
   */
  @IsUUID('4', { message: 'リフレッシュトークンはUUID形式である必要があります。' })
  refresh_token!: string;
}