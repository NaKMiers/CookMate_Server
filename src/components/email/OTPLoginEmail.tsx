import { Body, Column, Container, Row, Section } from '@react-email/components'

function OTPLoginEmail({
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
            We received a request to log in to your CookMate account using this
            email address.
          </p>
          <p style={{ margin: '12px 0' }}>
            If you did not request this, please ignore this email or let us
            know.
          </p>
          <p style={{ margin: '12px 0' }}>
            If you did request to log in, please use the following 6-digit code
            to continue:
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
            For your security, never share this code or email with anyone.
          </p>
          <p style={{ margin: '12px 0' }}>
            If you have any questions or need help, please contact the CookMate
            team:{' '}
            <a
              href="https://www.messenger.com/t/170660996137305"
              style={{ color: '#000', textDecoration: 'underline' }}
            >
              Contact Us
            </a>
          </p>
          <p style={{ margin: '12px 0' }}>
            Happy cooking,
            <br />
            The CookMate Team
          </p>
        </Section>

        {/* Footer */}
        <div style={{ textAlign: 'center', paddingTop: 32 }}>
          <span style={{ fontSize: 12, color: '#444' }}>
            © 2025 | CookMate - Developed by the CookMate team, All rights
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

export default OTPLoginEmail
