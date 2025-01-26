import process from "process";

export const validateRecaptcha = async (recaptchaResponse?: string): Promise<boolean> => {
    if (!recaptchaResponse) {
        return false;
    }

    const RECAPTCHA_SECRET_KEY = process.env["RECAPTCHA_SECRET_KEY"];

    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `secret=${RECAPTCHA_SECRET_KEY}&response=${recaptchaResponse}`
    });

    const data = (await response.json()) as { success: boolean };
    return data.success;
}
