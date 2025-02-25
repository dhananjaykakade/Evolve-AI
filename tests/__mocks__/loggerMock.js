export const info = jest.fn();
export const warn = jest.fn();
export const error = jest.fn();
export const httpLogger = (req, res, next) => {
    next(); // No-op middleware
  };

 // 👈 Mock middleware
