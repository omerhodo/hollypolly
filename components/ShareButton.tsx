'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface ShareButtonProps {
  roomId: string;
}

export default function ShareButton({ roomId }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = `${window.location.origin}/room/${roomId}`;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleShare}
      className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
    >
      {copied ? (
        <>
          <span>✓ Kopyalandı!</span>
        </>
      ) : (
        <>
          <span>🔗</span>
          <span>Kuraya katılacak kişilerle linki paylaş</span>
        </>
      )}
    </motion.button>
  );
}
