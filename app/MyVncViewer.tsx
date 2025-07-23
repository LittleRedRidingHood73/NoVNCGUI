// app/MyVncViewer.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import RFB from '@novnc/novnc/lib/rfb';

interface MyVncViewerProps {
  url: string;
  password?: string;
}

const MyVncViewer: React.FC<MyVncViewerProps> = ({ url, password }) => {
  const screenRef = useRef<HTMLDivElement>(null);
  const rfbRef = useRef<RFB | null>(null);

  useEffect(() => {
    if (!screenRef.current || rfbRef.current) {
      return;
    }

    try {
      // Ini bagian kuncinya: kita menyediakan password di dalam 'credentials'
      const options = {
        credentials: {
            username: '',
            target: '',
            password: password || '',
        },
    };

      const rfb = new RFB(screenRef.current, url, options);
      rfbRef.current = rfb;

      rfb.scaleViewport = true;
      rfb.resizeSession = true;

      console.log('RFB instance created, trying to connect...');

    } catch (error) {
      console.error('Failed to create RFB instance', error);
    }

    // Fungsi cleanup untuk disconnect saat komponen dilepas
    return () => {
      if (rfbRef.current) {
        rfbRef.current.disconnect();
        rfbRef.current = null;
        console.log('VNC disconnected.');
      }
    };
  }, [url, password]);

  return <div ref={screenRef} style={{ width: '100%', height: '100%' }} />;
};

export default MyVncViewer;