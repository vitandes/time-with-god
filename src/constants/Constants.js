// ARCHIVO DEPRECADO - Las constantes han sido migradas al sistema de internacionalización
// Para usar las constantes traducidas, importa desde:
// import { useConstants } from '../hooks/useConstants';
// 
// O para acceso directo:
// import { useTranslation } from 'react-i18next';
// const { t } = useTranslation('constants');
//
// Las constantes están organizadas en:
// - src/i18n/es/ (español)
// - src/i18n/en/ (inglés)
//
// Archivos por categoría:
// - plants.js: PLANTS, PLANT_STAGES
// - verses.js: BIBLE_VERSES  
// - messages.js: MESSAGES, INSPIRATIONAL_QUOTES, MORNING_MESSAGES
// - config.js: SESSION_DURATIONS, SUBSCRIPTION_PLANS, APP_CONFIG, SEED_MINUTES, SEED_PLANT

console.warn('Constants.js está deprecado. Usa el sistema de internacionalización en src/i18n/');

// Exportación temporal para compatibilidad (se eliminará en futuras versiones)
export const DEPRECATED_WARNING = 'Este archivo está deprecado. Usa useConstants() hook o useTranslation("constants")';

// Re-exportar desde español por compatibilidad temporal
import esConstants from '../i18n/es';
export default esConstants;