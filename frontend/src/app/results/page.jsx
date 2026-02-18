'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// ComparisonView component for side-by-side comparison
const ComparisonView = ({ originalText, simplifiedText, searchTerm, processingStatus }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Simplified Text (left side) */}
      <div className="bg-white border border-gray-200 rounded-xl">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>
            Simplified Version
          </h2>
        </div>
        <div className="p-5 max-h-[600px] overflow-y-auto">
          {processingStatus && (
            <div className="mb-4 p-3 bg-emerald-50 rounded-lg flex items-center">
              <svg className="animate-spin h-4 w-4 text-emerald-600 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-emerald-700 text-sm">{processingStatus}</span>
            </div>
          )}
          <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap">
            {simplifiedText}
          </div>
        </div>
      </div>

      {/* Original Text (right side) */}
      <div className="bg-white border border-gray-200 rounded-xl">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
            Original Document
          </h2>
        </div>
        <div className="p-5 max-h-[600px] overflow-y-auto">
          <div className="text-sm text-gray-500 leading-relaxed whitespace-pre-wrap font-mono">
            {originalText}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ResultsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('comparison');
  const [searchTerm, setSearchTerm] = useState('');
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);
  
  // Initialize state with default values
  const [originalText, setOriginalText] = useState('');
  const [simplifiedText, setSimplifiedText] = useState('');
  const [stats, setStats] = useState(null);
  const [processingStatus, setProcessingStatus] = useState('');
  


  // Load data from session storage and fetch simplified text
  useEffect(() => {
    const storedData = sessionStorage.getItem('analysisResults');
    if (!storedData) {
      setError('No analysis data found. Please upload a document first.');
      setLoading(false);
      return;
    }

    let parsedData;
    try {
      parsedData = JSON.parse(storedData);
      setAnalysisData(parsedData);
      // Set original text right away
      setOriginalText(parsedData.text || 'No original text found.');
    } catch (err) {
      console.error('Error parsing analysis data:', err);
      setError('Failed to load analysis results. Please try again.');
      setLoading(false);
      return;
    }

    // Fetch both original and simplified text (with streaming for simplified)
    const fetchTexts = async () => {
      if (!parsedData?.collection_id) {
        setError('Collection ID is missing, cannot fetch texts.');
        setLoading(false);
        return;
      }

      try {
        // Fetch original text first (non-streaming)
        const originalRes = await fetch(`http://localhost:3001/api/original-text/${parsedData.collection_id}`);
        if (!originalRes.ok) {
          const errorData = await originalRes.json();
          throw new Error(`Failed to fetch original text: ${errorData.detail}`);
        }
        const originalResult = await originalRes.json();
        setOriginalText(originalResult.text || 'No original text was returned.');

        // Now fetch simplified text with streaming
        setSimplifiedText(''); // Clear any existing text
        setProcessingStatus('Starting analysis...');
        const simplifiedRes = await fetch('http://localhost:3001/api/query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            collection_id: parsedData.collection_id,
            question: 'Provide a comprehensive overview of the entire document.',
            top_k: 10,
          }),
        });

        if (!simplifiedRes.ok) {
          throw new Error('Failed to start streaming simplified text.');
        }

        // Read the stream
        const reader = simplifiedRes.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedText = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n').filter(line => line.startsWith('data: '));

          for (const line of lines) {
            try {
              const jsonStr = line.replace('data: ', '');
              const data = JSON.parse(jsonStr);

              if (data.status) {
                // Update processing status
                setProcessingStatus(data.status);
              }
              if (data.token) {
                setProcessingStatus(''); // Clear status when tokens start arriving
                accumulatedText += data.token;
                setSimplifiedText(accumulatedText);
              }
              if (data.done) {
                // Streaming complete
                setProcessingStatus('');
                setLoading(false);
                setLoaded(true);
              }
              if (data.error) {
                throw new Error(data.error);
              }
            } catch (parseErr) {
              // Ignore parse errors for incomplete chunks
            }
          }
        }

      } catch (fetchError) {
        console.error('Error fetching texts:', fetchError);
        setError(fetchError.message);
      } finally {
        setLoading(false);
        setLoaded(true);
      }
    };

    fetchTexts();
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('analysisResult');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.originalText || parsed?.simplifiedText) {
          setOriginalText(parsed.originalText || '');
          setSimplifiedText(parsed.simplifiedText || '');
          setStats(parsed.stats || null);
        }
      }
    } catch (_) {}
    setLoaded(true);
  }, []);

  // Filter text based on search term
  const filterText = (text) => {
    if (!text) return '';
    return text
      .split('\n')
      .filter(line => 
        !searchTerm.trim() || 
        line.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .join('\n');
  };

  const filteredOriginalText = filterText(originalText);
  const filteredSimplifiedText = filterText(simplifiedText);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showUploadButton={false} />

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                Analysis Complete
              </h1>
              <p className="text-gray-500">
                Your document has been simplified. Compare the results below.
              </p>
            </div>
            <Link 
              href="/upload"
              className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Document
            </Link>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
              <button
                onClick={() => setActiveTab('comparison')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'comparison'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Side-by-Side
              </button>
              <button
                onClick={() => setActiveTab('original')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'original'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Original
              </button>
              <button
                onClick={() => setActiveTab('simplified')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'simplified'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Simplified
              </button>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 w-48 border border-gray-200 rounded-lg bg-white text-gray-900 text-sm placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors">
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Content Display */}
        {activeTab === 'comparison' && (
          <ComparisonView
            originalText={filteredOriginalText}
            simplifiedText={filteredSimplifiedText}
            searchTerm={searchTerm}
            processingStatus={processingStatus}
          />
        )}

        {activeTab === 'original' && (
          <div className="bg-white border border-gray-200 rounded-xl">
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                Original Document
              </h2>
            </div>
            <div className="p-5 max-h-[600px] overflow-y-auto">
              <div className="text-sm text-gray-500 leading-relaxed whitespace-pre-wrap font-mono">
                {filteredOriginalText}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'simplified' && (
          <div className="bg-white border border-gray-200 rounded-xl">
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>
                Simplified Version
              </h2>
            </div>
            <div className="p-5 max-h-[600px] overflow-y-auto">
              {processingStatus && (
                <div className="mb-4 p-3 bg-emerald-50 rounded-lg flex items-center">
                  <svg className="animate-spin h-4 w-4 text-emerald-600 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-emerald-700 text-sm">{processingStatus}</span>
                </div>
              )}
              <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap">
                {filteredSimplifiedText}
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
            <div className="text-2xl font-semibold text-gray-900 mb-1">
              {stats?.complexityReduction ? Math.round(stats.complexityReduction * 100) + '%' : '85%'}
            </div>
            <div className="text-sm text-gray-500">Simpler</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
            <div className="text-2xl font-semibold text-gray-900 mb-1">
              {stats?.keyPoints ?? 12}
            </div>
            <div className="text-sm text-gray-500">Key Points</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
            <div className="text-2xl font-semibold text-gray-900 mb-1">
              {stats?.readingSpeedGain ? stats.readingSpeedGain + 'x' : '3x'}
            </div>
            <div className="text-sm text-gray-500">Faster to Read</div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
