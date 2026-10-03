import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, Check, Monitor, Smartphone, Crop } from 'lucide-react';

export default function ImageCropModal({
  isOpen,
  onClose,
  imageUrl,
  onSaveCrop,
  initialTarget = 'pc', // 'pc' or 'mobile'
  pcAspectRatio = 16 / 6, // Wide desktop banner
  mobileAspectRatio = 4 / 3 // Mobile banner
}) {
  const [targetDevice, setTargetDevice] = useState(initialTarget);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const containerRef = useRef(null);

  const aspectRatio = targetDevice === 'pc' ? pcAspectRatio : mobileAspectRatio;

  // Reset transform when targetDevice or image changes
  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [targetDevice, imageUrl]);

  // Load Image
  useEffect(() => {
    if (!imageUrl) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;
    img.onload = () => {
      imgRef.current = img;
      drawCanvas();
    };
  }, [imageUrl, zoom, pan, targetDevice]);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    const width = 800;
    const height = Math.round(width / aspectRatio);

    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    // Calculate scale to fill canvas
    const imgRatio = img.width / img.height;
    const canvasRatio = width / height;

    let baseScale;
    if (imgRatio > canvasRatio) {
      baseScale = height / img.height;
    } else {
      baseScale = width / img.width;
    }

    const currentScale = baseScale * zoom;
    const renderWidth = img.width * currentScale;
    const renderHeight = img.height * currentScale;

    // Centering + pan
    const centerX = (width - renderWidth) / 2 + pan.x;
    const centerY = (height - renderHeight) / 2 + pan.y;

    ctx.drawImage(img, centerX, centerY, renderWidth, renderHeight);
  }, [aspectRatio, zoom, pan]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y
      });
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPan({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleConfirmCrop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
    onSaveCrop(croppedDataUrl, targetDevice);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 font-sans">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-5 shadow-2xl space-y-4 text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Crop className="w-5 h-5 text-[#e50914]" />
            <h3 className="font-extrabold text-base sm:text-lg">Visual Image Cropper</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Device Switcher [ PC ] & [ MOBILE ] */}
        <div className="flex items-center justify-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 max-w-sm mx-auto">
          <button
            type="button"
            onClick={() => setTargetDevice('pc')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
              targetDevice === 'pc'
                ? 'bg-[#008744] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-4 h-4" /> PC (Desktop Wide)
          </button>
          <button
            type="button"
            onClick={() => setTargetDevice('mobile')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
              targetDevice === 'mobile'
                ? 'bg-[#008744] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" /> Mobile
          </button>
        </div>

        <p className="text-center text-xs text-slate-400">
          Drag to pan the image. Use zoom controls to focus on the desired visible area for {targetDevice.toUpperCase()}.
        </p>

        {/* Crop Viewport Canvas Area */}
        <div 
          ref={containerRef}
          className="relative w-full max-h-[50vh] bg-black/60 rounded-2xl overflow-hidden border-2 border-dashed border-slate-700 flex items-center justify-center cursor-grab active:cursor-grabbing select-none p-2"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <canvas 
            ref={canvasRef} 
            className="max-h-full max-w-full rounded-xl shadow-lg border border-slate-800 object-contain"
          />
        </div>

        {/* Controls Toolbar: Zoom & Reset */}
        <div className="flex items-center justify-between gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-bold">Zoom:</span>
            <button
              type="button"
              onClick={() => setZoom(prev => Math.max(0.5, prev - 0.1))}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="font-mono text-emerald-400 font-bold w-12 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoom(prev => Math.min(3, prev + 0.1))}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset View
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 font-bold text-xs hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmCrop}
            className="px-5 py-2.5 rounded-xl bg-[#008744] hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all"
          >
            <Check className="w-4 h-4" /> Save {targetDevice.toUpperCase()} Crop
          </button>
        </div>

      </div>
    </div>
  );
}
