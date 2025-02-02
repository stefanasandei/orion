import { SUPPORT_EMAIL } from "../constants";
import { Resend } from "resend";

export interface EmailService {
    send: (to: string[], subject: string, html: string) => Promise<boolean>;
}

export class ResendEmailService implements EmailService {
    resend: Resend

    constructor() {
        this.resend = new Resend(process.env["RESEND_API_KEY"]);
    }

    async send(to: string[], subject: string, html: string) {
        const response = await this.resend.emails.send({
            from: SUPPORT_EMAIL,
            to: to,
            subject: subject,
            html: html
        });

        return response.error !== null;
    }
}

export const resendService = new ResendEmailService();