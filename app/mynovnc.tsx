"use client";

import { useEffect, useRef, useState } from 'react';
// import dynamic from 'next/dynamic';

// NoSSR bisa dicomment karena tadinya buat jaga-jaga klo ada error di server side rendering
// const NoSSR = dynamic(() => Promise.resolve(({ children }: any) => children), { ssr: false });

type NoVNCProps = {
  host: string;
  port: string;
  username?: string;
  password?: string;
  path?: string;
};

export default function NoVNC({ host, port, username = '', password = '' , path = '' }: NoVNCProps) {
  const screenRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState('Loading');
  const [rfb, setRfb] = useState<any>(null);

  useEffect(() => {
    const setup = async () => {
      const { default: RFB } = await import('/novnc/core/rfb.js');

      let url = window.location.protocol === 'https:' ? 'wss' : 'ws';
      url += '://' + host;
      if (port) url += ':' + port;
      url += '/' + path;

      const rfbInstance = new RFB(screenRef.current!, url, { credentials: { username, password } });
      setRfb(rfbInstance);

      rfbInstance.addEventListener('connect', () => setStatus(`Connected`));
      rfbInstance.addEventListener('disconnect', (e: any) => {
        setStatus(e.detail.clean ? 'Disconnected' : 'Something went wrong');
      });
      rfbInstance.addEventListener('credentialsrequired', () => {
        rfbInstance.sendCredentials({ username , password });
      });
      rfbInstance.addEventListener('desktopname', (e: any) => {
        console.log('Desktop Name:', e.detail.name);
      });

      rfbInstance.viewOnly = false;
      rfbInstance.scaleViewport = true; // ini buat ngatur windownya ke scale ato kaga
    };

    setup();
  }, [host, port, username, password, path]);

  const sendCtrlAltDel = () => {
    rfb?.sendCtrlAltDel();
  };

  // NoSSR bisa dicomment karena tadinya buat jaga-jaga klo ada error di server side rendering
  return (
    // <NoSSR> 
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}> 
        <div style={{ backgroundColor: '#6e84a3', color: 'white', font: 'bold 12px Helvetica', padding: '6px 5px 4px 5px', borderBottom: '1px outset' }}>
          <div style={{ textAlign: 'center' }}>{status}</div>
          <div style={{ position: 'fixed', top: 0, right: 0, border: '1px outset', padding: '5px 5px 4px 5px', cursor: 'pointer' }} onClick={sendCtrlAltDel}>
            Send CtrlAltDel
          </div>
        </div>
        <div ref={screenRef} style={{ flex: 1, overflow: 'hidden', backgroundColor: 'dimgrey' }}></div>
      </div>
    // </NoSSR>
  );
}
