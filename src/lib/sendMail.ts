import OTPLoginEmail from '@/components/email/OTPLoginEmail'
import RecoverAccountEmail from '@/components/email/RecoverAccountEmail'
import { environments } from '@/constants/environments'
import { render } from '@react-email/render'
import nodeMailer from 'nodemailer'

// SEND MAIL CORE
const transporter = nodeMailer.createTransport({
  service: 'gmail',
  secure: true,
  auth: {
    user: environments.NEXT_PUBLIC_MAIL,
    pass: environments.MAIL_APP_PASSWORD,
  },
})

export async function sendMail(
  to: string | string[],
  subject: string,
  html: string
) {
  console.log('- Send Mail -')

  await transporter.sendMail({
    from: 'CookMate <no-reply@cookm8.vercel.app>',
    to: to,
    subject: subject,
    html: html,
  })
}

// Email OTP Login
export async function sendEmailOTPLogin(email: string, otp: string) {
  console.log('- Send Email OTP Login -')

  try {
    const html = await render(OTPLoginEmail({ otp }))
    await sendMail(email, 'OTP Login', html)
  } catch (error) {
    console.log('Email OTP Login error:', error)
  }
}

// Recover Account Email
export async function sendRecoverAccountEmail(
  email: string,
  name: string,
  otp: string
) {
  console.log('- Send Recovery Account Email -')

  try {
    const html = await render(RecoverAccountEmail({ name, otp }))
    await sendMail(email, 'Recover account', html)
  } catch (error) {
    console.log('Recover account email error:', error)
  }
}
