import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackScreens } from "../../App";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Button, StyleSheet, View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type WelcomeProps = NativeStackScreenProps<StackScreens, "Welcome">;

const Welcome: React.FC<WelcomeProps> = ({ navigation }) => {
  const handleLogout = async () => {
    try {
      const response = await fetch("http://127.0.0.1:50000/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        await AsyncStorage.removeItem("userToken");
        navigation.replace("Home");
      } else {
        console.error("Logout failed:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <View style={{ flex: 1, marginTop: "5%" }}>
      <StatusBar style="auto" />
      <Button color={"#0092FF"} title="Logout" onPress={handleLogout} />
      <View style={styles.container}>
        <Text style={{ fontSize: 20, color: "#333366" }}>
          Welcome to TakeHome-RN!
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Welcome;
