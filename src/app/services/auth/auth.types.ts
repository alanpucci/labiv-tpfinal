export enum ERROR{
    INVALID_EMAIL='auth/invalid-email',
    EMAIL_ALREADY_IN_USE='auth/email-already-in-use',
    WEAK_PASSWORD='auth/weak-password',
    USER_NOT_FOUND='auth/user-not-found',
    WRONG_PASSWORD='auth/wrong-password',
    EMPTY_FIELDS='empty-fields',
    DIFFERENT_PASSWORDS='different-passwords',
    PENDING_USER="pending-user",
    INACTIVE_USER="inactive-user"
}

export enum SUCCESS{
    SIGNED_UP="signed-up"
}