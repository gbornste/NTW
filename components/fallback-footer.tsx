import Link from "next/link"

export function FallbackFooter() {
  return (
    <footer className="w-full py-4 bg-gray-100 dark:bg-gray-900">
      <div className="container px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            &copy; {new Date().getFullYear()} NOTRUMPNWAY. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-2 md:mt-0">
            <Link href="/terms" className="text-sm text-gray-600 dark:text-gray-400 hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-gray-600 dark:text-gray-400 hover:underline">
              Privacy
            </Link>
            <Link href="/contact" className="text-sm text-gray-600 dark:text-gray-400 hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default FallbackFooter
