import { Body, Column, Container, Row, Section } from '@react-email/components'

function RecoverAccountEmail({
  name = 'Alexander Pi Pi',
  otp = '123456',
}: {
  name?: string
  otp?: string
}) {
  return (
    <Body
      style={{
        color: '#000',
        background: '#fff',
        fontFamily: 'Arial, Helvetica, sans-serif',
        margin: 0,
        padding: 0,
      }}
    >
      <Container
        style={{
          background: '#fff',
          padding: 24,
          paddingBottom: 36,
          maxWidth: 600,
          border: '1px solid #000',
        }}
      >
        <Section style={{ textAlign: 'center', marginBottom: 12 }}>
          <Row>
            <Column>
              <span
                style={{
                  fontWeight: 'bold',
                  fontSize: 28,
                  letterSpacing: 1,
                  color: '#000',
                  textDecoration: 'none',
                }}
              >
                CookMate
              </span>
            </Column>
          </Row>
        </Section>

        <div
          style={{
            borderTop: '1px solid #000',
            margin: '18px 0',
          }}
        />

        <Section style={{ paddingLeft: 16, paddingRight: 16 }}>
          <p style={{ margin: '16px 0 12px 0' }}>Hi {name},</p>
          <p style={{ margin: '12px 0' }}>
            You have requested to verify your email at{' '}
            <b>&quot;CookMate&quot;</b> on{' '}
            {new Intl.DateTimeFormat('en', {
              dateStyle: 'full',
              timeStyle: 'medium',
              timeZone: 'Asia/Ho_Chi_Minh',
            }).format(new Date())}
            .
          </p>
          <p style={{ margin: '12px 0' }}>
            If this wasn&apos;t you, please ignore this email.
          </p>
          <p style={{ margin: '12px 0' }}>
            Otherwise, if this was you, please use the 6-digit code below to
            verify your email:
          </p>

          {/* OTP Code */}
          <div style={{ padding: 12, textAlign: 'center' }}>
            <span
              style={{
                background: '#000',
                color: '#fff',
                borderRadius: 4,
                padding: '14px 28px',
                fontWeight: 700,
                fontSize: 28,
                display: 'inline-block',
                fontFamily: 'monospace',
                marginTop: 8,
                marginBottom: 8,
                letterSpacing: 10,
              }}
            >
              {otp}
            </span>
          </div>

          <p
            style={{
              margin: '12px 0',
              textAlign: 'center',
              fontSize: 14,
              color: '#888',
            }}
          >
            This code will expire in 10 minutes.
          </p>

          <p style={{ margin: '12px 0' }}>
            To keep your account safe, do not share this code or this email with
            anyone.
          </p>
          <p style={{ margin: '12px 0' }}>
            If you have any questions, please contact CookMate for quick and
            friendly support:{' '}
            <a
              href="https://www.messenger.com/t/170660996137305"
              style={{ color: '#000', textDecoration: 'underline' }}
            >
              Contact Us
            </a>
          </p>
          <p style={{ margin: '12px 0' }}>
            Thank you,
            <br />
            CookMate
          </p>
        </Section>

        {/* Footer */}
        <div style={{ textAlign: 'center', paddingTop: 32 }}>
          <span style={{ fontSize: 12, color: '#444' }}>
            © 2025 | CookMate - Developed by CookMate team, All rights
            reserved.
          </span>
        </div>
        <div style={{ textAlign: 'center', marginTop: 12 }}>
          <a
            href="https://www.messenger.com/t/170660996137305"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-block',
              color: '#000',
              textDecoration: 'underline',
              fontSize: 14,
              marginLeft: 0,
            }}
          >
            Message us on Messenger
          </a>
        </div>
      </Container>
    </Body>
  )
}

export default RecoverAccountEmail
