import React, { useEffect, useLayoutEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, TextInput, Button, Alert, Text } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackScreens } from "../../App";
import AsyncStorage from "@react-native-async-storage/async-storage";

type LoginProps = NativeStackScreenProps<StackScreens, "Login">;

const Login: React.FC<LoginProps> = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const userToken = await AsyncStorage.getItem("userToken");
      if (userToken) {
        navigation.replace("Welcome");
      } else {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, [navigation]);

  const handleLogin = async () => {
    try {
      const response = await fetch("http://127.0.0.1:50000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        await AsyncStorage.setItem("userToken", data.data.token);
        navigation.replace("Welcome");
      } else {
        const data = await response.json();
        Alert.alert("Authentication Failed", data.message);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: !isLoading,
    });
  }, [navigation, isLoading]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <Text style={{ fontSize: 18 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={{ fontSize: 20, marginVertical: "2%", color: "#333366" }}>
        Sign in
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={(text) => setUsername(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <Button color={"#0092FF"} title="Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    margin: 10,
    padding: 10,
    width: "80%",
  },
});

export default Login;
