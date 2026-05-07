import { GRADES } from '@/lib/curriculum'
import GradePageClient from './GradePageClient'

// Generate static params for all grades
export function generateStaticParams() {
  return GRADES.map(grade => ({ id: grade.id.toString() }))
}

export default function GradePage() {
  return <GradePageClient />
}
