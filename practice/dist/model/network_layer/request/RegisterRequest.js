"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterRequest = void 0;
class RegisterRequest {
    _firstName;
    _lastName;
    _alias;
    _password;
    _userImageBytes;
    constructor(firstName, lastName, alias, password, userImageBytes) {
        this._firstName = firstName;
        this._lastName = lastName;
        this._alias = alias;
        this._password = password;
        this._userImageBytes = userImageBytes;
    }
    // Getter for _firstName
    get firstName() {
        return this._firstName;
    }
    // Getter for _lastName
    get lastName() {
        return this._lastName;
    }
    // Getter for _alias
    get alias() {
        return this._alias;
    }
    // Getter for _password
    get password() {
        return this._password;
    }
    // Getter for _userImageBytes
    get userImageBytes() {
        return this._userImageBytes;
    }
}
exports.RegisterRequest = RegisterRequest;
