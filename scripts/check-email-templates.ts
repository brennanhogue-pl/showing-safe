import { supabaseAdmin } from '../src/lib/supabaseAdmin';

async function checkEmailTemplates() {
  try {
    console.log('Checking email templates...');

    const { data: templates, error } = await supabaseAdmin
      .from('email_templates')
      .select('*');

    if (error) {
      console.error('Error fetching templates:', error);
      return;
    }

    console.log(`Found ${templates?.length || 0} templates`);
    console.log(templates);
  } catch (err) {
    console.error('Exception:', err);
  }
}

checkEmailTemplates();
