export interface DateFormatOptions {
  showTime?: boolean
  showSeconds?: boolean
  showYear?: boolean
  showRelative?: boolean
  format?: "short" | "medium" | "long"
}

/**
 * Parse and verify a publication date from NewsAPI
 *
 * This function handles various date formats and ensures
 * we're using the actual publication date, not the retrieval date.
 */
export function parseAndVerifyPublicationDate(dateString: string): Date {
  if (!dateString) {
    console.warn("Empty date string provided to parseAndVerifyPublicationDate")
    return new Date() // Default to current date if no date provided
  }

  try {
    // Parse the date string
    const date = new Date(dateString)

    // Verify the date is valid
    if (isNaN(date.getTime())) {
      console.error(`Invalid date string: ${dateString}`)
      return new Date() // Default to current date if invalid
    }

    // Verify the date is not in the future
    const now = new Date()
    if (date > now) {
      console.warn(`Future publication date detected: ${dateString}, using current date instead`)
      return now
    }

    // Log the parsed date for debugging
    console.log(`Parsed publication date: ${dateString} -> ${date.toISOString()}`)

    return date
  } catch (error) {
    console.error(`Error parsing date string: ${dateString}`, error)
    return new Date() // Default to current date on error
  }
}

/**
 * Format a publication date for display
 */
export function formatPublicationDate(date: Date, options: DateFormatOptions = {}): string {
  const { showTime = true, showSeconds = false, showYear = true, showRelative = false, format = "medium" } = options

  try {
    // For relative time display
    if (showRelative) {
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffSec = Math.floor(diffMs / 1000)
      const diffMin = Math.floor(diffSec / 60)
      const diffHour = Math.floor(diffMin / 60)
      const diffDay = Math.floor(diffHour / 24)

      if (diffSec < 60) return `${diffSec} seconds ago`
      if (diffMin < 60) return `${diffMin} minutes ago`
      if (diffHour < 24) return `${diffHour} hours ago`
      if (diffDay < 7) return `${diffDay} days ago`
    }

    // For formatted date display
    const dateOptions: Intl.DateTimeFormatOptions = {}

    // Date part options
    if (format === "short") {
      dateOptions.month = "numeric"
      dateOptions.day = "numeric"
    } else if (format === "medium") {
      dateOptions.month = "short"
      dateOptions.day = "numeric"
    } else {
      dateOptions.month = "long"
      dateOptions.day = "numeric"
    }

    if (showYear) {
      dateOptions.year = "numeric"
    }

    // Time part options
    if (showTime) {
      dateOptions.hour = "numeric"
      dateOptions.minute = "2-digit"

      if (showSeconds) {
        dateOptions.second = "2-digit"
      }

      dateOptions.hour12 = true
    }

    return date.toLocaleString("en-US", dateOptions)
  } catch (error) {
    console.error("Error formatting date", error)
    return date.toLocaleString() // Fallback to default formatting
  }
}

/**
 * Get the current date in YYYY-MM-DD format
 */
export function getCurrentDate(): string {
  // For demonstration, we'll use the specified date: 5/22/2025
  return "2025-05-22"
}

/**
 * Check if a date is today (5/22/2025)
 */
export function isToday(date: Date): boolean {
  const today = getCurrentDate()
  const dateString = date.toISOString().split("T")[0]

  return dateString === today
}

/**
 * Verify and correct publication dates in NewsAPI articles
 *
 * This function checks for common date issues and corrects them:
 * 1. Future dates (set to current date)
 * 2. Invalid dates (set to current date)
 * 3. Missing dates (set to current date)
 */
export function verifyAndCorrectPublicationDates(articles: any[]): any[] {
  return articles.map((article) => {
    if (!article.publishedAt) {
      console.warn(`Article missing publication date: "${article.title}"`)
      article.publishedAt = new Date().toISOString()
      article.dateVerified = false
    } else {
      try {
        const pubDate = new Date(article.publishedAt)

        // Check for invalid date
        if (isNaN(pubDate.getTime())) {
          console.warn(`Article has invalid publication date: ${article.publishedAt}, "${article.title}"`)
          article.publishedAt = new Date().toISOString()
          article.dateVerified = false
        }
        // Check for future date
        else if (pubDate > new Date()) {
          console.warn(`Article has future publication date: ${article.publishedAt}, "${article.title}"`)
          article.publishedAt = new Date().toISOString()
          article.dateVerified = false
        } else {
          article.dateVerified = true
        }
      } catch (error) {
        console.error(`Error verifying publication date: ${article.publishedAt}`, error)
        article.publishedAt = new Date().toISOString()
        article.dateVerified = false
      }
    }

    // Add formatted date for display
    const pubDate = parseAndVerifyPublicationDate(article.publishedAt)
    article.formattedDate = formatPublicationDate(pubDate, { showTime: true })
    article.formattedDateShort = formatPublicationDate(pubDate, { showTime: false, format: "short" })
    article.formattedDateRelative = formatPublicationDate(pubDate, { showRelative: true })
    article.isToday = isToday(pubDate)

    return article
  })
}
