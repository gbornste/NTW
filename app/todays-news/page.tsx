import { EnhancedNewsDisplay } from "@/components/enhanced-news-display"

export default function TodaysNewsPage() {
  return (
    <EnhancedNewsDisplay
      title="Today's Anti-Trump News"
      subtitle="Latest Anti-Trump headlines from May 22, 2025 with verified publication dates"
      type="anti-trump"
      showDateVerification={true}
    />
  )
}
