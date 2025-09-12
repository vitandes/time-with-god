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
import Colors from '../constants/Colors';

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isAppleAvailable, setIsAppleAvailable] = useState(Platform.OS === 'ios');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [magicEmail, setMagicEmail] = useState('');
  const [isMagicLinkSending, setIsMagicLinkSending] = useState(false);
  
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

  const { login } = useAuth();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const { name, email, password, confirmPassword } = formData;

    if (!name.trim()) {
      Alert.alert('Nombre requerido', '¿Cómo quieres que te llamemos en tu camino espiritual? 🌿');
      return false;
    }

    if (!email.trim()) {
      Alert.alert('Correo requerido', 'Necesitamos tu correo para acompañarte en tu camino 📩');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Correo inválido', 'Este correo necesita una bendición extra ✨ Revisa el formato.');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Contraseña corta', 'Una contraseña más larga te protegerá mejor en tu camino espiritual 🛡️');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Contraseñas diferentes', 'Las contraseñas no coinciden. Intenta nuevamente con paz y calma 🕊️');
      return false;
    }

    return true;
  };
  
  const validateMagicEmail = () => {
    if (!magicEmail.trim()) {
      Alert.alert('Correo requerido', 'Necesitamos tu correo para enviarte el enlace mágico ✨');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(magicEmail)) {
      Alert.alert('Correo inválido', 'Este correo necesita una bendición extra ✨ Revisa el formato.');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // Simular registro (en una app real, aquí harías la llamada a Firebase Auth)
      // Ejemplo: await createUserWithEmailAndPassword(auth, formData.email, formData.password)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const userInfo = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        registeredAt: new Date().toISOString(),
        photoURL: null
      };

      const result = await login(userInfo, 'email');
      
      if (result.success) {
        Alert.alert(
          '¡Bienvenido!',
          'Tu espacio espiritual ha sido creado. Cada día será una nueva oportunidad de crecer. ✨',
          [{ text: 'Continuar' }]
        );
      } else {
        Alert.alert('Algo salió mal', result.error || 'Hubo un problema al crear tu espacio espiritual');
      }
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al crear tu espacio. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    animateButton();
    setIsLoading(true);
    try {
      // Simulación de inicio de sesión con Google
      // En una implementación real, usarías Firebase Auth:
      // const provider = new GoogleAuthProvider();
      // const result = await signInWithPopup(auth, provider);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Datos simulados que vendrían de Google
      const userInfo = {
        id: `google_${Date.now().toString()}`,
        name: 'Usuario de Google',
        email: 'usuario@gmail.com',
        registeredAt: new Date().toISOString(),
        photoURL: 'https://example.com/profile.jpg'
      };
      
      const result = await login(userInfo, 'google');
      
      if (result.success) {
        Alert.alert(
          '¡Bienvenido a tu camino espiritual!',
          'Has iniciado tu viaje con Google exitosamente. Cada día será una nueva oportunidad de crecer. ✨',
          [{ text: 'Comenzar' }]
        );
      } else {
        Alert.alert('Algo salió mal', result.error || 'No pudimos iniciar tu camino con Google. Inténtalo nuevamente.');
      }
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al iniciar sesión con Google. Inténtalo de nuevo con fe.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleSignUp = async () => {
    animateButton();
    setIsLoading(true);
    try {
      // Simulación de inicio de sesión con Apple
      // En una implementación real, usarías Firebase Auth:
      // const provider = new OAuthProvider('apple.com');
      // const result = await signInWithPopup(auth, provider);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Datos simulados que vendrían de Apple
      const userInfo = {
        id: `apple_${Date.now().toString()}`,
        name: 'Usuario de Apple',
        email: 'usuario@icloud.com',
        registeredAt: new Date().toISOString(),
        photoURL: null
      };
      
      const result = await login(userInfo, 'apple');
      
      if (result.success) {
        Alert.alert(
          '¡Bienvenido a tu camino espiritual!',
          'Has iniciado tu viaje con Apple exitosamente. Cada día será una nueva oportunidad de crecer. ✨',
          [{ text: 'Comenzar' }]
        );
      } else {
        Alert.alert('Algo salió mal', result.error || 'No pudimos iniciar tu camino con Apple. Inténtalo nuevamente.');
      }
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al iniciar sesión con Apple. Inténtalo de nuevo con fe.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleMagicLinkSignUp = async () => {
    if (!validateMagicEmail()) return;
    
    setIsMagicLinkSending(true);
    try {
      // Simulación de envío de enlace mágico
      // En una implementación real, usarías Firebase Auth:
      // const actionCodeSettings = { ... };
      // await sendSignInLinkToEmail(auth, magicEmail, actionCodeSettings);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        '¡Enlace mágico enviado! ✨',
        `Hemos enviado un enlace especial a ${magicEmail}. Revisa tu correo para continuar tu camino espiritual.`,
        [{ text: 'Entendido' }]
      );
      setMagicEmail('');
    } catch (error) {
      Alert.alert('Error', 'No pudimos enviar el enlace mágico. Inténtalo de nuevo con fe.');
    } finally {
      setIsMagicLinkSending(false);
    }
  };

  return (
    <LinearGradient
      colors={[Colors.gradients.sky.start, Colors.gradients.sky.end]}
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
                <Ionicons name="arrow-back" size={24} color={Colors.white} />
              </TouchableOpacity>
              
              <View style={styles.titleContainer}>
                <Text style={styles.title}>Conéctate fácil, empieza tu camino con Dios</Text>
                <Text style={styles.subtitle}>Elige la forma más sencilla para ti.</Text>
              </View>
              
              {/* Indicador de progreso */}
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={styles.progressFill} />
                </View>
                <Text style={styles.progressText}>Paso 2 de 2</Text>
              </View>
            </View>

            {/* Opciones de acceso rápido */}
            <View style={styles.formContainer}>
              {/* Botones principales de acceso rápido */}
              <View style={styles.quickAccessContainer}>
                {/* Botón Google */}
                <Animated.View style={{
                  transform: [{ scale: buttonAnimation }],
                  marginBottom: 15,
                }}>
                  <TouchableOpacity
                    style={styles.googleButton}
                    onPress={handleGoogleSignUp}
                    activeOpacity={0.8}
                    disabled={isLoading}
                  >
                    <Ionicons name="logo-google" size={20} color="#DB4437" />
                    <Text style={styles.googleButtonText}>
                      {isLoading ? 'Conectando...' : 'Continuar con Google'}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
                
                {/* Botón Apple (solo iOS) */}
                {isAppleAvailable && (
                  <Animated.View style={{
                    transform: [{ scale: buttonAnimation }],
                    marginBottom: 15,
                  }}>
                    <TouchableOpacity
                      style={styles.appleButton}
                      onPress={handleAppleSignUp}
                      activeOpacity={0.8}
                      disabled={isLoading}
                    >
                      <Ionicons name="logo-apple" size={20} color={Colors.white} />
                      <Text style={styles.appleButtonText}>
                        {isLoading ? 'Conectando...' : 'Continuar con Apple'}
                      </Text>
                    </TouchableOpacity>
                  </Animated.View>
                )}
                
                {/* Botón Correo Mágico */}
                <Animated.View style={{
                  transform: [{ scale: buttonAnimation }],
                  marginBottom: 20,
                }}>
                  <View style={styles.magicLinkContainer}>
                    <View style={styles.inputWrapper}>
                      <Ionicons name="mail-outline" size={20} color={Colors.text.secondary} style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Tu correo electrónico"
                        placeholderTextColor={Colors.text.placeholder}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={magicEmail}
                        onChangeText={setMagicEmail}
                      />
                    </View>
                    
                    <TouchableOpacity 
                      style={styles.magicEmailButton}
                      onPress={handleMagicLinkSignUp}
                      activeOpacity={0.8}
                      disabled={isLoading || isMagicLinkSending}
                    >
                      <LinearGradient
                        colors={[Colors.gradients.primary.start, Colors.gradients.primary.end]}
                        style={styles.magicEmailButtonGradient}
                      >
                        {isMagicLinkSending ? (
                          <ActivityIndicator color="#fff" size="small" />
                        ) : (
                          <>
                            <Text style={styles.magicEmailButtonText}>Enviarme un enlace mágico</Text>
                            <Ionicons name="sparkles-outline" size={18} color="#fff" style={styles.magicEmailButtonIcon} />
                          </>
                        )}
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </Animated.View>
                
                {/* Formulario de correo mágico */}
                {showEmailForm && (
                  <View style={styles.magicEmailFormContainer}>
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Tu correo electrónico</Text>
                      <View style={styles.inputWrapper}>
                        <Ionicons
                          name="mail-outline"
                          size={20}
                          color={Colors.text.secondary}
                          style={styles.inputIcon}
                        />
                        <TextInput
                          style={styles.textInput}
                          placeholder="Para enviarte el enlace mágico ✨"
                          placeholderTextColor={Colors.text.muted}
                          value={magicEmail}
                          onChangeText={setMagicEmail}
                          keyboardType="email-address"
                          autoCapitalize="none"
                        />
                      </View>
                    </View>
                    
                    <Animated.View style={{
                      transform: [{ scale: buttonAnimation }],
                      marginBottom: 20,
                    }}>
                      <TouchableOpacity
                        style={[styles.magicEmailSendButton, isMagicLinkSending && styles.disabledButton]}
                        onPress={() => {
                          animateButton();
                          handleMagicLinkSignUp();
                        }}
                        disabled={isMagicLinkSending}
                        activeOpacity={0.8}
                      >
                        <LinearGradient
                          colors={[Colors.gradients.primary.start, Colors.gradients.primary.end]}
                          style={styles.buttonGradient}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                        >
                          {isMagicLinkSending ? (
                            <Text style={styles.registerButtonText}>Enviando enlace...</Text>
                          ) : (
                            <Text style={styles.registerButtonText}>Enviar enlace mágico</Text>
                          )}
                        </LinearGradient>
                      </TouchableOpacity>
                    </Animated.View>
                  </View>
                )}
              </View>
              
              {/* Divisor */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>o</Text>
                <View style={styles.dividerLine} />
              </View>
              
              {/* Opción de registro tradicional */}
              <TouchableOpacity 
                style={styles.emailButton}
                onPress={() => setShowEmailForm(!showEmailForm)}
                activeOpacity={0.8}
                disabled={isLoading}
              >
                <Text style={styles.emailButtonText}>Prefiero crear una cuenta con correo y contraseña</Text>
                <Ionicons 
                  name={showEmailForm ? "chevron-up-outline" : "chevron-down-outline"} 
                  size={18} 
                  color={Colors.text.secondary} 
                />
              </TouchableOpacity>
              
              {/* Formulario tradicional (condicional) */}
              {showEmailForm && (
                <View style={styles.traditionalFormContainer}>
                  {/* Campo Nombre */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Nombre</Text>
                    <View style={styles.inputWrapper}>
                      <Ionicons
                        name="person-outline"
                        size={20}
                        color={Colors.text.secondary}
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={styles.textInput}
                        placeholder="¿Cómo quieres que te llamemos en tu camino? 🌿"
                        placeholderTextColor={Colors.text.muted}
                        value={formData.name}
                        onChangeText={(value) => handleInputChange('name', value)}
                        autoCapitalize="words"
                      />
                    </View>
                  </View>

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
                        placeholder="Para acompañarte en tu camino espiritual 📩"
                        placeholderTextColor={Colors.text.muted}
                        value={formData.email}
                        onChangeText={(value) => handleInputChange('email', value)}
                        keyboardType="email-address"
                        autoCapitalize="none"
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
                        placeholder="Una clave que proteja tu espacio espiritual ✨"
                        placeholderTextColor={Colors.text.muted}
                        value={formData.password}
                        onChangeText={(value) => handleInputChange('password', value)}
                        secureTextEntry={!showPassword}
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
                <Text style={styles.inputLabel}>Confirmar contraseña</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={Colors.text.secondary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Confirma tu contraseña"
                    placeholderTextColor={Colors.text.muted}
                    value={formData.confirmPassword}
                    onChangeText={(value) => handleInputChange('confirmPassword', value)}
                    secureTextEntry={!showConfirmPassword}
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

                  {/* Botón de registro con animación */}
                  <Animated.View style={{
                    transform: [{ scale: buttonAnimation }],
                    marginTop: 10,
                    marginBottom: 20,
                  }}>
                    <TouchableOpacity
                      style={[styles.registerButton, isLoading && styles.disabledButton]}
                      onPress={() => {
                        animateButton();
                        handleRegister();
                      }}
                      disabled={isLoading}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={Colors.gradients.success}
                        style={styles.buttonGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                      >
                        {isLoading ? (
                          <Text style={styles.registerButtonText}>Creando espacio...</Text>
                        ) : (
                          <Text style={styles.registerButtonText}>Crear mi espacio</Text>
                        )}
                      </LinearGradient>
                    </TouchableOpacity>
                  </Animated.View>
                </View>
              )}

              {/* Link a login */}
              <View style={styles.loginLink}>
                <Text style={styles.loginLinkText}>¿Ya tienes una cuenta? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.loginLinkButton}>Inicia sesión</Text>
                </TouchableOpacity>
              </View>
              
              {/* Mensaje emocional final */}
              <View style={styles.emotionalMessage}>
                <Text style={styles.emotionalMessageText}>
                  Este es solo el inicio. Cada día será una nueva oportunidad de crecer con Él 🙏✨
                </Text>
              </View>
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
  magicLinkContainer: {
    width: '100%',
    marginBottom: 15,
  },
  magicEmailButton: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  magicEmailButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  magicEmailButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginRight: 8,
  },
  magicEmailButtonIcon: {
    marginLeft: 4,
  },
  magicEmailFormContainer: {
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 15,
  },
  magicEmailSendButton: {
    borderRadius: 12,
    marginTop: 10,
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
});

export default RegisterScreen;