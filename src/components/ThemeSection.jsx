import React from 'react';

export default function ThemeSection({ theme, onNavigate }) {
  if (!theme || theme.is_active === false) return null;

  const styles = theme.styles || {};
  const layoutData = Array.isArray(theme.layout_data) ? theme.layout_data : [];

  const containerStyle = {
    backgroundColor: styles.bgColor || '#0f172a',
    borderColor: styles.borderColor || 'transparent',
    borderWidth: styles.borderWidth || '0px',
    borderStyle: styles.borderWidth ? 'solid' : 'none',
    borderRadius: styles.borderRadius || '16px',
    padding: styles.padding || '24px'
  };

  const handleButtonClick = (linkUrl) => {
    if (!linkUrl) return;
    if (linkUrl.startsWith('http://') || linkUrl.startsWith('https://')) {
      window.open(linkUrl, '_blank');
    } else if (onNavigate) {
      onNavigate(linkUrl);
    }
  };

  return (
    <section className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div style={containerStyle} className="shadow-xl font-sans transition-all">
        <div className="bg-white rounded-xl p-4 sm:p-6 space-y-4 border border-slate-200">
          
        {theme.name && (
          <div className="sr-only">
            <h2>{theme.name}</h2>
          </div>
        )}

        {layoutData.map((block, idx) => {
          const key = block.id || `blk_${idx}`;
          const alignment = block.alignment || 'left';
          const alignClass = alignment === 'center' ? 'text-center items-center justify-center' : alignment === 'right' ? 'text-right items-end justify-end' : 'text-left items-start justify-start';

          switch (block.type) {
            case 'heading':
              return (
                <h3
                  key={key}
                  style={{
                    color: block.textColor || '#0f172a',
                    fontSize: block.fontSize || '20px',
                    fontWeight: block.fontWeight || '700',
                    lineHeight: block.lineHeight || '1.3'
                  }}
                  className={`${alignClass} tracking-tight`}
                >
                  {block.content}
                </h3>
              );

            case 'paragraph':
            case 'text':
              return (
                <p
                  key={key}
                  style={{
                    color: block.textColor || '#334155',
                    fontSize: block.fontSize || '14px',
                    lineHeight: block.lineHeight || '1.6'
                  }}
                  className={`${alignClass} font-medium max-w-3xl ${alignment === 'center' ? 'mx-auto' : ''}`}
                >
                  {block.content}
                </p>
              );

            case 'button':
              return (
                <div key={key} className={`flex ${alignClass} pt-2`}>
                  <button
                    onClick={() => handleButtonClick(block.linkUrl)}
                    style={{
                      backgroundColor: block.buttonColor || '#e50914',
                      color: block.textColor || '#ffffff',
                      borderRadius: block.borderRadius || '10px',
                      fontSize: block.fontSize || '13px',
                      border: block.border ? `2px solid ${block.borderColor || '#ffffff'}` : 'none'
                    }}
                    className="px-6 py-2.5 font-bold shadow-lg hover:opacity-95 transition-all cursor-pointer transform hover:scale-[1.02]"
                  >
                    {block.content || 'Click Here'}
                  </button>
                </div>
              );

            case 'image':
              return (
                <div key={key} className={`flex ${alignClass} py-2`}>
                  <img
                    src={block.imageUrl || block.content}
                    alt={block.alt || 'Theme Image'}
                    style={{
                      borderRadius: block.borderRadius || '12px',
                      border: block.border ? `2px solid ${block.borderColor || '#334155'}` : 'none',
                      maxHeight: block.maxHeight || '320px'
                    }}
                    className="w-full sm:w-auto object-cover shadow-md"
                  />
                </div>
              );

            case 'box':
              return (
                <div
                  key={key}
                  style={{
                    backgroundColor: block.bgColor || '#1e293b',
                    borderColor: block.borderColor || '#334155',
                    borderWidth: block.borderWidth || '1px',
                    borderStyle: block.borderWidth ? 'solid' : 'none',
                    borderRadius: block.borderRadius || '12px',
                    padding: block.padding || '16px'
                  }}
                  className="space-y-2 shadow-md my-2"
                >
                  {block.heading && (
                    <h4 className="font-bold text-white text-base" style={{ color: block.textColor }}>
                      {block.heading}
                    </h4>
                  )}
                  {block.description && (
                    <p className="text-xs text-slate-300" style={{ color: block.textColor }}>
                      {block.description}
                    </p>
                  )}
                  {block.buttonText && (
                    <button
                      onClick={() => handleButtonClick(block.linkUrl)}
                      className="px-4 py-2 bg-[#e50914] text-white font-bold text-xs rounded-lg mt-2 cursor-pointer"
                    >
                      {block.buttonText}
                    </button>
                  )}
                </div>
              );

            case 'tags':
              return (
                <div key={key} className={`flex flex-wrap gap-2 ${alignClass} py-1`}>
                  {Array.isArray(block.tagsList) ? block.tagsList.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      style={{
                        backgroundColor: tag.bgColor || '#3b82f6',
                        color: tag.textColor || '#ffffff'
                      }}
                      className="px-2.5 py-1 rounded-full text-xs font-bold shadow-sm"
                    >
                      {tag.text || tag}
                    </span>
                  )) : (
                    <span className="px-2.5 py-1 bg-emerald-950 text-emerald-300 rounded-full text-xs font-bold border border-emerald-800">
                      {block.content}
                    </span>
                  )}
                </div>
              );

            default:
              return (
                <div key={key} className="text-slate-800 text-xs">
                  {block.content}
                </div>
              );
          }
        })}

        </div>
      </div>
    </section>
  );
}
