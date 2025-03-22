import { DomainException } from "../../exception/DomainException";

/**
 * 作成日時を表す値オブジェクト
 * - 不変で信頼性のあるタイムスタンプを提供
 * - ドメインモデル内で日時の比較・検証にも使用可能
 * @author Fullness,Inc.
 * @date 2025-03-21
 * @version 1.0.0
 */
export class CreatedAt {
    private readonly value: Date
    /**
     * コンストラクタ（直接Dateを渡す）
     * @param value 作成日時（Date型）を内部に保持
     */
    private constructor(value: Date){
        this.validateCreateAt(value);
        this.value = value;
    }

    /**
     * 更新日の妥当性を検証するプライベートメソッド
     * @param value 検証対象の更新日
     * @throws DomainException 不正な場合にスロー
     */
    private validateCreateAt(value: Date){
        if (!value) {
            throw new DomainException('作成日時は必須です。');
        }
    }

    /**
     * 既存の Date 値からCreatedAtを生成するファクトリメソッド
     * @param date 更新日時として使用するDateオブジェクト
     * @returns CreateAt インスタンス
     */
    static fromDate(date: Date): CreatedAt {
        return new CreatedAt(date);
    }

    /**
     * 現在の時刻を使ってインスタンスを生成
     * @returns 現在日時のCreatedAtインスタンス
     */
    static now(): CreatedAt {
        return new CreatedAt(new Date());
    }
    
    /**
     * 保持している作成日を返す
     * @returns Dateオブジェクト
     */
    getValue(): Date {
        return this.value;
    }

    /**
     * 他のCreatedAtインスタンスと等価かを判定
     * @param other 比較対象
     * @returns 等しい場合true
     */
    equals(other: CreatedAt): boolean {
        return other instanceof CreatedAt 
            && this.value.getTime() === other.value.getTime();
    }

    /**
     * @returns 作成日時の文字列表現
     */
    toString(): string {
        return `CreatedAt=${this.value.toISOString()}`;
    }
}