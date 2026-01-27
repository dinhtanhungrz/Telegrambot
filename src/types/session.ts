import { Context, SessionFlavor } from 'grammy';

export interface SessionData {
    step: 'IDLE' | 'SELECT_COUNTRY' | 'SELECT_ACTION' | 'INPUT_AMOUNT' | 'CONFIRM';
    draft: { 
        countryCode?: 'vn' | 'us';
        action?: 'BUY' | 'SELL';
        amount?: number;
        finalData?: any;
    };
}

export type MyContext = Context & SessionFlavor<SessionData>;

export const INITIAL_SESSION: SessionData = {
    step: 'IDLE',
    draft: {}
};