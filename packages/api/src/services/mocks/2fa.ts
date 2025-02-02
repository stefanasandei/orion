import { TimeBasedTwoFactorAuth } from "../2fa";
import { TwoFAUtilsProvider } from "../2fa_utils";

class Mock2FAUtilsProvider implements TwoFAUtilsProvider {
    encodeBase64(_: Uint8Array) {
        return "sample string";
    }

    decodeBase64(_: string) {
        return new Uint8Array(12);
    }

    createTOTPKeyURI(issuer: string, account_id: string, user_secret_key: Uint8Array,
        _: number, _1: number) {
        return `otpauth://totp/${issuer}:${account_id}?secret=${user_secret_key}&issuer=${issuer}`;
    }

    verifyTOTPWithGracePeriod(_: Uint8Array, _1: string,
        _2: number, _3: number, _4: number) {
        return true;
    }
}

export const mockTotpService = new TimeBasedTwoFactorAuth("MockIssuer", new Mock2FAUtilsProvider());
