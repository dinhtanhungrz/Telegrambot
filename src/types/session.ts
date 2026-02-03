import { Context, SessionFlavor } from "grammy";

export enum Step {
    IDLE = 'IDLE',
    SELECT_COUNTRY = 'SELECT_COUNTRY',
    SELECT_AREA = 'SELECT_AREA',
    SELECT_COIN = 'SELECT_COIN',
    SELECT_ACTION = 'SELECT_ACTION',
    INPUT_AMOUNT = 'INPUT_AMOUNT', // Bước này giờ sẽ vừa hiện nút vừa cho nhập tay
    SELECT_METHOD = 'SELECT_METHOD',
    INPUT_CASH_INFO = 'INPUT_CASH_INFO',
    INPUT_PHONE = 'INPUT_PHONE',   // 👈 Mới thêm: Form nhập SĐT
    REVIEW = 'REVIEW'
}

export interface OrderDraft {
    countryId?: string;
    areaId?: string;
    coin?: string;
    action?: 'BUY' | 'SELL';
    amount?: number;
    method?: 'CASH' | 'BANK';
    zipCode?: string;
    contactPhone?: string; // 👈 Mới thêm: Lưu SĐT khách
    finalResult?: any;
}

// ... (Các phần dưới giữ nguyên)
export interface SessionData { step: Step; lastMsgId?: number; draft: OrderDraft; }
export type MyContext = Context & SessionFlavor<SessionData>;
export const INITIAL_SESSION: SessionData = { step: Step.IDLE, draft: {} };