import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    FlatList,
    Platform,
    Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    withRepeat,
    withSequence,
    withDelay,
    Easing,
    interpolate,
    useAnimatedScrollHandler,
} from 'react-native-reanimated';

import Colors from '../constants/Colors';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const { width, height } = Dimensions.get('window');

// Images from assets/onboarding
const ONBOARDING_IMAGES = {
    ob1: require('../../assets/onboarding/ob1.png'),
    ob2: require('../../assets/onboarding/ob2.png'),
    ob3: require('../../assets/onboarding/ob3.png'),
    ob4: require('../../assets/onboarding/ob4.png'),
    ob5: require('../../assets/onboarding/ob5.png'),
};

const onboardingData = [
    {
        id: 'welcome',
        title: 'Tiempo con Dios',
        subtitle: 'Tu compañero para momentos diarios de oración, reflexión y paz interior',
        icon: 'flower',
        image: ONBOARDING_IMAGES.ob1,
    },
    {
        id: 'time',
        type: 'selection', // Special type for interactive selection
        title: 'Momentos Personalizados',
        subtitle: '¿Cuánto tiempo te gustaría dedicar a tu conexión espiritual hoy?',
        icon: 'time',
        image: ONBOARDING_IMAGES.ob2,
    },
    {
        id: 'garden',
        title: 'Jardín Espiritual',
        subtitle: 'Cultiva tu fe. Tu constancia hará florecer hermosas plantas espirituales',
        icon: 'leaf',
        image: ONBOARDING_IMAGES.ob3,
    },
    {
        id: 'verse',
        title: 'Inspiración Diaria',
        subtitle: 'Nuevos versículos bíblicos cada día para guiar tu caminata',
        icon: 'book',
        image: ONBOARDING_IMAGES.ob4,
    },
    {
        id: 'music',
        title: 'Atmósfera de Paz',
        subtitle: 'Música instrumental suave para acompañar tus momentos de oración',
        icon: 'musical-notes',
        image: ONBOARDING_IMAGES.ob5,
    },
];

const TimeOption = ({ minutes, isSelected, onSelect }) => (
    <TouchableOpacity
        onPress={() => onSelect(minutes)}
        activeOpacity={0.7}
        style={[
            styles.timeOption,
            isSelected && styles.timeOptionSelected
        ]}
    >
        <LinearGradient
            colors={isSelected ? Colors.gradients.spiritual : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
            style={styles.timeOptionGradient}
        >
            <Text style={[styles.timeOptionText, isSelected && styles.timeOptionTextSelected]}>
                {minutes}
            </Text>
            <Text style={[styles.timeOptionLabel, isSelected && styles.timeOptionLabelSelected]}>
                min
            </Text>
        </LinearGradient>
    </TouchableOpacity>
);

const OnboardingItem = ({ item, index, scrollX, selectedTime, onSelectTime }) => {
    const animatedStyle = useAnimatedStyle(() => {
        const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
        ];

        // Smooth opacity transition
        const opacity = interpolate(
            scrollX.value,
            inputRange,
            [0, 1, 0],
            'clamp'
        );

        // Subtle scale effect
        const scale = interpolate(
            scrollX.value,
            inputRange,
            [0.9, 1, 0.9],
            'clamp'
        );

        return {
            opacity,
            transform: [{ scale }]
        };
    });

    return (
        <View style={styles.itemContainer}>
            <Animated.View style={[styles.imageContainer, animatedStyle]}>
                {/* Divine Light Background - optional, can keep or remove if interfering with circle */}
                <View style={styles.divineLight} />

                {/* Circle Container for Image */}
                <View style={styles.circleContainer}>
                    <View style={styles.circleInner}>
                        {item.image ? (
                            <Image
                                source={item.image}
                                style={styles.image}
                                resizeMode="contain"
                            />
                        ) : (
                            <LinearGradient
                                colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
                                style={styles.iconCircle}
                            >
                                <Ionicons name={item.icon} size={80} color="#FFFFFF" />
                            </LinearGradient>
                        )}
                    </View>
                    {/* Glow Effect behind circle */}
                    <View style={styles.glowEffect} />
                </View>
            </Animated.View>

            <View style={styles.contentContainer}>
                <View style={styles.glassCard}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.subtitle}>{item.subtitle}</Text>

                    {/* Interactive Time Selection */}
                    {item.type === 'selection' && (
                        <View style={styles.timeSelectionContainer}>
                            {[5, 10, 15, 30].map((min) => (
                                <TimeOption
                                    key={min}
                                    minutes={min}
                                    isSelected={selectedTime === min}
                                    onSelect={onSelectTime}
                                />
                            ))}
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
};

const Paginator = ({ data, scrollX }) => {
    return (
        <View style={styles.paginatorContainer}>
            {data.map((_, i) => {
                const animatedStyle = useAnimatedStyle(() => {
                    const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
                    const widthDot = interpolate(
                        scrollX.value,
                        inputRange,
                        [8, 24, 8],
                        'clamp'
                    );
                    const opacity = interpolate(
                        scrollX.value,
                        inputRange,
                        [0.3, 1, 0.3],
                        'clamp'
                    );
                    return {
                        width: widthDot,
                        opacity,
                    };
                });

                return (
                    <Animated.View
                        key={i.toString()}
                        style={[styles.dot, animatedStyle]}
                    />
                );
            })}
        </View>
    );
};

const OnboardingScreen = ({ navigation }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedTime, setSelectedTime] = useState(null); // State for time selection
    const scrollX = useSharedValue(0);
    const flatListRef = useRef(null);

    // Ambient animations
    const particle1Y = useSharedValue(0);
    const particle2Y = useSharedValue(0);

    React.useEffect(() => {
        // Start animations
        particle1Y.value = withRepeat(
            withSequence(
                withTiming(-20, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
                withTiming(0, { duration: 4000, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );

        particle2Y.value = withDelay(1000, withRepeat(
            withSequence(
                withTiming(-30, { duration: 5000, easing: Easing.inOut(Easing.ease) }),
                withTiming(0, { duration: 5000, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        ));
    }, []);

    const particle1Style = useAnimatedStyle(() => ({
        transform: [{ translateY: particle1Y.value }],
    }));

    const particle2Style = useAnimatedStyle(() => ({
        transform: [{ translateY: particle2Y.value }],
    }));

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollX.value = event.contentOffset.x;
        },
    });

    const handleNext = () => {
        // Validation for time selection
        if (onboardingData[currentIndex].type === 'selection' && !selectedTime) {
            // Optional: show a toast or shake animation. For now just don't advance or auto-select default?
            // Let's auto-select 15 if not selected, or just require it.
            // For better UX, we'll allow proceeding but defaulting to 15 later if undefined.
            // Actually user asked to "conserve functionality", implying it might be required.
            // We will default to 15 if they click next without selecting.
            setSelectedTime(15);
        }

        if (currentIndex < onboardingData.length - 1) {
            flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
        } else {
            navigation.replace('Login');
        }
    };

    const handleSkip = () => {
        navigation.replace('Login');
    };

    const onViewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    return (
        <View style={styles.container}>
            {/* Background Gradient */}
            <LinearGradient
                colors={Colors.gradients.spiritual}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.background}
            />

            {/* Ambient Lights */}
            <View style={[styles.ambientLight, styles.ambientLightTop]} />
            <View style={[styles.ambientLight, styles.ambientLightBottom]} />

            {/* Particles - Moved lower behind description */}
            <Animated.View style={[styles.particle, { top: '60%', left: '10%', width: 4, height: 4 }, particle1Style]} />
            <Animated.View style={[styles.particle, { top: '70%', right: '15%', width: 6, height: 6, opacity: 0.4 }, particle2Style]} />
            <Animated.View style={[styles.particle, { top: '80%', left: '20%', width: 3, height: 3, opacity: 0.3 }, particle1Style]} />

            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    {/* Language Switcher Restored */}
                    <View style={styles.languageContainer}>
                        <LanguageSwitcher />
                    </View>

                    <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
                        <Text style={styles.skipText}>
                            {currentIndex === onboardingData.length - 1 ? '' : 'Omitir'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.carouselContainer}>
                    <Animated.FlatList
                        ref={flatListRef}
                        data={onboardingData}
                        renderItem={({ item, index }) => (
                            <OnboardingItem
                                item={item}
                                index={index}
                                scrollX={scrollX}
                                selectedTime={selectedTime}
                                onSelectTime={setSelectedTime}
                            />
                        )}
                        keyExtractor={(item) => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        pagingEnabled
                        bounces={false}
                        onScroll={scrollHandler}
                        onViewableItemsChanged={onViewableItemsChanged}
                        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
                        scrollEventThrottle={32}
                    />
                </View>

                <View style={styles.footer}>
                    <Paginator data={onboardingData} scrollX={scrollX} />

                    <TouchableOpacity
                        style={styles.nextButton}
                        onPress={handleNext}
                        activeOpacity={0.8}
                        accessibilityLabel={currentIndex === onboardingData.length - 1 ? 'Comenzar' : 'Siguiente'}
                    >
                        <LinearGradient
                            colors={currentIndex === onboardingData.length - 1 ? ['#FFFFFF', '#E6E6FA'] : ['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.1)']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.nextButtonGradient}
                        >
                            <Text style={[
                                styles.nextButtonText,
                                currentIndex === onboardingData.length - 1 && styles.nextButtonTextActive
                            ]}>
                                {currentIndex === onboardingData.length - 1 ? 'Comenzar' : 'Siguiente'}
                            </Text>
                            <Ionicons
                                name={currentIndex === onboardingData.length - 1 ? "rocket-outline" : "arrow-forward"}
                                size={20}
                                color={currentIndex === onboardingData.length - 1 ? Colors.primary : "#FFFFFF"}
                            />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.primary,
    },
    background: {
        ...StyleSheet.absoluteFillObject,
    },
    safeArea: {
        flex: 1,
    },
    ambientLight: {
        position: 'absolute',
        width: width * 1.5,
        height: width * 1.5,
        borderRadius: width,
        opacity: 0.15,
    },
    ambientLightTop: {
        top: -width * 0.8,
        left: -width * 0.2,
        backgroundColor: '#8A2BE2',
        transform: [{ scale: 1.2 }],
    },
    ambientLightBottom: {
        bottom: -width * 0.8,
        right: -width * 0.2,
        backgroundColor: '#4B0082',
    },
    particle: {
        position: 'absolute',
        backgroundColor: '#FFF',
        borderRadius: 50,
        opacity: 0.5,
    },
    header: {
        position: 'absolute',
        top: Platform.OS === 'android' ? 40 : 10, // Adjust for status bar
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        height: 60,
        zIndex: 100, // Ensure controls are on top
    },
    languageContainer: {
        // Container for Language Switcher
    },
    skipButton: {
        padding: 10,
        paddingHorizontal: 15,
        backgroundColor: 'rgba(0,0,0,0.1)', // Slight pill background for readability
        borderRadius: 20,
    },
    skipText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    carouselContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: height * 0.08, // Reduced from 0.12 to give more space
    },
    itemContainer: {
        width: width,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingHorizontal: 15, // Reduced from 20
    },
    imageContainer: {
        width: width,
        height: width * 0.9,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20, // Increased spacing between image and card
    },
    circleContainer: {
        width: width * 0.75, // Increased size for visibility (was 0.65)
        height: width * 0.75,
        borderRadius: (width * 0.75) / 2,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 10,
            },
            android: {
                elevation: 5,
            }
        })
    },
    circleInner: {
        width: '92%', // Slightly larger inner
        height: '92%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: (width * 0.75 * 0.92) / 2,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        overflow: 'hidden', // Contain image
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    glowEffect: {
        position: 'absolute',
        width: width * 0.85, // Adjusted to match new circle size
        height: width * 0.85,
        borderRadius: (width * 0.85) / 2,
        backgroundColor: 'rgba(138, 43, 226, 0.3)',
        zIndex: 1,
        transform: [{ scale: 1.0 }],
        opacity: 0.6,
    },
    contentContainer: {
        width: '100%',
        paddingHorizontal: 0, // Removed extra padding
    },
    glassCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)', // Slightly more opaque for readability
        borderRadius: 30,
        padding: 24, // Reduced from 30
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        width: '100%',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.1,
                shadowRadius: 20,
            }
        })
    },
    title: {
        fontSize: 28, // Slightly larger
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 12,
        letterSpacing: 0.5,
        fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)', // More contrast
        textAlign: 'center',
        lineHeight: 26,
        paddingHorizontal: 10, // Add horizontal padding to text specifically
    },

    // Time Selection Styles
    timeSelectionContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
        gap: 10,
        flexWrap: 'wrap',
    },
    timeOption: {
        width: 60,
        height: 60,
        borderRadius: 30,
        overflow: 'hidden',
    },
    timeOptionGradient: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    timeOptionSelected: {
        transform: [{ scale: 1.1 }],
        shadowColor: '#FFF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 5,
    },
    timeOptionText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    timeOptionTextSelected: {
        fontSize: 20,
    },
    timeOptionLabel: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 10,
    },
    timeOptionLabelSelected: {
        color: 'rgba(255,255,255,0.9)',
    },

    footer: {
        paddingHorizontal: 30,
        paddingBottom: Platform.OS === 'ios' ? 20 : 30,
        alignItems: 'center',
        width: '100%',
    },
    paginatorContainer: {
        flexDirection: 'row',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    dot: {
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FFFFFF',
        marginHorizontal: 4,
    },
    nextButton: {
        width: '100%',
        borderRadius: 16,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
            }
        })
    },
    nextButtonGradient: {
        paddingVertical: 18,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    nextButtonText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
        marginRight: 8,
        letterSpacing: 0.5,
    },
    nextButtonTextActive: {
        color: Colors.primary,
    },
});

export default OnboardingScreen;
