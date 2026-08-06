import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from '@mui/material';
import TranslateIcon from '@mui/icons-material/Translate';
import CheckIcon from '@mui/icons-material/Check';
import type { LanguageSwitcherProps } from './LanguageSwitcher.types';

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = () => {
  const { i18n, t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);
  const currentLang = i18n.language?.startsWith('en') ? 'en' : 'vi';

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    handleClose();
  };

  return (
    <>
      <Tooltip title={t('common.language') || 'Ngôn ngữ'}>
        <IconButton
          onClick={handleClick}
          color="inherit"
          aria-controls={open ? 'language-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          sx={{
            borderRadius: 2,
            px: 1,
            py: 0.5,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <TranslateIcon fontSize="small" sx={{ mr: 0.5 }} />
          <Typography variant="body2" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
            {currentLang}
          </Typography>
        </IconButton>
      </Tooltip>

      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{
          paper: {
            elevation: 3,
            sx: {
              borderRadius: 2,
              minWidth: 150,
              mt: 1,
            },
          },
        }}
      >
        <MenuItem
          onClick={() => handleSelectLanguage('vi')}
          selected={currentLang === 'vi'}
        >
          <ListItemIcon sx={{ fontSize: '1.2rem', mr: 1 }}>🇻🇳</ListItemIcon>
          <ListItemText primary="Tiếng Việt" />
          {currentLang === 'vi' && <CheckIcon fontSize="small" color="primary" />}
        </MenuItem>

        <MenuItem
          onClick={() => handleSelectLanguage('en')}
          selected={currentLang === 'en'}
        >
          <ListItemIcon sx={{ fontSize: '1.2rem', mr: 1 }}>🇬🇧</ListItemIcon>
          <ListItemText primary="English" />
          {currentLang === 'en' && <CheckIcon fontSize="small" color="primary" />}
        </MenuItem>
      </Menu>
    </>
  );
};

export default LanguageSwitcher;
