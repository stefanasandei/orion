import { decodeBase64, encodeBase64 } from "@oslojs/encoding";
import { createTOTPKeyURI, verifyTOTPWithGracePeriod } from "@oslojs/otp";

export interface TwoFAUtilsProvider {
    encodeBase64: (s: Uint8Array) => string;
    decodeBase64: (s: string) => Uint8Array;

    // returns the uri with the secret embedded, needed for the user to setup their 2fa app 
    createTOTPKeyURI: (issuer: string, account_id: string, user_secret_key: Uint8Array,
        interval_in_seconds: number, digits_num: number) => string;

    // checks if the provided code is correct given the user's secret key and the current timestamp
    verifyTOTPWithGracePeriod: (user_secret_key: Uint8Array, code: string,
        interval_in_seconds: number, digits_num: number, grace_period_in_seconds: number) => boolean
}

export class OsloTwoFAUtilsProvider implements TwoFAUtilsProvider {
    encodeBase64(s: Uint8Array) {
        return encodeBase64(s);
    }

    decodeBase64(s: string) {
        return decodeBase64(s);
    }

    createTOTPKeyURI(issuer: string, account_id: string, user_secret_key: Uint8Array,
        interval_in_seconds: number, digits_num: number) {
        return createTOTPKeyURI(issuer, account_id, user_secret_key, interval_in_seconds, digits_num);
    }

    verifyTOTPWithGracePeriod(user_secret_key: Uint8Array, code: string,
        interval_in_seconds: number, digits_num: number, grace_period_in_seconds: number) {
        return verifyTOTPWithGracePeriod(user_secret_key, interval_in_seconds, digits_num, code, grace_period_in_seconds);
    }
}
