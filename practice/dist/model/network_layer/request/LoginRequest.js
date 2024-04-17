"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginRequest = void 0;
class LoginRequest {
    _alias;
    _password;
    constructor(alias, password) {
        this._alias = alias;
        this._password = password;
    }
    get alias() {
        return this._alias;
    }
    get password() {
        return this._password;
    }
}
exports.LoginRequest = LoginRequest;
