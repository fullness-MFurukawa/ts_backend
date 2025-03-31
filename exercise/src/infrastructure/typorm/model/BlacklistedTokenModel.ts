import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";
/**
 * アクセストークンのブラックリストモデル
 * - 無効化されたアクセストークンを管理するためのDBエンティティ
 * - トークンの存在有無によって認可制御に活用される
 * @author Fullness,Inc.
 * @date 2025-03-30
 * @version 1.0.0
 */
@Entity('blacklisted_tokens')
@Unique(['token'])
export class BlacklistedTokenModel {
  /**
   * UUID形式の一意なId（内部管理用）
   */
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  /**
   * ブラックリスト対象のアクセストークン（JWTそのもの）
   */
  @Column({ type: 'varchar', length: 512, unique: true })
   token!: string;
  /**
   * トークンの有効期限（アクセストークンのexpと一致）
   * - 期限切れのブラックリストレコードは定期削除などの対象となる
   */
  @Column({ type: 'datetime', nullable: false })
  expiresAt!: Date;
  /**
   * ブラックリストへの登録日時
   * - レコード作成時に自動でセットされる
   */
  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;
}
