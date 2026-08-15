import type { HomeMarketingSettings } from '@cinmax/types';
import type { IHomeMarketingRepository } from './repository.interface';

const defaultMarketingSettings: HomeMarketingSettings = {
  topOffers: [
    '🔥 Flash Sale: Flat 20% OFF on all soaps',
    '🚚 Free Express Shipping on orders over ₹499',
    '🎁 Buy 2 Get 1 Free on Neem Herbal Range',
  ],
  heroBanners: [
    {
      id: 'hb_1',
      title: 'French Green Clay & Eucalyptus',
      subtitle: 'Artisan Cold-Processed Saponification • 40-Day Slow Cured',
      imageUrl: 'https://images.unsplash.com/photo-1607006314147-759088fd21c2?w=1600&auto=format&fit=crop&q=80',
      badgeText: 'New Cure Release',
      buttonText: 'Discover Blend',
      linkUrl: '/shop',
      isActive: true,
    },
    {
      id: 'hb_2',
      title: 'Azure Marine Botanical Bar',
      subtitle: 'Wild-harvested Atlantic kelp & organic bergamot peel hydration.',
      imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1600&auto=format&fit=crop&q=80',
      badgeText: 'Atelier Signature',
      buttonText: 'Shop Collection',
      linkUrl: '/product/azure-marine-botanical-bar',
      isActive: true,
    },
  ],
  watchShopVideos: [
    {
      id: 'v1',
      slug: 'aloe-vera-soap',
      title: 'Aloe Vera Soap',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-skin-care-product-routine-42901-large.mp4',
      productName: 'Aloe Vera Soap',
      productPrice: '₹199',
      productImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC85VgeJRlaGssVKe4o5MaUTzkpQWnScMZ6g9JvCSe-AhjElgCk-Yowqs1H5yrvUiFwhlWsilPdz9OOpG1Ws6cEJPX3MqFjZYdw9mFcjU-6d2GmTnneNs0Hv4b0MNq3arAlFZt4a8TD4uN0jtZdcgrqrUYi4dEkRyGZTOfAX4Yp6YgHz-xA0zhXWRpnfIk3FrKENZ9c9b6hfKS6VNogJjs5ByDdGYS0ggxXlRgx8KWscPhk-oThH0B1',
      isActive: true,
    },
    {
      id: 'v2',
      slug: 'herbal-face-wash',
      title: 'Herbal Face Wash',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-applying-facial-cream-42900-large.mp4',
      productName: 'Herbal Face Wash',
      productPrice: '₹349',
      productImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHnFfmbzs4odu4hUcNbwNd-OrXTBHOw41GW-tf2Bmna5p-oJmZUFqsC1sBj8txLrKD33VBEvxYtGShx6CF-f1GbvmzwWHQ4eptdfGsDUdizSlp9go6ALz_fF1JyGAq3Lhl3sdIMZmPbM3ZF659XjIsYoQc4giS_ewhlT0DPW6sxfsMs_doKDdM-TgL3MwIfp4o7xpABiKVYy3uWo8XQj5Tk5nxnaDD9NPr7bR3OM_KyUbFqFTRxxzy',
      isActive: true,
    },
  ],
  midBanner: {
    title: 'Monsoon Magic Sale',
    subtitle: 'On all Gift Hampers & Combo Packs',
    badgeText: 'LIMITED PERIOD OFFER',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDF1LQEjxBq0OtLya_zBSJmrBZGcpIt5GSK2bjVJwv_OH2wEvIFvmkvPBOwrecHsjs_oyNThVL7ZH4AUdRer9JJTMlrFAnb8z4ralUPHUwN9WP4S-39GnkgDrqIEgWZw9RaJtY8iwvffsTZD_Popbvs_HN8VBfLLeWF7GtyAos2D-BFKUhivqRdo3aEuD_KXEEev5cHd6UEVnfdZhhC6iRO1kHJA_rMX0q8Z19vqu_okch2q5g6QKPu',
    buttonText: 'Grab Now',
    linkUrl: '/(tabs)/shop',
    isActive: true,
  },
  realResults: [
    {
      id: 'r1',
      beforeUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5BOW-AMfn4OYmw2raRZLFjyAXl9_Og2oljlyp6Ey3blAt0F58rE21Yc2kFmrF_m8w0_bszNhtfNPcsATPHO3DTKc5-xaT7Y0ZjBW1_TNzJioa5TZURDMTRt1t9pX3z-tlGfEKQwtCCItGZeCLGFICOAr2rCVYxeE6NlxuyABQQ3_aEL3gjrXGthTSnEDu44eD7saHOsvmf4hq5dtRwLMPjiu3W-zO2yCyhMDJBYPlz9EKgQiy_WhT',
      afterUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBYYqfLzkyDJCgmUIN62zfpDnVNi80xAnbOwXMzWR_EC665r4W7a8jgxawqehE-NsGCjsao-u0awGHY1IawWevNQcSWP5uOLvmXo8iVoso9HXauK_4wWL6zedipG6xSlBnZ7PvBUQQw8SDi5OQEIzGlroqvATlo8emGKQmNpZkYbPTV5kb74HCXzfWSSdwZ-feAljIXulzIuzrRfkFuPTBDYlbTWpuPRjpYWGCmJD3d7oLoTXmRmLR',
      quote: '"My acne cleared in just 3 weeks!"',
      userName: 'Ananya V. used Neem & Tea Tree Soap',
      isActive: true,
    },
    {
      id: 'r2',
      beforeUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSmwCmvA7_D8HomTuRM1h4-XIekacntzbTsKXAOZG-yS7i__CLwkYk_ZZ_UOnBrjjU8xOv5kTZV5YSZTE1ASD_krTM85OV_eoo2-OdqxYoW3fFM68y1SFpuzcDcdVOne23KTXLBIjJE2wpjkz-UngniFKww-KJQ-RfOZtIPghQaj9f-nc5GqCXz92BG7S8HGuPprjsgHU5ZXUr3XrOx9B1l-p0YjEDb7TIcTa1rXXxTZZvg6k87pnV',
      afterUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4Vn-kpObT8hA33krBjhT874sGUANPgaNnCqeLWi4cdTn7XPL8hHvwiWiOJy8s4pA2TeUfQLer9uuetutL-BqlbyfGUwRXlbsDku2FVeRYPqNkvVUfUBU9DOrX137dmO2fuSNWqiEJUGpHxZUarqOK4deyr8MvM26JYCwqdoH2f6nR5-fDNBBjptXUum-NGLugvCOsk6E9eLos1suar0a-SACWpOkirGvowgxOjlO7t7OpaA5tfimw',
      quote: '"The glow is actually visible now."',
      userName: 'Rahul S. used Sandalwood Serum',
      isActive: true,
    },
  ],
  trustBadges: [
    { id: 'tb_1', label: '100% Natural', iconName: 'Leaf', isActive: true },
    { id: 'tb_2', label: 'Dermatologist Tested', iconName: 'ShieldCheck', isActive: true },
    { id: 'tb_3', label: 'Cruelty Free', iconName: 'Heart', isActive: true },
    { id: 'tb_4', label: 'No Parabens', iconName: 'CheckCircle', isActive: true },
    { id: 'tb_5', label: 'Clinically Proven', iconName: 'FlaskConical', isActive: true },
    { id: 'tb_6', label: 'Ayush Certified', iconName: 'Award', isActive: true },
  ],
  bottomBanner: {
    title: 'Crafted with Quality',
    subtitle: 'Our state-of-the-art facility ensures every bar of soap meets global standards of purity.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGE69IJlast_Ul6rXuCQSS3GH9L16poRY-l4l0iLBhoriu0C4LiZu3f7ZasTL9El20BxRnLTR3yhtY06Qyv2WRC2rkh3JMyHvdbriffqhNy4zqgJbeSfm_sQdZRfhBRJvCHtUEkCDdOoUFSDEUFRamWxTJs7vcGIUEWF00FZywN7h07CqZpCeqT6qRYsAmAO2bk5-APQk-HdqbqLMS5IQmGNzYH5WjPfz9gHlMpUg46Re6GavrK01c',
    buttonText: 'Learn More',
    linkUrl: '/about',
    isActive: true,
  },
  updatedAt: new Date().toISOString(),
};

export class MockHomeMarketingRepository implements IHomeMarketingRepository {
  private settings: HomeMarketingSettings = { ...defaultMarketingSettings };

  public async getSettings(): Promise<HomeMarketingSettings> {
    return { ...this.settings };
  }

  public async updateSettings(newSettings: Partial<HomeMarketingSettings>): Promise<HomeMarketingSettings> {
    this.settings = {
      ...this.settings,
      ...newSettings,
      updatedAt: new Date().toISOString(),
    };
    return { ...this.settings };
  }
}
