import  { Resend } from 'resend';

const resend = new Resend(process.env.AUTH_RESEND_KEY);

export const sendEmailVerification = async (email: string, token: string) => {
    console.log("Sending email to " + email);
    try{
        await resend.emails.send({
            from: "HemoPress <onboarding@resend.dev>",
            to: email,
            subject: "Verify your email",
            html: `
            <p>Click the link below to verify your email</p>
            <a href="${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}&email=${email}">Verify Email</a>
            `,
        });

        return {
            success: true,
        }

    }catch (error) {
        console.log("Error sending email" + error);
        return {
            error: true
        }
    }

}