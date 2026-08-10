import type { ReactNode } from 'react';

export interface DataTableColumn<T = any> {
  id: string;
  headerName: string;
  field?: keyof T | string;
  width?: number;
  minWidth?: number;
  flex?: number;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  filter?: boolean | string;
  renderCell?: (row: T, index: number) => ReactNode;
}

export interface DataTableProps<T = any> {
  /** Column definitions */
  columns: DataTableColumn<T>[];
  /** Array of row data */
  data: T[];
  /** Primary key field to uniquely identify rows */
  getRowId?: (row: T) => string | number;
  /** Title of table */
  title?: ReactNode;
  /** Subtitle / description */
  subtitle?: ReactNode;
  /** Header icon */
  headerIcon?: ReactNode;
  /** Enable quick filter search input (Default: true) */
  searchable?: boolean;
  /** Search box placeholder */
  searchPlaceholder?: string;
  /** Enable AG Grid Pagination (Default: true) */
  pagination?: boolean;
  /** Default rows per page (Default: 10) */
  paginationPageSize?: number;
  /** Page size options (Default: [5, 10, 25, 50]) */
  paginationPageSizeSelector?: number[];
  /** Loading overlay flag */
  loading?: boolean;
  /** Empty overlay text */
  emptyMessage?: string;
  /** Custom toolbar action buttons */
  toolbarActions?: ReactNode;
  /** Grid container height (e.g. 400 or '100%') */
  height?: number | string;
  /** Layout mode: 'autoHeight' removes empty space at bottom when rows are few (Default: 'autoHeight') */
  domLayout?: 'normal' | 'autoHeight' | 'print';
}
