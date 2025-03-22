"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleId = void 0;
const uuid = __importStar(require("uuid"));
const DomainException_1 = require("../../exception/DomainException");
/**
 * ロールを一意に識別するための値オブジェクト
 * UUID形式で不変性を持ち、妥当性検証を内部で行う
 * @author Fullness,Inc.
 * @date 2025-03-21
 * @version 1.0.0
 */
class RoleId {
    /**
     * プライベートコンストラクタ
     * createNew()またはfromString()からのみインスタンス化可能
     * @param id UUID値
     */
    constructor(id) {
        this.validateRoleId(id); // 妥当性検証
        this.value = id;
    }
    /**
     * UUID形式の妥当性検証
     * @param value チェック対象のUUID
     * @throws DomainException UUIDが不正な場合
     */
    validateRoleId(value) {
        if (!value || value.trim() === "") {
            throw new DomainException_1.DomainException('ロールIdは、必須です。');
        }
        if (!uuid.validate(value)) {
            throw new DomainException_1.DomainException('ロールIdは、UUID形式である必要があります。');
        }
    }
    /**
     * 新しいUUIDを生成してRoleIdを作成
     * @returns 新規RoleIdインスタンス
     */
    static createNew() {
        return new RoleId(uuid.v4());
    }
    /**
     * 既存のUUIDからRoleIdを生成
     * @param id 既存のUUID
     * @returns RoleIdインスタンス
     */
    static fromString(id) {
        return new RoleId(id);
    }
    /**
     * 保持しているUUID値を返す
     * @returns UUID文字列
     */
    getValue() {
        return this.value;
    }
    /**
     * 他のRoleIdと同一かどうか比較
     * @param other 比較対象のRoleId
     * @returns 同一であればtrue
     */
    equals(other) {
        return other instanceof RoleId && this.value === other.value;
    }
    /**
     * 文字列表現を返す
     * @returns ロールIdの文字列表現
     */
    toString() {
        return `RoleId=${this.value}`;
    }
}
exports.RoleId = RoleId;
