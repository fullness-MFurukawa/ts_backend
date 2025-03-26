import { Controller, Get, Inject } from "@nestjs/common";
import { RoleDTO } from "@src/application/in/dto/RoleDTO";
import { RegisterUserUsecase } from "@src/application/in/usecase/RegisterUserUsecase";

@Controller('users/register')
export class RegisterUserController {
    constructor(
        @Inject('RegisterUserUsecase')
        private readonly registerUserUsecase: RegisterUserUsecase) {}
    
    /**
     * 使用可能なロールを提供する
     * @returns 
     */
    @Get('roles')
    async getAvailableRoles(): Promise<RoleDTO[]> {
        return await this.registerUserUsecase.fetchRoles();
    }
}