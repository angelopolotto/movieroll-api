export interface ITokenPlayload {
    user_id: string;
    language: string;
    region: string;
    role: string;
}

export const TokenPayload = (tokenPlayload: ITokenPlayload) => {
    return tokenPlayload;
};