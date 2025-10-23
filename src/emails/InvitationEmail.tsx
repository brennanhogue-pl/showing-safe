import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface InvitationEmailProps {
  invitedByName: string;
  invitedByEmail: string;
  role: string;
  inviteUrl: string;
}

export default function InvitationEmail({
  invitedByName = 'Admin',
  invitedByEmail = 'admin@showingsafe.com',
  role = 'homeowner',
  inviteUrl = 'https://showingsafe.com/accept-invite',
}: InvitationEmailProps) {
  const roleDisplayName = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <Html>
      <Head />
      <Preview>You&apos;ve been invited to join ShowingSafe</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>You&apos;re invited to ShowingSafe</Heading>

          <Text style={text}>
            <strong>{invitedByName}</strong> ({invitedByEmail}) has invited you to join ShowingSafe as a <strong>{roleDisplayName}</strong>.
          </Text>

          <Text style={text}>
            ShowingSafe provides comprehensive protection for real estate showings, ensuring peace of mind for homeowners and agents alike.
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={inviteUrl}>
              Accept Invitation
            </Button>
          </Section>

          <Text style={text}>
            This invitation will expire in 7 days. If you didn&apos;t expect this invitation, you can safely ignore this email.
          </Text>

          <Text style={footer}>
            © {new Date().getFullYear()} ShowingSafe. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const h1 = {
  color: '#1f2937',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0 40px',
  textAlign: 'center' as const,
};

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
  padding: '0 40px',
};

const buttonContainer = {
  padding: '27px 40px',
};

const button = {
  backgroundColor: '#3b82f6',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 24px',
};

const footer = {
  color: '#6b7280',
  fontSize: '12px',
  lineHeight: '16px',
  margin: '32px 0 0',
  padding: '0 40px',
  textAlign: 'center' as const,
};
