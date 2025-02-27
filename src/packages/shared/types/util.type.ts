// Record Utils
export type Values<TRecord extends Record<any, unknown>> = TRecord[keyof TRecord];

// Method Utils
export type Callback = (...args: unknown[]) => void;

// Class Utils
export type Constructor<T> = new (...args: any[]) => T;
