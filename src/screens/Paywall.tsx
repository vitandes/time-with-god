import { Platform } from 'react-native';

import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import RevenueCatUI, { PAYWALL_RESULT } from "react-native-purchases-ui";
import Purchases, { LOG_LEVEL } from "react-native-purchases";


const SubscriptionPaywall = ({ navigation }) => {
   useEffect(() => {
     Purchases.setLogLevel(LOG_LEVEL.VERBOSE);

     // Platform-specific API keys
     const iosApiKey = 'test_ObwXVXTOZpepjNdgRjeuMuqKZMv';
     const androidApiKey = 'test_ObwXVXTOZpepjNdgRjeuMuqKZMv';

     if (Platform.OS === 'ios') {
        Purchases.configure({apiKey: iosApiKey});
     } else if (Platform.OS === 'android') {
        Purchases.configure({apiKey: androidApiKey});
     }
   }, []);

  const [offering, setOffering] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const handlePurchaseCompleted = (customerInfo) => {
    console.log("Purchase completed event received!");

    console.log("🟢 ID original:", customerInfo.originalAppUserId);
    navigation.replace("Login");
  };

  const handleRestoreCompleted = (customerInfo) => {
    console.log("Restore completed event received!");
    console.log("Restored CustomerInfo:", customerInfo);
    navigation.replace("Login");
  };

  useEffect(() => {
    const getOfferings = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Asegúrate que Purchases esté configurado
        if (!Purchases.isConfigured()) {
          console.warn(
            "Purchases SDK no está configurado. Por favor, llama a Purchases.configure() primero."
          );
          // Aquí podrías intentar configurar si sabes que no lo has hecho, o simplemente mostrar un error.
          // Por ejemplo, si este componente puede ser el primero en usar Purchases:
          // await Purchases.configure({ apiKey: "tu_api_key_google_o_apple" });
        }

        const offerings = await Purchases.getOfferings();
        if (
          offerings.current !== null &&
          offerings.current.availablePackages.length !== 0
        ) {
          setOffering(offerings.current);
        } else {
          setError("No current offering found or no available packages.");
          console.warn("No current offering found or no available packages.");
        }
      } catch (e) {
        setError("Error fetching offerings: " + e.message);
        console.error("Error fetching offerings:", e);
      } finally {
        setIsLoading(false);
      }
    };

    getOfferings();
  }, []);

  if (!offering) {
    // Esto puede pasar si no hay error, pero tampoco hay 'current' offering.
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No offerings available at the moment.</Text>
      </View>
    );
  }

  // Si llegas aquí, offering no es null y no hay error
  return (
    <RevenueCatUI.Paywall
      options={{ offering: offering }}
      // Opcional: Escuchar eventos del Paywall

      onPurchaseCompleted={handlePurchaseCompleted}
      onRestoreCompleted={handleRestoreCompleted} // Es buena práctica manejar restauraciones
      onDismiss={() => console.log("Paywall dismissed")} // Importante si lo usas como modal
    />
  );
};

export default SubscriptionPaywall;
