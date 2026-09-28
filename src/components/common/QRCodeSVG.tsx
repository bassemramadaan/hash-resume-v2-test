import React, { useMemo } from 'react';
import QRCode from 'qrcode';

export interface QRCodeSVGProps {
  value: string;
  size?: number;
  level?: 'L' | 'M' | 'Q' | 'H';
  bgColor?: string;
  fgColor?: string;
  includeMargin?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const QRCodeSVG: React.FC<QRCodeSVGProps> = ({
  value,
  size = 128,
  level = 'M',
  bgColor = '#ffffff',
  fgColor = '#000000',
  includeMargin = false,
  className = '',
  style,
}) => {
  const { pathData, viewBoxSize } = useMemo(() => {
    try {
      const qr = QRCode.create(value || ' ', {
        errorCorrectionLevel: level,
      });
      const margin = includeMargin ? 2 : 1;
      const moduleCount = qr.modules.size;
      const totalSize = moduleCount + margin * 2;

      let d = '';
      for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount; col++) {
          if (qr.modules.get(row, col)) {
            d += `M${col + margin} ${row + margin}h1v1h-1z `;
          }
        }
      }

      return { pathData: d, viewBoxSize: totalSize };
    } catch {
      return { pathData: '', viewBoxSize: 33 };
    }
  }, [value, level, includeMargin]);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      width={size}
      height={size}
      className={className}
      style={{ shapeRendering: 'crispEdges', ...style }}
    >
      <rect width="100%" height="100%" fill={bgColor} />
      {pathData && <path d={pathData} fill={fgColor} />}
    </svg>
  );
};

export default QRCodeSVG;
