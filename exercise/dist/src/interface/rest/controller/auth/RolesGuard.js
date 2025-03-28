"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const roles_decorator_1 = require("./roles.decorator");
/**
 * RolesGuard（ロールベース認可用ガード）
 * - @Roles() デコレーターで指定されたロールを取得し、
 *   JWTトークンで認証されたユーザーの roles にそのロールが含まれているかを検証する。
 * - roles に一致しない場合は 403 Forbiddenをスロー
 * @author Fullness,Inc.
 * @date 2025-03-28
 * @version 1.0.0
 */
let RolesGuard = class RolesGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    /**
     * アクセス可否の判定処理
     * @param context 実行コンテキスト
     * @returns boolean（true: 通過、false: 拒否）
     * @throws ForbiddenException アクセス権限がない場合
    */
    canActivate(context) {
        // クラスやハンドラ（メソッド）に付与されたロール情報を取得
        const requiredRoles = this.reflector.getAllAndOverride(roles_decorator_1.ROLES_KEY, [context.getHandler(), context.getClass()]);
        // もし @Roles() が付与されていなければ制限なし（アクセス許可）
        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }
        // リクエストから認証済みユーザーを取得
        const { user } = context.switchToHttp().getRequest();
        const userRoles = user?.roles ?? [];
        // ユーザーのいずれかのロールが requiredRoles に含まれていれば通過
        const hasRole = requiredRoles.some((role) => userRoles.includes(role));
        if (!hasRole) {
            throw new common_1.ForbiddenException('アクセスが拒否されました（権限不足）');
        }
        return true;
    }
};
exports.RolesGuard = RolesGuard;
exports.RolesGuard = RolesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], RolesGuard);
