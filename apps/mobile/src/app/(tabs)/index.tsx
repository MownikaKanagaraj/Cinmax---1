import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Dimensions,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ProductCard } from '../../components/ProductCard';
import { useCartStore, useWishlistStore, useProductsQuery, useCategoriesQuery, useHomeMarketingQuery } from '@cinmax/hooks';
import type { Product } from '@cinmax/types';
import {
  Menu,
  Heart,
  ShoppingBag,
  Search,
  PlayCircle,
  Star,
  Leaf,
  ShieldCheck,
  Award,
  FlaskConical,
  CheckCircle,
} from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CONTAINER_PADDING = 20;

const FONT_SERIF_BOLD = Platform.select({
  web: "'Noto Serif', Georgia, serif",
  default: 'NotoSerif_700Bold',
});

const FONT_SERIF_SEMIBOLD = Platform.select({
  web: "'Noto Serif', Georgia, serif",
  default: 'NotoSerif_600SemiBold',
});

const FONT_SANS_REGULAR = Platform.select({
  web: "'Plus Jakarta Sans', system-ui, sans-serif",
  default: 'PlusJakartaSans_400Regular',
});

const FONT_SANS_SEMIBOLD = Platform.select({
  web: "'Plus Jakarta Sans', system-ui, sans-serif",
  default: 'PlusJakartaSans_600SemiBold',
});

const FONT_SANS_BOLD = Platform.select({
  web: "'Plus Jakarta Sans', system-ui, sans-serif",
  default: 'PlusJakartaSans_700Bold',
});

export default function MobileHomeScreen() {
  const router = useRouter();
  const { addItem, items: cartItems } = useCartStore();
  const { toggleItem, isWishlisted } = useWishlistStore();
  const { data: categories = [] } = useCategoriesQuery();
  const { data: productsData } = useProductsQuery();
  const { data: homeMarketingData } = useHomeMarketingQuery();
  const products: Product[] = productsData?.items || [];

  const topOffers = homeMarketingData?.topOffers || [
    'Free Shipping above ₹499',
    'Buy 2 Get 1 Free',
    'New Launch: Charcoal Series',
  ];

  const activeBanners = (homeMarketingData?.heroBanners || []).filter(b => b.isActive).map(b => ({
    id: b.id,
    title: b.title,
    subtitle: b.subtitle,
    badgeText: b.badgeText || 'Featured',
    ctaText: b.buttonText,
    ctaLink: b.linkUrl,
    imageUrl: b.imageUrl,
  }));

  const watchShopVideos = (homeMarketingData?.watchShopVideos || []).map(v => ({
    id: v.id,
    slug: v.slug || 'product',
    title: v.title,
    price: v.productPrice,
    thumb: v.productImage,
    videoBg: v.productImage,
  }));

  const midBanner = homeMarketingData?.midBanner || {
    title: 'Monsoon Magic Sale',
    subtitle: 'On all Gift Hampers & Combo Packs',
    badgeText: 'LIMITED PERIOD OFFER',
    buttonText: 'Grab Now',
    linkUrl: '/shop',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDF1LQEjxBq0OtLya_zBSJmrBZGcpIt5GSK2bjVJwv_OH2wEvIFvmkvPBOwrecHsjs_oyNThVL7ZH4AUdRer9JJTMlrFAnb8z4ralUPHUwN9WP4S-39GnkgDrqIEgWZw9RaJtY8iwvffsTZD_Popbvs_HN8VBfLLeWF7GtyAos2D-BFKUhivqRdo3aEuD_KXEEev5cHd6UEVnfdZhhC6iRO1kHJA_rMX0q8Z19vqu_okch2q5g6QKPu',
  };

  const realResults = (homeMarketingData?.realResults || []).map(r => ({
    id: r.id,
    before: r.beforeUrl,
    after: r.afterUrl,
    quote: r.quote,
    user: r.userName,
  }));

  const trustBadges = (homeMarketingData?.trustBadges || []).map(tb => ({
    label: tb.label,
    icon: Leaf,
  }));

  const bottomBanner = homeMarketingData?.bottomBanner || {
    title: 'Crafted with Quality',
    subtitle: 'Our state-of-the-art facility ensures every bar meets global standards of purity.',
    buttonText: 'Learn More',
    linkUrl: '/about',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGE69IJlast_Ul6rXuCQSS3GH9L16poRY-l4l0iLBhoriu0C4LiZu3f7ZasTL9El20BxRnLTR3yhtY06Qyv2WRC2rkh3JMyHvdbriffqhNy4zqgJbeSfm_sQdZRfhBRJvCHtUEkCDdOoUFSDEUFRamWxTJs7vcGIUEWF00FZywN7h07CqZpCeqT6qRYsAmAO2bk5-APQk-HdqbqLMS5IQmGNzYH5WjPfz9gHlMpUg46Re6GavrK01c',
  };

  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  React.useEffect(() => {
    if (activeBanners.length <= 1) return;
    const timer = setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % activeBanners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [activeBanners.length]);

  const scrollViewRef = React.useRef<ScrollView>(null);

  React.useEffect(() => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: false });
  }, []);

  const [activeConcern, setActiveConcern] = useState('Dry Skin');
  const [searchQuery, setSearchQuery] = useState('');

  const categoryAvatars = [
    { title: 'Bath Soap', slug: 'bath-soap', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpIoHGNt8K2IwZW-F7gzPobXAQUkVIt2KYkxhO1eSWplJXLrQKYGRddfIymkCSroyFXB8-bWWemt7g5oMW-QpG6401-FXIeIHBY5gdDUSwpqyUX9ASwRH9i_EYGp8sS3wtlDGrTKjSkj3P3ZuMLYr191TC1dCtJdFHUe9t5dST4XtFX8ZQtpfJMtLfqCqL4lYC59QY4ctPuIn07bfFJ2AkLFiqAmf5m7wg_Ldo1bT2_Rp9HgNvu7ZA' },
    { title: 'Herbal Soap', slug: 'herbal-soap', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAa4yv0gYZBUd0SEVtTlVkMcGNANs-fgctuNM7SEzJYRxMxlkKJaT71DPF-EfhUVwQEzMftaBRYvstM11GaElv3osNZTKJJjEvMhzYBcGPk9efj5Gm-4Wp01Zh5tXW62PxsReysnnieVjiZUVbyRSWHEA2vS72W5wQb8LDdGHq5A79LxgeeDpkDn9c7KZpMl2BQ8MaYGO6KlOxhOgDt6PxHmj5Cug4uIJBKl-9VtVLaYV7vbS2Y8c6a' },
    { title: 'Face Care', slug: 'face-care', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoRsDMNvc9hgexWVqa6dtEaFl6nN2xCiF5iV-T5gl46JoAnOu5AOcZVfxL9hm_305zBiYjSitTmh6CRwDk51PB-8Df_pnQe40YxDitX72iQeZBpAAO1XnjsIptJ49nlYqnJwTojbIFo8vNtTfc5JczIdvDP2BXDEXZ2bP1Q1F_keOYHZBudHhE6aq_uWSDGEfXUPHwbT-Juuf3giE7gZrvYHwU9KjCJ6nk_A4BEEPadfPeSazwudst' },
    { title: 'Body Care', slug: 'body-care', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9lubmr39J6fZHpoItlXf_vE7Bt7g6eAd8NLC8ETl92RmQDIJBDBkLOuLbRoUEqrQfaJNP_bii3VO1DgAp9db1R-jRWQZVjvb6fU-1ol1kFRS_x95uIcyFDPiYZcrMCRgekQJwOet1HRiKwlVPeduydGDOAr5-saKjPVmo60e2NpXEdgW-Fx3Dm6cGMkvatrS4e2r_raXj_I_cn-RPyrTVo47B71tY4cqSDuxf0XSWQaT4lsWufVlk' },
    { title: 'Hair Care', slug: 'hair-care', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDraVE7daOdNCK2xnaJeAdZY2woblVfcS9rPgNefx3K2TiDXuvlWmiVrSSpeHDAHTMhkvGZ-O-E13eY581zZpfpskz6Pf8dIVqFcwgZlLbNTfoy1MojHODIOgFfB5-T0LGfkprN3RI-vp4y-5onqnuatv5Vnlp2qvHwqcG8wsgcicy24HiQM34fOWXv8H6H70V7fMLoPCK37_O2JIzLgB3Qk4x6vtLBWPuW5zJjBoC-X9ExblUanHfd' },
    { title: 'Gift Sets', slug: 'gift-sets', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcZZWrp5hww_VPAwl39MRLYADlGq40ikgeByV0ShCSdwukE1M-0aSyIT-bPuQjX_4vZD8emKVM2DUnDENsUEfebjJszH3gEzzLdmzCt7al9id7-iq9xrW35wpa2Cef7YAGrttP91IpoTjst02TV7IeWekbi4rPgTdgJBYnT9iFt-B8eQCRor6WUabNr17n5HnRRBbHR3gS6REGi72jNv7evGuHKYi6QeFs9DHcHu40iMzej5u4PtFe' },
  ];

  const watchShopVideos = [
    {
      id: 'v1',
      slug: 'aloe-vera-soap',
      title: 'Aloe Vera Soap',
      price: '₹199',
      thumb: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC85VgeJRlaGssVKe4o5MaUTzkpQWnScMZ6g9JvCSe-AhjElgCk-Yowqs1H5yrvUiFwhlWsilPdz9OOpG1Ws6cEJPX3MqFjZYdw9mFcjU-6d2GmTnneNs0Hv4b0MNq3arAlFZt4a8TD4uN0jtZdcgrqrUYi4dEkRyGZTOfAX4Yp6YgHz-xA0zhXWRpnfIk3FrKENZ9c9b6hfKS6VNogJjs5ByDdGYS0ggxXlRgx8KWscPhk-oThH0B1',
      videoBg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYWOizEZDuaWyblNqgPfFEOp2E1S7-_r3mCe31-TBndf4pZxCjh2WDz36JQXQQfn9nTUKRwkJQVEpJxhw2BTQPQxMZkK9r6if5X5njBMJSkHpNL2nwiLENqAJSO5xK6NCr0QZXwBEvffOB72Q3ibHuQm_Eqes4JwzBFp69fDYzpDWBnHA5ruI2brQhhUnpla7L_gLVYd9EmdQVK1Yg446y59Vlbvm_Lkh0HlHy4qYTJg15uGouMf4H',
    },
    {
      id: 'v2',
      slug: 'herbal-face-wash',
      title: 'Herbal Face Wash',
      price: '₹349',
      thumb: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHnFfmbzs4odu4hUcNbwNd-OrXTBHOw41GW-tf2Bmna5p-oJmZUFqsC1sBj8txLrKD33VBEvxYtGShx6CF-f1GbvmzwWHQ4eptdfGsDUdizSlp9go6ALz_fF1JyGAq3Lhl3sdIMZmPbM3ZF659XjIsYoQc4giS_ewhlT0DPW6sxfsMs_doKDdM-TgL3MwIfp4o7xpABiKVYy3uWo8XQj5Tk5nxnaDD9NPr7bR3OM_KyUbFqFTRxxzy',
      videoBg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4hGIPIejk60bEezIYicTQLJpMY5-qQKabcM6coMemOPeELnvU355rNxezfAka_vpZYvzKdAANiQdIfxCyWItJuApZwrQ4SUljqMS3AekmtsH56lTNrV4yW0CQvYPydHykT6-6IKpcE5uGJ20Z56o9G0C2eHNyFnuqZWAh_vJe-QW9MOs5ZoDzdwe8IaVgq9NUeT4Hqus39jZhB8kLV3Ey6_HyCuw8nlP2Tjnl01lROQmU2bmezRlX',
    },
    {
      id: 'v3',
      slug: 'body-butter',
      title: 'Body Butter',
      price: '₹599',
      thumb: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAC4_O-VCsUAlu719m1m0vV3KMOoUtAFzG3dkrQycKtnheA5jOA15zyNCpS17Lh9rLBJtLA7ZvuOKLRPZZhdpXFgDiYWUXF-BZ0-racDb1CIYbqiamFr6ZvwLMEGJtfvd0faHNL1BQ-pt5hzJtC2UmK-QmF8jzuIPJRDOiqvfSoEDMgZgwFiJ69FRJdGuK_ZQwvGAJAcLGKr5eC7_Mq78PJIKrkGLBPDjaE0rPxJk6R9jx6XNoMOK7g',
      videoBg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAD-2JQ6dXD42VIKrGXpTgMQTarLSKdbwD46cJkLtP_7TKmMwzx660Ighbfe8kVX9geq_iFddOwwXLrmF5IUWRmWPIceuSmb0o_ZkJXyyQI7Qx6azaAPeHi0N1E2POWR1T4ju4EMfbkFPHLRnqRvgeN4mRjqZHMuSFjQNvvKRxs6S6qMQV8oSkCP0Taxihl9ZPeMTHEHAjrc_9Rv2IjLN3zJ7xdBD68AjQX7bu18WyNBhnLFQBdVe83',
    },
  ];

  const concerns = ['Dry Skin', 'Acne Prone', 'Sensitive Skin', 'Anti-Aging', 'Glowing Skin'];

  const newLaunches = [
    {
      id: 'nl1',
      slug: 'charcoal-detox-soap',
      title: 'Charcoal Detox Soap',
      price: '₹199',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-dq8XUwj3X1WEGXjtcvThflNa3iMjTvw4FW0ChFnl_gpdcSTLRlH5a_oM0k3Yiwp-Xg9Js9mRUvZx2_FDooaaabSs0SnfJuF_4BrtHbswtMIzSRCkbm6L6gg1kJfX0dnktmNiCZv_pAEaKwJTuyddY-5qa4Z7Wn4-qDSBMaHH7v9XO6Tmid_Sd1BaX8tov31MT2345AEu-Jp4IqjU_GniV0YEPb4OcJ_nnc3v9fSBiUqPtB19s_vX',
    },
    {
      id: 'nl2',
      slug: 'lavender-body-oil',
      title: 'Lavender Body Oil',
      price: '₹349',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIXOwG3JF1cEgy088VwXeQ31OJWXFfbyFL3P80WZiwi7NJFu8gSwlpzuI70DeVru9ZvYJHc61ux3ac6OEvVH9cIV4Q85Z7ppForwR4uHCUdxKqcBs9DlPXUJxYC9s2wISvTgD_wisBGQNPAZkG4j-_CoGmObPoFsNwusaSj_jBvjxw6T2znPVEiXyOdU5oBAR8E0FHK7ikCv_0EkrRJ5DYwJ2B8A0G0Q9utVfNl6Vukh_ZgapEZ7IX',
    },
    {
      id: 'nl3',
      slug: 'vitamin-e-cream',
      title: 'Vitamin E Cream',
      price: '₹280',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsOOk0LhSLMEWdeoeA9MDQXNcQzL3SkQaGFNZcLOi28uBe9AtrmaKkn1v9lT2-g67qOL8oa5TcY1AtbihEq5zzGshc7S00k5yBgFabXvmkCm5NfcmPMKyaeXXuwhG7QXXIPKQp3Bp11IPqTqe-cqXUagUILlujV_2C-0bJjI_jMfRCApIi46UxnpwXFjZdDTIpaaPDmi3l_lR6rEs93rtf1HEWLQxVfF84jlYrP4HvSbkC9J59ZXFN',
    },
  ];

  const comboOffers = [
    {
      id: 'c1',
      slug: 'ultimate-spa-gift-pack',
      title: 'Ultimate Spa Gift Pack',
      subtitle: 'Includes 4 Premium Soaps + Loofah',
      price: '₹899',
      originalPrice: '₹1200',
      badge: 'Save 25%',
      bgColor: 'rgba(0, 39, 84, 0.08)',
      borderColor: 'rgba(0, 39, 84, 0.12)',
      badgeBg: '#002754',
      badgeText: 'white',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfLmv-8PIhmABGo3DodM11iE1jbnlcba8OLYEYvLDtfPFpvtgtgYb9fDv3R95xfRWjqulbf_d5LzBLCS5Zyg9LHaRZUVu6W6r0eylmUfK11ybPuURiqx-uqsIQA_cNRlWyGNS71a9PtOaKJ1w-f-qla6hCy_mLiHC8K5HICAUBIS5jz9JDt7XciJsCne58yMImQhdMmnCHsSQ3bRdoSEou7JqLyUkoBmKgO1yCzRIJh78Qxg3Vfj6A',
    },
    {
      id: 'c2',
      slug: 'family-essentials-bundle',
      title: 'Family Essentials Bundle',
      subtitle: 'Set of 10 Daily Use Soaps',
      price: '₹1499',
      originalPrice: '₹2000',
      badge: 'Save 30%',
      bgColor: 'rgba(70, 95, 138, 0.08)',
      borderColor: 'rgba(70, 95, 138, 0.12)',
      badgeBg: '#465F8A',
      badgeText: 'white',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDRE-BdrdvvX-gKkNKLk2AdESMknnwxISYNAUvYdKV0pPR6emM4ZYz7PR2CWQOL1erXhKEY8dgfxcbiqKLAn8v0z75CluFjK5do19sCwsdo41knnwFXIeQ17tGbq5EWBrjsrx8U98LsT50EVmiHDDoHMnt0elhIYnt4iMJ3P21TSXKFX5ojGeDcV8CjOQn3gYETWI3b38DvREcXL8unyffzPR84ZLZNAvDnAc6YOouF615IKYNC3rrC',
    },
  ];

  const realResults = [
    {
      id: 'r1',
      before: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5BOW-AMfn4OYmw2raRZLFjyAXl9_Og2oljlyp6Ey3blAt0F58rE21Yc2kFmrF_m8w0_bszNhtfNPcsATPHO3DTKc5-xaT7Y0ZjBW1_TNzJioa5TZURDMTRt1t9pX3z-tlGfEKQwtCCItGZeCLGFICOAr2rCVYxeE6NlxuyABQQ3_aEL3gjrXGthTSnEDu44eD7saHOsvmf4hq5dtRwLMPjiu3W-zO2yCyhMDJBYPlz9EKgQiy_WhT',
      after: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBYYqfLzkyDJCgmUIN62zfpDnVNi80xAnbOwXMzWR_EC665r4W7a8jgxawqehE-NsGCjsao-u0awGHY1IawWevNQcSWP5uOLvmXo8iVoso9HXauK_4wWL6zedipG6xSlBnZ7PvBUQQw8SDi5OQEIzGlroqvATlo8emGKQmNpZkYbPTV5kb74HCXzfWSSdwZ-feAljIXulzIuzrRfkFuPTBDYlbTWpuPRjpYWGCmJD3d7oLoTXmRmLR',
      quote: '"My acne cleared in just 3 weeks!"',
      user: 'Ananya V. used Neem & Tea Tree Soap',
    },
    {
      id: 'r2',
      before: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSmwCmvA7_D8HomTuRM1h4-XIekacntzbTsKXAOZG-yS7i__CLwkYk_ZZ_UOnBrjjU8xOv5kTZV5YSZTE1ASD_krTM85OV_eoo2-OdqxYoW3fFM68y1SFpuzcDcdVOne23KTXLBIjJE2wpjkz-UngniFKww-KJQ-RfOZtIPghQaj9f-nc5GqCXz92BG7S8HGuPprjsgHU5ZXUr3XrOx9B1l-p0YjEDb7TIcTa1rXXxTZZvg6k87pnV',
      after: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4Vn-kpObT8hA33krBjhT874sGUANPgaNnCqeLWi4cdTn7XPL8hHvwiWiOJy8s4pA2TeUfQLer9uuetutL-BqlbyfGUwRXlbsDku2FVeRYPqNkvVUfUBU9DOrX137dmO2fuSNWqiEJUGpHxZUarqOK4deyr8MvM26JYCwqdoH2f6nR5-fDNBBjptXUum-NGLugvCOsk6E9eLos1suar0a-SACWpOkirGvowgxOjlO7t7OpaA5tfimw',
      quote: '"The glow is actually visible now."',
      user: 'Rahul S. used Sandalwood Serum',
    },
  ];

  const trustBadges = [
    { label: '100% Natural', icon: Leaf },
    { label: 'Dermatologist Tested', icon: ShieldCheck },
    { label: 'Cruelty Free', icon: Heart },
    { label: 'No Parabens', icon: CheckCircle },
    { label: 'Clinically Proven', icon: FlaskConical },
    { label: 'Ayush Certified', icon: Award },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F9FB' }}>
      {/* 1. FIXED TOP HEADER BAR */}
      <View style={{ zIndex: 100, paddingHorizontal: CONTAINER_PADDING, paddingTop: 14, paddingBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(247, 249, 251, 0.95)', borderBottomWidth: 1, borderBottomColor: 'rgba(195, 198, 209, 0.3)', shadowColor: '#0A3D78', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6 }}>
        <View style={{ width: 22 }} />
        <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 24, fontWeight: '700', color: '#002754', letterSpacing: -0.5 }}>
          CINMAX
        </Text>
        <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
          <TouchableOpacity onPress={() => router.push('/(tabs)/wishlist' as any)} style={{ padding: 4 }}>
            <Heart size={22} color="#002754" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/cart' as any)} style={{ padding: 4, position: 'relative' }}>
            <ShoppingBag size={22} color="#002754" />
            <View style={{ position: 'absolute', top: -2, right: -6, backgroundColor: '#BA1A1A', borderRadius: 8, width: 16, height: 16, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontFamily: FONT_SANS_BOLD, color: 'white', fontSize: 10, fontWeight: '700' }}>{cartItems.length || 2}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* 2. Search & Announcement */}
        <View style={{ paddingHorizontal: CONTAINER_PADDING, paddingTop: 16, gap: 14 }}>
          <View style={{ backgroundColor: '#F2F4F6', borderRadius: 25, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 48, borderWidth: 1, borderColor: 'rgba(195, 198, 209, 0.3)' }}>
            <Search size={18} color="#737781" style={{ marginRight: 10 }} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={() => router.push('/search' as any)}
              placeholder="Search soaps, skincare and body care..."
              placeholderTextColor="#737781"
              style={{ fontFamily: FONT_SANS_REGULAR, flex: 1, fontSize: 14, color: '#191C1E' }}
            />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
            <View style={{ backgroundColor: 'rgba(0, 39, 84, 0.1)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(0, 39, 84, 0.1)' }}>
              <Text style={{ fontFamily: FONT_SANS_SEMIBOLD, color: '#002754', fontSize: 12, fontWeight: '500' }}>Free Shipping above ₹499</Text>
            </View>
            <View style={{ backgroundColor: 'rgba(70, 95, 138, 0.2)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(70, 95, 138, 0.1)' }}>
              <Text style={{ fontFamily: FONT_SANS_SEMIBOLD, color: '#465F8A', fontSize: 12, fontWeight: '500' }}>Buy 2 Get 1 Free</Text>
            </View>
            <View style={{ backgroundColor: '#DAE3F4', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 }}>
              <Text style={{ fontFamily: FONT_SANS_SEMIBOLD, color: '#131C28', fontSize: 12, fontWeight: '500' }}>New Launch: Charcoal Series</Text>
            </View>
          </ScrollView>
        </View>

        {/* 3. Shop By Category */}
        <View style={{ marginTop: 28, paddingHorizontal: CONTAINER_PADDING }}>
          <Text style={{ fontFamily: FONT_SERIF_SEMIBOLD, fontSize: 22, fontWeight: '500', color: '#002754', marginBottom: 14 }}>
            Shop By Category
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 20, paddingVertical: 4 }}>
            {(categories.length > 0 ? categories : categoryAvatars).map((cat: any, idx: number) => (
              <TouchableOpacity key={cat.id || idx} onPress={() => router.push(`/category/${cat.slug}` as any)} style={{ alignItems: 'center', gap: 6 }}>
                <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: 'white', overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(195, 198, 209, 0.2)', shadowColor: '#0A3D78', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 10 }}>
                  <Image source={{ uri: cat.image || cat.icon || 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=200&auto=format&fit=crop&q=80' }} style={{ width: '100%', height: '100%' }} />
                </View>
                <Text style={{ fontFamily: FONT_SANS_SEMIBOLD, fontSize: 11, fontWeight: '600', color: '#191C1E' }}>{cat.name || cat.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 4. Dynamic Auto-Sliding Hero Carousel Banner */}
        {activeBanners.length > 0 && (() => {
          const currentBanner = activeBanners[activeSlideIndex % activeBanners.length];
          return (
            <View style={{ marginHorizontal: CONTAINER_PADDING, marginTop: 28, borderRadius: 24, overflow: 'hidden', height: 320, backgroundColor: '#002754', shadowColor: '#0A3D78', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.12, shadowRadius: 15, position: 'relative' }}>
              <Image
                key={currentBanner.id || activeSlideIndex}
                source={{ uri: currentBanner.imageUrl }}
                style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
              />
              <View style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0, 39, 84, 0.45)' }} />

              <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, alignItems: 'center' }}>
                {currentBanner.badgeText ? (
                  <View style={{ backgroundColor: '#C5A880', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12, marginBottom: 8 }}>
                    <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#002754', fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      {currentBanner.badgeText}
                    </Text>
                  </View>
                ) : null}

                <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 24, fontWeight: '700', color: 'white', textAlign: 'center', marginBottom: 6, lineHeight: 30 }}>
                  {currentBanner.title}
                </Text>
                <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 13, color: 'rgba(255, 255, 255, 0.9)', textAlign: 'center', marginBottom: 16, lineHeight: 18 }} numberOfLines={2}>
                  {currentBanner.subtitle}
                </Text>

                <TouchableOpacity
                  onPress={() => router.push((currentBanner.ctaLink || '/shop') as any)}
                  style={{ backgroundColor: '#0A3D78', paddingHorizontal: 28, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' }}
                >
                  <Text style={{ fontFamily: FONT_SANS_SEMIBOLD, color: 'white', fontWeight: '600', fontSize: 13 }}>
                    {currentBanner.ctaText || 'Shop Collection'}
                  </Text>
                </TouchableOpacity>

                {/* Dynamic Indicator Dots */}
                <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 16 }}>
                  {activeBanners.map((_, idx) => (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => setActiveSlideIndex(idx)}
                      style={{
                        width: activeSlideIndex === idx ? 20 : 6,
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: activeSlideIndex === idx ? '#FFFFFF' : 'rgba(255, 255, 255, 0.4)',
                      }}
                    />
                  ))}
                </View>
              </View>
            </View>
          );
        })()}

        {/* 5. Watch & Shop */}
        <View style={{ marginTop: 28, paddingHorizontal: CONTAINER_PADDING }}>
          <Text style={{ fontFamily: FONT_SERIF_SEMIBOLD, fontSize: 22, fontWeight: '500', color: '#002754', marginBottom: 14 }}>
            Watch &amp; Shop
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 14 }}>
            {watchShopVideos.map((vid) => (
              <TouchableOpacity key={vid.id} onPress={() => router.push(`/product/${vid.slug}` as any)} style={{ width: 170, height: 300, borderRadius: 18, overflow: 'hidden', backgroundColor: '#ECEEF0', position: 'relative' }}>
                <Image source={{ uri: vid.videoBg }} style={{ width: '100%', height: '100%' }} />
                <View style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' }}>
                  <PlayCircle size={44} color="white" />
                </View>
                <View style={{ position: 'absolute', bottom: 8, left: 8, right: 8, backgroundColor: 'rgba(255, 255, 255, 0.92)', borderRadius: 10, padding: 6, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <View style={{ width: 28, height: 28, borderRadius: 6, backgroundColor: '#E0E3E5', overflow: 'hidden' }}>
                    <Image source={{ uri: vid.thumb }} style={{ width: '100%', height: '100%' }} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 10, fontWeight: '700', color: '#191C1E' }} numberOfLines={1}>{vid.title}</Text>
                    <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 10, fontWeight: '700', color: '#002754' }}>{vid.price}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 6. Shop By Concern */}
        <View style={{ marginTop: 28, paddingHorizontal: CONTAINER_PADDING }}>
          <Text style={{ fontFamily: FONT_SERIF_SEMIBOLD, fontSize: 22, fontWeight: '500', color: '#002754', marginBottom: 14 }}>
            Shop By Concern
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
            {concerns.map((c) => (
              <TouchableOpacity
                key={c}
                onPress={() => setActiveConcern(c)}
                style={{
                  paddingHorizontal: 18,
                  paddingVertical: 8,
                  borderRadius: 20,
                  backgroundColor: activeConcern === c ? '#002754' : '#E6E8EA',
                  borderWidth: activeConcern === c ? 0 : 1,
                  borderColor: 'rgba(195, 198, 209, 0.3)',
                }}
              >
                <Text style={{ fontFamily: FONT_SANS_SEMIBOLD, fontSize: 13, fontWeight: '600', color: activeConcern === c ? 'white' : '#434750' }}>{c}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 7. Best Sellers */}
        <View style={{ marginTop: 28, paddingHorizontal: CONTAINER_PADDING }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <Text style={{ fontFamily: FONT_SERIF_SEMIBOLD, fontSize: 22, fontWeight: '500', color: '#002754' }}>Best Sellers</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/shop' as any)}>
              <Text style={{ fontFamily: FONT_SANS_SEMIBOLD, fontSize: 13, fontWeight: '600', color: '#002754' }}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 14, justifyContent: 'space-between' }}>
            {products.map((prod) => (
              <ProductCard
                key={prod.id}
                id={prod.id}
                title={prod.title}
                slug={prod.slug}
                price={prod.basePrice}
                originalPrice={prod.compareAtPrice}
                image={typeof prod.images?.[0] === 'string' ? prod.images[0] : prod.images?.[0]?.url || 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&auto=format&fit=crop&q=80'}
                rating={prod.averageRating?.toString() || '4.95'}
                reviewCount={prod.reviewCount?.toString() || '128'}
                badge={prod.isFeatured ? 'HERO BAR' : 'TOP RATED'}
                badgeBg={prod.isFeatured ? '#002754' : '#365E9B'}
              />
            ))}
          </View>
        </View>

        {/* 8. Promotional Banner */}
        <View style={{ marginHorizontal: CONTAINER_PADDING, marginTop: 28, borderRadius: 18, overflow: 'hidden', height: 150, backgroundColor: '#002754', shadowColor: '#0A3D78', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 10 }}>
          <Image
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDF1LQEjxBq0OtLya_zBSJmrBZGcpIt5GSK2bjVJwv_OH2wEvIFvmkvPBOwrecHsjs_oyNThVL7ZH4AUdRer9JJTMlrFAnb8z4ralUPHUwN9WP4S-39GnkgDrqIEgWZw9RaJtY8iwvffsTZD_Popbvs_HN8VBfLLeWF7GtyAos2D-BFKUhivqRdo3aEuD_KXEEev5cHd6UEVnfdZhhC6iRO1kHJA_rMX0q8Z19vqu_okch2q5g6QKPu' }}
            style={{ width: '100%', height: '100%', opacity: 0.6 }}
          />
          <View style={{ position: 'absolute', inset: 0, justifyContent: 'center', alignItems: 'center', padding: 14 }}>
            <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 11, fontWeight: '700', color: 'white', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 2 }}>
              Monsoon Magic Sale
            </Text>
            <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 22, fontWeight: '700', color: 'white', marginBottom: 2 }}>
              Flat 40% OFF
            </Text>
            <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 14, color: 'rgba(255, 255, 255, 0.85)', marginBottom: 12 }}>
              On all Gift Hampers &amp; Combo Packs
            </Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/shop' as any)} style={{ backgroundColor: 'white', paddingHorizontal: 22, paddingVertical: 7, borderRadius: 18 }}>
              <Text style={{ fontFamily: FONT_SANS_BOLD, color: '#002754', fontWeight: '600', fontSize: 13 }}>Grab Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 9. New Launch */}
        <View style={{ marginTop: 28, paddingHorizontal: CONTAINER_PADDING }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <Text style={{ fontFamily: FONT_SERIF_SEMIBOLD, fontSize: 22, fontWeight: '500', color: '#002754' }}>New Launches</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/shop' as any)}>
              <Text style={{ fontFamily: FONT_SANS_SEMIBOLD, fontSize: 13, fontWeight: '600', color: '#002754' }}>View All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 14, paddingBottom: 6 }}>
            {products.map((item) => (
              <TouchableOpacity key={item.id} onPress={() => router.push(`/product/${item.slug}` as any)} style={{ width: 140, gap: 6 }}>
                <View style={{ width: 140, height: 140, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(195, 198, 209, 0.3)' }}>
                  <Image source={{ uri: typeof item.images?.[0] === 'string' ? item.images[0] : item.images?.[0]?.url || 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=300&auto=format&fit=crop&q=80' }} style={{ width: '100%', height: '100%' }} />
                </View>
                <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 13, fontWeight: '700', color: '#191C1E' }} numberOfLines={1}>{item.title}</Text>
                <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 13, fontWeight: '700', color: '#002754' }}>₹{item.basePrice}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 10. Combo Offers */}
        <View style={{ marginTop: 28, paddingHorizontal: CONTAINER_PADDING }}>
          <Text style={{ fontFamily: FONT_SERIF_SEMIBOLD, fontSize: 22, fontWeight: '500', color: '#002754', marginBottom: 14 }}>
            Combo Offers
          </Text>
          <View style={{ gap: 14 }}>
            {comboOffers.map((combo) => (
              <TouchableOpacity key={combo.id} onPress={() => router.push(`/product/${combo.slug}` as any)} style={{ backgroundColor: combo.bgColor, borderRadius: 16, padding: 14, flexDirection: 'row', gap: 14, borderWidth: 1, borderColor: combo.borderColor }}>
                <Image source={{ uri: combo.image }} style={{ width: 84, height: 84, borderRadius: 12 }} />
                <View style={{ flex: 1, justifyContent: 'space-between', paddingVertical: 2 }}>
                  <View>
                    <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 15, fontWeight: '700', color: '#002754' }}>{combo.title}</Text>
                    <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 11, color: '#434750', marginTop: 2 }}>{combo.subtitle}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 15, fontWeight: '700', color: '#002754' }}>
                      {combo.price} <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 11, color: '#737781', textDecorationLine: 'line-through', fontWeight: '400' }}>{combo.originalPrice}</Text>
                    </Text>
                    <View style={{ backgroundColor: combo.badgeBg, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 }}>
                      <Text style={{ fontFamily: FONT_SANS_BOLD, color: 'white', fontSize: 10, fontWeight: '700', textTransform: 'uppercase' }}>{combo.badge}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 11. Real Results */}
        <View style={{ marginTop: 28, paddingHorizontal: CONTAINER_PADDING }}>
          <Text style={{ fontFamily: FONT_SERIF_SEMIBOLD, fontSize: 22, fontWeight: '500', color: '#002754', marginBottom: 14 }}>
            Real Results
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 14 }}>
            {realResults.map((item) => (
              <View key={item.id} style={{ width: 240, backgroundColor: 'white', borderRadius: 16, padding: 10, borderWidth: 1, borderColor: 'rgba(195, 198, 209, 0.2)', shadowColor: '#0A3D78', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 10 }}>
                <View style={{ flexDirection: 'row', gap: 8, marginBottom: 10 }}>
                  <View style={{ flex: 1, height: 88, borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
                    <Image source={{ uri: item.before }} style={{ width: '100%', height: '100%' }} />
                    <View style={{ position: 'absolute', bottom: 4, left: 4, backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 4, paddingVertical: 2, borderRadius: 4 }}>
                      <Text style={{ fontFamily: FONT_SANS_REGULAR, color: 'white', fontSize: 8 }}>Before</Text>
                    </View>
                  </View>
                  <View style={{ flex: 1, height: 88, borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
                    <Image source={{ uri: item.after }} style={{ width: '100%', height: '100%' }} />
                    <View style={{ position: 'absolute', bottom: 4, left: 4, backgroundColor: '#002754', paddingHorizontal: 4, paddingVertical: 2, borderRadius: 4 }}>
                      <Text style={{ fontFamily: FONT_SANS_REGULAR, color: 'white', fontSize: 8 }}>After</Text>
                    </View>
                  </View>
                </View>
                <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 10, fontWeight: '700', color: '#002754', fontStyle: 'italic', marginBottom: 2 }}>{item.quote}</Text>
                <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 10, color: '#737781' }}>{item.user}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* 12. Why Choose CINMAX? */}
        <View style={{ marginTop: 28, paddingHorizontal: CONTAINER_PADDING, alignItems: 'center' }}>
          <Text style={{ fontFamily: FONT_SERIF_SEMIBOLD, fontSize: 22, fontWeight: '500', color: '#002754', textAlign: 'center', marginBottom: 20 }}>
            Why Choose CINMAX?
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 20, width: '100%' }}>
            {trustBadges.map((badge, idx) => {
              const IconComp = badge.icon;
              return (
                <View key={idx} style={{ width: '28%', alignItems: 'center', gap: 6 }}>
                  <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0, 39, 84, 0.08)', justifyContent: 'center', alignItems: 'center' }}>
                    <IconComp size={22} color="#002754" />
                  </View>
                  <Text style={{ fontFamily: FONT_SANS_BOLD, fontSize: 10, fontWeight: '700', color: '#191C1E', textAlign: 'center' }}>{badge.label}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* 13. Manufacturing Banner */}
        <View style={{ marginHorizontal: CONTAINER_PADDING, marginTop: 28, borderRadius: 18, overflow: 'hidden', height: 230, backgroundColor: '#002754', position: 'relative' }}>
          <Image
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGE69IJlast_Ul6rXuCQSS3GH9L16poRY-l4l0iLBhoriu0C4LiZu3f7ZasTL9El20BxRnLTR3yhtY06Qyv2WRC2rkh3JMyHvdbriffqhNy4zqgJbeSfm_sQdZRfhBRJvCHtUEkCDdOoUFSDEUFRamWxTJs7vcGIUEWF00FZywN7h07CqZpCeqT6qRYsAmAO2bk5-APQk-HdqbqLMS5IQmGNzYH5WjPfz9gHlMpUg46Re6GavrK01c' }}
            style={{ width: '100%', height: '100%' }}
          />
          <View style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0, 39, 84, 0.4)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            <Text style={{ fontFamily: FONT_SERIF_BOLD, fontSize: 24, fontWeight: '600', color: 'white', textAlign: 'center', marginBottom: 6 }}>
              Crafted with Quality
            </Text>
            <Text style={{ fontFamily: FONT_SANS_REGULAR, fontSize: 14, color: 'white', textAlign: 'center', maxWidth: 260, lineHeight: 20 }}>
              Our state-of-the-art facility ensures every bar of soap meets global standards of purity and excellence.
            </Text>
            <TouchableOpacity style={{ marginTop: 14, borderWidth: 1, borderColor: 'white', paddingHorizontal: 22, paddingVertical: 7, borderRadius: 18 }}>
              <Text style={{ fontFamily: FONT_SANS_BOLD, color: 'white', fontWeight: '700', fontSize: 13 }}>Learn More</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
