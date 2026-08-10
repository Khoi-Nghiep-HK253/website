import React, { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import TableRowsIcon from '@mui/icons-material/TableRows';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';

import { AgGridReact } from 'ag-grid-react';
import {
  ModuleRegistry,
  AllCommunityModule,
  type CellStyle,
  type ColDef,
  type GridApi,
  type GridReadyEvent,
} from 'ag-grid-community';

import type { DataTableProps } from './DataTable.types';
import { useAgGridTheme } from '@/hooks/common/useAgGridTheme';

// Register AG Grid Community Modules once
ModuleRegistry.registerModules([AllCommunityModule]);


export function DataTable<T>({
  columns,
  data = [],
  getRowId,
  title,
  subtitle,
  headerIcon,
  searchable = true,
  searchPlaceholder,
  pagination = true,
  paginationPageSize = 10,
  paginationPageSizeSelector = [5, 10, 25, 50],
  loading = false,
  emptyMessage,
  toolbarActions,
  height,
  domLayout = height ? 'normal' : 'autoHeight',
}: DataTableProps<T>): React.ReactElement {
  const { t } = useTranslation();
  const resolvedSearchPlaceholder = searchPlaceholder ?? t('dataTable.searchPlaceholder');
  const resolvedEmptyMessage = emptyMessage ?? t('dataTable.noData');
  const gridRef = useRef<AgGridReact<T>>(null);
  const [gridApi, setGridApi] = useState<GridApi<T> | null>(null);
  const [quickFilterText, setQuickFilterText] = useState('');

  // Reactive MUI-synced theme
  const agTheme = useAgGridTheme();

  // Convert DataTableColumn -> AG Grid ColDef
  const columnDefs = useMemo<ColDef<T>[]>(() => {
    return columns.map((col) => {
      const colDef: ColDef<T> = {
        headerName: col.headerName,
        field: col.field as any,
        width: col.width,
        minWidth: col.minWidth,
        flex: col.flex ?? (col.width ? undefined : 1),
        sortable: col.sortable ?? true,
        filter: col.filter ?? true,
      };

      // Base cell style: always vertically centered
      // Cast to AG Grid's CellStyle (which requires an index signature)
      const baseStyle: CellStyle = { display: 'flex', alignItems: 'center' };

      if (col.align === 'center') {
        colDef.cellStyle = { ...baseStyle, justifyContent: 'center' };
      } else if (col.align === 'right') {
        colDef.cellStyle = { ...baseStyle, justifyContent: 'flex-end' };
      } else {
        colDef.cellStyle = baseStyle;
      }

      if (col.renderCell) {
        colDef.cellRenderer = (params: any) => {
          if (!params.data) return null;
          return col.renderCell!(params.data, params.node.rowIndex ?? 0);
        };
      }

      return colDef;
    });
  }, [columns]);

  const defaultColDef = useMemo<ColDef>(
    () => ({
      resizable: true,
      sortable: true,
      filter: true,
      // Ensure all cells are vertically centered by default
      cellStyle: { display: 'flex', alignItems: 'center' } as CellStyle,
    }),
    []
  );

  const onGridReady = useCallback((params: GridReadyEvent<T>) => {
    setGridApi(params.api);
    params.api.sizeColumnsToFit();
  }, []);

  useEffect(() => {
    if (gridApi) {
      gridApi.sizeColumnsToFit();
    }
  }, [data, gridApi]);

  const handleExportCsv = useCallback(() => {
    gridApi?.exportDataAsCsv({
      fileName: `export_${new Date().toISOString().split('T')[0]}.csv`,
    });
  }, [gridApi]);

  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
        bgcolor: 'background.paper',
        pb: 2, // extra padding at bottom
      }}
    >
      {/* ── Header & Toolbar ── */}
      <Box
        sx={{
          p: 2.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        {/* Title Section */}
        {(title || subtitle) && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {headerIcon && (
              <Box sx={{ display: 'flex', alignItems: 'center', fontSize: '1.5rem' }}>
                {headerIcon}
              </Box>
            )}
            <Box>
              {title && (
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem', lineHeight: 1.3 }}>
                  {title}
                </Typography>
              )}
              {subtitle && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25, fontSize: '0.85rem' }}>
                  {subtitle}
                </Typography>
              )}
            </Box>
          </Box>
        )}

        {/* Toolbar Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', ml: 'auto' }}>
          {searchable && (
            <TextField
              size="small"
              placeholder={resolvedSearchPlaceholder}
              value={quickFilterText}
              onChange={(e) => setQuickFilterText(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: quickFilterText ? (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setQuickFilterText('')}>
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                },
              }}
              sx={{ minWidth: 200 }}
            />
          )}

          <Tooltip title={t('dataTable.exportCsv')}>
            <Button
              size="small"
              variant="outlined"
              startIcon={<FileDownloadIcon fontSize="small" />}
              onClick={handleExportCsv}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
            >
              {t('dataTable.exportCsv')}
            </Button>
          </Tooltip>

          <Chip
            icon={<TableRowsIcon fontSize="small" />}
            label={t('dataTable.rowCount', { count: data.length })}
            size="small"
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />

          {toolbarActions}
        </Box>
      </Box>

      {/* ── AG Grid Canvas ── */}
      <Box
        sx={{
          width: '100%',
          height: domLayout === 'autoHeight' ? undefined : (height ?? 400),
        }}
      >
        <AgGridReact<T>
          ref={gridRef}
          theme={agTheme}
          rowData={data}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
          quickFilterText={quickFilterText}
          pagination={pagination}
          paginationPageSize={paginationPageSize}
          paginationPageSizeSelector={paginationPageSizeSelector}
          loading={loading}
          domLayout={domLayout}
          overlayNoRowsTemplate={`<span>${resolvedEmptyMessage}</span>`}
          getRowId={getRowId ? (params) => String(getRowId(params.data)) : undefined}
          animateRows
        />
      </Box>
    </Paper>
  );
}
