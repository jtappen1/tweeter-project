"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    _firstName;
    _lastName;
    _alias;
    _imageUrl;
    constructor(firstName, lastName, alias, imageUrl) {
        this._firstName = firstName;
        this._lastName = lastName;
        this._alias = alias;
        this._imageUrl = imageUrl;
    }
    get firstName() {
        return this._firstName;
    }
    set firstName(value) {
        this._firstName = value;
    }
    get lastName() {
        return this._lastName;
    }
    set lastName(value) {
        this._lastName = value;
    }
    get name() {
        return `${this.firstName} ${this.lastName}`;
    }
    get alias() {
        return this._alias;
    }
    set alias(value) {
        this._alias = value;
    }
    get imageUrl() {
        return this._imageUrl;
    }
    set imageUrl(value) {
        this._imageUrl = value;
    }
    equals(other) {
        return this._alias === other._alias;
    }
    static fromJsonString(json) {
        return json ? this.fromDto(JSON.parse(json)) : null;
    }
    static fromDto(dto) {
        return dto ? new User(dto.firstName, dto.lastName, dto.alias, dto.imageUrl) : null;
    }
    get dto() {
        return {
            firstName: this.firstName,
            lastName: this.lastName,
            alias: this.alias,
            imageUrl: this.imageUrl
        };
    }
    static fromJson(json) {
        if (!!json) {
            let jsonObject = JSON.parse(json);
            return new User(jsonObject._firstName, jsonObject._lastName, jsonObject._alias, jsonObject._imageUrl);
        }
        else {
            return null;
        }
    }
    toJson() {
        return JSON.stringify(this.dto);
    }
}
exports.User = User;
