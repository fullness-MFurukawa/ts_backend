import { DomainException } from "../../exception/DomainException";

/**
 * 更新日時を表す値オブジェクト
 * - 不変で信頼性のあるタイムスタンプを提供
 * - ドメインモデル内で日時の比較・検証にも使用可能
 * @author Fullness,Inc.
 * @date 2025-03-21
 * @version 1.0.0
 */
export class UpdatedAt {
    private readonly value: Date
    /**
     * コンストラクタ（直接Dateを渡す）
     * @param value 更新日時（Date型）を内部に保持
     */
    private constructor(value: Date){
        this.validateUpdatedAt(value);
        this.value = value;
    }

    /**
     * 更新日の妥当性を検証するプライベートメソッド
     * @param value 検証対象の更新日
     * @throws DomainException 不正な場合にスロー
     */
    private validateUpdatedAt(value: Date){
        if (!value) {
            throw new DomainException('更新日時は必須です。');
        }
    }

    /**
     * 現在の時刻を使ってインスタンスを生成
     * @returns 現在日時のCreatedAtインスタンス
     */
    static now(): UpdatedAt {
        return new UpdatedAt(new Date());
    }

    /**
     * 既存の Date 値から UpdatedAt を生成するファクトリメソッド
     * @param date 更新日時として使用するDateオブジェクト
     * @returns UpdatedAt インスタンス
     */
    static fromDate(date: Date): UpdatedAt {
        return new UpdatedAt(date);
    }

    /**
     * 内部に保持している Date 値を取得する
     * @returns Date オブジェクト
     */
    getValue(): Date {
        return this.value;
    }

    /**
     * 指定された日時より前かどうかを判定する
     * @param date 比較対象の日時
     * @returns 自身の日時が指定日時より前であれば true
     */
    isBefore(date: Date): boolean {
        return this.value.getTime() < date.getTime();
    }

    /**
     * 指定された日時より後かどうかを判定する
     * @param date 比較対象の日時
     * @returns 自身の日時が指定日時より後であれば true
     */
    isAfter(date: Date): boolean {
        return this.value.getTime() > date.getTime();
    }

    /**
     * 同じ UpdatedAt 値かどうかを比較する
     * @param other 比較対象の UpdatedAt
     * @returns 同一の日時を保持していれば true
     */
    equals(other: UpdatedAt): boolean {
        return other instanceof UpdatedAt && 
            this.value.getTime() === other.getValue().getTime();
    }

    /**
     * ISO 形式の文字列に変換する
     * @returns ISO 形式の日時文字列
     */
    toString(): string {
        return `UpdatedAt=${this.value.toISOString()}`;
    }
}