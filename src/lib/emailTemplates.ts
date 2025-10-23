import { supabaseAdmin } from "./supabaseAdmin";

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  html_content: string;
  variables: string[];
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface EmailVariables {
  [key: string]: string | number;
}

/**
 * Get an email template by name
 */
export async function getEmailTemplate(name: string): Promise<EmailTemplate | null> {
  const { data, error } = await supabaseAdmin
    .from("email_templates")
    .select("*")
    .eq("name", name)
    .eq("is_active", true)
    .single();

  if (error) {
    console.error(`Error fetching email template "${name}":`, error);
    return null;
  }

  return data;
}

/**
 * Replace variables in email template
 */
export function replaceEmailVariables(
  template: string,
  variables: EmailVariables
): string {
  let result = template;

  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{${key}}}`, "g");
    result = result.replace(regex, String(value));
  }

  return result;
}

/**
 * Render an email template with variables
 */
export async function renderEmailTemplate(
  templateName: string,
  variables: EmailVariables
): Promise<{ subject: string; html: string } | null> {
  const template = await getEmailTemplate(templateName);

  if (!template) {
    console.error(`Email template "${templateName}" not found`);
    return null;
  }

  // Add default variables
  const allVariables = {
    currentYear: new Date().getFullYear(),
    ...variables,
  };

  const subject = replaceEmailVariables(template.subject, allVariables);
  const html = replaceEmailVariables(template.html_content, allVariables);

  return { subject, html };
}

/**
 * Get all email templates
 */
export async function getAllEmailTemplates(): Promise<EmailTemplate[]> {
  const { data, error } = await supabaseAdmin
    .from("email_templates")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching email templates:", error);
    return [];
  }

  return data || [];
}

/**
 * Update an email template
 */
export async function updateEmailTemplate(
  id: string,
  updates: Partial<Pick<EmailTemplate, "subject" | "html_content" | "description" | "is_active">>
): Promise<EmailTemplate | null> {
  const { data, error } = await supabaseAdmin
    .from("email_templates")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating email template:", error);
    return null;
  }

  return data;
}
