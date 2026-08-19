'use client';

import { useState, useMemo } from 'react';
import { Column } from '@/components/ui/ReusableTable';


export type SortConfig<T> = {
  key: keyof T | string;  
  direction: 'asc' | 'desc';
} | null;

type FilterValue = string | number | string[];

export function useTableFilters<T extends object>(
  data: T[],
  columns: Column<T>[]
) {
  const [sortConfig, setSortConfig] = useState<SortConfig<T>>(null);
  const [localFilters, setLocalFilters] = useState<Record<string, FilterValue>>({});

  const handleSort = (key: keyof T | string) => {
    setSortConfig(prev => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const handleFilterChange = (key: string, value: FilterValue) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const applyFilters = () => {
    console.log('Filters applied');
  };

  const resetFilters = () => {
    setLocalFilters({});
  };

  const activeFiltersCount = Object.keys(localFilters).filter(key => {
    const value = localFilters[key];
    if (Array.isArray(value)) return value.length > 0;
    return value !== '' && value !== null && value !== undefined;
  }).length;

  const getFilteredData = (data: T[], filters: Record<string, FilterValue>) => {
    return data.filter(item => {
      for (const [key, filterValue] of Object.entries(filters)) {
        if (!filterValue) continue;
        
        const column = columns.find(col => col.accessor === key);
        if (!column) continue;
        
        let itemValue: unknown;
        if (typeof column.accessor === 'function') {
          const result = column.accessor(item);
          if (typeof result === 'string' || typeof result === 'number') {
            itemValue = result;
          } else if (typeof result === 'object' && result !== null && 'props' in result) {
            const children = (result as { props?: { children?: unknown } }).props?.children;
            itemValue = typeof children === 'string' ? children : '';
          } else {
            itemValue = '';
          }
        } else {
          itemValue = item[column.accessor];
        }
        
        const filterType = column.filterType || 'text';
        
        if (filterType === 'select' && Array.isArray(filterValue)) {
          if (filterValue.length === 0) continue;
          if (!filterValue.includes(String(itemValue))) return false;
        } else {
          const itemStr = String(itemValue).toLowerCase();
          const filterStr = String(filterValue).toLowerCase();
          if (!itemStr.includes(filterStr)) return false;
        }
      }
      return true;
    });
  };

  const getSortedData = (data: T[], sortConfig: SortConfig<T>) => {
    if (!sortConfig || !sortConfig.key) return data;
    
    const column = columns.find(col => col.accessor === sortConfig.key);
    if (!column) return data;
    
    return [...data].sort((a, b) => {
      let aValue: string | number = '';
      let bValue: string | number = '';
      
      if (typeof column.accessor === 'function') {
        const aResult = column.accessor(a);
        const bResult = column.accessor(b);
        
        if (typeof aResult === 'string' || typeof aResult === 'number') {
          aValue = aResult;
        } else if (typeof aResult === 'object' && aResult !== null && 'props' in aResult) {
          const children = (aResult as { props?: { children?: unknown } }).props?.children;
          aValue = typeof children === 'string' ? children : '';
        } else {
          aValue = '';
        }
        
        if (typeof bResult === 'string' || typeof bResult === 'number') {
          bValue = bResult;
        } else if (typeof bResult === 'object' && bResult !== null && 'props' in bResult) {
          const children = (bResult as { props?: { children?: unknown } }).props?.children;
          bValue = typeof children === 'string' ? children : '';
        } else {
          bValue = '';
        }
      } else {
        const aRaw = a[column.accessor];
        const bRaw = b[column.accessor];
        aValue = typeof aRaw === 'string' || typeof aRaw === 'number' ? aRaw : '';
        bValue = typeof bRaw === 'string' || typeof bRaw === 'number' ? bRaw : '';
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();
      
      if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const filteredData = getFilteredData(data, localFilters);
  const sortedData = getSortedData(filteredData, sortConfig);

  return {
    sortedData,
    filteredData,
    sortConfig,
    localFilters,
    activeFiltersCount,
    handleFilterChange,
    applyFilters,
    resetFilters,
    handleSort,
  };
}