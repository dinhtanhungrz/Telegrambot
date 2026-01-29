import { Context, SessionFlavor } from 'grammy';

export interface SessionData {
    step: 'IDLE' | 'SELECT_COUNTRY' | 'SELECT_ACTION' | 'INPUT_AMOUNT' | 'CONFIRM';
    lang: string; // Lưu ngôn ngữ
    draft: { 
        countryCode?: 'vn' | 'us';
        action?: 'BUY' | 'SELL';
        amount?: number;
        finalData?: any;
    };
}


export type MyContext = Context & SessionFlavor<SessionData> & {
    t: (key: string, params?: Record<string, string | number>) => string;
    i18n: {
        getLocale: () => string;
        setLocale: (lang: string) => void;
    };
};

export const INITIAL_SESSION: SessionData = {
    step: 'IDLE',
    lang: 'en',
    draft: {}
};