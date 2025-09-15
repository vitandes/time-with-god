import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../context/AuthContext';
import Colors from '../constants/Colors';

const LoginScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isAppleLoading, setIsAppleLoading] = useState(false);

  const { login } = useAuth();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const { email, password } = formData;

    if (!email.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu correo electrónico');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Por favor ingresa un correo electrónico válido');
      return false;
    }

    if (!password.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu contraseña');
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // Simular login (en una app real, aquí harías la llamada a tu API)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const userInfo = {
        id: Date.now().toString(),
        name: 'Usuario Demo',
        email: formData.email,
        loginAt: new Date().toISOString()
      };

      const result = await login(userInfo, 'email');
      
      if (result.success) {
        Alert.alert('Éxito', '¡Bienvenido! Has iniciado sesión correctamente.');
      } else {
        Alert.alert('Error', result.error || 'Credenciales incorrectas');
      }
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al iniciar sesión. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    
    try {
      // Integración con Firebase Auth Google Sign-In
      // En una app real, aquí usarías @react-native-google-signin/google-signin
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const userInfo = {
        id: 'google_' + Date.now().toString(),
        name: 'Usuario Google',
        email: 'usuario@gmail.com',
        authProvider: 'google',
        loginAt: new Date().toISOString()
      };

      const result = await login(userInfo, 'google');
      
      if (result.success) {
        Alert.alert('Éxito', '¡Bienvenido! Has iniciado sesión con Google.');
      } else {
        Alert.alert('Error', result.error || 'Error al iniciar sesión con Google');
      }
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al iniciar sesión con Google.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setIsAppleLoading(true);
    
    try {
      // Integración con Firebase Auth Apple Sign-In
      // En una app real, aquí usarías @invertase/react-native-apple-authentication
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const userInfo = {
        id: 'apple_' + Date.now().toString(),
        name: 'Usuario Apple',
        email: 'usuario@icloud.com',
        authProvider: 'apple',
        loginAt: new Date().toISOString()
      };

      const result = await login(userInfo, 'apple');
      
      if (result.success) {
        Alert.alert('Éxito', '¡Bienvenido! Has iniciado sesión con Apple.');
      } else {
        Alert.alert('Error', result.error || 'Error al iniciar sesión con Apple');
      }
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al iniciar sesión con Apple.');
    } finally {
      setIsAppleLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Recuperar contraseña',
      'Se enviará un enlace de recuperación a tu correo electrónico.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Enviar', onPress: () => {
          Alert.alert('Enviado', 'Revisa tu correo electrónico para recuperar tu contraseña.');
        }}
      ]
    );
  };

  return (
    <LinearGradient
      colors={Colors.gradients.primary}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
              </TouchableOpacity>
              
              <View style={styles.titleContainer}>
                <View style={styles.iconContainer}>
                  <Ionicons
                    name="flower"
                    size={40}
                    color={Colors.text.primary}
                  />
                </View>
                <Text style={styles.title}>Bienvenido de vuelta</Text>
                <Text style={styles.subtitle}>
                  Continúa tu viaje espiritual
                </Text>
              </View>
            </View>

            {/* Botones de acceso rápido */}
            <View style={styles.quickAccessContainer}>
              {/* Botón Google - Prioridad 1 */}
              <TouchableOpacity
                style={[styles.googleButton, isGoogleLoading && styles.disabledButton]}
                onPress={handleGoogleSignIn}
                disabled={isGoogleLoading}
                activeOpacity={0.8}
              >
                {isGoogleLoading ? (
                  <ActivityIndicator color={Colors.text.primary} size="small" />
                ) : (
                  <Ionicons name="logo-google" size={24} color={Colors.text.primary} />
                )}
                <Text style={styles.googleButtonText}>
                  {isGoogleLoading ? 'Iniciando sesión...' : 'Iniciar sesión con Google'}
                </Text>
              </TouchableOpacity>

              {/* Botón Apple - Prioridad 2 (solo iOS) */}
              {Platform.OS === 'ios' && (
                <TouchableOpacity
                  style={[styles.appleButton, isAppleLoading && styles.disabledButton]}
                  onPress={handleAppleSignIn}
                  disabled={isAppleLoading}
                  activeOpacity={0.8}
                >
                  {isAppleLoading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Ionicons name="logo-apple" size={24} color="#fff" />
                  )}
                  <Text style={styles.appleButtonText}>
                    {isAppleLoading ? 'Iniciando sesión...' : 'Iniciar sesión con Apple'}
                  </Text>
                </TouchableOpacity>
              )}

              {/* Divisor */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>o</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Botón para mostrar formulario de correo - Prioridad 3 */}
              <TouchableOpacity
                style={styles.emailToggleButton}
                onPress={() => setShowEmailForm(!showEmailForm)}
                activeOpacity={0.8}
              >
                <Ionicons 
                  name="mail-outline" 
                  size={20} 
                  color={Colors.text.secondary} 
                />
                <Text style={styles.emailToggleButtonText}>
                  Iniciar sesión con correo y contraseña
                </Text>
                <Ionicons 
                  name={showEmailForm ? "chevron-up-outline" : "chevron-down-outline"} 
                  size={18} 
                  color={Colors.text.secondary} 
                />
              </TouchableOpacity>
            </View>

            {/* Formulario de correo y contraseña (colapsable) */}
            {showEmailForm && (
              <View style={styles.emailFormContainer}>
                {/* Campo Email */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Correo electrónico</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons
                      name="mail-outline"
                      size={20}
                      color={Colors.text.secondary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.textInput}
                      placeholder="tu@correo.com"
                      placeholderTextColor={Colors.text.muted}
                      value={formData.email}
                      onChangeText={(value) => handleInputChange('email', value)}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                    />
                  </View>
                </View>

                {/* Campo Contraseña */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Contraseña</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color={Colors.text.secondary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.textInput}
                      placeholder="Tu contraseña"
                      placeholderTextColor={Colors.text.muted}
                      value={formData.password}
                      onChangeText={(value) => handleInputChange('password', value)}
                      secureTextEntry={!showPassword}
                      autoComplete="password"
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeIcon}
                    >
                      <Ionicons
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        size={20}
                        color={Colors.text.secondary}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Enlace olvidé contraseña */}
                <TouchableOpacity
                  style={styles.forgotPassword}
                  onPress={handleForgotPassword}
                >
                  <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
                </TouchableOpacity>

                {/* Botón de login */}
                <TouchableOpacity
                  style={[styles.loginButton, isLoading && styles.disabledButton]}
                  onPress={handleLogin}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  {isLoading ? (
                    <Text style={styles.loginButtonText}>Iniciando sesión...</Text>
                  ) : (
                    <Text style={styles.loginButtonText}>Iniciar sesión</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}

            {/* Link a registro */}
            <View style={styles.registerLink}>
              <Text style={styles.registerLinkText}>¿No tienes una cuenta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerLinkButton}>Regístrate</Text>
              </TouchableOpacity>
            </View>

            {/* Mensaje inspirador */}
            <View style={styles.inspirationalContainer}>
              <Text style={styles.inspirationalText}>
                "Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar"
              </Text>
              <Text style={styles.inspirationalReference}>Mateo 11:28</Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  header: {
    marginTop: 20,
    marginBottom: 40,
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 8,
    marginBottom: 30,
  },
  titleContainer: {
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 40,
    marginBottom: 20,
    shadowColor: Colors.shadow.light,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  quickAccessContainer: {
    marginBottom: 20,
  },
  emailFormContainer: {
    marginTop: 16,
  },
  formContainer: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: Colors.shadow.light,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
  },
  eyeIcon: {
    padding: 4,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 30,
  },
  forgotPasswordText: {
    color: Colors.text.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: Colors.text.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: Colors.shadow.dark,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  disabledButton: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: Colors.text.light,
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.text.muted,
  },
  dividerText: {
    marginHorizontal: 16,
    color: Colors.text.secondary,
    fontSize: 14,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.text.muted,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  googleButtonText: {
    color: Colors.text.primary,
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
  appleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  appleButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
    marginLeft: 12,
  },
  emailToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.text.muted,
    marginBottom: 8,
  },
  emailToggleButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.text.secondary,
    flex: 1,
    marginLeft: 12,
  },
  registerLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  registerLinkText: {
    color: Colors.text.secondary,
    fontSize: 14,
  },
  registerLinkButton: {
    color: Colors.text.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  inspirationalContainer: {
    backgroundColor: Colors.surface,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 30,
    borderLeftWidth: 4,
    borderLeftColor: Colors.secondary,
  },
  inspirationalText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 6,
    lineHeight: 20,
  },
  inspirationalReference: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
});

export default LoginScreen;