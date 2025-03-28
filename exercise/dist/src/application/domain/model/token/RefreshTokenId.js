"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenId = void 0;
const uuid_1 = require("uuid");
const DomainException_1 = require("../../exception/DomainException");
/**
 * リフレッシュトークンを表現した値オブジェクト
 * - UUID形式のリフレッシュトークンId
 * @author Fullness,Inc.
 * @date 2025-03-28
 * @version 1.0.0
 */
class RefreshTokenId {
    constructor(value) {
        this.value = value;
    }
    /**
     * 新しいUUIDを生成してインスタンスを返す
     */
    static new() {
        return new RefreshTokenId((0, uuid_1.v4)());
    }
    /**
     * UUID文字列からインスタンスを生成（バリデーションあり）
     * @param id UUID文字列
     * @throws DomainException UUID形式でない場合
     */
    static fromString(id) {
        if (!(0, uuid_1.validate)(id)) {
            throw new DomainException_1.DomainException(`不正なUUID形式のRefreshTokenId: ${id}`);
        }
        return new RefreshTokenId(id);
    }
    /**
     * 値を取得する
     */
    getValue() {
        return this.value;
    }
    /**
     * 等価性のチェック
     */
    equals(other) {
        return this.value === other.getValue();
    }
    toString() {
        return this.value;
    }
}
exports.RefreshTokenId = RefreshTokenId;
