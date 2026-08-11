'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '../components/header';
import { Footer } from '../components/footer';
import { CartDrawer } from '../components/cart-drawer';
import { useCartStore, useWishlistStore, useProductsQuery, useCategoriesQuery, useBannersQuery } from '@cinmax/hooks';

export default function HomePage() {
  const router = useRouter();
  const { addItem, items: cartItems } = useCartStore();
  const { toggleItem, isWishlisted } = useWishlistStore();
  const { data: categories = [] } = useCategoriesQuery();
  const { data: productsData } = useProductsQuery();
  const { data: heroBannersData = [] } = useBannersQuery(true);
  const products = productsData?.items || [];

  const activeBanners = heroBannersData.length > 0 ? heroBannersData : [
    {
      id: 'b1',
      title: 'French Green Clay & Eucalyptus',
      subtitle: 'Artisan Cold-Processed Saponification • 40-Day Slow Cured',
      badgeText: 'New Cure Release',
      ctaText: 'Discover Blend',
      ctaLink: '/shop',
      imageUrl: 'https://images.unsplash.com/photo-1607006314147-759088fd21c2?w=1600&auto=format&fit=crop&q=80',
    },
    {
      id: 'b2',
      title: 'The Atelier Gift Box Collection',
      subtitle: 'Curated Hinoki Wooden Sets with 4 Signature Cured Slabs',
      badgeText: 'Atelier Signature',
      ctaText: 'Explore Sets',
      ctaLink: '/shop',
      imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1600&auto=format&fit=crop&q=80',
    },
    {
      id: 'b3',
      title: 'Azure Marine Botanical Bar',
      subtitle: 'Wild-harvested Atlantic kelp & organic bergamot peel hydration.',
      badgeText: 'Top Rated Cure',
      ctaText: 'Shop Now',
      ctaLink: '/shop',
      imageUrl: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=1600&auto=format&fit=crop&q=80',
    },
  ];

  const [activeSlideIndex, setActiveSlideIndex] = React.useState(0);

  React.useEffect(() => {
    if (activeBanners.length <= 1) return;
    const timer = setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % activeBanners.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [activeBanners.length]);

  const [activeConcern, setActiveConcern] = React.useState('Dry Skin');
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const concerns = ['Dry Skin', 'Acne Prone', 'Sensitive Skin', 'Anti-Aging', 'Glowing Skin'];

  const categoryAvatars = [
    { title: 'Bath Soap', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpIoHGNt8K2IwZW-F7gzPobXAQUkVIt2KYkxhO1eSWplJXLrQKYGRddfIymkCSroyFXB8-bWWemt7g5oMW-QpG6401-FXIeIHBY5gdDUSwpqyUX9ASwRH9i_EYGp8sS3wtlDGrTKjSkj3P3ZuMLYr191TC1dCtJdFHUe9t5dST4XtFX8ZQtpfJMtLfqCqL4lYC59QY4ctPuIn07bfFJ2AkLFiqAmf5m7wg_Ldo1bT2_Rp9HgNvu7ZA' },
    { title: 'Herbal Soap', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAa4yv0gYZBUd0SEVtTlVkMcGNANs-fgctuNM7SEzJYRxMxlkKJaT71DPF-EfhUVwQEzMftaBRYvstM11GaElv3osNZTKJJjEvMhzYBcGPk9efj5Gm-4Wp01Zh5tXW62PxsReysnnieVjiZUVbyRSWHEA2vS72W5wQb8LDdGHq5A79LxgeeDpkDn9c7KZpMl2BQ8MaYGO6KlOxhOgDt6PxHmj5Cug4uIJBKl-9VtVLaYV7vbS2Y8c6a' },
    { title: 'Face Care', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoRsDMNvc9hgexWVqa6dtEaFl6nN2xCiF5iV-T5gl46JoAnOu5AOcZVfxL9hm_305zBiYjSitTmh6CRwDk51PB-8Df_pnQe40YxDitX72iQeZBpAAO1XnjsIptJ49nlYqnJwTojbIFo8vNtTfc5JczIdvDP2BXDEXZ2bP1Q1F_keOYHZBudHhE6aq_uWSDGEfXUPHwbT-Juuf3giE7gZrvYHwU9KjCJ6nk_A4BEEPadfPeSazwudst' },
    { title: 'Body Care', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9lubmr39J6fZHpoItlXf_vE7Bt7g6eAd8NLC8ETl92RmQDIJBDBkLOuLbRoUEqrQfaJNP_bii3VO1DgAp9db1R-jRWQZVjvb6fU-1ol1kFRS_x95uIcyFDPiYZcrMCRgekQJwOet1HRiKwlVPeduydGDOAr5-saKjPVmo60e2NpXEdgW-Fx3Dm6cGMkvatrS4e2r_raXj_I_cn-RPyrTVo47B71tY4cqSDuxf0XSWQaT4lsWufVlk' },
    { title: 'Hair Care', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDraVE7daOdNCK2xnaJeAdZY2woblVfcS9rPgNefx3K2TiDXuvlWmiVrSSpeHDAHTMhkvGZ-O-E13eY581zZpfpskz6Pf8dIVqFcwgZlLbNTfoy1MojHODIOgFfB5-T0LGfkprN3RI-vp4y-5onqnuatv5Vnlp2qvHwqcG8wsgcicy24HiQM34fOWXv8H6H70V7fMLoPCK37_O2JIzLgB3Qk4x6vtLBWPuW5zJjBoC-X9ExblUanHfd' },
    { title: 'Gift Sets', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcZZWrp5hww_VPAwl39MRLYADlGq40ikgeByV0ShCSdwukE1M-0aSyIT-bPuQjX_4vZD8emKVM2DUnDENsUEfebjJszH3gEzzLdmzCt7al9id7-iq9xrW35wpa2Cef7YAGrttP91IpoTjst02TV7IeWekbi4rPgTdgJBYnT9iFt-B8eQCRor6WUabNr17n5HnRRBbHR3gS6REGi72jNv7evGuHKYi6QeFs9DHcHu40iMzej5u4PtFe' },
  ];

  const watchShopVideos = [
    {
      id: 'v1',
      title: 'Aloe Vera Soap',
      price: '₹199',
      thumb: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC85VgeJRlaGssVKe4o5MaUTzkpQWnScMZ6g9JvCSe-AhjElgCk-Yowqs1H5yrvUiFwhlWsilPdz9OOpG1Ws6cEJPX3MqFjZYdw9mFcjU-6d2GmTnneNs0Hv4b0MNq3arAlFZt4a8TD4uN0jtZdcgrqrUYi4dEkRyGZTOfAX4Yp6YgHz-xA0zhXWRpnfIk3FrKENZ9c9b6hfKS6VNogJjs5ByDdGYS0ggxXlRgx8KWscPhk-oThH0B1',
      videoBg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYWOizEZDuaWyblNqgPfFEOp2E1S7-_r3mCe31-TBndf4pZxCjh2WDz36JQXQQfn9nTUKRwkJQVEpJxhw2BTQPQxMZkK9r6if5X5njBMJSkHpNL2nwiLENqAJSO5xK6NCr0QZXwBEvffOB72Q3ibHuQm_Eqes4JwzBFp69fDYzpDWBnHA5ruI2brQhhUnpla7L_gLVYd9EmdQVK1Yg446y59Vlbvm_Lkh0HlHy4qYTJg15uGouMf4H',
    },
    {
      id: 'v2',
      title: 'Herbal Face Wash',
      price: '₹349',
      thumb: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHnFfmbzs4odu4hUcNbwNd-OrXTBHOw41GW-tf2Bmna5p-oJmZUFqsC1sBj8txLrKD33VBEvxYtGShx6CF-f1GbvmzwWHQ4eptdfGsDUdizSlp9go6ALz_fF1JyGAq3Lhl3sdIMZmPbM3ZF659XjIsYoQc4giS_ewhlT0DPW6sxfsMs_doKDdM-TgL3MwIfp4o7xpABiKVYy3uWo8XQj5Tk5nxnaDD9NPr7bR3OM_KyUbFqFTRxxzy',
      videoBg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4hGIPIejk60bEezIYicTQLJpMY5-qQKabcM6coMemOPeELnvU355rNxezfAka_vpZYvzKdAANiQdIfxCyWItJuApZwrQ4SUljqMS3AekmtsH56lTNrV4yW0CQvYPydHykT6-6IKpcE5uGJ20Z56o9G0C2eHNyFnuqZWAh_vJe-QW9MOs5ZoDzdwe8IaVgq9NUeT4Hqus39jZhB8kLV3Ey6_HyCuw8nlP2Tjnl01lROQmU2bmezRlX',
    },
    {
      id: 'v3',
      title: 'Body Butter',
      price: '₹599',
      thumb: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAC4_O-VCsUAlu719m1m0vV3KMOoUtAFzG3dkrQycKtnheA5jOA15zyNCpS17Lh9rLBJtLA7ZvuOKLRPZZhdpXFgDiYWUXF-BZ0-racDb1CIYbqiamFr6ZvwLMEGJtfvd0faHNL1BQ-pt5hzJtC2UmK-QmF8jzuIPJRDOiqvfSoEDMgZgwFiJ69FRJdGuK_ZQwvGAJAcLGKr5eC7_Mq78PJIKrkGLBPDjaE0rPxJk6R9jx6XNoMOK7g',
      videoBg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAD-2JQ6dXD42VIKrGXpTgMQTarLSKdbwD46cJkLtP_7TKmMwzx660Ighbfe8kVX9geq_iFddOwwXLrmF5IUWRmWPIceuSmb0o_ZkJXyyQI7Qx6azaAPeHi0N1E2POWR1T4ju4EMfbkFPHLRnqRvgeN4mRjqZHMuSFjQNvvKRxs6S6qMQV8oSkCP0Taxihl9ZPeMTHEHAjrc_9Rv2IjLN3zJ7xdBD68AjQX7bu18WyNBhnLFQBdVe83',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FB] text-[#191C1E] font-sans antialiased pb-[80px]">
      <Header />
      <CartDrawer />

      <main className="flex-1 flex flex-col gap-8 pt-4">
        {/* Search & Announcement Tags */}
        <section className="px-4 flex flex-col gap-4 max-w-5xl mx-auto w-full">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search soaps, skincare and body care..."
              className="w-full bg-[#F2F4F6] text-[#191C1E] text-sm rounded-full py-3.5 pl-12 pr-4 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#002754] transition-all placeholder:text-gray-400 shadow-sm"
            />
          </form>

          <div className="flex gap-3 overflow-x-auto hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="flex-none bg-[#002754]/10 text-[#002754] px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap border border-[#002754]/10">
              Free Shipping above ₹499
            </div>
            <div className="flex-none bg-[#465F8A]/20 text-[#465F8A] px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap border border-[#465F8A]/10">
              Buy 2 Get 1 Free
            </div>
            <div className="flex-none bg-[#DAE3F4] text-[#131C28] px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap">
              New Launch: Charcoal Series
            </div>
          </div>
        </section>

        {/* Shop By Category */}
        <section className="px-4 max-w-5xl mx-auto w-full">
          <h3 className="font-serif text-2xl font-semibold text-[#002754] mb-4">Shop By Category</h3>
          <div className="flex gap-6 overflow-x-auto hide-scrollbar py-2">
            {categoryAvatars.map((cat, idx) => (
              <div key={idx} className="flex-none flex flex-col items-center gap-2 cursor-pointer group" onClick={() => router.push('/shop')}>
                <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center border border-gray-100 overflow-hidden group-hover:scale-105 transition-transform">
                  <img src={cat.image} alt={cat.title} className="w-full h-full object-cover" />
                </div>
                <span className="text-xs font-semibold text-[#191C1E] whitespace-nowrap">{cat.title}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Dynamic Auto-Sliding Hero Carousel Banner */}
        {activeBanners.length > 0 && (() => {
          const currentBanner = activeBanners[activeSlideIndex % activeBanners.length];
          return (
            <section className="px-4 max-w-5xl mx-auto w-full">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/5] sm:aspect-[16/7] shadow-xl bg-[#002754]">
                <img
                  key={currentBanner.id || activeSlideIndex}
                  src={currentBanner.imageUrl}
                  alt={currentBanner.title}
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#002754]/95 via-[#002754]/45 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 sm:p-12 w-full text-center sm:text-left flex flex-col items-center sm:items-start z-10">
                  {currentBanner.badgeText && (
                    <span className="bg-[#C5A880] text-[#002754] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3 shadow-sm">
                      {currentBanner.badgeText}
                    </span>
                  )}
                  <h2 className="font-serif text-2xl sm:text-4xl font-semibold text-white mb-2 max-w-xl">
                    {currentBanner.title}
                  </h2>
                  <p className="text-sm sm:text-base text-white/90 mb-6 max-w-md">
                    {currentBanner.subtitle}
                  </p>
                  <button
                    onClick={() => router.push(currentBanner.ctaLink || '/shop')}
                    className="bg-gradient-to-r from-[#0A3D78] to-[#002754] text-white font-semibold text-sm px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all border border-white/20 hover:scale-105"
                  >
                    {currentBanner.ctaText || 'Shop Now'}
                  </button>

                  {/* Indicator Dots */}
                  <div className="flex justify-center sm:justify-start gap-2 mt-6">
                    {activeBanners.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveSlideIndex(idx)}
                        className={`h-1.5 rounded-full transition-all ${
                          activeSlideIndex === idx ? 'w-6 bg-white' : 'w-1.5 bg-white/40'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </section>
          );
        })()}

        {/* Watch & Shop */}
        <section className="px-4 max-w-5xl mx-auto w-full">
          <h3 className="font-serif text-2xl font-semibold text-[#002754] mb-4">Watch &amp; Shop</h3>
          <div className="flex gap-4 overflow-x-auto hide-scrollbar">
            {watchShopVideos.map((vid) => (
              <div key={vid.id} className="flex-none w-48 aspect-[9/16] bg-gray-100 rounded-2xl relative overflow-hidden group shadow-md cursor-pointer">
                <img src={vid.videoBg} alt={vid.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-5xl opacity-80 group-hover:scale-110 transition-transform">
                    play_circle
                  </span>
                </div>
                <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-sm rounded-lg p-2 flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-gray-200 overflow-hidden flex-none">
                    <img src={vid.thumb} alt={vid.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-gray-900 truncate">{vid.title}</p>
                    <p className="text-[10px] text-[#002754] font-semibold">{vid.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Shop By Concern */}
        <section className="px-4 max-w-5xl mx-auto w-full">
          <h3 className="font-serif text-2xl font-semibold text-[#002754] mb-4">Shop By Concern</h3>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar">
            {concerns.map((c) => (
              <button
                key={c}
                onClick={() => setActiveConcern(c)}
                className={`px-5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  activeConcern === c
                    ? 'bg-[#002754] text-white'
                    : 'bg-[#E6E8EA] text-[#434750] border border-gray-300 hover:bg-gray-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </section>

        {/* Best Sellers */}
        <section className="px-4 max-w-5xl mx-auto w-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-serif text-2xl font-semibold text-[#002754]">Best Sellers</h3>
            <Link href="/shop" className="text-[#002754] text-xs font-bold uppercase tracking-wider hover:underline">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Sandalwood Luxury Soap */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col border border-gray-100">
              <div className="relative aspect-square">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLi8BEEcvYkRFbiNYee-N9pm2_s6ndTvcNkJ4y4Nrcp5yd-P7eI1QQBskU2funPCvXEqu67VY47-MUpKsVtDOSDpNOtcSymdGz6851J0jCamqe7cCHE_KarRWT7velF1a1hXCvJpateZeGhwW68AjO4cr2BV8XsxpxNrDJovgt79-7g0VTHn0y2ozH8gzP77DK81SpHyx6Z2NI8rKJ48kIuDPZRVt2zkqQ8gkuX8uc2K6EItZnDHcl"
                  alt="Sandalwood Soap"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 bg-[#465F8A] text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Top Rated
                </span>
                <button
                  onClick={() => toggleItem('p1')}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#002754]"
                >
                  <span className={`material-symbols-outlined text-lg ${isWishlisted('p1') ? 'text-red-500 fill-current' : ''}`}>
                    favorite
                  </span>
                </button>
              </div>
              <div className="p-3 flex-1 flex flex-col gap-1">
                <div className="flex items-center gap-1 text-[10px] text-[#465F8A]">
                  <span className="material-symbols-outlined text-[12px] text-amber-500">star</span>
                  <span>4.8 (1.2k)</span>
                </div>
                <h4 className="text-xs font-bold text-[#191C1E] line-clamp-2">Sandalwood &amp; Saffron Luxury Soap</h4>
                <div className="mt-auto pt-2">
                  <p className="text-[#002754] font-bold text-sm">
                    ₹249 <span className="text-gray-400 text-xs line-through font-normal ml-1">₹350</span>
                  </p>
                  <button
                    onClick={() =>
                      addItem({
                        id: 'ci_sandalwood',
                        cartId: 'c1',
                        productId: 'p1',
                        unitPrice: 249,
                        totalPrice: 249,
                        quantity: 1,
                        product: { id: 'p1', title: 'Sandalwood & Saffron Soap', slug: 'sandalwood-soap', images: [], processType: 'cold-process' },
                        variant: { id: 'v1', sku: 'SKU-SAN', title: 'Default', price: 249, weightGrams: 150, volumeMl: 0, options: {} },
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                      })
                    }
                    className="w-full mt-2 border-2 border-[#002754] text-[#002754] py-1.5 rounded-xl text-xs font-bold hover:bg-[#002754] hover:text-white transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>

            {/* Vit C Serum */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col border border-gray-100">
              <div className="relative aspect-square">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxglU_913hJAApUMg2iOhzfjeFzxCh1GLo5bHQgsP-MvaGYLOMIKuLn60dqkfmtrUAbe_k_5pdHGwCC-OnyC9-mSf7K6TFe1y1zdawHjJmKzDHh2IilNAt_Hscs_4LR1g_Sm9KiR_ApGDoMTYgNJNN6as7IIzYXf7BprDVq0Uzru2_swUX01SRJK9seAqyIknGvbUDMuB2agm-0w9fFO2o4CkjtXwS2dxKDbQp2Ln3AGQaLzMAsa8R"
                  alt="Face Serum"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 bg-[#BA1A1A] text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Sale
                </span>
                <button
                  onClick={() => toggleItem('p2')}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#002754]"
                >
                  <span className={`material-symbols-outlined text-lg ${isWishlisted('p2') ? 'text-red-500 fill-current' : ''}`}>
                    favorite
                  </span>
                </button>
              </div>
              <div className="p-3 flex-1 flex flex-col gap-1">
                <div className="flex items-center gap-1 text-[10px] text-[#465F8A]">
                  <span className="material-symbols-outlined text-[12px] text-amber-500">star</span>
                  <span>4.9 (850)</span>
                </div>
                <h4 className="text-xs font-bold text-[#191C1E] line-clamp-2">Hydrating Face Serum with Vit C</h4>
                <div className="mt-auto pt-2">
                  <p className="text-[#002754] font-bold text-sm">
                    ₹499 <span className="text-gray-400 text-xs line-through font-normal ml-1">₹699</span>
                  </p>
                  <button
                    onClick={() =>
                      addItem({
                        id: 'ci_serum',
                        cartId: 'c1',
                        productId: 'p2',
                        unitPrice: 499,
                        totalPrice: 499,
                        quantity: 1,
                        product: { id: 'p2', title: 'Vit C Face Serum', slug: 'vit-c-serum', images: [], processType: 'cold-process' },
                        variant: { id: 'v2', sku: 'SKU-SERUM', title: 'Default', price: 499, weightGrams: 100, volumeMl: 50, options: {} },
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                      })
                    }
                    className="w-full mt-2 border-2 border-[#002754] text-[#002754] py-1.5 rounded-xl text-xs font-bold hover:bg-[#002754] hover:text-white transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Promotional Banner */}
        <section className="px-4 max-w-5xl mx-auto w-full">
          <div className="relative rounded-2xl overflow-hidden aspect-[16/7] bg-[#002754] shadow-lg">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDF1LQEjxBq0OtLya_zBSJmrBZGcpIt5GSK2bjVJwv_OH2wEvIFvmkvPBOwrecHsjs_oyNThVL7ZH4AUdRer9JJTMlrFAnb8z4ralUPHUwN9WP4S-39GnkgDrqIEgWZw9RaJtY8iwvffsTZD_Popbvs_HN8VBfLLeWF7GtyAos2D-BFKUhivqRdo3aEuD_KXEEev5cHd6UEVnfdZhhC6iRO1kHJA_rMX0q8Z19vqu_okch2q5g6QKPu"
              alt="Monsoon Sale"
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-4 text-center">
              <p className="text-[10px] font-bold tracking-widest uppercase mb-1">Monsoon Magic Sale</p>
              <h3 className="text-2xl sm:text-3xl font-bold mb-2">Flat 40% OFF</h3>
              <p className="text-xs sm:text-sm text-white/80 mb-3">On all Gift Hampers &amp; Combo Packs</p>
              <button onClick={() => router.push('/shop')} className="bg-white text-[#002754] px-6 py-2 rounded-full text-xs font-bold shadow-md hover:bg-gray-100 transition-colors">
                Grab Now
              </button>
            </div>
          </div>
        </section>

        {/* Real Results (Before & After) */}
        <section className="px-4 max-w-5xl mx-auto w-full">
          <h3 className="font-serif text-2xl font-semibold text-[#002754] mb-4">Real Results</h3>
          <div className="flex gap-4 overflow-x-auto hide-scrollbar">
            <div className="flex-none w-64 bg-white rounded-2xl shadow-md p-3 border border-gray-100">
              <div className="flex gap-2 mb-3">
                <div className="flex-1 relative rounded-lg overflow-hidden">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5BOW-AMfn4OYmw2raRZLFjyAXl9_Og2oljlyp6Ey3blAt0F58rE21Yc2kFmrF_m8w0_bszNhtfNPcsATPHO3DTKc5-xaT7Y0ZjBW1_TNzJioa5TZURDMTRt1t9pX3z-tlGfEKQwtCCItGZeCLGFICOAr2rCVYxeE6NlxuyABQQ3_aEL3gjrXGthTSnEDu44eD7saHOsvmf4hq5dtRwLMPjiu3W-zO2yCyhMDJBYPlz9EKgQiy_WhT" alt="Before" className="w-full h-24 object-cover" />
                  <span className="absolute bottom-1 left-1 bg-black/50 text-white text-[8px] px-1 rounded">Before</span>
                </div>
                <div className="flex-1 relative rounded-lg overflow-hidden">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBYYqfLzkyDJCgmUIN62zfpDnVNi80xAnbOwXMzWR_EC665r4W7a8jgxawqehE-NsGCjsao-u0awGHY1IawWevNQcSWP5uOLvmXo8iVoso9HXauK_4wWL6zedipG6xSlBnZ7PvBUQQw8SDi5OQEIzGlroqvATlo8emGKQmNpZkYbPTV5kb74HCXzfWSSdwZ-feAljIXulzIuzrRfkFuPTBDYlbTWpuPRjpYWGCmJD3d7oLoTXmRmLR" alt="After" className="w-full h-24 object-cover" />
                  <span className="absolute bottom-1 left-1 bg-[#002754] text-white text-[8px] px-1 rounded">After</span>
                </div>
              </div>
              <p className="text-xs font-bold text-[#002754] mb-1 italic">"My acne cleared in just 3 weeks!"</p>
              <p className="text-[10px] text-gray-500">Ananya V. used Neem &amp; Tea Tree Soap</p>
            </div>

            <div className="flex-none w-64 bg-white rounded-2xl shadow-md p-3 border border-gray-100">
              <div className="flex gap-2 mb-3">
                <div className="flex-1 relative rounded-lg overflow-hidden">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSmwCmvA7_D8HomTuRM1h4-XIekacntzbTsKXAOZG-yS7i__CLwkYk_ZZ_UOnBrjjU8xOv5kTZV5YSZTE1ASD_krTM85OV_eoo2-OdqxYoW3fFM68y1SFpuzcDcdVOne23KTXLBIjJE2wpjkz-UngniFKww-KJQ-RfOZtIPghQaj9f-nc5GqCXz92BG7S8HGuPprjsgHU5ZXUr3XrOx9B1l-p0YjEDb7TIcTa1rXXxTZZvg6k87pnV" alt="Before" className="w-full h-24 object-cover" />
                  <span className="absolute bottom-1 left-1 bg-black/50 text-white text-[8px] px-1 rounded">Before</span>
                </div>
                <div className="flex-1 relative rounded-lg overflow-hidden">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4Vn-kpObT8hA33krBjhT874sGUANPgaNnCqeLWi4cdTn7XPL8hHvwiWiOJy8s4pA2TeUfQLer9uuetutL-BqlbyfGUwRXlbsDku2FVeRYPqNkvVUfUBU9DOrX137dmO2fuSNWqiEJUGpHxZUarqOK4deyr8MvM26JYCwqdoH2f6nR5-fDNBBjptXUum-NGLugvCOsk6E9eLos1suar0a-SACWpOkirGvowgxOjlO7t7OpaA5tfimw" alt="After" className="w-full h-24 object-cover" />
                  <span className="absolute bottom-1 left-1 bg-[#002754] text-white text-[8px] px-1 rounded">After</span>
                </div>
              </div>
              <p className="text-xs font-bold text-[#002754] mb-1 italic">"The glow is actually visible now."</p>
              <p className="text-[10px] text-gray-500">Rahul S. used Sandalwood Serum</p>
            </div>
          </div>
        </section>

        {/* Why Choose CINMAX? */}
        <section className="px-4 max-w-5xl mx-auto w-full py-4">
          <h3 className="font-serif text-2xl font-semibold text-[#002754] text-center mb-6">Why Choose CINMAX?</h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-6">
            {[
              { title: '100% Natural', icon: 'eco' },
              { title: 'Dermatologist Tested', icon: 'health_and_safety' },
              { title: 'Cruelty Free', icon: 'cruelty_free' },
              { title: 'No Parabens', icon: 'fluid_med' },
              { title: 'Clinically Proven', icon: 'science' },
              { title: 'Ayush Certified', icon: 'workspace_premium' },
            ].map((pillar, idx) => (
              <div key={idx} className="flex flex-col items-center text-center gap-2">
                <div className="w-12 h-12 rounded-full bg-[#002754]/10 flex items-center justify-center text-[#002754]">
                  <span className="material-symbols-outlined">{pillar.icon}</span>
                </div>
                <p className="text-[10px] font-bold text-[#191C1E]">{pillar.title}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
