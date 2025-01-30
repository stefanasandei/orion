import { decodeBase64, encodeBase64 } from "@oslojs/encoding";
import { createTOTPKeyURI, verifyTOTPWithGracePeriod } from "@oslojs/otp";
import { renderSVG } from "uqr";

export interface TwoFactorAuth {
    // returns a base64 encoded secret key, to be stored for a user
    generateSecret(): Promise<string>;

    // account - identifier for the user account
    // key - the secret key of the user
    // returns a totp uri, to be scanned by the user in a 2fa app
    createKeyURI(account: string, key: string): { uri: string, qr_svg: string };

    // code - the digits entered by the user
    // userTOTPKey - the secret key stored associated with the user
    verifyCode(code: string, userTOTPKey: string): boolean;
}

export class TimeBasedTwoFactorAuth implements TwoFactorAuth {
    issuer: string;
    intervalInSeconds: number = 30;
    gracePeriodInSeconds: number = 30;
    digits: number = 6;

    constructor(issuer: string) {
        this.issuer = issuer;
    }

    async generateSecret(): Promise<string> {
        const secret = new Uint8Array(20);
        crypto.getRandomValues(secret);
        return encodeBase64(secret);
    }

    createKeyURI(account: string, key: string): { uri: string, qr_svg: string } {
        const keyArray = decodeBase64(key);

        const uri = createTOTPKeyURI(this.issuer, account, keyArray, this.intervalInSeconds, this.digits);

        const qrcode = renderSVG(uri);

        return { uri, qr_svg: qrcode };
    }

    verifyCode(code: string, userTOTPKey: string): boolean {
        try {
            const keyArray = decodeBase64(userTOTPKey);

            const valid = verifyTOTPWithGracePeriod(keyArray, this.intervalInSeconds, this.digits, code, this.gracePeriodInSeconds);

            return valid;
        } catch (e) {
            console.log(e);
            return false;
        }
    }
}

const ISSUER = "Orion";

export const totpService: TwoFactorAuth = new TimeBasedTwoFactorAuth(ISSUER);
