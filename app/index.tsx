import { Text, View, Button } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useSetAtom } from 'jotai';
import { analysisAtom } from '@/atoms/analysis';
const fakeResponse = require('@/assets/response.json');

export default function Index() {
  const router = useRouter();
  const setAnalysis = useSetAtom(analysisAtom);

  const captureImage = async (camera = false) => {
    // if (__DEV__) {
    //   setAnalysis(fakeResponse);
    //   router.push('/result');
    //   return;
    // }

    let result;
    if (camera) {
      await ImagePicker.requestCameraPermissionsAsync();
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        quality: 1,
        base64: true,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 1,
        base64: true,
      });
    }

    if (!result.canceled) {
      try {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: {
              inlineData: {
                data: result.assets[0].base64,
                mimeType: 'image/jpeg',
              },
            },
          }),
        });
        const data = await response.json();
        const foodAnalysis = data.data.foodAnalysis;
        foodAnalysis.image = result.assets[0].uri;
        setAnalysis(foodAnalysis);
        router.push('/result');
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 20,
      }}>
      <Text style={{ fontSize: 24, marginBottom: 30, color: '#333', textAlign: 'center' }}>
        Choose an Image
      </Text>
      <View style={{ gap: 15 }}>
        <Button title="📸 Take Photo" onPress={() => captureImage(true)} color="#007AFF" />
        <Button title="🖼️ Pick from Gallery" onPress={() => captureImage(false)} color="#32CD32" />
      </View>
    </View>
  );
}
