import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { API_URL } from '../config/constants';

export function Transcribe() {
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['audio/*', 'video/*'],
        copyToCacheDirectory: true,
      });

      if (result.type === 'success') {
        await uploadFile(result);
      }
    } catch (err) {
      setError('Error selecting file');
      console.error(err);
    }
  };

  const uploadFile = async (document: DocumentPicker.DocumentResult) => {
    if (document.type !== 'success') return;

    setLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: document.uri,
        type: document.mimeType,
        name: document.name,
      } as any);

      const response = await fetch(`${API_URL}/transcribe`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = await response.json();

      if (data.success) {
        setTranscript(data.transcript);
      } else {
        setError(data.error || 'Failed to transcribe file');
      }
    } catch (err) {
      setError('Error uploading file');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.uploadButton} 
        onPress={pickDocument}
        disabled={loading}
      >
        <Text style={styles.uploadButtonText}>
          {loading ? 'Processing...' : 'Upload Audio/Video'}
        </Text>
      </TouchableOpacity>

      {loading && (
        <ActivityIndicator size="large" style={styles.loader} />
      )}

      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : null}

      {transcript ? (
        <ScrollView style={styles.transcriptContainer}>
          <Text style={styles.transcriptTitle}>Transcript:</Text>
          <Text style={styles.transcriptText}>{transcript}</Text>
        </ScrollView>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  uploadButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loader: {
    marginTop: 20,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
  transcriptContainer: {
    marginTop: 20,
    flex: 1,
  },
  transcriptTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  transcriptText: {
    fontSize: 16,
    lineHeight: 24,
  },
}); 