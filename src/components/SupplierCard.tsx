import React from 'react';
import { Award, Check, Clock, Truck } from 'lucide-react';
import { SupplierOffer, calculateOfferTotal, formatSom } from '../data/suppliers';

interface SupplierCardProps {
  offer: SupplierOffer;
  quantity: number | null;
  isBestValue: boolean;
  isSelected: boolean;
  onSelect: (id: SupplierOffer['id']) => void;
}

export const SupplierCard: React.FC<SupplierCardProps> = ({
  offer,
  quantity,
  isBestValue,
  isSelected,
  onSelect,
}) => {
  const isValidQty = quantity !== null && Number.isInteger(quantity) && quantity >= 1;
  const totalCost = isValidQty ? calculateOfferTotal(quantity, offer) : null;
  const subtotal = isValidQty ? quantity * offer.unitPrice : null;

  return (
    <div
      role="radio"
      aria-checked={isSelected}
      tabIndex={0}
      onClick={() => onSelect(offer.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(offer.id);
        }
      }}
      className={`group relative flex flex-col justify-between rounded-2xl border p-6 transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
        isSelected
          ? 'border-blue-600 bg-white shadow-sm ring-1 ring-blue-600/20 dark:border-blue-400 dark:bg-zinc-900 dark:ring-blue-400/25'
          : isBestValue
            ? 'border-emerald-500/60 bg-white hover:-translate-y-0.5 hover:shadow-sm dark:border-emerald-500/45 dark:bg-zinc-900'
            : 'border-zinc-200 bg-white hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700'
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
              {offer.name}
            </h3>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {offer.tagline}
            </p>
          </div>

          <div
            aria-hidden="true"
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors duration-150 ${
              isSelected
                ? 'border-blue-600 bg-blue-600 text-white dark:border-blue-400 dark:bg-blue-400 dark:text-zinc-950'
                : 'border-zinc-300 bg-transparent dark:border-zinc-700'
            }`}
          >
            {isSelected && <Check className="h-3.5 w-3.5 stroke-[2.5]" />}
          </div>
        </div>

        <div className="mt-3 min-h-[28px] flex items-center">
          {isBestValue ? (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
              <Award className="h-3.5 w-3.5 shrink-0" />
              <span>Eng yaxshi narx</span>
            </span>
          ) : (
            <span className="text-xs text-zinc-400 dark:text-zinc-500">
              {offer.paperSpec}
            </span>
          )}
        </div>

        <dl className="mt-5 space-y-3 border-t border-zinc-100 pt-5 text-sm dark:border-zinc-800">
          <div className="flex items-center justify-between gap-2">
            <dt className="text-zinc-600 dark:text-zinc-400">Birlik narxi</dt>
            <dd className="font-mono-nums font-semibold text-zinc-950 dark:text-zinc-100">
              {formatSom(offer.unitPrice)}
            </dd>
          </div>

          <div className="flex items-center justify-between gap-2">
            <dt className="inline-flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
              <Truck className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-500" />
              <span>Yetkazib berish haqi</span>
            </dt>
            <dd className="font-mono-nums font-semibold text-zinc-950 dark:text-zinc-100">
              {formatSom(offer.deliveryFee)}
            </dd>
          </div>

          <div className="flex items-center justify-between gap-2">
            <dt className="inline-flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
              <Clock className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-500" />
              <span>Yetkazib berish muddati</span>
            </dt>
            <dd className="font-medium text-zinc-900 dark:text-zinc-200">
              {offer.deliveryTime}
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-6 border-t border-zinc-100 pt-5 dark:border-zinc-800">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Jami xarajat
          </span>
          {isValidQty && subtotal !== null && (
            <span className="font-mono-nums text-xs text-zinc-400 dark:text-zinc-500">
              {quantity} × {(offer.unitPrice / 1000).toFixed(0)}k + {(offer.deliveryFee / 1000).toFixed(0)}k
            </span>
          )}
        </div>

        <div className="mt-1.5 flex items-baseline justify-between gap-3">
          <span
            className={`font-display font-mono-nums text-2xl font-bold tracking-tight ${
              isBestValue && isValidQty
                ? 'text-emerald-700 dark:text-emerald-400'
                : 'text-zinc-950 dark:text-zinc-50'
            }`}
          >
            {totalCost !== null ? formatSom(totalCost) : '—'}
          </span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(offer.id);
          }}
          className={`mt-5 flex h-11 w-full items-center justify-center rounded-xl px-4 text-sm font-semibold transition-colors duration-150 whitespace-nowrap ${
            isSelected
              ? 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:text-zinc-950 dark:hover:bg-blue-400'
              : 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700'
          }`}
        >
          {isSelected ? 'Tanlangan taklif' : 'Ushbu taklifni tanlash'}
        </button>
      </div>
    </div>
  );
};
