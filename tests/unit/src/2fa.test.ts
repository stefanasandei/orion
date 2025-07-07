import { expect, test, describe } from 'vitest';
import { TimeBasedTwoFactorAuth, totpService } from '@repo/api/services';

// Mock TwoFAUtilsProvider for deterministic tests
class MockTwoFAUtilsProvider {
    encodeBase64(arr: Uint8Array) {
        return Buffer.from(arr).toString('base64');
    }
    decodeBase64(str: string) {
        return Buffer.from(str, 'base64');
    }
    createTOTPKeyURI(issuer: string, account: string, key: Uint8Array, interval: number, digits: number) {
        return `otpauth://totp/${issuer}:${account}?secret=MOCKSECRET&issuer=${issuer}&period=${interval}&digits=${digits}`;
    }
    verifyTOTPWithGracePeriod(key: Uint8Array, code: string, interval: number, digits: number, grace: number) {
        // Accept only '000000' as valid for test
        return code === '000000';
    }
}

describe('TimeBasedTwoFactorAuth', () => {
    const issuer = 'TestIssuer';
    const twoFAUtils = new MockTwoFAUtilsProvider();
    const service = new TimeBasedTwoFactorAuth(issuer, twoFAUtils);

    test('generateSecret returns base64 string of correct length', async () => {
        const secret = await service.generateSecret();
        expect(typeof secret).toBe('string');
        expect(secret).toHaveLength(28); // 20 bytes base64
    });

    test('createKeyURI returns valid uri and svg', () => {
        const secret = Buffer.from('12345678901234567890').toString('base64');
        const { uri, qr_svg } = service.createKeyURI('user', secret);
        expect(uri).toContain('otpauth://totp/TestIssuer:user');
        expect(uri).toContain('secret=MOCKSECRET');
        expect(typeof qr_svg).toBe('string');
    });

    test('verifyCode returns true for valid code and false for invalid', () => {
        const secret = Buffer.from('12345678901234567890').toString('base64');
        expect(service.verifyCode('000000', secret)).toBe(true);
        expect(service.verifyCode('123456', secret)).toBe(false);
    });
});

describe('totpService (integration smoke)', () => {
    test('generateSecret returns a string', async () => {
        const secret = await totpService.generateSecret();
        expect(typeof secret).toBe('string');
    });
});
