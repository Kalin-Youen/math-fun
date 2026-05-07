import { GRADES } from '@/lib/curriculum'
import TopicPageClient from './TopicPageClient'

// Generate static params for all topics
export function generateStaticParams() {
  const slugs: { slug: string }[] = []
  GRADES.forEach(grade => {
    grade.categories.forEach(cat => {
      cat.topics.forEach(topic => {
        slugs.push({ slug: topic.slug })
      })
    })
  })
  return slugs
}

export default function TopicPage() {
  return <TopicPageClient />
}
