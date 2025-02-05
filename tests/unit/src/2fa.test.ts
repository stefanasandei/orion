import { expect, test } from 'vitest'
import { mockTotpService } from "@repo/api/services";

test('secret generation', async () => {
    const secret = await mockTotpService.generateSecret();
    const SECRET_BASE64_LENGTH = 28;
    expect(secret).toHaveLength(SECRET_BASE64_LENGTH)

    expect(() =>
        mockTotpService.twoFAUtils.decodeBase64(secret)
    ).not.toThrow();
})

test('valid totp uri', async () => {
    const secret = await mockTotpService.generateSecret();
    const user_uri = mockTotpService.createKeyURI("sample_account", secret);

    const URI_REGEX = /otpauth:\/\/([ht]otp)\/(?:[a-zA-Z0-9%]+:)?([^\?]+)\?secret=([0-9A-Za-z]+)(?:.*(?:<?counter=)([0-9]+))?/;
    expect(user_uri.uri).toMatch(URI_REGEX);

    const SVG_REGEX = /<svg\b[^>]*>(.*?)<\/svg>/;
    expect(user_uri.qr_svg).toMatch(SVG_REGEX);
})

test('validates otp', async () => {
    const secret = await mockTotpService.generateSecret();

    const INVALID_CODE = "123123";
    const invalid_result = mockTotpService.verifyCode(INVALID_CODE, secret);
    expect(invalid_result).not.toBeTruthy();

    const VALID_CODE = "000000";
    const valid_result = mockTotpService.verifyCode(VALID_CODE, secret);
    expect(valid_result).toBeTruthy();
})
