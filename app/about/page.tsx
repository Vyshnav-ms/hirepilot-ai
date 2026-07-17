import { FadeIn, PageTransition } from "@/components/motion-shell";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";

export default function AboutPage() {
  return (
    <PageTransition>
      <div className="min-h-screen text-white bg-[#0b1326]">
        <SiteNav />

        <main className="mx-auto max-w-4xl px-6 py-24">
          <FadeIn>
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">About HirePilot AI</h1>
            <p className="mb-12 text-lg text-zinc-400">
              Our mission is to help candidates navigate the modern job market with confidence, using advanced AI to bridge the gap between their experience and what employers are looking for.
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="glass-card rounded-3xl p-8 md:p-12">
              <h2 className="mb-4 text-2xl font-semibold text-white">The Problem We Solve</h2>
              <p className="mb-8 leading-7 text-zinc-400">
                Applying for jobs today often feels like sending your resume into a black hole. Applicant Tracking Systems (ATS) filter out highly qualified candidates simply because their resumes lack specific keywords or formatting. Furthermore, interview preparation is typically generic, leaving candidates unprepared for highly specific, role-based questions.
              </p>

              <h2 className="mb-4 text-2xl font-semibold text-white">Our Approach</h2>
              <p className="mb-8 leading-7 text-zinc-400">
                HirePilot AI was built on the core philosophy of <strong>Document-to-Document Matching</strong>. We don't just generate generic interview questions. Our AI reads your actual resume and compares it directly against the specific job description you are targeting. This allows us to generate highly personalized interview scenarios, calculate an accurate ATS compatibility score, and even draft tailored application emails that highlight your real experience.
              </p>

              <h2 className="mb-4 text-2xl font-semibold text-white">Why It Matters</h2>
              <p className="leading-7 text-zinc-400">
                By understanding exactly where your experience intersects with a company's needs, we empower you to walk into interviews prepared for the hardest questions and to submit applications that get noticed. We believe that technology should work for the candidate, not just the recruiter.
              </p>
            </div>
          </FadeIn>
        </main>

        <SiteFooter />
      </div>
    </PageTransition>
  );
}
