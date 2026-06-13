import { createContext } from 'react';

/** True when rendered inside the Puck editor canvas; false everywhere else (including export). */
export const BuilderModeContext = createContext(false);
