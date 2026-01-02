import { getLegalPageBySlug } from '@/lib/nexus'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function TermsPage() {
  const page = await getLegalPageBySlug('terms')

  return (
    <div className="min-h-screen bg-[#f5f0e8] text-[#2a2520]">
      {/* Hero */}
      <section className="pt-32 pb-12 md:pt-40 md:pb-16">
        <div className="container mx-auto px-6 lg:px-16 max-w-3xl">
          <p className="text-xs tracking-[0.3em] uppercase text-[#2a2520]/40 mb-6">
            Legal
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-[#2a2520]/90">
            {page?.title || 'Terms of Use'}
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="pb-24 md:pb-32">
        <div className="container mx-auto px-6 lg:px-16 max-w-3xl">
          <div className="border-t border-[#2a2520]/10 pt-12">
            {page?.content ? (
              <div 
                className="text-[#2a2520]/60 leading-relaxed whitespace-pre-line prose prose-headings:font-serif prose-headings:text-[#2a2520]/80 prose-p:text-[#2a2520]/60 max-w-none"
                dangerouslySetInnerHTML={{ __html: page.content }}
              />
            ) : (
              <p className="text-[#2a2520]/50">
                Terms of use content will be loaded from Nexus.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
