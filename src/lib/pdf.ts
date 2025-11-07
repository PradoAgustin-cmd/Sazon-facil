import jsPDF from 'jspdf';
import type { Recipe } from './types';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

// Sanitiza nombre de archivo removiendo caracteres inseguros
function safeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9-_ ]+/g, ' ').trim().replace(/ +/g, '_').substring(0, 50) || 'receta';
}

// Añade salto de página si se excede el límite vertical
function ensureSpace(doc: jsPDF, currentY: number, lineHeight: number) {
  const pageHeight = doc.internal.pageSize.getHeight();
  if (currentY + lineHeight > pageHeight - 20) {
    doc.addPage();
    return 20; // margen inicial en nueva página
  }
  return currentY;
}

export async function downloadRecipePDF(recipe: Recipe) {
  try {
    const doc = new jsPDF();
    const font = 'helvetica';
    const lineHeight = 6;
    const pageWidth = doc.internal.pageSize.getWidth();
    const contentWidth = pageWidth - 20; // márgenes de 10mm

    // Encabezado
    doc.setFontSize(18);
    doc.text(recipe.name, 10, 16);
    doc.setFontSize(11);
    const dateStr = new Date().toLocaleDateString();
    doc.text(`Fecha: ${dateStr}`, 10, 22);
    doc.text(`Autor: ${recipe.authorName || 'Anónimo'}`, 10, 28);
    doc.text(`Prep: ${recipe.prepTime || '-'}  |  Cocción: ${recipe.cookTime || '-'}  |  Porciones: ${recipe.servings || '-'}`, 10, 34);
    if (recipe.tags?.length) {
      const tagLines = doc.splitTextToSize(`Tags: ${recipe.tags.join(', ')}`, contentWidth);
      doc.text(tagLines, 10, 40);
    }

    // Imagen (opcional)
    let y = 48;
    const imageUrl = recipe.image || '';
    if (imageUrl) {
      try {
        const dataUrl = await getImageDataUrl(imageUrl);
        if (dataUrl) {
          const imgHeight = 60; // altura fija para mantener layout
          y = ensureSpace(doc, y, imgHeight);
          doc.addImage(dataUrl, 'JPEG', 10, y, contentWidth, imgHeight, undefined, 'FAST');
          y += imgHeight + 6;
        }
      } catch {
        // Si falla la imagen, continuar sin interrumpir
      }
    }

    // Ingredientes
    y = ensureSpace(doc, y, lineHeight);
    doc.setFont(font, 'bold');
    doc.text('Ingredientes', 10, y);
    doc.setFont(font, 'normal');
    y += lineHeight;
    recipe.ingredients.forEach((ing) => {
      y = ensureSpace(doc, y, lineHeight);
      const line = `• ${[ing.amount, ing.item].filter(Boolean).join(' ')}`.trim();
      const lines = doc.splitTextToSize(line, contentWidth);
      lines.forEach((ln) => {
        y = ensureSpace(doc, y, lineHeight);
        doc.text(ln, 12, y);
        y += lineHeight;
      });
    });

    // Instrucciones
    y += 2;
    y = ensureSpace(doc, y, lineHeight);
    doc.setFont(font, 'bold');
    doc.text('Instrucciones', 10, y);
    doc.setFont(font, 'normal');
    y += lineHeight;
    recipe.instructions.forEach((step, idx) => {
      const numbered = `${idx + 1}. ${step}`;
      const lines = doc.splitTextToSize(numbered, contentWidth);
      lines.forEach((ln) => {
        y = ensureSpace(doc, y, lineHeight);
        doc.text(ln, 12, y);
        y += lineHeight;
      });
      y += 2; // espacio entre pasos
    });

    const fileName = safeFileName(recipe.name) + '.pdf';

    // En Android/iOS, usar Capacitor Filesystem + Share
    if (Capacitor.isNativePlatform()) {
      const pdfOutput = doc.output('datauristring');
      const base64Data = pdfOutput.split(',')[1];

      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Cache
      });

      await Share.share({
        title: recipe.name,
        text: 'Receta exportada',
        url: savedFile.uri,
        dialogTitle: 'Compartir receta'
      });
    } else {
      // En web, descarga normal
      doc.save(fileName);
    }
  } catch (err) {
    console.error('Error generando PDF', err);
    alert('Error al generar PDF: ' + (err instanceof Error ? err.message : 'desconocido'));
  }
}

// Carga imagen como dataURL (data:), soporta http/https; retorna null si falla
async function getImageDataUrl(src: string): Promise<string | null> {
  try {
    if (src.startsWith('data:')) return src;
    const res = await fetch(src);
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(typeof reader.result === 'string' ? reader.result : null);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch (e) {
    return null;
  }
}
