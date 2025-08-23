"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function CheckoutPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    const productId = searchParams.get("productId");
    const variantId = searchParams.get("variantId");
    const quantity = searchParams.get("quantity") || "1";

    const handleCheckout = async () => {
        if (!productId || !variantId) {
            setError("Missing product information");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    productId,
                    variantId,
                    quantity: parseInt(quantity),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Checkout failed");
            }

            // Redirect to Printify checkout URL
            if (data.checkoutUrl) {
                window.location.href = data.checkoutUrl;
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Checkout failed");
        } finally {
            setLoading(false);
        }
    };

    if (!productId || !variantId) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-md mx-auto">
                    <h1 className="text-2xl font-bold mb-4">Invalid Checkout</h1>
                    <p className="text-red-600">Missing product information</p>
                    <button
                        onClick={() => router.back()}
                        className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-md mx-auto">
                <h1 className="text-2xl font-bold mb-6">Checkout</h1>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="mb-4">
                        <p className="text-sm text-gray-600">Product ID: {productId}</p>
                        <p className="text-sm text-gray-600">Variant ID: {variantId}</p>
                        <p className="text-sm text-gray-600">Quantity: {quantity}</p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handleCheckout}
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Processing..." : "Complete Purchase"}
                    </button>

                    <button
                        onClick={() => router.back()}
                        className="w-full mt-3 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}