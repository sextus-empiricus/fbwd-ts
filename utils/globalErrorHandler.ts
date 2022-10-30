import { NextFunction, Response } from 'express';
import { CustomException } from '../exceptions/custom.exception';
import { RequestExtended } from '../types';

export const globalErrorHandler = (
   err: Error,
   req: RequestExtended,
   res: Response,
   next: NextFunction,
) => {
   res.status(err instanceof CustomException ? err.code : 500).json({
      title: err instanceof CustomException ? 'Exception' : 'Server Error',
      code: err instanceof CustomException ? err.code : 500,
      message: err instanceof CustomException ? err.message : 'Something went wrong.',
   });
};
