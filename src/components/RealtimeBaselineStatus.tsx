"use client";

import { useEffect, useState } from 'react';
import BaselineStatusIcon from './BaselineStatusIcon';

interface RealtimeBaselineStatusProps {
  code: string;
  isBaseline?: boolean;
  className?: string;
}

interface WebFeature {
  id: string;
  name: string;
  status: 'baseline' | 'newly-interoperable' | 'limited-browser-support' | 'not-baseline';
  description: string;
}

export default function RealtimeBaselineStatus({ 
  code, 
  isBaseline = false, 
  className = "" 
}: RealtimeBaselineStatusProps) {
  const [detectedFeatures, setDetectedFeatures] = useState<WebFeature[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Detect web features from code
  const detectFeatures = (code: string): string[] => {
    const features: string[] = [];
    
    // Common web features detection patterns
    const featurePatterns = {
      'css-grid': /display:\s*grid|grid-template|grid-area|grid-gap/gi,
      'flexbox': /display:\s*flex|flex-direction|justify-content|align-items/gi,
      'css-custom-properties': /--[a-zA-Z][\w-]*\s*:/gi,
      'css-transforms': /transform:\s*|translate|rotate|scale/gi,
      'css-animations': /@keyframes|animation:/gi,
      'css-transitions': /transition:/gi,
      'css-media-queries': /@media/gi,
      'css-pseudo-classes': /:hover|:focus|:active|:nth-child/gi,
      'fetch-api': /fetch\s*\(/gi,
      'promises': /Promise\s*\(|\.then\s*\(|\.catch\s*\(/gi,
      'async-await': /async\s+|await\s+/gi,
      'arrow-functions': /=>\s*/gi,
      'template-literals': /`[^`]*\$\{[^}]+\}[^`]*`/gi,
      'destructuring': /const\s*\{|let\s*\{|var\s*\{/gi,
      'spread-operator': /\.\.\./gi,
      'modules': /import\s+|export\s+/gi,
      'local-storage': /localStorage\.|sessionStorage\./gi,
      'web-workers': /Worker\s*\(|postMessage|onmessage/gi,
      'service-workers': /serviceWorker|navigator\.serviceWorker/gi,
      'web-components': /customElements\.define|connectedCallback|disconnectedCallback/gi,
      'intersection-observer': /IntersectionObserver/gi,
      'mutation-observer': /MutationObserver/gi,
      'resize-observer': /ResizeObserver/gi,
      'web-sockets': /WebSocket/gi,
      'web-rtc': /RTCPeerConnection|getUserMedia/gi,
      'webgl': /WebGL|getContext\s*\(\s*['"]webgl/gi,
      'canvas': /getContext\s*\(\s*['"]2d/gi,
      'svg': /<svg|createElementNS\s*\(\s*['"]http:\/\/www\.w3\.org\/2000\/svg/gi,
      'web-audio': /AudioContext|createBuffer|createOscillator/gi,
      'geolocation': /navigator\.geolocation/gi,
      'device-orientation': /deviceorientation|devicemotion/gi,
      'touch-events': /touchstart|touchend|touchmove/gi,
      'pointer-events': /pointerdown|pointerup|pointermove/gi,
      'drag-drop': /draggable|ondrag|ondrop/gi,
      'file-api': /FileReader|File\s*\(|Blob/gi,
      'crypto': /crypto\.|subtle\./gi,
      'web-assembly': /WebAssembly/gi,
      'web-streams': /ReadableStream|WritableStream/gi,
      'web-locks': /navigator\.locks/gi,
      'web-share': /navigator\.share/gi,
      'web-push': /PushManager|ServiceWorkerRegistration\.pushManager/gi,
      'web-notifications': /Notification/gi,
      'web-bluetooth': /navigator\.bluetooth/gi,
      'web-usb': /navigator\.usb/gi,
      'web-serial': /navigator\.serial/gi,
      'web-nfc': /navigator\.nfc/gi,
      'web-hid': /navigator\.hid/gi,
      'web-xr': /navigator\.xr/gi,
      'web-codecs': /VideoDecoder|AudioDecoder/gi,
      'web-transport': /WebTransport/gi,
      'web-otp': /OTPCredential/gi,
      'web-identity': /IdentityCredential/gi,
      'web-payments': /PaymentRequest/gi,
      'web-share-target': /WebShareTarget/gi,
      'web-share-level-2': /navigator\.canShare/gi,
      'web-share-level-3': /navigator\.share/gi,
      'web-share-level-4': /navigator\.share/gi,
      'web-share-level-5': /navigator\.share/gi,
      'web-share-level-6': /navigator\.share/gi,
      'web-share-level-7': /navigator\.share/gi,
      'web-share-level-8': /navigator\.share/gi,
      'web-share-level-9': /navigator\.share/gi,
      'web-share-level-10': /navigator\.share/gi
    };

    Object.entries(featurePatterns).forEach(([feature, pattern]) => {
      if (pattern.test(code)) {
        features.push(feature);
      }
    });

    return features;
  };

  // Fetch baseline status from webstatus.dev API
  const fetchBaselineStatus = async (featureIds: string[]): Promise<WebFeature[]> => {
    const features: WebFeature[] = [];
    
    for (const featureId of featureIds) {
      try {
        const response = await fetch(`https://api.webstatus.dev/v1/features/${featureId}`);
        if (response.ok) {
          const data = await response.json();
          features.push({
            id: featureId,
            name: data.name || featureId,
            status: data.baseline_status || 'not-baseline',
            description: data.description || ''
          });
        }
      } catch (err) {
        console.warn(`Failed to fetch status for ${featureId}:`, err);
      }
    }
    
    return features;
  };

  useEffect(() => {
    if (!code) return;

    setLoading(true);
    setError(null);

    const detectAndFetch = async () => {
      try {
        const detectedFeatureIds = detectFeatures(code);
        console.log('Detected features:', detectedFeatureIds);
        
        if (detectedFeatureIds.length > 0) {
          const features = await fetchBaselineStatus(detectedFeatureIds);
          setDetectedFeatures(features);
        } else {
          setDetectedFeatures([]);
        }
      } catch (err) {
        setError('Failed to detect features');
        console.error('Feature detection error:', err);
      } finally {
        setLoading(false);
      }
    };

    detectAndFetch();
  }, [code]);

  // Get overall baseline status
  const getOverallStatus = (): 'baseline' | 'newly-interoperable' | 'limited-browser-support' | 'not-baseline' => {
    if (detectedFeatures.length === 0) return 'not-baseline';
    
    const baselineCount = detectedFeatures.filter(f => f.status === 'baseline').length;
    const newlyInteropCount = detectedFeatures.filter(f => f.status === 'newly-interoperable').length;
    const limitedCount = detectedFeatures.filter(f => f.status === 'limited-browser-support').length;
    
    if (baselineCount === detectedFeatures.length) return 'baseline';
    if (newlyInteropCount > 0) return 'newly-interoperable';
    if (limitedCount > 0) return 'limited-browser-support';
    return 'not-baseline';
  };

  const overallStatus = getOverallStatus();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {loading ? (
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 animate-spin text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span className="text-xs text-gray-600 dark:text-gray-400">Analyzing...</span>
        </div>
      ) : error ? (
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="text-xs text-red-600">Error</span>
        </div>
      ) : (
        <BaselineStatusIcon 
          isBaseline={isBaseline}
          status={overallStatus}
          size="md"
        />
      )}
      
      {detectedFeatures.length > 0 && (
        <div className="ml-2 text-xs text-gray-500 dark:text-gray-400">
          {detectedFeatures.length} feature{detectedFeatures.length !== 1 ? 's' : ''} detected
        </div>
      )}
    </div>
  );
}
