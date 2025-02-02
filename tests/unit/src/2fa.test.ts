import { beforeAll, expect, test } from 'vitest'
import { mockTotpService } from "@repo/api";

test('generates a secret', async () => {
    const secret = await mockTotpService.generateSecret();
    // console.log(secret.length) TODO
    expect(secret).toHaveLength(20)
})

