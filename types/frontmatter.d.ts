declare module '*.md' {
    import type { FC } from 'react';
  
    export const attributes: {
      [key: string]: any;
    };
  
    export const react: FC;
  }
  