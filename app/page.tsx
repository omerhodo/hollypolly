'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function HomePage() {
  const t = useTranslations('loading');
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      const roomId = uuidv4();
      router.push(`/room/${roomId}`);
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
          className="w-20 h-20 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-6"
        />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {t('title')}
        </h1>
        <p className="text-gray-600">
          {t('subtitle')}
        </p>
      </motion.div>
    </div>
  );
}
