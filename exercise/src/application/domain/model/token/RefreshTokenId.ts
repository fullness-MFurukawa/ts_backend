import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import { DomainException } from '../../exception/DomainException';
/**
 * リフレッシュトークンを表現した値オブジェクト
 * - UUID形式のリフレッシュトークンId
 * @author Fullness,Inc.
 * @date 2025-03-28
 * @version 1.0.0
 */
export class RefreshTokenId {
    private constructor(private readonly value: string) {}
    /**
     * 新しいUUIDを生成してインスタンスを返す
     */
    static new(): RefreshTokenId {
        return new RefreshTokenId(uuidv4());
    }
    /**
     * UUID文字列からインスタンスを生成（バリデーションあり）
     * @param id UUID文字列
     * @throws DomainException UUID形式でない場合
     */
    static fromString(id: string): RefreshTokenId {
        if (!uuidValidate(id)) {
        throw new DomainException(`不正なUUID形式のRefreshTokenId: ${id}`);
        }
        return new RefreshTokenId(id);
    }
    /**
     * 値を取得する
     */
    getValue(): string {
        return this.value;
    }
    /**
     * 等価性のチェック
     */
    equals(other: RefreshTokenId): boolean {
        return this.value === other.getValue();
    }
    toString(): string {
        return this.value;
    }
}