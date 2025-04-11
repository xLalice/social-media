import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '@/configs/jwt';

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {   
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Access token required' });
      return;
    }
    
    const token = authHeader.split(' ')[1];
    if (!token) {
      res.status(401).json({ message: 'Token missing after Bearer' });
      return;
    }
    
    const decoded = verifyAccessToken(token);
    
    (req as any).userId = decoded.sub;
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};