'use client';

import { GoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Cookies from 'js-cookie';

export default function LoginPage() {
  const router = useRouter();

  const handleSuccess = async (credentialResponse) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const data = await res.json();

      if (res.ok) {
        // Store user data in cookie or local storage
        Cookies.set('user', JSON.stringify(data.user), { expires: 7 });
        router.push('/upload'); // Redirect to upload page
      } else {
        console.error('Login failed:', data.error);
      }
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header showUploadButton={false} />
      
      <main className="flex-grow flex items-center justify-center px-6">
        <div className="bg-white border border-gray-200 p-8 rounded-xl max-w-sm w-full text-center">
          <div className="mb-6">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-1">Sign in to Lexify</h1>
            <p className="text-sm text-gray-500">Continue with your Google account</p>
          </div>

          <div className="flex justify-center">
            {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? (
              <GoogleLogin
                onSuccess={handleSuccess}
                onError={() => {
                  console.log('Login Failed');
                }}
                useOneTap
                theme="outline"
                shape="rectangular"
                size="large"
              />
            ) : (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                Google Client ID not configured.
              </div>
            )}
          </div>
          
          <p className="mt-6 text-xs text-gray-400">
            By signing in, you agree to our Terms and Privacy Policy.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
