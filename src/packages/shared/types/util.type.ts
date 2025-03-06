// Record Utils
export type Values<TRecord extends Record<any, unknown>> = TRecord[keyof TRecord];

// Method Utils
export type Callback<Args = any, Return = any> = (...args: Args[]) => Return;

// Class Utils
export type Constructor<T> = new (...args: any[]) => T;
