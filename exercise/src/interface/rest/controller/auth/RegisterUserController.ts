import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { RoleDTO } from "@src/application/in/dto/RoleDTO";
import { RegisterUserUsecase } from "@src/application/in/usecase/RegisterUserUsecase";
import { Converter } from "@src/shared/adapter/Converter";
import { RegisterUserParam } from "../../param/RegisterUserParam";
import { UserDTO } from "@src/application/in/dto/UserDTO";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";


/**
 * ユーザー登録RESTAPIコントローラ
 * @author Fullness,Inc.
 * @date 2025-03-25
 * @version 1.0.0
 */
@ApiTags('ユーザー登録')
@Controller('users/register')
export class RegisterUserController {
    /**
     * コンストラクタ
     * @param registerUserUsecase ユーザー登録ユースケース
     * @param paramConverter RegisterUserParamをUserDTOへ変換 
     */
    constructor(
        @Inject('RegisterUserUsecase')
        private readonly registerUserUsecase: RegisterUserUsecase,
        @Inject('RegisterUserParamConverter')
        private readonly paramConverter: Converter<RegisterUserParam, UserDTO>,
    ) {}
    
    /**
     * 使用可能なロールを提供する
     * @returns 
     */
    @Get('roles')
    @ApiOperation({ summary: '利用可能なロール一覧の取得' })
    @ApiResponse({ status: 200, description: 'ロール一覧を取得しました。', type: [RoleDTO] })
    async getAvailableRoles(): Promise<RoleDTO[]> {
        return await this.registerUserUsecase.fetchRoles();
    }

    /**
     * ユーザーを登録する   
     * @param param RegisterUserParam
     */
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UsePipes(new ValidationPipe({ transform: true })) // class-transformer + validator対応
    @ApiOperation({ summary: 'ユーザー登録' })
    @ApiBody({ type: RegisterUserParam })
    @ApiResponse({ status: 201, description: 'ユーザーが正常に登録されました。' })
    async registerUser(@Body() param: RegisterUserParam): Promise<void> {
        const dto = await this.paramConverter.convert(param);
        await this.registerUserUsecase.register(dto);
    }
}