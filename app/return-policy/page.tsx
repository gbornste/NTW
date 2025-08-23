"use client"

export default function ReturnPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Return Policy</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">30-Day Return Policy</h2>
          
          <div className="space-y-4">
            <p className="text-gray-700">
              We offer a 30-day return policy for most items.
            </p>
            
            <div>
              <h3 className="font-semibold mb-2">Return Conditions:</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                <li>Item must be in original condition</li>
                <li>Original packaging required</li>
                <li>Custom items cannot be returned unless defective</li>
                <li>Return must be initiated within 30 days</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Refund Process:</h3>
              <p className="text-gray-700">
                Refunds are processed within 5-7 business days after we receive and inspect the returned item.
              </p>
            </div>

            <div className="pt-4">
              <a href="/contact" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-block">
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
