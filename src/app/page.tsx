import { AnatomyExplorer } from '@/components/anatomy/AnatomyExplorer'

export default function Home() {
  return (
    <>
      <section id="body" aria-label="Interactive human body" className="relative scroll-mt-16">
        <AnatomyExplorer />
      </section>
    </>
  )
}
