'use client';

import Snackbar from '@mui/material/Snackbar';
import { IoCloseCircle, IoInformationCircle, IoWarning } from 'react-icons/io5';
import { RiCheckboxCircleFill } from 'react-icons/ri';

export type ToastSeverity = 'success' | 'error' | 'warning' | 'info';

interface CustomToastProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message?: string;
  severity?: ToastSeverity;
  duration?: number;
  anchorOrigin?: {
    vertical: 'bottom' | 'top';
    horizontal: 'center' | 'left' | 'right';
  };
}

const severityStyles: Record<
  ToastSeverity,
  { bg: string; icon: React.ReactNode }
> = {
  success: {
    bg: 'bg-green-500',
    icon: <RiCheckboxCircleFill className="w-4 h-4 text-white" />,
  },
  error: {
    bg: 'bg-red-500',
    icon: <IoCloseCircle className="w-4 h-4 text-white" />,
  },
  warning: {
    bg: 'bg-yellow-500',
    icon: <IoWarning className="w-4 h-4 text-white" />,
  },
  info: {
    bg: 'bg-blue-500',
    icon: <IoInformationCircle className="w-4 h-4 text-white" />,
  },
};

export const CustomToast = ({
  open,
  onClose,
  title,
  message,
  severity = 'info',
  duration = 4000,
  anchorOrigin = { vertical: 'top', horizontal: 'center' },
}: CustomToastProps) => {
  const { bg, icon } = severityStyles[severity];

  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
      sx={{
        '& .MuiSnackbarContent-root': {
          padding: 0,
          minWidth: 'auto',
          backgroundColor: 'transparent',
          boxShadow: 'none',
        },
      }}
    >
      <div
        className={`
          flex flex-col justify-center gap-0.5 px-3 py-3 rounded-xl shadow-lg
          w-[calc(100vw-32px)] sm:w-auto sm:min-w-[356px] max-w-[420px] min-h-[72px]
          ${bg}
        `}
      >
        <div className="flex items-center gap-2">
          <div className="flex-shrink-0">{icon}</div>
          <span className="text-white font-bold text-base leading-tight">
            {title}
          </span>
        </div>
        {message && (
          <span className="text-white text-sm leading-tight pl-6">
            {message}
          </span>
        )}
      </div>
    </Snackbar>
  );
};
