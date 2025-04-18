import { Text, View, TouchableOpacity, StyleSheet, Platform, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useSetAtom } from 'jotai';
import { analysisAtom } from '@/atoms/analysis';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Camera, ImagePlus } from 'lucide-react-native';

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
    <ImageBackground
      source={{
        uri: 'https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      }}
      resizeMode="cover"
      style={styles.background}
    >
      <View style={styles.overlay} />

      <View style={styles.container}>
        <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
          <Text style={styles.greeting}>Start Tracking</Text>
          <Text style={styles.subText}>Upload or capture your meal photo</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.actionCards}>
          <TouchableOpacity style={styles.actionCard} onPress={() => captureImage(true)}>
            <Camera size={28} color="#2DD4BF" />
            <Text style={styles.actionText}>Take a Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => captureImage(false)}>
            <ImagePlus size={28} color="#2DD4BF" />
            <Text style={styles.actionText}>Upload Photo</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  greeting: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#FFFFFF',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#E5E7EB',
    textAlign: 'center',
  },
  actionCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
  },
  actionCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    height: 120,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  actionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: '#374151',
    marginTop: 12,
    textAlign: 'center',
  },
});
