import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackScreens } from "../../App";
import { WebView as NativeWebView } from "react-native-webview";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function WebView({}: NativeStackScreenProps<StackScreens, "App">) {
  console.log(
    "EXPO_PUBLIC_WEBAPP_ROOT=%s",
    process.env.EXPO_PUBLIC_WEBAPP_ROOT
  );

  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const retrieveSessionToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("userToken");
        setToken(storedToken);
      } catch (error) {
        console.error("Error retrieving session token:", error);
      } finally {
        setLoading(false);
      }
    };

    if (loading && !token) {
      retrieveSessionToken();
    }
  }, [loading, token]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <NativeWebView
        sharedCookiesEnabled={true}
        source={{
          uri: process.env.EXPO_PUBLIC_WEBAPP_ROOT as string,
          headers: {
            Cookie: `SESSION_TOKEN=${token}`,
          },
        }}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
