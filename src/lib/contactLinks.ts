import { emailLink, externalLink, phoneLink, profile } from './portfolio';

export interface ContactLink {
  id: string;
  name: string;
  description: string;
  value: string;
  href?: string;
  newTab?: boolean;
}

// Keep these destinations in profile so About Me and Links stay in sync.
// A missing URL remains selectable without sending visitors anywhere.
export const contactLinks: ContactLink[] = [
  { id: 'github', name: 'GitHub', description: 'Explore my code, projects, and experiments.', value: profile.github.replace(/^https?:\/\//, ''), href: externalLink(profile.github), newTab: true },
  { id: 'linkedin', name: 'LinkedIn', description: 'Connect with me professionally.', value: profile.linkedin.replace(/^https?:\/\//, ''), href: externalLink(profile.linkedin), newTab: true },
  { id: 'email', name: 'Email', description: 'Get in touch about a project or opportunity.', value: profile.email, href: emailLink(profile.email), newTab: true },
  { id: 'phone', name: 'Phone', description: 'Reach me by phone.', value: profile.phone, href: phoneLink(profile.phone) },
];
