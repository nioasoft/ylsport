/**
 * Newsletter Confirmation Email Template
 * TODO: Implement proper React Email template in Phase 3
 */
export function NewsletterConfirmationEmail({ email, name }: { email: string; name?: string }) {
  return (
    <div>
      <h1>הצטרפת לניוזלטר של YL Sport!</h1>
      <p>שלום {name || "לקוח יקר"},</p>
      <p>תודה שהצטרפת לניוזלטר שלנו!</p>
      <p>נשמח לעדכן אותך על מבצעים ומוצרים חדשים.</p>
      {/* TODO: Full email template implementation in Phase 3 */}
    </div>
  );
}
