import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

/**
 * JWT認証用のPassportストラテジークラス
 * - AuthorizationヘッダーのBearerトークンからJWTを抽出し、検証・デコードを行う
 * - 認証に成功した場合、validate()の戻り値がreq.userとして利用可能になる
 * @author Fullness,Inc.
 * @date 2025-03-27
 * @version 1.0.0
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    /**
     * コンストラクタ
     * @param configService 環境変数を取得するためのサービス（JWT_SECRETなどを参照）
     */
    constructor(private readonly configService: ConfigService) {
        super({
            // JWTの取得元：AuthorizationヘッダーのBearerトークン
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            // トークンの有効期限を検証するかどうか（falseなら期限切れは拒否）
            ignoreExpiration: false,
            // JWT署名検証に使うシークレットキー
            secretOrKey: configService.get<string>('JWT_SECRET')!, 
        });
    }
    /**
     * JWTのペイロードをバリデートし、認証情報として返す
     * - この戻り値は、自動的にreq.userにセットされ、後続の処理で利用可能
     * @param payload JWTのデコード済みペイロード
     * @returns 認証されたユーザー情報（任意のオブジェクト）
     */
    validate(payload: any) {
        // 認証成功後に req.user にセットされる値
        return {
            userId: payload.sub,
            username: payload.username,
            roles: payload.roles,
        };
    }
}