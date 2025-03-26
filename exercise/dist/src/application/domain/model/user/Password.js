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
exports.Password = void 0;
const bcrypt = __importStar(require("bcrypt")); // bcrypt を使ってパスワードをハッシュ化・比較
const DomainException_1 = require("../../exception/DomainException");
/**
 * パスワードを表す値オブジェクト
 * - ハッシュ化機能あり
 * - パスワード照合機能あり
 * @author Fullness,Inc.
 * @date 2025-03-21
 * @version 1.0.0
 */
class Password {
    /**
     * プライベートコンストラクタ
     * @param value パスワード
     */
    constructor(value) {
        this.value = value;
    }
    /**
     * 平文パスワードからPasswordを生成する
     * @param plainPassword 平文のパスワード
     * @returns Passwordのインスタンス
     */
    static fromPlain(plainPassword) {
        return new Password(plainPassword);
    }
    /**
     * 既にハッシュ化されたパスワードからPasswordを生成する
     * @param hashedPassword ハッシュ化されたパスワード
     * @returns Passwordのインスタンス
     */
    static fromHashed(hashedPassword) {
        return new Password(hashedPassword);
    }
    /**
     * 平文のパスワードをハッシュ化してPasswordのインスタンスを生成する
     * @param plainPassword 平文パスワード
     * @returns Passwordのインスタンス
     */
    static async hash(plainPassword) {
        if (plainPassword.length < 8) {
            throw new DomainException_1.DomainException('パスワードは8文字以上でなければなりません。');
        }
        const hashed = await bcrypt.hash(plainPassword, 10);
        return new Password(hashed);
    }
    /**
     * 平文のパスワードがハッシュと一致するか確認する
     * @param plainPassword 平文のパスワード
     * @returns 一致する場合:true 一致しない場合:false
     */
    async matches(plainPassword) {
        return bcrypt.compare(plainPassword, this.value);
    }
    /**
     * ハッシュ化されたパスワードを取得する
     * @returns ハッシュ変換済みのパスワード
     */
    getValue() {
        return this.value;
    }
    /**
     * このPasswordと他のPasswordが等しいかどうかを判定する
     * @param other 比較対象のPassword
     * @returns 他のPasswordと等しい場合はtrue、それ以外の場合はfalse
     */
    equals(other) {
        return other instanceof Password && this.value === other.value;
    }
    /**
     * @returns パスワードの値を含む文字列
     */
    toString() {
        return `Password=${this.value}`;
    }
}
exports.Password = Password;
