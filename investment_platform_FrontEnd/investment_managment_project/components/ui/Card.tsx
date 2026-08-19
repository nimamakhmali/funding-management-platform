// components/ui/smart-card.tsx
import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface CardProps<T> {
  data: T;
  mapping: {
    title: keyof T;
    value: keyof T;
    icon?: keyof T;
    unit?: keyof T;
    growth?: keyof T;
    label?: keyof T;
    color?: keyof T;
  };
  iconPosition?: 'header' | 'footer' | 'both' | 'none';
  renderTitle?: (title: string, icon?: any) => ReactNode;
  renderValue?: (value: unknown, unit?: string) => ReactNode;
  renderFooter?: (data: T, icon?: any) => ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function Card<T>({ 
  data, 
  mapping, 
  onClick,
  iconPosition = 'header',
  renderTitle,
  renderValue,
  renderFooter,
  className = ''
}: CardProps<T>) {
  
  const title = String(data[mapping.title]);
  const value = data[mapping.value];
  const unit = mapping.unit ? String(data[mapping.unit]) : undefined;
  const growth = mapping.growth ? data[mapping.growth] : undefined;
  const label = mapping.label ? String(data[mapping.label]) : undefined;
  const color = mapping.color ? data[mapping.color] : undefined;
  
  const IconComponent = mapping.icon ? data[mapping.icon] as any : null;

  const hasFooter = growth !== undefined || label !== undefined;
  const showIconInHeader = iconPosition === 'header' || iconPosition === 'both';
  const showIconInFooter = iconPosition === 'footer' || iconPosition === 'both';

  return (
    <div
      onClick={onClick}
      className={`bg-white p-6 rounded-xl border border-gray-100 shadow-md flex flex-col gap-2 transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]' : ''
      } ${className}`}
    >
      {renderTitle ? (
        renderTitle(title, IconComponent)
      ) : (
        <div className="flex items-center gap-2">
          {showIconInHeader && IconComponent && (
            <IconComponent className="w-5 h-5 text-gray-400" />
          )}
          <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">
            {title}
          </p>
        </div>
      )}

      {renderValue ? (
        renderValue(value, unit)
      ) : (
        <h3 className="text-2xl font-black text-gray-900">
          {String(value)}
          {unit && (
            <span className="text-xs font-medium text-gray-500 mr-1">
              {unit}
            </span>
          )}
        </h3>
      )}

      {renderFooter ? (
        renderFooter(data, IconComponent)
      ) : (
        hasFooter && (
          <div className="flex items-center gap-1.5 mt-2">
            {growth !== undefined && (
              <div className={`flex items-center px-1.5 py-0.5 rounded text-[12px] font-bold ${
                color === 'primary' 
                  ? 'text-primary bg-blue-50' 
                  : 'text-gray-500 bg-gray-100'
              }`}>
                {showIconInFooter && IconComponent && (
                  <IconComponent className="w-3 h-3 ml-0.5" />
                )}
                <span>{String(growth)}</span>
              </div>
            )}
            {label !== undefined && (
              <span className="text-gray-500 text-[12px]">{label}</span>
            )}
          </div>
        )
      )}
    </div>
  );
}