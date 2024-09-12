import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const CancelSpeetch = () => {
  const location = useLocation();

  useEffect(() => {
    // Cancel speech synthesis when route changes
    window.speechSynthesis.cancel();
  }, [location]);
};

export default CancelSpeetch;
