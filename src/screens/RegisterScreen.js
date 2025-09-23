import React, { useState, useEffect, useRef } from 'react';
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
  Animated,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import Colors from '../constants/Colors';

const RegisterScreen = ({ navigation }) => {
  const { t } = useTranslation(['app', 'common']);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isAppleLoading, setIsAppleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isAppleAvailable, setIsAppleAvailable] = useState(Platform.OS === 'ios');
  const [showEmailForm, setShowEmailForm] = useState(false);

  
  // Animación para los botones
  const buttonAnimation = useState(new Animated.Value(1))[0];
  const scrollViewRef = useRef(null);
  
  const animateButton = () => {
    Animated.sequence([
      Animated.timing(buttonAnimation, {
        toValue: 1.05,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(buttonAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };
  
  // Efecto para desplazar la pantalla cuando se muestra el formulario de email
  useEffect(() => {
    if (showEmailForm && scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }, 300);
    }
  }, [showEmailForm]);

  const { signInWithGoogle, signInWithApple, signUpWithEmail } = useAuth();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const { name, email, password, confirmPassword } = formData;

    if (!name.trim()) {
      Alert.alert(t('common:error'), t('app:register.validation.nameRequired'));
      return false;
    }

    if (!email.trim()) {
      Alert.alert(t('common:error'), t('app:register.validation.emailRequired'));
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert(t('common:error'), t('app:register.validation.invalidEmail'));
      return false;
    }

    if (!password.trim()) {
      Alert.alert(t('common:error'), t('app:register.validation.passwordRequired'));
      return false;
    }

    if (password.length < 6) {
      Alert.alert(t('common:error'), t('app:register.validation.passwordTooShort'));
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert(t('common:error'), t('app:register.validation.passwordsDoNotMatch'));
      return false;
    }

    return true;
  };
  


  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // Usar Firebase Auth para registrar con email y contraseña
      const result = await signUpWithEmail(formData.email, formData.password);
      
      if (result.success) {
        Alert.alert(
          '¡Bienvenido!',
          'Tu espacio espiritual ha sido creado exitosamente. Cada día será una nueva oportunidad de crecer. ✨',
          [{ text: 'Continuar' }]
        );
      } else {
        Alert.alert('Error de registro', result.error || 'Hubo un problema al crear tu cuenta');
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', 'Hubo un problema al crear tu espacio. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar registro con Google - Firebase Auth 2025
  const handleGoogleSignUp = async () => {
    animateButton();
    setIsGoogleLoading(true);
    try {
      // NOTA: Esta función necesita ser refactorizada para usar useGoogleAuth hook
      // Ver googleAuthExample.ts para la implementación correcta con useAuthRequest
      Alert.alert(
        'Implementación requerida', 
        'Google Sign-In requiere usar el hook useGoogleAuth. Ver googleAuthExample.ts para la implementación correcta.'
      );
    } catch (error) {
      console.error('Error Google Sign-In:', error);
      Alert.alert('Error', 'Hubo un problema al iniciar sesión con Google. Inténtalo de nuevo con fe.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Manejar registro con Apple - Firebase Auth 2025 (solo iOS)
  const handleAppleSignUp = async () => {
    animateButton();
    setIsAppleLoading(true);
    try {
      const result = await signInWithApple();
      
      if (result.success) {
        Alert.alert(
          '¡Bienvenido a tu camino espiritual!',
          'Has iniciado tu viaje con Apple exitosamente. Cada día será una nueva oportunidad de crecer. ✨',
          [{ text: 'Comenzar' }]
        );
      } else {
        Alert.alert('Error de Apple', result.error || 'No pudimos iniciar tu camino con Apple. Inténtalo nuevamente.');
      }
    } catch (error) {
      console.error('Error Apple Sign-In:', error);
      Alert.alert('Error', 'Hubo un problema al iniciar sesión con Apple. Inténtalo de nuevo con fe.');
    } finally {
      setIsAppleLoading(false);
    }
  };
  


  return (
    <LinearGradient
      colors={Colors.gradients.sky}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView 
            ref={scrollViewRef}
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
                <Text style={styles.title}>{t('app:register.title')}</Text>
        <Text style={styles.subtitle}>
          {t('app:register.subtitle')}
        </Text>
              </View>
            </View>

            {/* Botones de acceso rápido */}
            <View style={styles.quickAccessContainer}>
              {/* Botón Apple - Prioridad 1 (solo iOS) */}
              {Platform.OS === 'ios' && (
                <TouchableOpacity
                  style={[styles.appleButton, isAppleLoading && styles.disabledButton]}
                  onPress={handleAppleSignUp}
                  disabled={isAppleLoading}
                  activeOpacity={0.8}
                >
                  {isAppleLoading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Ionicons name="logo-apple" size={24} color="#fff" />
                  )}
                  <Text style={styles.appleButtonText}>
                    {isAppleLoading ? t('app:auth.signingUp') : t('app:register.continueWithApple')}
                  </Text>
                </TouchableOpacity>
              )}

              {/* Botón Google - Prioridad 2 */}
              <TouchableOpacity
                style={[styles.googleButton, isGoogleLoading && styles.disabledButton]}
                onPress={handleGoogleSignUp}
                disabled={isGoogleLoading}
                activeOpacity={0.8}
              >
                {isGoogleLoading ? (
                  <ActivityIndicator color={Colors.text.primary} size="small" />
                ) : (
                  <Ionicons name="logo-google" size={24} color={Colors.text.primary} />
                )}
                <Text style={styles.googleButtonText}>
                  {isGoogleLoading ? t('app:auth.signingUp') : t('app:register.continueWithGoogle')}
                </Text>
              </TouchableOpacity>

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
                <Ionicons 
                  name="mail-outline" 
                  size={20} 
                  color={Colors.text.secondary} 
                />
                <Text style={styles.emailToggleButtonText}>
                  {t('app:register.createWithEmail')}
                </Text>
                <Ionicons 
                  name={showEmailForm ? "chevron-up-outline" : "chevron-down-outline"} 
                  size={18} 
                  color={Colors.text.secondary} 
                />
              </TouchableOpacity>
            </View>

            {/* Formulario de registro (colapsable) */}
            {showEmailForm && (
              <View style={styles.emailFormContainer}>
                {/* Campo Nombre */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>{t('app:register.name')}</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons
                      name="person-outline"
                      size={20}
                      color={Colors.text.secondary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.textInput}
                      placeholder={t('app:register.namePlaceholder')}
                      placeholderTextColor={Colors.text.muted}
                      value={formData.name}
                      onChangeText={(value) => handleInputChange('name', value)}
                      autoCapitalize="words"
                      autoComplete="name"
                    />
                  </View>
                </View>

                {/* Campo Email */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>{t('app:register.email')}</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons
                      name="mail-outline"
                      size={20}
                      color={Colors.text.secondary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.textInput}
                      placeholder={t('app:register.emailPlaceholder')}
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
                  <Text style={styles.inputLabel}>{t('app:register.password')}</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color={Colors.text.secondary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.textInput}
                      placeholder={t('app:register.passwordPlaceholder')}
                      placeholderTextColor={Colors.text.muted}
                      value={formData.password}
                      onChangeText={(value) => handleInputChange('password', value)}
                      secureTextEntry={!showPassword}
                      autoComplete="new-password"
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

                {/* Campo Confirmar Contraseña */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>{t('app:register.confirmPassword')}</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color={Colors.text.secondary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.textInput}
                      placeholder={t('app:register.confirmPasswordPlaceholder')}
                      placeholderTextColor={Colors.text.muted}
                      value={formData.confirmPassword}
                      onChangeText={(value) => handleInputChange('confirmPassword', value)}
                      secureTextEntry={!showConfirmPassword}
                      autoComplete="new-password"
                    />
                    <TouchableOpacity
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={styles.eyeIcon}
                    >
                      <Ionicons
                        name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                        size={20}
                        color={Colors.text.secondary}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Botón de registro */}
                <TouchableOpacity
                  style={[styles.registerButton, isLoading && styles.disabledButton]}
                  onPress={handleRegister}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  {isLoading ? (
                    <Text style={styles.registerButtonText}>{t('app:auth.creatingAccount')}</Text>
                  ) : (
                    <Text style={styles.registerButtonText}>{t('app:register.createAccount')}</Text>
                  )}
                </TouchableOpacity>


              </View>
            )}

            {/* Link a login */}
            <View style={styles.loginLink}>
              <Text style={styles.loginLinkText}>{t('app:register.alreadyHaveAccount')} </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLinkButton}>{t('app:register.signIn')}</Text>
              </TouchableOpacity>
            </View>

            {/* Mensaje inspirador */}
            <View style={styles.inspirationalContainer}>
              <Text style={styles.inspirationalText}>
                {t('app:register.inspirationalMessage.text')}
              </Text>
              <Text style={styles.inspirationalReference}>{t('app:register.inspirationalMessage.reference')}</Text>
            </View>

            {/* Términos y condiciones - Solo una vez al final */}
            <View style={styles.termsContainer}>
              <Text style={styles.termsText}>
                {t('app:register.termsAcceptance')} 
                <Text style={styles.termsLink}> {t('app:register.termsOfService')}</Text>
                <Text> {t('app:register.and')} </Text>
                <Text style={styles.termsLink}>{t('app:register.privacyPolicy')}</Text>
              </Text>
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
    paddingBottom: 40,
  },
  header: {
    marginTop: 20,
    marginBottom: 30,
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 8,
    marginBottom: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  progressContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  progressBar: {
    width: '60%',
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.white,
    borderRadius: 3,
  },
  progressText: {
    color: Colors.white,
    fontSize: 12,
    marginTop: 5,
    opacity: 0.9,
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
  registerButton: {
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: Colors.shadow.dark,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
  registerButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
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
  quickAccessContainer: {
    marginBottom: 20,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: Colors.shadow.light,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
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
    shadowColor: Colors.shadow.dark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  appleButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
  loginLink: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  socialButtonsContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  loginLinkText: {
    color: Colors.white,
    fontSize: 14,
    opacity: 0.9,
  },
  loginLinkButton: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  emotionalMessage: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  emotionalMessageText: {
    color: Colors.white,
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
    opacity: 0.9,
    lineHeight: 20,
  },

  emailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  emailButtonText: {
    color: Colors.text.secondary,
    fontWeight: '500',
    fontSize: 15,
    textDecorationLine: 'underline',
    marginRight: 5,
  },
  traditionalFormContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
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
    textAlign: 'left',
    flexWrap: 'wrap',
  },
  emailFormContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    marginBottom: 24,
  },
  iconContainer: {
    marginBottom: 16,
  },
  termsContainer: {
    marginTop: 16,
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  termsText: {
    fontSize: 13,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: Colors.primary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  inspirationalContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginTop: 24,
    marginBottom: 32,
    alignItems: 'center',
    shadowColor: Colors.shadow.medium,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  inspirationalText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 24,
    fontWeight: '500',
  },
  inspirationalReference: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default RegisterScreen;