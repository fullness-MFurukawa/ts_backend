import { Email } from "@src/application/domain/model/user/Email";
import { User } from "@src/application/domain/model/user/User";
import { UserId } from "@src/application/domain/model/user/UserId";
import { Username } from "@src/application/domain/model/user/Username";

/**
 * Userエンティティのリポジトリインターフェイス  
 * - ユーザー情報の検索、登録、更新、削除を担う  
 * - トランザクション境界を意識し、任意のEntityManagerを受け取れるように設計  
 * @author Fullness,Inc.
 * @date 2025-03-22
 * @version 1.0.0
 */
export interface UserRepository<T> {
    /**
     * ユーザーIdで検索する
     * @param id 検索対象のUserId
     * @param manager? 任意のトランザクション用EntityManager
     * @returns 該当ユーザーが存在すればUser、存在しなければnull
     */
    findById(id: UserId, manager?: T): Promise<User | null>;
    /**
     * ユーザー名で検索する（ログイン認証などに利用）
     * @param username 検索対象のユーザー名
     * @param manager? 任意のトランザクション用EntityManager
     * @returns 該当ユーザーが存在すればUser、存在しなければnull
     */
    findByUsername(username: Username, manager?: T): Promise<User | null>;
    /**
     * メールアドレスで検索する
     * @param email 検索対象のメールアドレス
     * @param manager? 任意のトランザクション用EntityManager
     * @returns 該当ユーザーが存在すればUser、存在しなければnull
     */
    findByEmail(email: Email, manager?: T): Promise<User | null>;
    /**
     * ユーザー名が既に存在するかを判定する
     * @param username チェック対象のユーザー名
     * @param manager? 任意のトランザクション用EntityManager
     * @returns true: 存在する, false: 存在しない
     */
    existsByUsername(username: Username, manager?: T): Promise<boolean>;
    /**
     * メールアドレスが既に存在するかを判定する
     * @param email チェック対象のメールアドレス
     * @param manager? 任意のトランザクション用EntityManager
     * @returns true: 存在する, false: 存在しない
     */
    existsByEmail(email: Email, manager?: T): Promise<boolean>;
    /**
     * 新しいユーザーを永続化する
     * @param user 永続化対象のUserエンティティ
     * @param manager? 任意のトランザクション用EntityManager
     */
    create(user: User, manager?: T): Promise<void>;
    /**
     * ユーザーIdでユーザー情報を更新する
     * @param user 更新対象のUserエンティティ
     * @param manager? 任意のトランザクション用EntityManager
     * @returns true: 更新成功, false: 該当ユーザーが存在しない
     */
    updateById(user: User, manager?: T): Promise<boolean>;
    /**
     * ユーザーIdでユーザー情報を削除する
     * @param id 削除対象のUserId
     * @param manager? 任意のトランザクション用EntityManager
     * @returns true: 削除成功, false: 該当ユーザーが存在しない
     */
    deleteById(id: UserId, manager?: T): Promise<boolean>;
}