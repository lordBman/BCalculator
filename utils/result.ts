class Result<T>{
    value?: T;
    message?: string;

    constructor(value?: T, message?: string){
        this.value = value;
        this.message = message;
    }

    isError = (): boolean => this.message !== undefined || this.value === undefined;
    unwrap = (): T | undefined => this.value;

    getMessage(){ return this.message; }

    public static Ok<T>(value: T): Result<T>{
        return new Result<T>(value);
    }

    public static Error<T>(message: string): Result<T>{
        return new Result<T>(undefined, message);
    }
}

export default Result