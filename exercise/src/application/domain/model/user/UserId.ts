import * as uuid from 'uuid';
import { DomainException } from "../../exception/DomainException";

/**
 * ユーザーを一意に識別するための値オブジェクト
 * 不変性を持ち、妥当性検証を内部で行う
 * @author Fullness,Inc.
 * @date 2025-03-21
 * @version 1.0.0
 */
export class UserId {
    // 内部的に保持するUUID値（不変）
    private readonly value: string;

    /**
     * プライベートコンストラクタ
     * 外部から直接インスタンスを生成できないようにし、
     * createNew()またはfromString()を使用する
     * @param id UUID値
     */
    private constructor(id: string) {
        this.validateUserId(id);    // UUIDの妥当性を検証
        this.value = id;            // 検証に成功したUUID値を設定
    }

    /**
     * UUIDの妥当性を検証するプライベートメソッド
     * @param value 検証対象のUUID値
     * @throws DomainException UUIDが不正な場合にスロー
     */
    private validateUserId(value: string){
        if (!value || value.trim() === "") {
            throw new DomainException('ユーザーId、は必須です。');
        }
        if (!uuid.validate(value)) {
            throw new DomainException(
                'ユーザーIdは、UUID形式でなければなりません。');
        }
    }

    /**
     * 新しいUUIDを生成してUserIdのインスタンスを作成
     * @returns 新規作成されたUserIdのインスタンス
     */
    static createNew(): UserId {
        // ランダムなUUIDを生成してインスタンス化
        return new UserId(uuid.v4()); 
    }
    
    /**
     * 既存のUUIDからUserIdのインスタンスを生成
     * @param id 既存のUUID
     * @returns UserIdインスタンス
     */
    static fromString(id: string): UserId {
        return new UserId(id); // 引数のUUIDを検証し、インスタンス化
    }

    /**
     * 内部的に保持しているUUID値を取得
     * @returns UUID値
     */
    getValue(): string {
        return this.value;
    }

    /**
     * このUserIdと他のUserIdが等しいかどうかを判定する
     * @param other 比較対象のUserId
     * @returns 他のUserIdと等しい場合はtrue、それ以外の場合はfalse
     */
    equals(other: UserId): boolean {
        return other instanceof UserId && this.value === other.value;
    }
    /**
     * @returns ユーザーIdの値を含む文字列
     */
    toString(): string {
        return `UserId=${this.value}`;
    }
}