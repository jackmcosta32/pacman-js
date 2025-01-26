export type Keys<TRecord extends Record<any, unknown>> = TRecord[keyof TRecord];
