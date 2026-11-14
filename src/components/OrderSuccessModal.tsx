import React, { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { SupplierOffer, formatSom } from '../data/suppliers';

interface OrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerName: string;
  offer: SupplierOffer;
  quantity: number;
  totalCost: number;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  isOpen,
  onClose,
  customerName,
  offer,
  quantity,
  totalCost,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-success-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Oynani yopish"
          className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-400">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <h2
            id="order-success-title"
            className="font-display mt-5 text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50"
          >
            Buyurtma tasdiqlandi!
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Soʻrovingiz muvaffaqiyatli qabul qilindi. Quyida buyurtma tafsilotlari keltirilgan.
          </p>
        </div>

        <dl className="mt-6 space-y-3.5 border-y border-zinc-200 py-5 text-sm dark:border-zinc-800">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-zinc-500 dark:text-zinc-400">Mijozning ismi</dt>
            <dd className="font-semibold text-zinc-950 dark:text-zinc-50">
              {customerName}
            </dd>
          </div>

          <div className="flex items-center justify-between gap-4">
            <dt className="text-zinc-500 dark:text-zinc-400">Yetkazib beruvchi</dt>
            <dd className="font-semibold text-blue-600 dark:text-blue-400">
              {offer.name} ({offer.tagline})
            </dd>
          </div>

          <div className="flex items-center justify-between gap-4">
            <dt className="text-zinc-500 dark:text-zinc-400">Pachkalar soni</dt>
            <dd className="font-mono-nums font-semibold text-zinc-950 dark:text-zinc-50">
              {quantity} pachka
            </dd>
          </div>

          <div className="flex items-center justify-between gap-4">
            <dt className="text-zinc-500 dark:text-zinc-400">Yetkazib berish muddati</dt>
            <dd className="font-medium text-zinc-900 dark:text-zinc-200">
              {offer.deliveryTime}
            </dd>
          </div>

          <div className="flex items-center justify-between gap-4 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
            <dt className="font-medium text-zinc-700 dark:text-zinc-300">Jami xarajat</dt>
            <dd className="font-display font-mono-nums text-xl font-bold text-emerald-700 dark:text-emerald-400">
              {formatSom(totalCost)}
            </dd>
          </div>
        </dl>

        <p className="mt-4 text-center font-mono-nums text-xs text-zinc-500 dark:text-zinc-400">
          Hisob-kitob: ({quantity} × {formatSom(offer.unitPrice)}) + {formatSom(offer.deliveryFee)} = {formatSom(totalCost)}
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-full items-center justify-center rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:bg-blue-500 dark:text-zinc-950 dark:hover:bg-blue-400"
          >
            Tushunarli
          </button>
        </div>
      </div>
    </div>
  );
};
