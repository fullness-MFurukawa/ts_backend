import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { UserRoleModel } from "./UserRoleModel";
import { RefreshTokenModel } from "./RefreshTokenModel";

/**
 * usersテーブルにマッピングされるエンティティクラス
 * @author Fullness,Inc.
 * @date 2025-03-21
 * @version 1.0.0
 */
//@Entity('users')
export class UserModel {
    // UUID形式のユーザーId（主キー）
    @PrimaryColumn({ type: 'char', length: 36, comment: 'ユーザーID（UUID形式）' })
    id!: string;
    // ログイン用のユーザー名（ユニーク制約付き）
    @Column({ type: 'varchar', length: 255, unique: true, comment: 'ログイン用ユーザー名（一意制約）' })
    username!: string;
    // ハッシュ化されたパスワード
    @Column({ type: 'varchar', length: 255, comment: 'ハッシュ化されたパスワード' })
    password!: string;
    // メールアドレス（NULL可、ユニーク制約付き）
    @Column({ type: 'varchar', length: 255, unique: true, nullable: true, comment: 'メールアドレス（NULL許可、一意制約）' })
    email!: string | null;
    // 有効フラグ（論理削除などに利用）
    @Column({ type: 'boolean', default: true, comment: '有効フラグ（論理削除用などに利用）' })
    isActive!: boolean;
    // レコード作成日時
    @CreateDateColumn({ name: 'created_at', type: 'timestamp', comment: 'レコード作成日時' })
    createdAt!: Date;
    // レコード更新日時
    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', comment: 'レコード更新日時（自動更新）' })
    updatedAt!: Date;
    // リレーション: ユーザーが持つロール情報（中間テーブル経由）
    @OneToMany(() => UserRoleModel, userRole => userRole.user, {
        cascade: true, // 重要
    })
    userRoles!: UserRoleModel[];
    // リレーション: ユーザーのリフレッシュトークン
    @OneToMany(() => RefreshTokenModel, refreshToken => refreshToken.user)
    refreshTokens!: RefreshTokenModel[];
}