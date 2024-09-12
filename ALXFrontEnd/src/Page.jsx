import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Page = ({ title }) => {
  const location = useLocation();

  useEffect(() => {
    document.title = "Scribe Tales | " + title;
  }, [location, title]);

  return null;
};

export default Page;