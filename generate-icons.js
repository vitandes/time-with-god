const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Tamaños para Android
const androidSizes = [
  { size: 36, density: 'ldpi' },
  { size: 48, density: 'mdpi' },
  { size: 72, density: 'hdpi' },
  { size: 96, density: 'xhdpi' },
  { size: 144, density: 'xxhdpi' },
  { size: 192, density: 'xxxhdpi' }
];

// Tamaños para iOS
const iosSizes = [
  { size: 20, name: 'icon-20.png' },
  { size: 29, name: 'icon-29.png' },
  { size: 40, name: 'icon-40.png' },
  { size: 58, name: 'icon-58.png' },
  { size: 60, name: 'icon-60.png' },
  { size: 80, name: 'icon-80.png' },
  { size: 87, name: 'icon-87.png' },
  { size: 120, name: 'icon-120.png' },
  { size: 180, name: 'icon-180.png' },
  { size: 1024, name: 'icon-1024.png' }
];

async function generateIcons() {
  const logoPath = path.join(__dirname, 'assets', 'twg-logo.png');
  
  // Crear directorios si no existen
  const androidDir = path.join(__dirname, 'assets', 'android');
  const iosDir = path.join(__dirname, 'assets', 'ios');
  
  if (!fs.existsSync(androidDir)) {
    fs.mkdirSync(androidDir, { recursive: true });
  }
  
  if (!fs.existsSync(iosDir)) {
    fs.mkdirSync(iosDir, { recursive: true });
  }

  console.log('Generando iconos para Android...');
  
  // Generar iconos para Android
  for (const { size, density } of androidSizes) {
    const outputPath = path.join(androidDir, `icon-${size}.png`);
    await sharp(logoPath)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    console.log(`✓ Generado: ${density} (${size}x${size})`);
  }

  console.log('\nGenerando iconos para iOS...');
  
  // Generar iconos para iOS
  for (const { size, name } of iosSizes) {
    const outputPath = path.join(iosDir, name);
    await sharp(logoPath)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    console.log(`✓ Generado: ${name} (${size}x${size})`);
  }

  // Generar icono principal
  const mainIconPath = path.join(__dirname, 'assets', 'icon.png');
  await sharp(logoPath)
    .resize(1024, 1024)
    .png()
    .toFile(mainIconPath);
  console.log(`\n✓ Generado icono principal: icon.png (1024x1024)`);

  console.log('\n🎉 ¡Todos los iconos han sido generados exitosamente!');
}

generateIcons().catch(console.error);