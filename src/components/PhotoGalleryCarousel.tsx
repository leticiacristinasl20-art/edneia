import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Camera,
  Maximize2,
  X,
  Plus,
  Sparkles,
  Images,
  Trash2,
  Upload,
  CheckCircle2,
  RefreshCw,
  FolderHeart
} from 'lucide-react';
import { INITIAL_PHOTOS, PhotoMemory } from '../data/tributes';
import { processImageFile, ProcessedPhoto } from '../utils/imageOptimizer';
import { getPhotosFromDB, savePhotosToDB, clearPhotosFromDB } from '../utils/idbStorage';

interface PhotoGalleryCarouselProps {
  onTriggerConfetti: () => void;
}

export const PhotoGalleryCarousel: React.FC<PhotoGalleryCarouselProps> = ({ onTriggerConfetti }) => {
  const [photos, setPhotos] = useState<PhotoMemory[]>(() => {
    try {
      const saved = localStorage.getItem('voneia_custom_photos');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_PHOTOS;
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activePhoto, setActivePhoto] = useState<PhotoMemory | null>(null);
  const [viewMode, setViewMode] = useState<'polaroid' | 'bento'>('polaroid');
  const [filterType, setFilterType] = useState<'todos' | 'enviadas' | 'originais'>('todos');
  
  // Multi-upload states
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [pendingPhotos, setPendingPhotos] = useState<ProcessedPhoto[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingProgress, setProcessingProgress] = useState<{ current: number; total: number }>({ current: 0, total: 0 });
  const [batchCategory, setBatchCategory] = useState<string>('Família Reunida');
  const [batchDescription, setBatchDescription] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);

  // Load reliably from IndexedDB on startup (handles large albums without quota limits)
  useEffect(() => {
    let isMounted = true;
    getPhotosFromDB().then((loaded) => {
      if (isMounted && loaded && loaded.length > 0) {
        setPhotos(loaded);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Dismiss toast message after 4 seconds
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const customPhotosCount = photos.filter((p) => !p.id.startsWith('photo-1') && !p.id.startsWith('photo-2') && !p.id.startsWith('photo-3') && !p.id.startsWith('photo-4')).length;

  const filteredPhotos = photos.filter((p) => {
    const isInitial = p.id === 'photo-1' || p.id === 'photo-2' || p.id === 'photo-3' || p.id === 'photo-4';
    if (filterType === 'enviadas') return !isInitial;
    if (filterType === 'originais') return isInitial;
    return true;
  });

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -380, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 380, behavior: 'smooth' });
    }
  };

  // Process multiple files selected or dropped
  const handleFilesSelected = async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((file) => file.type.startsWith('image/'));
    if (fileArray.length === 0) return;

    setIsProcessing(true);
    setProcessingProgress({ current: 0, total: fileArray.length });

    const processedList: ProcessedPhoto[] = [];

    for (let i = 0; i < fileArray.length; i++) {
      try {
        setProcessingProgress({ current: i + 1, total: fileArray.length });
        const processed = await processImageFile(fileArray[i], batchCategory);
        processedList.push(processed);
      } catch (err) {
        console.error('Error processing image:', err);
      }
    }

    setPendingPhotos((prev) => [...prev, ...processedList]);
    setIsProcessing(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFilesSelected(e.target.files);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setShowUploadModal(true);
      handleFilesSelected(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemovePendingPhoto = (id: string) => {
    setPendingPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const handleConfirmBatchUpload = async () => {
    if (pendingPhotos.length === 0) return;

    const newPhotoItems: PhotoMemory[] = pendingPhotos.map((p, idx) => ({
      id: p.id,
      url: p.url,
      title: p.title || `Momento Especial ${idx + 1}`,
      caption: batchDescription || p.caption || 'Lembrança inesquecível gravada no coração da família.',
      tag: batchCategory || 'Família Reunida',
      aspect: 'square'
    }));

    // Prepend new photos to gallery
    const updatedPhotos = [...newPhotoItems, ...photos];
    setPhotos(updatedPhotos);
    setPendingPhotos([]);
    setShowUploadModal(false);
    setBatchDescription('');

    // Persist in IndexedDB without memory limits
    await savePhotosToDB(updatedPhotos);
    setToastMessage(`✓ ${newPhotoItems.length} ${newPhotoItems.length === 1 ? 'foto salva' : 'fotos salvas'} com sucesso no biosite!`);
    onTriggerConfetti();
  };

  const handleDeletePhoto = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Deseja remover esta foto do biosite?')) {
      const updatedPhotos = photos.filter((p) => p.id !== id);
      setPhotos(updatedPhotos);
      if (activePhoto?.id === id) {
        setActivePhoto(null);
      }
      await savePhotosToDB(updatedPhotos);
      setToastMessage('Foto removida do biosite.');
    }
  };

  const handleResetToDefaultPhotos = async () => {
    if (confirm('Deseja restaurar as fotos originais do biosite?')) {
      setPhotos(INITIAL_PHOTOS);
      await clearPhotosFromDB();
      setToastMessage('Fotos originais restauradas!');
      onTriggerConfetti();
    }
  };

  // Lightbox Next/Prev navigation
  const handleNextPhoto = () => {
    if (!activePhoto) return;
    const currentIndex = filteredPhotos.findIndex((p) => p.id === activePhoto.id);
    if (currentIndex >= 0 && currentIndex < filteredPhotos.length - 1) {
      setActivePhoto(filteredPhotos[currentIndex + 1]);
    } else {
      setActivePhoto(filteredPhotos[0]);
    }
  };

  const handlePrevPhoto = () => {
    if (!activePhoto) return;
    const currentIndex = filteredPhotos.findIndex((p) => p.id === activePhoto.id);
    if (currentIndex > 0) {
      setActivePhoto(filteredPhotos[currentIndex - 1]);
    } else {
      setActivePhoto(filteredPhotos[filteredPhotos.length - 1]);
    }
  };

  return (
    <section
      id="galeria"
      className="py-16 md:py-24 bg-gradient-to-b from-[#FFF8F8] to-[#FFF1F2]/60 border-b border-rose-100 relative"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Visual drag-over glow indicator on entire section */}
      {isDragging && (
        <div className="absolute inset-0 bg-red-600/10 border-4 border-dashed border-red-500 rounded-3xl z-30 flex items-center justify-center backdrop-blur-xs pointer-events-none">
          <div className="bg-white/95 px-8 py-6 rounded-3xl shadow-2xl border border-rose-200 text-center animate-bounce">
            <Upload className="w-12 h-12 text-red-600 mx-auto mb-2" />
            <p className="font-display text-xl font-bold text-slate-900">
              Solte as fotos aqui para subir ao biosite!
            </p>
            <p className="text-sm text-rose-700">
              Você pode soltar múltiplas fotos de uma só vez
            </p>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Toast alert banner */}
        {toastMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 shadow-md flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{toastMessage}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="p-1 rounded-md text-emerald-600 hover:text-emerald-900 hover:bg-emerald-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-700 mb-2">
              <Camera className="w-4 h-4 text-red-600" />
              <span>Galeria de Memórias & Alta Resolução</span>
              <span aria-hidden="true" className="text-rose-300">·</span>
              <span className="text-rose-600">Álbum Especial ({photos.length} Fotos)</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Momentos de Amor Eternizados
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-xl">
              Role o carrossel ou envie várias fotos da família para espalhar momentos de carinho por todo o biosite.
            </p>
          </div>

          {/* Controls: Multi-Upload Button, View Mode & Reset */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Multi Upload Button */}
            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-red-700 hover:bg-red-800 text-white font-semibold text-xs sm:text-sm shadow-md shadow-red-700/20 active:scale-95 transition-all"
            >
              <Images className="w-4 h-4" />
              <span>Subir Múltiplas Fotos 📸</span>
            </button>

            {/* Reset button if custom photos exist */}
            {customPhotosCount > 0 && (
              <button
                onClick={handleResetToDefaultPhotos}
                className="p-2 rounded-full bg-white border border-rose-200 text-slate-600 hover:text-red-700 hover:bg-rose-50 transition-colors"
                title="Restaurar fotos originais"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}

            {/* View Mode Toggle */}
            <div className="flex items-center bg-white p-1 rounded-full border border-rose-200 shadow-xs">
              <button
                onClick={() => setViewMode('polaroid')}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                  viewMode === 'polaroid'
                    ? 'bg-rose-100 text-red-900 font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Polaroid
              </button>
              <button
                onClick={() => setViewMode('bento')}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                  viewMode === 'bento'
                    ? 'bg-rose-100 text-red-900 font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Mural Editorial
              </button>
            </div>

            {/* Carousel Navigation Arrows */}
            {viewMode === 'polaroid' && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={scrollLeft}
                  className="p-2.5 rounded-full bg-white border border-rose-200 text-slate-700 hover:bg-rose-50 shadow-sm transition-colors"
                  aria-label="Voltar foto"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={scrollRight}
                  className="p-2.5 rounded-full bg-white border border-rose-200 text-slate-700 hover:bg-rose-50 shadow-sm transition-colors"
                  aria-label="Avançar foto"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Filter Pills (All / Uploaded / Originals) */}
        {customPhotosCount > 0 && (
          <div className="flex items-center gap-2 mb-6 text-xs overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => setFilterType('todos')}
              className={`px-3.5 py-1.5 rounded-full font-medium transition-all ${
                filterType === 'todos'
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'bg-white border border-rose-200 text-slate-600 hover:bg-rose-50'
              }`}
            >
              Todas as Fotos ({photos.length})
            </button>
            <button
              onClick={() => setFilterType('enviadas')}
              className={`px-3.5 py-1.5 rounded-full font-medium transition-all ${
                filterType === 'enviadas'
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'bg-white border border-rose-200 text-slate-600 hover:bg-rose-50'
              }`}
            >
              Fotos Enviadas pela Família ({customPhotosCount})
            </button>
            <button
              onClick={() => setFilterType('originais')}
              className={`px-3.5 py-1.5 rounded-full font-medium transition-all ${
                filterType === 'originais'
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'bg-white border border-rose-200 text-slate-600 hover:bg-rose-50'
              }`}
            >
              Fotos Originais
            </button>
          </div>
        )}

        {/* Presentation 1: Horizontal Scrollable Polaroid Carousel */}
        {viewMode === 'polaroid' && (
          <div
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto pb-8 pt-4 px-2 snap-x snap-mandatory no-scrollbar scroll-smooth"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {filteredPhotos.map((photo, idx) => {
              const tilt = idx % 2 === 0 ? '-rotate-1' : 'rotate-1';
              const isCustom = !photo.id.startsWith('photo-1') && !photo.id.startsWith('photo-2') && !photo.id.startsWith('photo-3') && !photo.id.startsWith('photo-4');

              return (
                <div
                  key={photo.id}
                  onClick={() => setActivePhoto(photo)}
                  className={`w-[290px] sm:w-[340px] shrink-0 snap-start bg-white p-4 pb-6 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer group ${tilt} hover:rotate-0 hover:-translate-y-2 border border-rose-100/80 relative`}
                >
                  {/* Decorative Washi Tape */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-4 bg-rose-200/80 backdrop-blur-sm shadow-xs rounded-xs pointer-events-none transform -rotate-1" />

                  {/* Photo Frame */}
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-rose-50 mb-4">
                    <img
                      src={photo.url}
                      alt={photo.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Quick zoom icon */}
                    <div className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </div>

                    {/* Tag badge */}
                    <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-sm text-white text-[11px] font-medium">
                      {photo.tag}
                    </div>
                  </div>

                  {/* Polaroid Handwritten Style Title & Caption */}
                  <div className="px-1 text-center">
                    <h3 className="font-display text-lg font-bold text-slate-900 group-hover:text-red-700 transition-colors truncate">
                      {photo.title}
                    </h3>
                    <p className="font-serif italic text-xs sm:text-sm text-slate-600 mt-1 line-clamp-2">
                      "{photo.caption}"
                    </p>
                  </div>

                  {/* Delete option if user added */}
                  {isCustom && (
                    <button
                      onClick={(e) => handleDeletePhoto(photo.id, e)}
                      className="absolute bottom-2 right-2 p-1.5 text-slate-300 hover:text-red-600 rounded-md transition-colors"
                      title="Excluir esta foto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Presentation 2: Editorial Bento Grid */}
        {viewMode === 'bento' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {filteredPhotos.map((photo, idx) => {
              const colSpan = idx % 4 === 0 ? 'md:col-span-8' : idx % 4 === 1 ? 'md:col-span-4' : 'md:col-span-6';
              const heightClass = idx % 4 === 0 ? 'h-80 sm:h-96' : 'h-72 sm:h-80';
              const isCustom = !photo.id.startsWith('photo-1') && !photo.id.startsWith('photo-2') && !photo.id.startsWith('photo-3') && !photo.id.startsWith('photo-4');

              return (
                <div
                  key={photo.id}
                  onClick={() => setActivePhoto(photo)}
                  className={`${colSpan} ${heightClass} relative rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group bg-slate-100`}
                >
                  <img
                    src={photo.url}
                    alt={photo.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />

                  {/* Contrast Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-red-950/85 via-red-950/20 to-transparent pointer-events-none" />

                  {/* Overlay text */}
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-300">
                      {photo.tag}
                    </span>
                    <h3 className="font-display text-xl sm:text-2xl font-bold mt-0.5 truncate">
                      {photo.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-rose-100 line-clamp-2 mt-1">
                      {photo.caption}
                    </p>
                  </div>

                  {isCustom && (
                    <button
                      onClick={(e) => handleDeletePhoto(photo.id, e)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-black/40 text-white/70 hover:text-white hover:bg-black/80 transition-colors"
                      title="Excluir foto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Multi-Photo Quick Drop / Action Banner */}
        <div className="mt-8 p-5 sm:p-6 rounded-3xl bg-white border border-rose-200/90 shadow-sm flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 text-white shadow-md shadow-red-600/20">
              <FolderHeart className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">
                Tem várias fotos com a Dona Neia?
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Você pode selecionar dezenas de fotos de uma vez só ou arrastá-las direto para a página. Elas ficam salvas no biosite!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
            <button
              onClick={() => setShowUploadModal(true)}
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-red-700 hover:bg-red-800 text-white font-medium text-xs sm:text-sm shadow-md shadow-red-700/20 active:scale-95 transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>Selecionar Múltiplas Fotos</span>
            </button>
          </div>
        </div>

      </div>

      {/* Fullscreen Lightbox Modal with Next / Prev */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActivePhoto(null)}
        >
          {/* Previous Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevPhoto();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors"
            aria-label="Foto anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNextPhoto();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors"
            aria-label="Próxima foto"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div
            className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors"
              aria-label="Fechar visualização"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative max-h-[70vh] bg-stone-950 flex items-center justify-center">
              <img
                src={activePhoto.url}
                alt={activePhoto.title}
                referrerPolicy="no-referrer"
                className="max-h-[70vh] w-auto object-contain mx-auto"
              />
            </div>

            <div className="p-6 bg-white border-t border-rose-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-red-700">
                    {activePhoto.tag}
                  </span>
                  <h3 className="font-display text-2xl font-bold text-slate-900 mt-0.5">
                    {activePhoto.title}
                  </h3>
                  <p className="text-sm text-slate-700 mt-1 font-serif italic">
                    "{activePhoto.caption}"
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      onTriggerConfetti();
                    }}
                    className="px-5 py-2.5 rounded-full bg-red-700 text-white text-xs font-medium hover:bg-red-800 transition-colors"
                  >
                    Celebrar Momento 🎉
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Multi-Photo Upload Modal */}
      {showUploadModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in"
          onClick={() => setShowUploadModal(false)}
        >
          <div
            className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-rose-200 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-rose-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-red-100 text-red-700">
                  <Images className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900">
                    Subir Múltiplas Fotos para o Biosite
                  </h3>
                  <p className="text-xs text-slate-500">
                    Selecione várias fotos do celular ou computador de uma só vez.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Hidden Multi File Input */}
            <input
              type="file"
              multiple
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              className="hidden"
            />

            {/* Scrollable Content */}
            <div className="my-4 overflow-y-auto flex-1 pr-1 space-y-4">
              
              {/* Drop / Select Zone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-rose-300 hover:border-red-600 rounded-2xl p-6 text-center cursor-pointer transition-all bg-rose-50/40 hover:bg-rose-50/80 group"
              >
                <Upload className="w-10 h-10 text-rose-500 group-hover:scale-110 transition-transform mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-800">
                  Clique aqui para selecionar várias fotos ou arraste-as para cá
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Você pode segurar Ctrl ou Shift (ou selecionar vários arquivos no celular)
                </p>
                <span className="inline-block mt-3 px-4 py-1.5 rounded-full bg-white border border-rose-200 text-red-800 text-xs font-semibold shadow-xs">
                  Procurar Fotos nos Arquivos
                </span>
              </div>

              {/* Processing Spinner */}
              {isProcessing && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-3 animate-pulse">
                  <RefreshCw className="w-5 h-5 text-red-600 animate-spin" />
                  <div className="text-xs">
                    <p className="font-semibold text-slate-900">
                      Otimizando fotos ({processingProgress.current} de {processingProgress.total})...
                    </p>
                    <p className="text-slate-500">
                      Ajustando a resolução para carregamento ultra-rápido no biosite.
                    </p>
                  </div>
                </div>
              )}

              {/* Batch Settings */}
              {pendingPhotos.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-rose-50/60 border border-rose-100">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Categoria / Álbum das Fotos
                    </label>
                    <select
                      value={batchCategory}
                      onChange={(e) => setBatchCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-rose-200 text-xs bg-white focus:ring-2 focus:ring-red-500"
                    >
                      <option value="Família Reunida">Família Reunida</option>
                      <option value="Momentos com Filhos">Momentos com os Filhos</option>
                      <option value="Viagens Inesquecíveis">Viagens Inesquecíveis</option>
                      <option value="Com o Neto Kaique">Com o Neto Kaique</option>
                      <option value="Comemoração & Festa">Comemoração & Festa</option>
                      <option value="Amigos & Igreja">Amigos & Igreja</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Legenda Coletiva (Opcional)
                    </label>
                    <input
                      type="text"
                      value={batchDescription}
                      onChange={(e) => setBatchDescription(e.target.value)}
                      placeholder="Ex: Um dia especial de muita alegria e sorrisos..."
                      className="w-full px-3 py-2 rounded-xl border border-rose-200 text-xs bg-white focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
              )}

              {/* Pending Photos Preview Grid */}
              {pendingPhotos.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      {pendingPhotos.length} {pendingPhotos.length === 1 ? 'foto pronta' : 'fotos prontas'} para adicionar:
                    </span>
                    <button
                      onClick={() => setPendingPhotos([])}
                      className="text-xs text-rose-600 hover:underline"
                    >
                      Remover todas
                    </button>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-60 overflow-y-auto p-1">
                    {pendingPhotos.map((photo) => (
                      <div
                        key={photo.id}
                        className="relative aspect-square rounded-xl overflow-hidden border border-rose-200 group bg-rose-50"
                      >
                        <img
                          src={photo.url}
                          alt={photo.name}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemovePendingPhoto(photo.id)}
                          className="absolute top-1 right-1 p-1 rounded-full bg-black/60 hover:bg-red-600 text-white transition-colors"
                          title="Remover esta foto"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[10px] px-1 py-0.5 truncate text-center">
                          {photo.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer Actions */}
            <div className="pt-3 border-t border-rose-100 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                {pendingPhotos.length > 0
                  ? `${pendingPhotos.length} fotos prontas`
                  : 'Nenhuma foto selecionada'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-full text-xs font-medium text-slate-600 hover:bg-rose-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={pendingPhotos.length === 0 || isProcessing}
                  onClick={handleConfirmBatchUpload}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-700 hover:bg-red-800 disabled:opacity-50 text-white font-medium text-xs shadow-sm transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    Adicionar {pendingPhotos.length > 0 ? `${pendingPhotos.length} Fotos` : 'ao Biosite'}
                  </span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
