class CustomError extends Error {
    userErrorTitle: string;
    userErrorMessage: string;

    constructor(message: string, userErrorTitle: string, userErrorMessage: string) {
        super(message);
        this.userErrorTitle = userErrorTitle;
        this.userErrorMessage = userErrorMessage;

        Object.setPrototypeOf(this, CustomError.prototype);
    }
}

export default CustomError;