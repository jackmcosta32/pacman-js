// Record Utils
export type Values<TRecord extends Record<any, unknown>> = TRecord[keyof TRecord];

// Method Utils
export type Callback<Args = unknown[], Return = void> =
  Args extends Array<unknown> ? (...args: Args) => Return : (args: Args) => Return;

// Class Utils
export type Constructor<T> = new (...args: any[]) => T;
