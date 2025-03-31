import { Body, Controller, HttpCode, HttpStatus, Inject, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthenticateUserUsecase } from "@src/application/in/usecase/AuthenticateUserUsecase";
import { Converter } from "@src/shared/adapter/Converter";
import { AuthenticateParam } from "../../param/AuthenticateParam";
import { AuthenticateDTO } from "@src/application/in/dto/AuthenticateDTO";
import { AuthenticateResultDTO } from "@src/application/in/dto/AuthenticateResultDTO";
import { LogoutUserUsecase } from "@src/application/in/usecase/LogoutUserUsecase";
import { LogoutParam } from "../../param/LogoutParam";
import { RefreshAccessTokenUsecase } from "@src/application/in/usecase/RefreshAccessTokenUsecase";
import { RefreshTokenParam } from "../../param/RefreshTokenParam";
import { LogoutDTO } from "@src/application/in/dto/LogoutDTO";

/**
 * 認証APIコントローラ
 * - ユーザーのログイン処理を提供する
 * @author Fullness,Inc.
 * @date 2025-03-27
 * @version 1.0.0
 */
@ApiTags('認証')
@Controller('auth')
export class AuthenticateController {
    /**
     * コンストラクタ
     * @param authenticateUserUsecase 認証ユースケース
     * @param logoutUserUsecase ログアウトユースケース
     * @param refreshAccessTokenUsecase リフレッシュトークンからアクセストークンを再発行するユースケース
     * @param paramConverter AuthenticateParamをAuthenticateDTOに変換 
     */
    constructor(
        @Inject('AuthenticateUserUsecase')
        private readonly authenticateUserUsecase: AuthenticateUserUsecase,
        @Inject('LogoutUserUsecase')
        private readonly logoutUserUsecase: LogoutUserUsecase, 
        @Inject('RefreshAccessTokenUsecase') 
        private readonly refreshAccessTokenUsecase: RefreshAccessTokenUsecase,
        @Inject('AuthenticateParamConverter')
        private readonly paramConverter: Converter<AuthenticateParam, AuthenticateDTO>,
        @Inject('LogoutParamConverter')
        private readonly logoutParamConverter: Converter<LogoutParam, LogoutDTO>,
    ) {}

    /**
     * ログイン処理
     * @param param クライアントから送信されたログインパラメータ
     * @returns アクセストークン
     */
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @UsePipes(new ValidationPipe({ transform: true }))
    @ApiOperation({ summary: 'ユーザーログイン（JWTトークンを取得）' })
    @ApiBody({ type: AuthenticateParam })
    @ApiResponse({
        status: 200,
        description: '認証成功。アクセストークンとリフレッシュトークンを返却します。',
        schema: {
            example: {
                access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                refresh_token: '93d3f768-1d1e-4760-94a6-abc123456789'
            }
        }
    })
    async login(@Body() param: AuthenticateParam): Promise<AuthenticateResultDTO> {
        const dto = await this.paramConverter.convert(param);
        return await this.authenticateUserUsecase.authenticate(dto);
    }

    @Post('logout')
    @HttpCode(HttpStatus.NO_CONTENT)
    @UsePipes(new ValidationPipe({ transform: true }))
    @ApiOperation({ summary: 'ユーザーログアウト（リフレッシュトークン無効化）' })
    @ApiBody({ type: LogoutParam })
    @ApiResponse({ status: 204, description: 'ログアウト成功。リフレッシュトークンを無効化しました。' })
    @ApiResponse({ status: 404, description: 'リフレッシュトークンが存在しない場合のエラー。' })
    @ApiResponse({ status: 500, description: 'サーバー内部エラー。' })
    async logout(@Body() param: LogoutParam): Promise<void> {
        const dto = await this.logoutParamConverter.convert(param);
        await this.logoutUserUsecase.logout(dto);
    }

    /**
     * アクセストークン再発行（リフレッシュトークン使用）
     */
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    @UsePipes(new ValidationPipe({ transform: true }))
    @ApiOperation({ summary: 'アクセストークン再発行', description: 'リフレッシュトークンを用いて新しいアクセストークンを取得します。' })
    @ApiBody({ type: RefreshTokenParam })
    @ApiResponse({
        status: 200,
        description: 'アクセストークン再発行成功',
        schema: {
            example: {
                access_token: 'new.jwt.access.token'
            }
        }
    })
    async refresh(@Body() param: RefreshTokenParam): Promise<{ access_token: string }> {
        const newToken = await this.refreshAccessTokenUsecase.refresh(param.refresh_token);
        return { access_token: newToken };
    }
}