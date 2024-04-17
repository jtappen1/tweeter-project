import { UserDto } from "../dto/UserDTO";
export declare class User {
    private _firstName;
    private _lastName;
    private _alias;
    private _imageUrl;
    constructor(firstName: string, lastName: string, alias: string, imageUrl: string);
    get firstName(): string;
    set firstName(value: string);
    get lastName(): string;
    set lastName(value: string);
    get name(): string;
    get alias(): string;
    set alias(value: string);
    get imageUrl(): string;
    set imageUrl(value: string);
    equals(other: User): boolean;
    static fromJsonString(json: string | null | undefined): User | null;
    static fromDto(dto: UserDto | null | undefined): User | null;
    get dto(): UserDto;
    static fromJson(json: string | null | undefined): User | null;
    toJson(): string;
}
