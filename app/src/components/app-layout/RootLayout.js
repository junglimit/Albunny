import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const RootLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleRedirection = () => {
      const restrictedPaths = ['/detail', '/workplace/modify', '/workplace/pwdverify'];
      const isRestrictedPath = restrictedPaths.some(path => location.pathname.startsWith(path));
      const workplaceId = localStorage.getItem('workplaceId');
      const hasShownAlert = localStorage.getItem('hasShownAlert');

      if (isRestrictedPath) {
        if (!workplaceId) {
          if (!hasShownAlert) {
            alert('원하는 사업장 클릭 후 간편비밀번호로 인증 후 접근하실 수 있습니다.');
            localStorage.setItem('hasShownAlert', 'true');
          }
          navigate('/workplace', { replace: true });
          return; 
        }

        if (location.pathname === '/workplace/modify' && localStorage.getItem('redirectedFromDetail')) {
          if (!hasShownAlert) {
            alert('사업장 목록 페이지에 직접 접근하실 수 없습니다. 사업장 변경을 통해 이동해주세요 😃');
            localStorage.setItem('hasShownAlert', 'true');
          }
          navigate('/detail', { replace: true });
          return;
        }

        if (location.pathname === '/detail') {
          localStorage.removeItem('redirectedFromDetail');
        }

        if (location.pathname.startsWith('/workplace/modify')) {
          localStorage.setItem('redirectedFromDetail', 'true');
        }
      } else {
        localStorage.removeItem('workplaceId');
        localStorage.removeItem('redirectedFromDetail');
        localStorage.removeItem('hasShownAlert');
      }

      setLoading(false);
    };

    handleRedirection();
  }, [location, navigate]);

  if (loading) {
    return null;
  }

  return (
    <main>
      <Outlet />
    </main>
  );
};

export default RootLayout;
