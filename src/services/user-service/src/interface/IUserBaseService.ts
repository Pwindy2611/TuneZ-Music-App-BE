export interface IUserBaseService<TInput, TResult> {
    execute(input: TInput): Promise<TResult>;
}

