import Link from 'next/link';
import { verifyBillplzPayment } from '@/app/actions/checkout';

interface SuccessPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  // Try extracting the bill parameters. Note: searchParams keys with brackets might be parsed strangely
  // but usually Next.js keeps them intact.
  const billplzId = searchParams['billplz[id]'] as string | undefined;
  const billplzPaid = searchParams['billplz[paid]'] as string | undefined;

  let verified = false;
  if (billplzId && billplzPaid === 'true') {
    verified = await verifyBillplzPayment(billplzId);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-background text-foreground">
      {verified || billplzPaid === 'true' ? (
        <>
          <h1 className="text-4xl font-black text-green-600 dark:text-green-400 mb-4">Payment Successful! ⚡️</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Your MegaHelper tool is being prepared for delivery. Check your order history!</p>
        </>
      ) : (
        <>
          <h1 className="text-4xl font-black text-primary mb-4">Processing...</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">We are verifying your payment details. Please check your order history shortly.</p>
        </>
      )}
      <div className="flex gap-4">
        <Link href="/orders" className="bg-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-primary-hover transition-colors">
          View Orders
        </Link>
        <Link href="/" className="bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold px-6 py-3 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
          Back to Store
        </Link>
      </div>
    </div>
  );
}