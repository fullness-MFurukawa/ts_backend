import { Role } from "../role/Role";
import { Email } from "./Email";
import { Password } from "./Password";
import { Username } from "./Username";

/**
 * ユーザーエンティティ
 * - ユーザーの認証情報を管理
 * @author Fullness,Inc.
 * @date 2025-03-21
 * @version 1.0.0
 */
export class User {
    /**
     * コンストラクタ
     * @param username  ユーザー名
     * @param password  パスワード
     * @param email     メールアドレス
     * @param isActive  有効/無効 
     * @param roles     ロール(複数ロールの割り当て)
     * @param id        ユーザーId(内部でのみ利用)
     */
    constructor(   
        private readonly username: Username,    
        private password: Password,             
        private email: Email | null,            
        private isActive: boolean = true,       
        private roles: Role[] = [],             
        private readonly id?: number){}

    /**
     * ユーザーIdの取得
     * @returns ユーザーId
     */
    getId(): number | null {
        return this.id ?? null; 
    }
    /**
     * ユーザー名の取得
     * @returns ユーザー名
     */
    getUsername(): Username {
        return this.username;
    }
    /**
     * パスワードの取得
     * @returns パスワード
     */
    getPassword(): Password {
        return this.password;
    }
    /**
     * メールアドレスの取得
     * @returns メールアドレス
     */
    getEmail(): Email | null {
        return this.email;
    }
    /**
     * 有効/無効の取得
     * @returns true:有効 false:無効
     */
    getIsActive(): boolean {
        return this.isActive;
    }
    /**
     * ロールの取得
     * @returns 
     */
    getRoles(): Role[] { 
        return this.roles;
    }

    /**
     * 認証処理（パスワードの照合）
     * @param plainPassword ユーザーが入力したパスワード
     * @returns 照合結果(true:成功,false:失敗)
     */
    async authenticate(plainPassword: string): Promise<boolean> {
        return this.password.matches(plainPassword);
    }
}