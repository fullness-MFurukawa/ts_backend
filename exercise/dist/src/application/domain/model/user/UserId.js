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
exports.UserId = void 0;
const uuid = __importStar(require("uuid"));
const DomainException_1 = require("../../exception/DomainException");
/**
 * ユーザーを一意に識別するための値オブジェクト
 * 不変性を持ち、妥当性検証を内部で行う
 * @author Fullness,Inc.
 * @date 2025-03-21
 * @version 1.0.0
 */
class UserId {
    /**
     * プライベートコンストラクタ
     * 外部から直接インスタンスを生成できないようにし、
     * createNew()またはfromString()を使用する
     * @param id UUID値
     */
    constructor(id) {
        this.validateUserId(id); // UUIDの妥当性を検証
        this.value = id; // 検証に成功したUUID値を設定
    }
    /**
     * UUIDの妥当性を検証するプライベートメソッド
     * @param value 検証対象のUUID値
     * @throws DomainException UUIDが不正な場合にスロー
     */
    validateUserId(value) {
        if (!value || value.trim() === "") {
            throw new DomainException_1.DomainException('ユーザーId、は必須です。');
        }
        if (!uuid.validate(value)) {
            throw new DomainException_1.DomainException('ユーザーIdは、UUID形式でなければなりません。');
        }
    }
    /**
     * 新しいUUIDを生成してUserIdのインスタンスを作成
     * @returns 新規作成されたUserIdのインスタンス
     */
    static createNew() {
        // ランダムなUUIDを生成してインスタンス化
        return new UserId(uuid.v4());
    }
    /**
     * 既存のUUIDからUserIdのインスタンスを生成
     * @param id 既存のUUID
     * @returns UserIdインスタンス
     */
    static fromString(id) {
        return new UserId(id); // 引数のUUIDを検証し、インスタンス化
    }
    /**
     * 内部的に保持しているUUID値を取得
     * @returns UUID値
     */
    getValue() {
        return this.value;
    }
    /**
     * このUserIdと他のUserIdが等しいかどうかを判定する
     * @param other 比較対象のUserId
     * @returns 他のUserIdと等しい場合はtrue、それ以外の場合はfalse
     */
    equals(other) {
        return other instanceof UserId && this.value === other.value;
    }
    /**
     * @returns ユーザーIdの値を含む文字列
     */
    toString() {
        return `UserId=${this.value}`;
    }
}
exports.UserId = UserId;
