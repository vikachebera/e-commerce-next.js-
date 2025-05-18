export type FormState = {
    errors?: {
        name?: string[],
        email?: string[],
        password?: string[],
    }
    success?: boolean;
}