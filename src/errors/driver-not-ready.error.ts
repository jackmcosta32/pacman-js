export interface TDriverNotReadyErrorConstructor {
  driverName: string;
}

export class DriverNotReadyError extends Error {
  constructor({ driverName }: TDriverNotReadyErrorConstructor) {
    super(
      `The ${driverName} is not ready to be used. Please ensure that it was properly initialized before using it.`
    );
  }
}
