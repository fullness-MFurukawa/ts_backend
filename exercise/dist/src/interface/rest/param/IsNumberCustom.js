"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsNumberCustom = IsNumberCustom;
const class_validator_1 = require("class-validator");
/**
 * 数値検証のカスタムデコレーター
 * @param validationOptions バリデーションオプション（エラーメッセージなどを設定可能）
 * @author Fullness,Inc.
 * @date 2025-03-20
 * @version 1.0.0
 */
function IsNumberCustom(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: "IsNumberCustom",
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: {
                validate(value) {
                    return typeof value === "number" && !isNaN(value);
                },
                defaultMessage(args) {
                    return `${args.property}は数値である必要があります。`;
                },
            },
        });
    };
}
