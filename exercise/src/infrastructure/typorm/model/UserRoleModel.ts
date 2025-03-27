import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { UserModel } from "./UserModel";
import { RoleModel } from "./RoleModel";

/**
 * user_rolesテーブルにマッピングされるエンティティクラス（多対多のリレーション）
 * @author Fullness,Inc.
 * @date 2025-03-21
 * @version 1.0.0
 */
// @Entity('user_roles')
export class UserRoleModel {
    // --- 複合主キー構成 ---
    @PrimaryColumn({ type: 'char', length: 36, name: 'user_id', comment: 'ユーザーID（外部キー）' })
    userId!: string;

    @PrimaryColumn({ type: 'char', length: 36, name: 'role_id', comment: 'ロールID（外部キー）' })
    roleId!: string;

    // --- ロール付与日時 ---
    @Column({ type: 'timestamp', name: 'assigned_at', default: () => 'CURRENT_TIMESTAMP', comment: 'ロールが付与された日時' })
    assignedAt!: Date;

    // --- リレーション設定 ---
    @ManyToOne(() => UserModel, user => user.userRoles, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user!: UserModel;

    @ManyToOne(() => RoleModel, role => role.userRoles, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'role_id' })
    role!: RoleModel;
}
