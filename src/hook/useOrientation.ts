import { useCallback, useEffect, useState } from 'react';

export default function useOrientation() {
  const [isLandscape, setIsLandscape] = useState(true);

  const checkOrientation = useCallback(() => {
    setIsLandscape(window.matchMedia('(orientation: landscape)').matches);
  }, []);

  useEffect(() => {
    checkOrientation();

    window.addEventListener('orientationchange', checkOrientation);
    window.addEventListener('resize', checkOrientation);

    return () => {
      window.removeEventListener('orientationchange', checkOrientation);
      window.removeEventListener('resize', checkOrientation);
    };
  }, [checkOrientation]);
  
  return { isLandscape };
}
