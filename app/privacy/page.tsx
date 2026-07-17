import { FadeIn, PageTransition } from "@/components/motion-shell";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";

export default function PrivacyPage() {
  return (
    <PageTransition>
      <div className="min-h-screen text-white bg-[#0b1326]">
        <SiteNav />

        <main className="mx-auto max-w-4xl px-6 py-24">
          <FadeIn>
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">Privacy Policy</h1>
            <p className="mb-12 text-lg text-zinc-400">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="glass-card rounded-3xl p-8 md:p-12 space-y-8">
              <section>
                <h2 className="mb-4 text-2xl font-semibold text-white">1. Information We Collect</h2>
                <p className="leading-7 text-zinc-400">
                  When you use HirePilot AI, we collect the information you provide directly to us. This includes your account information (email address, full name), the resumes you upload (PDF or text), and the job descriptions you analyze. We use this data exclusively to power the AI matching features, such as generating interview questions and calculating ATS scores.
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-semibold text-white">2. How We Use Your Data</h2>
                <p className="leading-7 text-zinc-400">
                  Your resumes and job descriptions are securely processed by our AI partners (e.g., Groq) to generate the requested insights. We do not use your personal data to train our own models, nor do we sell your data to third parties, recruiters, or advertisers. 
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-semibold text-white">3. Gmail Integration</h2>
                <p className="leading-7 text-zinc-400">
                  If you choose to connect your Gmail account to send job applications directly from the platform, we securely store your OAuth tokens. We only use these tokens to send emails on your behalf when you explicitly click the "Send" button. We do not read your inbox, nor do we share your tokens with any third parties.
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-semibold text-white">4. Data Security & Deletion</h2>
                <p className="leading-7 text-zinc-400">
                  Your data is stored securely using Supabase (PostgreSQL). You maintain full control over your data. You can delete individual applications, remove your master resume, or permanently delete your entire account and all associated data at any time from your Account Settings page.
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-semibold text-white">5. Contact Us</h2>
                <p className="leading-7 text-zinc-400">
                  If you have any questions or concerns about this Privacy Policy or how your data is handled, please contact us at support@hirepilotai.com.
                </p>
              </section>
            </div>
          </FadeIn>
        </main>

        <SiteFooter />
      </div>
    </PageTransition>
  );
}
