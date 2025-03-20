import {    registerDecorator, 
            ValidationArguments, 
            ValidationOptions } from "class-validator";
/**
 * 数値検証のカスタムデコレーター
 * @param validationOptions バリデーションオプション（エラーメッセージなどを設定可能）
 * @author Fullness,Inc.
 * @date 2025-03-20
 * @version 1.0.0
 */
export function IsNumberCustom(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "IsNumberCustom",
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: {
                validate(value: any) {
                    return typeof value === "number" && !isNaN(value);
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property}は数値である必要があります。`;
                },
            },
        });
    };
}