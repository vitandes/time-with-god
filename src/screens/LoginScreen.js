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
import { useTranslation } from 'react-i18next';

import { useAuth } from '../context/AuthContext';
import Colors from '../constants/Colors';

const LoginScreen = ({ navigation }) => {
  const { t } = useTranslation('app');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isAppleLoading, setIsAppleLoading] = useState(false);

  const { signInWithGoogle, signInWithApple, signInWithEmail } = useAuth();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const { email, password } = formData;

    if (!email.trim()) {
      Alert.alert(t('common:error'), t('app:auth.invalidEmail'));
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert(t('common:error'), t('app:auth.invalidEmail'));
      return false;
    }

    if (!password.trim()) {
      Alert.alert(t('common:error'), t('app:auth.passwordTooShort'));
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // Usar Firebase Auth para iniciar sesión con email y contraseña
      const result = await signInWithEmail(formData.email, formData.password);
      
      if (result.success) {
        Alert.alert(t('common:welcome'), t('app:auth.loginSuccess'));
      } else {
        Alert.alert(t('app:auth.authError'), result.error || t('app:auth.loginError'));
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert(t('common:error'), t('app:auth.loginProblem'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    
    try {
      // NOTA: Esta función necesita ser refactorizada para usar useGoogleAuth hook
      // Ver googleAuthExample.ts para la implementación correcta con useAuthRequest
      // Alert.alert(
      //   'Implementación requerida', 
      //   'Google Sign-In requiere usar el hook useGoogleAuth. Ver googleAuthExample.ts para la implementación correcta.'
      // );
      const resp = await signInWithGoogle()
      console.log('resp googlesingin: ',resp)
    } catch (error) {
      console.error('Google sign-in error:', error);
      Alert.alert(t('common:error'), t('app:auth.googleError'));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setIsAppleLoading(true);
    
    try {
      // Usar Firebase Auth para iniciar sesión con Apple
      const result = await signInWithApple();
      
      if (result.success) {
        Alert.alert(t('common:welcome'), t('app:auth.appleSuccess'));
      } else {
        Alert.alert(t('app:auth.appleError'), result.error || t('app:auth.appleLoginError'));
      }
    } catch (error) {
      console.error('Apple sign-in error:', error);
      Alert.alert(t('common:error'), t('app:auth.appleProblem'));
    } finally {
      setIsAppleLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      t('app:auth.recoverPassword'),
      t('app:auth.recoverPasswordMessage'),
      [
        { text: t('common:cancel'), style: 'cancel' },
        { text: t('common:send'), onPress: () => {
          Alert.alert(t('app:auth.sent'), t('app:auth.checkEmail'));
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
                <Text style={styles.title}>{t('app:auth.welcomeBack')}</Text>
                <Text style={styles.subtitle}>
                  {t('app:auth.continueJourney')}
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
                  {isGoogleLoading ? t('app:auth.signingIn') : t('app:auth.signInGoogle')}
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
                    {isAppleLoading ? t('app:auth.signingIn') : t('app:auth.signInApple')}
                  </Text>
                </TouchableOpacity>
              )}

              {/* Divisor */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>{t('common:or')}</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Botón para mostrar formulario de correo - Prioridad 3 */}
              <TouchableOpacity
                style={styles.emailToggleButton}
                onPress={() => setShowEmailForm(!showEmailForm)}
                activeOpacity={0.8}
              >
                <Text style={styles.emailToggleButtonText}>
                  {t('app:auth.signInEmail')}
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
                  <Text style={styles.inputLabel}>{t('app:auth.email')}</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons
                      name="mail-outline"
                      size={20}
                      color={Colors.text.secondary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.textInput}
                      placeholder={t('app:auth.emailPlaceholder')}
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
                  <Text style={styles.inputLabel}>{t('app:auth.password')}</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color={Colors.text.secondary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.textInput}
                      placeholder={t('app:auth.passwordPlaceholder')}
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
                  <Text style={styles.forgotPasswordText}>{t('app:auth.forgotPassword')}</Text>
                </TouchableOpacity>

                {/* Botón de login */}
                <TouchableOpacity
                  style={[styles.loginButton, isLoading && styles.disabledButton]}
                  onPress={handleLogin}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  {isLoading ? (
                    <Text style={styles.loginButtonText}>{t('app:auth.signingIn')}</Text>
                  ) : (
                    <Text style={styles.loginButtonText}>{t('common:login')}</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}

            {/* Link a registro */}
            <View style={styles.registerLink}>
              <Text style={styles.registerLinkText}>{t('app:auth.noAccount')} </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerLinkButton}>{t('common:register')}</Text>
              </TouchableOpacity>
            </View>

            {/* Mensaje inspirador */}
            <View style={styles.inspirationalContainer}>
              <Text style={styles.inspirationalText}>
                {t('app:login.inspirationalMessage.text')}
            </Text>
            <Text style={styles.inspirationalReference}>{t('app:login.inspirationalMessage.reference')}</Text>
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
    backgroundColor: Colors.surface,
    borderRadius: 20,
    shadowColor: Colors.shadow.light,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  titleContainer: {
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: Colors.surface,
    padding: 20,
    borderRadius: 50,
    marginBottom: 24,
    shadowColor: Colors.shadow.medium,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: Colors.primary + '20',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: Colors.white,
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.9,
  },
  quickAccessContainer: {
    marginBottom: 24,
  },
  emailFormContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 24,
    marginTop: 16,
    marginBottom: 24,
    shadowColor: Colors.shadow.medium,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: Colors.primary + '15',
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
    backgroundColor: Colors.primary,
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
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.text.secondary + '30',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 16,
    color: Colors.white,
    fontWeight: '500',
    opacity: 0.8,
  },
  googleButton: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.shadow.medium,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: Colors.text.secondary + '20',
  },
  googleButtonText: {
    color: Colors.text.primary,
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
  appleButton: {
    backgroundColor: Colors.text.primary,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.shadow.dark,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  appleButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
    marginLeft: 12,
  },
  emailToggleButton: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 2,
    alignItems: 'center',
    shadowColor: Colors.shadow.medium,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  emailToggleText: {
    color: Colors.text.light,
    fontSize: 16,
    fontWeight: '600',
  },
  registerLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 24,
  },
  registerLinkText: {
    color: Colors.white,
    fontSize: 16,
    opacity: 0.9,
  },
  registerLinkButton: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  inspirationalContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 24,
    marginTop: 24,
    marginBottom: 40,
    alignItems: 'center',
    shadowColor: Colors.shadow.light,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.primary + '10',
  },
  inspirationalText: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 24,
    marginBottom: 8,
  },
  inspirationalReference: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default LoginScreen;