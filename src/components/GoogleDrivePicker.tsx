"use client";

import React, { useState, useEffect } from 'react';
import { Cloud } from 'lucide-react';

const API_KEY = 'AIzaSyClWJYKu31hWb1QgYvNNIqOie42H7B-bes';
const CLIENT_ID = '933782187633-566u375t27lm2f2ajos1906lq5rp8n5j.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/drive.readonly';
const APP_ID = '933782187633'; // App ID is the first part of Client ID

interface Props {
  onFileSelect: (url: string) => void;
  className?: string;
  mimeTypes?: string;
  onToken?: (token: string) => void;
}

export function GoogleDrivePicker({ onFileSelect, className = "", mimeTypes, onToken }: Props) {
  const [tokenClient, setTokenClient] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const loadScript = (src: string, onLoad: () => void) => {
      const existingScript = document.querySelector(`script[src="${src}"]`);
      if (existingScript) {
        if (existingScript.getAttribute('data-loaded') === 'true') {
          onLoad();
        } else {
          existingScript.addEventListener('load', onLoad);
        }
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        script.setAttribute('data-loaded', 'true');
        onLoad();
      };
      document.body.appendChild(script);
    };

    loadScript('https://apis.google.com/js/api.js', () => {
      // Just ensure gapi is loaded, we'll load picker on demand if needed
    });

    loadScript('https://accounts.google.com/gsi/client', () => {
      const google = (window as any).google;
      if (google && google.accounts && google.accounts.oauth2) {
        const client = google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: SCOPES,
          callback: (response: any) => {
            if (response.error !== undefined) {
              console.error('Error from GIS:', response);
              throw (response);
            }
            setAccessToken(response.access_token);
            if (onToken) onToken(response.access_token);
            createPicker(response.access_token);
          },
        });
        setTokenClient(client);
      }
    });
  }, []);

  const createPicker = (token: string) => {
    const google = (window as any).google;
    const gapi = (window as any).gapi;
    
    if (!google || !google.picker) {
      if (gapi) {
        gapi.load('picker', { callback: () => {
          // Retry once picker is loaded
          createPicker(token);
        }});
      } else {
        alert("El sistema de Google Drive aún no ha terminado de cargar. Por favor, intenta de nuevo en unos segundos.");
      }
      return;
    }
    
    if (token) {
      const view = new google.picker.DocsView(google.picker.ViewId.DOCS);
      view.setIncludeFolders(true);
      
      if (mimeTypes) {
        view.setMimeTypes(mimeTypes);
      }
      const picker = new google.picker.PickerBuilder()
        .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
        .setDeveloperKey(API_KEY)
        .setAppId(APP_ID)
        .setOAuthToken(token)
        .addView(view)
        .setCallback(async (data: any) => {
          if (data.action === google.picker.Action.PICKED) {
            for (const doc of data.docs) {
              const fileId = doc.id;
              const mimeType = doc.mimeType || '';
              
              let url = `https://drive.google.com/file/d/${fileId}/preview`;
              onFileSelect(url);
            }
          }
        })
        .build();
      picker.setVisible(true);
    }
  };

  const handleOpenPicker = () => {
    if (accessToken) {
      createPicker(accessToken);
    } else if (tokenClient) {
      tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      // Intentar inicializar aquí por si el script cargó después del renderizado inicial
      const google = (window as any).google;
      if (google && google.accounts && google.accounts.oauth2) {
        const client = google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: SCOPES,
          callback: (response: any) => {
            if (response.error !== undefined) {
              console.error('Error from GIS:', response);
              throw (response);
            }
            setAccessToken(response.access_token);
            if (onToken) onToken(response.access_token);
            createPicker(response.access_token);
          },
        });
        setTokenClient(client);
        client.requestAccessToken({ prompt: 'consent' });
      } else {
        console.error('Token client not initialized and google object not found');
        
        // Forzar recarga de scripts como último recurso
        const script1 = document.createElement('script');
        script1.src = 'https://apis.google.com/js/api.js';
        document.body.appendChild(script1);
        
        const script2 = document.createElement('script');
        script2.src = 'https://accounts.google.com/gsi/client';
        document.body.appendChild(script2);
        
        alert("Parece que hubo un problema de conexión con Google. Estamos intentando reconectar. Por favor, espera 3 segundos y haz clic nuevamente.");
      }
    }
  };

  return (
    <button 
      onClick={(e) => { e.preventDefault(); handleOpenPicker(); }}
      className={`text-sm font-semibold text-primary flex items-center gap-1 hover:underline ${className}`}
    >
      <Cloud className="w-4 h-4" /> Desde Drive
    </button>
  );
}
