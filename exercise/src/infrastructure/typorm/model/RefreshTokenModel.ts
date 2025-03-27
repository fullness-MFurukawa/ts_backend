import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { UserModel } from "./UserModel";

/**
 * refresh_tokensテーブルにマッピングされるエンティティクラス
 * - 各ユーザーごとに複数のリフレッシュトークンを発行可能
 * @author Fullness,Inc.
 * @date 2025-03-21
 * @version 1.0.0
 */
@Entity('refresh_tokens')
export class RefreshTokenModel {
    // UUID形式のトークンId（主キー）
    @PrimaryColumn({ type: 'char', length: 36, comment: '主キー: リフレッシュトークンのUUID' })
    id!: string;
    // 外部キー: ユーザーId
    @Column({ type: 'char', length: 36, name: 'user_id', comment: '対象のユーザーID(UUID)' })
    userId!: string;
    // JWTなどのリフレッシュトークンの値
    @Column({ type: 'varchar', length: 512, unique: true, comment: 'リフレッシュトークン文字列' })
    token!: string;
    // 発行日時
    @Column({ type: 'datetime', name: 'issued_at', comment: 'トークンの発行日時' })
    issuedAt!: Date;
    // 有効期限
    @Column({ type: 'datetime', name: 'expires_at', comment: 'トークンの有効期限' })
    expiresAt!: Date;
    // 無効化日時（nullなら有効）
    @Column({ type: 'datetime', name: 'revoked_at', nullable: true, comment: '無効化日時（nullなら有効）' })
    revokedAt?: Date | null;
    // 作成日時（自動設定）
    @CreateDateColumn({ name: 'created_at', type: 'datetime', comment: '作成日時' })
    createdAt!: Date;
    // 更新日時（自動更新）
    @UpdateDateColumn({ name: 'updated_at', type: 'datetime', comment: '更新日時' })
    updatedAt!: Date;
    // ユーザーエンティティとのリレーション
    @ManyToOne(() => UserModel, user => user.refreshTokens, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user!: UserModel;
}