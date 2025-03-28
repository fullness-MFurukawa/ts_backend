import {    Column, 
            CreateDateColumn, 
            Entity, 
            JoinColumn, 
            ManyToOne, 
            PrimaryColumn, 
            UpdateDateColumn } from "typeorm";
import { UserModel } from "./UserModel";

/**
 * refresh_tokens テーブルに対応する TypeORM エンティティ
 * - ユーザーごとのリフレッシュトークン情報を保持
 * - JWTと併用するリフレッシュトークン戦略に基づく管理用
 * @author Fullness
 * @date 2025-03-28
 * @version 1.0.0
 */
@Entity('refresh_tokens')
export class RefreshTokenModel {
    /** リフレッシュトークンID（UUID, 主キー） */
    @PrimaryColumn({ type: 'char', length: 36, comment: '主キー: リフレッシュトークンのUUID' })
    id!: string;

    /** 紐づくユーザーId（外部キー） */
    @Column({ type: 'char', length: 36, name: 'user_id', comment: '対象のユーザーID(UUID)' })
    userId!: string;

    /** トークン文字列（ユニーク） */
    @Column({ type: 'varchar', length: 512, unique: true, comment: 'リフレッシュトークン文字列' })
    token!: string;

    /** 発行日時 */
    @Column({ type: 'datetime', name: 'issued_at', comment: 'トークンの発行日時' })
    issuedAt!: Date;

    /** 有効期限 */
    @Column({ type: 'datetime', name: 'expires_at', comment: 'トークンの有効期限' })
    expiresAt!: Date;

    /** 無効化された日時（null = 有効） */
    @Column({ type: 'datetime', name: 'revoked_at', nullable: true, comment: '無効化日時（nullなら有効）' })
    revokedAt?: Date | null;

    /** 作成日時 */
    @CreateDateColumn({ name: 'created_at', type: 'datetime', comment: '作成日時' })
    createdAt!: Date;

    /** 更新日時 */
    @UpdateDateColumn({ name: 'updated_at', type: 'datetime', comment: '更新日時' })
    updatedAt!: Date;

    /** ユーザーとのリレーション（多対一） */
    @ManyToOne(() => UserModel, user => user.refreshTokens, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user!: UserModel;
}