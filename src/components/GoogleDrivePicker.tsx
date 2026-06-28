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
}

export function GoogleDrivePicker({ onFileSelect, className = "", mimeTypes }: Props) {
  const [pickerInited, setPickerInited] = useState(false);
  const [tokenClient, setTokenClient] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    // Load gapi picker
    const gapi = (window as any).gapi;
    if (gapi) {
      gapi.load('picker', { callback: () => setPickerInited(true) });
    }

    // Initialize GIS (Google Identity Services)
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
          createPicker(response.access_token);
        },
      });
      setTokenClient(client);
    }
  }, []);

  const createPicker = (token: string) => {
    const google = (window as any).google;
    if (pickerInited && token) {
      const view = new google.picker.View(google.picker.ViewId.DOCS);
      if (mimeTypes) {
        view.setMimeTypes(mimeTypes);
      }
      const picker = new google.picker.PickerBuilder()
        .enableFeature(google.picker.Feature.NAV_HIDDEN)
        .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
        .setDeveloperKey(API_KEY)
        .setAppId(APP_ID)
        .setOAuthToken(token)
        .addView(view)
        .setCallback((data: any) => {
          if (data.action === google.picker.Action.PICKED) {
            data.docs.forEach((doc: any) => {
              // We use the file ID to generate a previewable URL 
              // that works well for embedding.
              const fileId = doc.id;
              const url = `https://drive.google.com/file/d/${fileId}/preview`;
              onFileSelect(url);
            });
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
      console.error('Token client not initialized');
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
