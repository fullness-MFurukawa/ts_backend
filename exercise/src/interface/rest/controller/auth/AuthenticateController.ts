import { Body, Controller, HttpCode, HttpStatus, Inject, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthenticateUserUsecase } from "@src/application/in/usecase/AuthenticateUserUsecase";
import { Converter } from "@src/shared/adapter/Converter";
import { AuthenticateParam } from "../../param/AuthenticateParam";
import { AuthenticateDTO } from "@src/application/in/dto/AuthenticateDTO";
import { AuthenticateResultDTO } from "@src/application/in/dto/AuthenticateResultDTO";

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
     * @param paramConverter AuthenticateParamをAuthenticateDTOに変換 
     */
    constructor(
        @Inject('AuthenticateUserUsecase')
        private readonly authenticateUserUsecase: AuthenticateUserUsecase,
        @Inject('AuthenticateParamConverter')
        private readonly paramConverter: Converter<AuthenticateParam, AuthenticateDTO>,
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
}