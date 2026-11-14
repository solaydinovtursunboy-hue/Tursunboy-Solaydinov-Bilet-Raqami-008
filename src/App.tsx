import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowDown,
  FileText,
  Minus,
  Moon,
  Plus,
  ShieldCheck,
  Sun,
  Truck,
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { SupplierCard } from './components/SupplierCard';
import {
  SUPPLIER_OFFERS,
  SupplierOffer,
  calculateOfferTotal,
  formatSom,
} from './data/suppliers';

const QUICK_QUANTITIES = [5, 10, 25, 50];

export default function App() {
  const [isDark, setIsDark] = useState<boolean>(false);
  const [quantityInput, setQuantityInput] = useState<string>('5');
  const [selectedOfferId, setSelectedOfferId] = useState<SupplierOffer['id']>('C');
  const [customerName, setCustomerName] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [confirmedOrder, setConfirmedOrder] = useState<{
    customerName: string;
    offer: SupplierOffer;
    quantity: number;
    totalCost: number;
  } | null>(null);

  const [heroImgError, setHeroImgError] = useState(false);
  const [detailImgError, setDetailImgError] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const orderSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const parsedQuantity = useMemo<number | null>(() => {
    const trimmed = quantityInput.trim();
    if (!/^\d+$/.test(trimmed)) return null;
    const num = Number(trimmed);
    if (!Number.isSafeInteger(num) || num < 1) return null;
    return num;
  }, [quantityInput]);

  const isQuantityValid = parsedQuantity !== null;

  const totalsByOffer = useMemo(() => {
    if (parsedQuantity === null) return null;
    return SUPPLIER_OFFERS.map((offer) => ({
      offer,
      total: calculateOfferTotal(parsedQuantity, offer),
    }));
  }, [parsedQuantity]);

  const minTotal = useMemo(() => {
    if (!totalsByOffer) return null;
    return Math.min(...totalsByOffer.map((item) => item.total));
  }, [totalsByOffer]);

  const bestOffers = useMemo(() => {
    if (!totalsByOffer || minTotal === null) return [];
    return totalsByOffer
      .filter((item) => item.total === minTotal)
      .map((item) => item.offer);
  }, [totalsByOffer, minTotal]);

  const selectedOffer = useMemo(
    () => SUPPLIER_OFFERS.find((o) => o.id === selectedOfferId) ?? SUPPLIER_OFFERS[0],
    [selectedOfferId]
  );

  const selectedOfferTotal = useMemo(() => {
    if (parsedQuantity === null) return null;
    return calculateOfferTotal(parsedQuantity, selectedOffer);
  }, [parsedQuantity, selectedOffer]);

  const handleQuantityChange = (nextValue: string) => {
    setQuantityInput(nextValue);
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const handleStepQuantity = (delta: number) => {
    const base = parsedQuantity ?? 0;
    const next = Math.max(1, base + delta);
    setQuantityInput(String(next));
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const handleNameChange = (nextName: string) => {
    setCustomerName(nextName);
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const scrollToOrder = () => {
    orderSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => {
      nameInputRef.current?.focus({ preventScroll: true });
    }, 350);
  };

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: string[] = [];

    if (parsedQuantity === null) {
      errors.push('Pachkalar soni kamida 1 ta butun son boʻlishi kerak (0, manfiy yoki boʻsh boʻlmasin).');
    }

    const trimmedName = customerName.trim();
    if (!trimmedName) {
      errors.push('Iltimos, buyurtmachining ismini kiriting.');
    }

    if (errors.length > 0 || parsedQuantity === null) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors([]);
    const finalTotal = calculateOfferTotal(parsedQuantity, selectedOffer);
    setConfirmedOrder({
      customerName: trimmedName,
      offer: selectedOffer,
      quantity: parsedQuantity,
      totalCost: finalTotal,
    });
  };

  return (
    <div
      id="top"
      className="min-h-screen bg-zinc-50 text-zinc-950 transition-colors duration-200 dark:bg-zinc-950 dark:text-zinc-50"
    >
      <Navbar onOrderClick={scrollToOrder} />

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6 sm:pt-12 lg:px-8">
        {/* Hero Split */}
        <section className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="flex flex-col justify-center lg:col-span-7">
            <p className="text-xs font-semibold tracking-wide text-blue-600 dark:text-blue-400">
              A4 ofis qogʻozi · Ulgurji taqqoslash
            </p>

            <h1 className="font-display mt-3 text-3xl font-bold tracking-tight text-zinc-950 [text-wrap:balance] sm:text-4xl lg:text-5xl dark:text-zinc-50">
              Doʻkoningiz uchun A4 qogʻozni eng qulay narxda oling.
            </h1>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
              Uchta ishonchli yetkazib beruvchining birlik narxi va bir martalik yetkazib berish haqini real vaqt rejimida taqqoslang. Kerakli pachkalar sonini kiriting va eng tejamkor taklifga darhol buyurtma bering.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <a
                href="#taqqoslash"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-zinc-950 px-6 text-sm font-semibold text-white transition-colors duration-150 hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 whitespace-nowrap dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
              >
                <span>Takliflarni koʻrish</span>
                <ArrowDown className="h-4 w-4" />
              </a>

              <a
                href="#shartlar"
                className="inline-flex h-11 items-center rounded-xl border border-zinc-200 bg-white px-5 text-sm font-medium text-zinc-700 transition-colors duration-150 hover:border-zinc-300 hover:text-zinc-950 whitespace-nowrap dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:text-zinc-50"
              >
                Hisoblash tartibi
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-zinc-200 pt-5 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
              <span>3 ta yetkazib beruvchi</span>
              <span aria-hidden="true">·</span>
              <span>Bir martalik yetkazib berish haqi</span>
              <span aria-hidden="true">·</span>
              <span>80 g/m² · 500 varaq / pachka</span>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative h-full min-h-[260px] overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
              {!heroImgError ? (
                <img
                  src="/src/assets/images/hero_a4_paper_stack_1794640600730.jpg"
                  alt="Oq A4 ofis qogʻozi pachkalari"
                  referrerPolicy="no-referrer"
                  onError={() => setHeroImgError(true)}
                  className="h-full w-full object-cover aspect-[4/3] lg:aspect-auto"
                />
              ) : (
                <div className="flex h-full min-h-[260px] flex-col items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 p-8 text-center dark:from-zinc-900 dark:to-zinc-800">
                  <FileText className="h-12 w-12 text-zinc-400 dark:text-zinc-500" />
                  <p className="mt-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    A4 Standart Ofis Qogʻozi
                  </p>
                </div>
              )}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-zinc-950/75 via-zinc-950/30 to-transparent p-5">
                <p className="text-xs font-medium text-zinc-100">
                  Standart oʻlcham: 210 × 297 mm · Yorqin oq qogʻoz
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Calculator & Theme Toolbar */}
        <section id="kalkulyator" className="mt-14 scroll-mt-24">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="font-display text-lg font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
                      Miqdorni kiriting
                    </h2>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                      Pachkalar soni oʻzgarganda barcha takliflar avtomatik qayta hisoblanadi.
                    </p>
                  </div>

                  {/* Theme Switcher */}
                  <div
                    role="group"
                    aria-label="Mavzu rejimi"
                    className="inline-flex items-center gap-1 rounded-xl border border-zinc-200 bg-zinc-100 p-1 dark:border-zinc-800 dark:bg-zinc-950"
                  >
                    <button
                      type="button"
                      onClick={() => setIsDark(false)}
                      aria-pressed={!isDark}
                      className={`inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                        !isDark
                          ? 'bg-white text-zinc-950 shadow-sm dark:bg-zinc-800 dark:text-zinc-50'
                          : 'text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-200'
                      }`}
                    >
                      <Sun className="h-3.5 w-3.5" />
                      <span>Yorugʻ</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsDark(true)}
                      aria-pressed={isDark}
                      className={`inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                        isDark
                          ? 'bg-zinc-800 text-zinc-50 shadow-sm'
                          : 'text-zinc-600 hover:text-zinc-950'
                      }`}
                    >
                      <Moon className="h-3.5 w-3.5" />
                      <span>Tungi</span>
                    </button>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleStepQuantity(-1)}
                      aria-label="Pachka sonini kamaytirish"
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-800 transition-colors hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
                    >
                      <Minus className="h-4 w-4" />
                    </button>

                    <div className="relative w-36 sm:w-40">
                      <label htmlFor="pack-quantity" className="sr-only">
                        Pachkalar soni
                      </label>
                      <input
                        id="pack-quantity"
                        type="number"
                        inputMode="numeric"
                        min={1}
                        step={1}
                        value={quantityInput}
                        onChange={(e) => handleQuantityChange(e.target.value)}
                        placeholder="Masalan: 5"
                        aria-invalid={!isQuantityValid}
                        className={`font-mono-nums h-11 w-full rounded-xl border bg-white px-3.5 pr-16 text-base font-semibold text-zinc-950 transition-colors focus:outline-none focus:ring-2 dark:bg-zinc-950 dark:text-zinc-50 ${
                          isQuantityValid
                            ? 'border-zinc-200 focus:border-blue-600 focus:ring-blue-600/20 dark:border-zinc-700 dark:focus:border-blue-400 dark:focus:ring-blue-400/20'
                            : 'border-red-400 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500'
                        }`}
                      />
                      <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-zinc-400 dark:text-zinc-500">
                        pachka
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleStepQuantity(1)}
                      aria-label="Pachka sonini oshirish"
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-800 transition-colors hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Quick Quantity Presets */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mr-1">
                      Tezkor tanlov:
                    </span>
                    {QUICK_QUANTITIES.map((preset) => {
                      const active = parsedQuantity === preset;
                      return (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => handleQuantityChange(String(preset))}
                          className={`h-9 rounded-lg px-3 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                            active
                              ? 'bg-blue-600 text-white dark:bg-blue-500 dark:text-zinc-950'
                              : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
                          }`}
                        >
                          {preset} pachka
                        </button>
                      );
                    })}
                  </div>
                </div>

                {!isQuantityValid && (
                  <p
                    role="alert"
                    className="mt-3 flex items-center gap-1.5 text-xs font-medium text-red-600 dark:text-red-400"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>
                      Diqqat: Pachkalar soni kamida 1 boʻlgan butun son boʻlishi kerak.
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 3-Column Supplier Comparison */}
        <section id="taqqoslash" className="mt-10 scroll-mt-24">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
                Yetkazib beruvchilar taqqoslamasi
              </h2>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Oʻzingizga mos yetkazib beruvchini tanlang. Eng arzon jami narx avtomatik belgilanadi.
              </p>
            </div>

            {isQuantityValid && minTotal !== null && bestOffers.length > 0 && (
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                Eng tejamkor:{' '}
                <span className="font-semibold">
                  {bestOffers.map((o) => o.name).join(' va ')}
                </span>{' '}
                — <span className="font-mono-nums">{formatSom(minTotal)}</span>
              </p>
            )}
          </div>

          <div
            role="radiogroup"
            aria-label="Yetkazib beruvchini tanlash"
            className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3"
          >
            {SUPPLIER_OFFERS.map((offer) => {
              const total =
                parsedQuantity !== null
                  ? calculateOfferTotal(parsedQuantity, offer)
                  : null;
              const isBestValue =
                total !== null && minTotal !== null && total === minTotal;

              return (
                <SupplierCard
                  key={offer.id}
                  offer={offer}
                  quantity={parsedQuantity}
                  isBestValue={isBestValue}
                  isSelected={selectedOfferId === offer.id}
                  onSelect={(id) => {
                    setSelectedOfferId(id);
                    if (validationErrors.length > 0) setValidationErrors([]);
                  }}
                />
              );
            })}
          </div>
        </section>

        {/* Order Checkout & Formula Info Split */}
        <section
          id="buyurtma"
          ref={orderSectionRef}
          className="mt-14 scroll-mt-24 grid grid-cols-1 gap-8 lg:grid-cols-12"
        >
          {/* Left: Product Details & Pricing Rules */}
          <div
            id="shartlar"
            className="scroll-mt-24 flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 lg:col-span-5"
          >
            <div>
              <div className="overflow-hidden rounded-xl border border-zinc-100 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950">
                {!detailImgError ? (
                  <img
                    src="/src/assets/images/a4_paper_ream_detail_1794640601535.jpg"
                    alt="A4 80 g/m² ofis qogʻozi varaqlarining yaqin koʻrinishi"
                    referrerPolicy="no-referrer"
                    onError={() => setDetailImgError(true)}
                    className="aspect-[4/3] w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-[4/3] w-full flex-col items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 p-6 text-center dark:from-zinc-900 dark:to-zinc-800">
                    <FileText className="h-10 w-10 text-zinc-400" />
                    <span className="mt-2 text-xs text-zinc-500">A4 80 g/m² · 500 varaq</span>
                  </div>
                )}
              </div>

              <h3 className="font-display mt-6 text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
                Hisoblash va yetkazib berish shartlari
              </h3>

              <ul className="mt-4 space-y-3.5 text-sm text-zinc-600 dark:text-zinc-400">
                <li className="flex items-start gap-3">
                  <FileText className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
                  <span>
                    <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
                      Hisoblash formulasi:
                    </strong>{' '}
                    Jami xarajat = (miqdor × birlik narxi) + yetkazib berish haqi.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Truck className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
                  <span>
                    <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
                      Bir martalik yetkazib berish:
                    </strong>{' '}
                    Yetkazib berish haqi pachkalar sonidan qatʼi nazar buyurtmaga faqat bir marta qoʻshiladi.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
                  <span>
                    <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
                      Sifat kafolati:
                    </strong>{' '}
                    Barcha yetkazib beruvchilar 80 g/m² zichlikdagi, 500 varaqli standart A4 qogʻoz taqdim etadi.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right: Order Form */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 dark:border-zinc-800 dark:bg-zinc-900 lg:col-span-7">
            <h2 className="font-display text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
              Buyurtmani rasmiylashtirish
            </h2>
            <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400">
              Tanlangan yetkazib beruvchini tekshiring va ismingizni kiriting.
            </p>

            <form onSubmit={handleConfirmOrder} noValidate className="mt-6 space-y-6">
              {/* Supplier Quick Selector */}
              <div>
                <span className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Tanlangan yetkazib beruvchi
                </span>
                <div className="mt-2.5 grid grid-cols-3 gap-2.5">
                  {SUPPLIER_OFFERS.map((offer) => {
                    const active = selectedOfferId === offer.id;
                    return (
                      <button
                        key={offer.id}
                        type="button"
                        onClick={() => {
                          setSelectedOfferId(offer.id);
                          if (validationErrors.length > 0) setValidationErrors([]);
                        }}
                        className={`flex h-11 items-center justify-center rounded-xl border px-3 text-sm font-semibold transition-colors whitespace-nowrap ${
                          active
                            ? 'border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-950/60 dark:text-blue-300'
                            : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-800'
                        }`}
                      >
                        {offer.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Customer Name */}
              <div>
                <label
                  htmlFor="customer-name"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Mijozning ismi
                </label>
                <input
                  ref={nameInputRef}
                  id="customer-name"
                  type="text"
                  value={customerName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Masalan: Jasurbek Karimov"
                  className="mt-2 h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 text-base text-zinc-950 placeholder:text-zinc-400 transition-colors focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-blue-400 dark:focus:ring-blue-400/20"
                />
              </div>

              {/* Live Summary */}
              <dl className="space-y-3 border-y border-zinc-200 py-5 text-sm dark:border-zinc-800">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-zinc-500 dark:text-zinc-400">Yetkazib beruvchi</dt>
                  <dd className="font-semibold text-zinc-950 dark:text-zinc-100">
                    {selectedOffer.name} · {selectedOffer.deliveryTime}
                  </dd>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <dt className="text-zinc-500 dark:text-zinc-400">
                    Pachkalar ({isQuantityValid ? `${parsedQuantity} dona` : 'notoʻgʻri miqdor'})
                  </dt>
                  <dd className="font-mono-nums font-medium text-zinc-900 dark:text-zinc-200">
                    {isQuantityValid && parsedQuantity !== null
                      ? formatSom(parsedQuantity * selectedOffer.unitPrice)
                      : '—'}
                  </dd>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <dt className="text-zinc-500 dark:text-zinc-400">Yetkazib berish haqi</dt>
                  <dd className="font-mono-nums font-medium text-zinc-900 dark:text-zinc-200">
                    {formatSom(selectedOffer.deliveryFee)}
                  </dd>
                </div>

                <div className="flex items-baseline justify-between gap-4 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <dt className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
                    Jami toʻlov
                  </dt>
                  <dd className="font-display font-mono-nums text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {selectedOfferTotal !== null ? formatSom(selectedOfferTotal) : '—'}
                  </dd>
                </div>
              </dl>

              {/* Red Validation Error Alert */}
              {validationErrors.length > 0 && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/70 dark:bg-red-950/60 dark:text-red-300"
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
                    <div>
                      <p className="font-semibold">
                        Buyurtmani tasdiqlab boʻlmadi:
                      </p>
                      <ul className="mt-1 list-disc space-y-1 pl-4">
                        {validationErrors.map((err, index) => (
                          <li key={index}>{err}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="flex h-12 w-full items-center justify-center rounded-xl bg-blue-600 px-6 text-base font-semibold text-white transition-colors duration-150 hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:bg-blue-500 dark:text-zinc-950 dark:hover:bg-blue-400"
              >
                Buyurtmani tasdiqlash
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200 bg-white py-8 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-zinc-500 sm:flex-row sm:px-6 lg:px-8 dark:text-zinc-400">
          <p className="font-medium text-zinc-900 dark:text-zinc-200">
            A4 Market — Kichik doʻkonlar uchun A4 qogʻoz taqqoslash platformasi
          </p>
          <div className="flex items-center gap-6">
            <a href="#taqqoslash" className="hover:text-zinc-900 dark:hover:text-zinc-100">
              Taqqoslash
            </a>
            <a href="#kalkulyator" className="hover:text-zinc-900 dark:hover:text-zinc-100">
              Kalkulyator
            </a>
            <a href="#buyurtma" className="hover:text-zinc-900 dark:hover:text-zinc-100">
              Buyurtma
            </a>
          </div>
        </div>
      </footer>

      {confirmedOrder && (
        <OrderSuccessModal
          isOpen={true}
          onClose={() => setConfirmedOrder(null)}
          customerName={confirmedOrder.customerName}
          offer={confirmedOrder.offer}
          quantity={confirmedOrder.quantity}
          totalCost={confirmedOrder.totalCost}
        />
      )}
    </div>
  );
}
