import { Inject, Injectable, Logger } from "@nestjs/common";
import { RegisterUserUsecase } from "../usecase/RegisterUserUsecase";
import { UserDTO } from "../dto/UserDTO";
import { InjectEntityManager } from "@nestjs/typeorm";
import { EntityManager } from "typeorm";
import { Restorer } from "@src/shared/adapter/Restorer";
import { User } from "@src/application/domain/model/user/User";
import { UserRepository } from "@src/application/out/repository/UserRepository";
import { RoleRepository } from "@src/application/out/repository/RoleRepository";
import { Username } from "@src/application/domain/model/user/Username";
import { ExistsException } from "@src/shared/exceptions/ExistsException";
import { Email } from "@src/application/domain/model/user/Email";
import { RoleName } from "@src/application/domain/model/role/RoleName";
import { NotFoundException } from "@src/shared/exceptions/NotFoundException";
import { InternalException } from "@src/shared/exceptions/InternalException";

/**
 * RegisterUserUsecaseインターフェイスの実装
 * - ユーザーの存在チェック、ロール確認、永続化を担う
 * @author Fullness,Inc.
 * @date 2025-03-23
 * @version 1.0.0
 */
@Injectable()
export class RegisterUserInteractor implements RegisterUserUsecase {
    private readonly logger = new Logger('RegisterUserInteractor');

    /**
     * コンストラクタ
     * @param manager TypeORMのEntityManager
     * @param userRestorer UserDTOからUserエンティティを復元
     * @param userRepository UserRepositoryインターフェイス
     * @param roleRepository RoleRepositoryインターフェイス
     */
    constructor(
        @InjectEntityManager()
        private readonly entityManager: EntityManager,
        @Inject('UserDTORestorer')
        private readonly userRestorer: Restorer<UserDTO, User>,
        @Inject('UserRepository')
        private readonly userRepository: UserRepository<EntityManager>,
        @Inject('RoleRepository')
        private readonly roleRepository: RoleRepository<EntityManager>){}
    
    /**
     * ユーザーを新規登録する
     * @param dto UserDTO（入力データ）
     * @throws ExistsException ユーザー名またはメールアドレスが既に存在する
     * @throws NotFoundException 指定されたロールが存在しない
     * @throws InternalException その他内部エラー
     */
    async register(dto: UserDTO): Promise<void> {
        await this.entityManager.transaction(async (manager) => {  
            try{
                // ユーザー名とメールアドレスの重複チェック
                await this.checkUserConflicts(dto, manager);
                // 指定されたロールが存在するかを検証する
                await this.verifyRolesExist(dto, manager);
                // UserDTOからUserエンティティを復元
                const user: User = await this.userRestorer.restore(dto);
                // ユーザーを永続化する
                await this.userRepository.create(user, manager);
            }catch(error){
                if (error instanceof ExistsException || error instanceof NotFoundException) {
                    throw error;
                }
                this.logger.error(`ユーザー登録失敗: ${error}`, (error as Error).stack);
                throw new InternalException(`ユーザーの登録処理中に予期せぬエラーが発生しました。`);
            }
        });
    }

    /**
     * ユーザー名とメールアドレスの重複チェック
     * @param dto UserDTO
     * @param manager TypeORMのEntityManager
     */
    private async checkUserConflicts(dto: UserDTO, manager: EntityManager): Promise<void> {
        const username = Username.fromString(dto.username);
        if (await this.userRepository.existsByUsername(username, manager)) {
            throw new ExistsException(`ユーザー名「${dto.username}」は既に存在しています。`);
        }

        const email = Email.fromString(dto.email);
        if (await this.userRepository.existsByEmail(email, manager)) {
            throw new ExistsException(`メールアドレス「${dto.email}」は既に使用されています。`);
        }
    }

    /**
     * 指定されたロールが存在するかを検証する
     * @param dto UserDTO
     * @param manager TypeORMのEntityManager
     */
    private async verifyRolesExist(dto: UserDTO, manager: EntityManager): Promise<void> {
        if (!dto.roles) return;
        for (const role of dto.roles) {
            const roleName = RoleName.fromString(role.name);
            const exists = await this.roleRepository.exists(roleName, manager);
            if (!exists) {
                throw new NotFoundException(`ロール「${role.name}」は存在しません。`);
            }
        }
    }
}