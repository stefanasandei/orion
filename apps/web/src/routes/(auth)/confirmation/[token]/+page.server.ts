import { createCaller } from '@repo/api';
import type { PageServerLoad } from './$types';
import type { CtxRequestEvent } from '@repo/core';

export const load: PageServerLoad = async (event) => {
    const token = event.params.token;

    const caller = createCaller({ event: event as CtxRequestEvent });
    const response = await caller.user.confirmEmail({ token });

    return {
        success: response !== false
    };
};
