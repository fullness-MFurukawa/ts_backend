import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "./roles.decorator";

/**
 * RolesGuard（ロールベース認可用ガード）
 * - @Roles() デコレーターで指定されたロールを取得し、
 *   JWTトークンで認証されたユーザーの roles にそのロールが含まれているかを検証する。
 * - roles に一致しない場合は 403 Forbiddenをスロー
 * @author Fullness,Inc.
 * @date 2025-03-28
 * @version 1.0.0
 */
@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    /**
     * アクセス可否の判定処理
     * @param context 実行コンテキスト
     * @returns boolean（true: 通過、false: 拒否）
     * @throws ForbiddenException アクセス権限がない場合
    */
    canActivate(context: ExecutionContext): boolean {
        // クラスやハンドラ（メソッド）に付与されたロール情報を取得
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
        );

        // もし @Roles() が付与されていなければ制限なし（アクセス許可）
        if (!requiredRoles || requiredRoles.length === 0) {
        return true;
        }
        // リクエストから認証済みユーザーを取得
        const { user } = context.switchToHttp().getRequest();
        const userRoles: string[] = user?.roles ?? [];
        // ユーザーのいずれかのロールが requiredRoles に含まれていれば通過
        const hasRole = requiredRoles.some((role) => userRoles.includes(role));
        if (!hasRole) {
            throw new ForbiddenException('アクセスが拒否されました（権限不足）');
        }
        return true;
    }
}