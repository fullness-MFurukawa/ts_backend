import { Role } from "@src/application/domain/model/role/Role";
import { RoleName } from "@src/application/domain/model/role/RoleName";

/**
 * Roleエンティティのリポジトリインターフェイス  
 * - 権限（ロール）の永続化・取得・検証などの機能を提供する  
 * - トランザクション単位で操作可能なように、任意でマネージャを受け取る設計  
 * @author Fullness,Inc.
 * @date 2025-03-22
 * @version 1.0.0
 */
export interface RoleRepository<T> {
    /**
     * 利用可能なすべてのロールを取得する
     * @param manager? 任意のトランザクション用EntityManager
     * @returns Roleの配列、存在しない場合は null
     */
    findAll(manager?: T): Promise<Role[] | null>;
    /**
     * 指定されたロールが継承しているすべてのロールを取得する
     * - 例: Admin → User → Guest のように継承されている場合、Admin を指定すると全てを取得
     * - 再帰的に親ロールをたどる
     * @param roleName 選択されたロール名
     * @param manager EntityManager（任意）
     * @returns 継承されたすべてのロールを含む配列（選択されたロール自身も含む）
     */
    findAllInheritedRoles(roleName: RoleName, manager?: T): Promise<Role[]>
    /**
     * ロール名でロールを検索する
     * @param roleName 検索対象のロール名
     * @param manager? 任意のトランザクション用EntityManager
     * @returns Role インスタンス、存在しない場合は null
     */
    findByName(roleName: RoleName, manager?: T): Promise<Role | null>;
    /**
     * 指定されたロール名が既に存在するかを判定する
     * @param roleName 確認対象のロール名
     * @param manager? 任意のトランザクション用EntityManager
     * @returns true: 存在する, false: 存在しない
     */
    exists(roleName: RoleName, manager?: T): Promise<boolean>;
    /**
     * 新しいロールを永続化する
     * @param role 登録するロールエンティティ
     * @param manager? 任意のトランザクション用EntityManager
     */
    create(role: Role, manager?: T): Promise<void>;
    /**
     * ロール名でロールを削除する
     * @param roleName 削除対象のロール名
     * @param manager? 任意のトランザクション用EntityManager
     * @returns true: 削除成功, false: 該当ロールが存在しない
     */
    deleteByName(roleName: RoleName, manager?: T): Promise<boolean>;
}