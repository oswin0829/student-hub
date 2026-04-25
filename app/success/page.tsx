import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-4xl font-black text-green-600 mb-4">Payment Successful! ⚡️</h1>
      <p className="text-gray-600 mb-8">Your MegaHelper tool is being prepared for delivery.</p>
      <Link href="/" className="text-black font-bold hover:underline">
        Back to Dashboard
      </Link>
    </div>
  );
}