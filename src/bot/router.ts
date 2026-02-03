import { Router } from "@grammyjs/router";
import { MyContext, Step } from "../types/session";
import { Handlers } from "./handlers";

export const router = new Router<MyContext>((ctx) => {
    return ctx.session?.step || Step.IDLE;
});

router.route(Step.SELECT_COUNTRY, Handlers.onSelectCountry);
router.route(Step.SELECT_AREA, Handlers.onSelectArea);
router.route(Step.SELECT_COIN, Handlers.onSelectCoin);
router.route(Step.SELECT_ACTION, Handlers.onSelectAction);
router.route(Step.INPUT_AMOUNT, Handlers.onInputAmount);
router.route(Step.SELECT_METHOD, Handlers.onSelectMethod);
router.route(Step.INPUT_CASH_INFO, Handlers.onInputCashInfo);
// 👇 Đăng ký bước mới
router.route(Step.INPUT_PHONE, Handlers.onInputPhone); 
router.route(Step.REVIEW, Handlers.onSubmit);