import { TimeBasedTwoFactorAuth } from "../2fa";
import { TwoFAUtilsProvider } from "../2fa_utils";

class Mock2FAUtilsProvider implements TwoFAUtilsProvider {
    encodeBase64(s: Uint8Array) {
        return Buffer.from(s).toString('base64');
    }

    decodeBase64(s: string) {
        return new Uint8Array(Buffer.from(s, 'base64'));
    }

    createTOTPKeyURI(
        issuer: string,
        account_id: string,
        user_secret_key: Uint8Array,
        interval_in_seconds: number,
        digits_num: number
    ): string {
        issuer = encodeURIComponent(issuer);
        account_id = encodeURIComponent(account_id);

        const secret = this.encodeBase64(user_secret_key);
        return `otpauth://totp/${issuer}:${account_id}?secret=${secret}&issuer=${issuer}&period=${interval_in_seconds}&digits=${digits_num}`;
    }

    verifyTOTPWithGracePeriod(
        _user_secret_key: Uint8Array,
        code: string,
        _interval_in_seconds: number,
        _digits_num: number,
        _grace_period_in_seconds: number
    ): boolean {
        return code === "000000";
    }
}

export const mockTotpService = new TimeBasedTwoFactorAuth("MockIssuer", new Mock2FAUtilsProvider());
