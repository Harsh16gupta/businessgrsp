export class AppError extends Error {
    constructor(
        public message: string,
        public statusCode: number = 500,
        public code?: string
    ) {
        super(message)
        this.name = 'AppError'
    }
}

export class ValidationError extends AppError {
    constructor(message: string) {
        super(message, 400, "VALIDATION_ERROR")
    }
}


export class NotFoundError extends AppError {
    constructor(resource: string) {
        super(`${resource} NOT_FOUND`, 404, 'NOT_FOUND ERROR')
    }
}


export class AuthenticationError extends AppError {
    constructor(message: string = 'Authentication required') {
        super(message, 401, 'AUTH_ERROR')
    }
}