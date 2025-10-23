import { Resend } from 'resend';
import { env } from './env';

// Only initialize if API key is available
const apiKey = env.resend.apiKey;

if (apiKey) {
  console.log('✅ Resend API key found, initializing email client...');
} else {
  console.log('⚠️  No RESEND_API_KEY found in environment variables');
}

export const resend = apiKey ? new Resend(apiKey) : null;
