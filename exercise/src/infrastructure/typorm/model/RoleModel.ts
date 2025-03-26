import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { UserRoleModel } from "./UserRoleModel";

/**
 * rolesテーブルにマッピングされるエンティティクラス
 * @author Fullness,Inc.
 * @date 2025-03-21
 * @version 1.0.0
 */
@Entity('roles')
export class RoleModel {
    /**
     * コンストラクタ
     * @param id    ロールId
     * @param name  ロール名
     */
    constructor(id?: string, name?: string) {
        if (id) this.id = id;
        if (name) this.name = name;
    }
    // UUID形式のロールId（主キー）
    @PrimaryColumn({ type: 'char', length: 36, comment: 'ロールID（UUID形式）' })
    id!: string;
    // ロール名（例: Admin, User, Guestなど）
    @Column({ type: 'varchar', length: 100, unique: true, comment: 'ロール名（Admin, Userなど）' })
    name!: string;
    // ロールに関連付けられたユーザー情報（中間テーブル経由）
    @OneToMany(() => UserRoleModel, userRole => userRole.role)
    userRoles!: UserRoleModel[];

    // 親ロール（継承元）を参照する自己参照の多対一関係
    @ManyToOne(() => RoleModel, { nullable: true })
    @JoinColumn({ name: 'inherits_from' }) // DB上のカラム名
    inheritsFrom?: RoleModel | null;
}