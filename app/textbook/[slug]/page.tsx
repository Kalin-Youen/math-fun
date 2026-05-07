import { GRADES } from '@/lib/curriculum'
import TextbookPageClient from './TextbookPageClient'

// Generate static params for all topics with textbook content
export function generateStaticParams() {
  const slugs: { slug: string }[] = []
  GRADES.forEach(grade => {
    grade.categories.forEach(cat => {
      cat.topics.forEach(topic => {
        if (topic.textbookContent) {
          slugs.push({ slug: topic.slug })
        }
      })
    })
  })
  return slugs
}

export default function TextbookPage() {
  return <TextbookPageClient />
}
