import { OrderDraft } from "../types/session";
import { MARKETS } from "../config/markets";
import { Formatter } from "../utils/formatter";

export const FeeService = {
    calculate(draft: OrderDraft) {
        if (!draft.countryId || !draft.areaId || !draft.amount) return null;

        const market = MARKETS[draft.countryId];
        const area = market.areas[draft.areaId];
        
        const feePercent = draft.action === 'BUY' ? area.buyFee : area.sellFee;
        const feeAmount = draft.amount * (feePercent / 100);
        
        let total = draft.action === 'BUY' 
            ? draft.amount + feeAmount 
            : draft.amount - feeAmount;

        return {
            feePercent,
            feeAmount: Formatter.roundCoin(feeAmount),
            finalAmount: Formatter.roundCoin(total),
            currency: market.currency
        };
    }
};