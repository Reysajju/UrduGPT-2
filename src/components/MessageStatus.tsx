import React from 'react';
import { Check, CheckCheck } from 'lucide-react';
import { MessageStatus as Status } from '../types';

interface MessageStatusProps {
  status: Status;
}

export function MessageStatus({ status }: MessageStatusProps) {
  switch (status) {
    case 'sending':
      return (
        <span className="text-gray-400">
          <Check className="w-4 h-4" />
        </span>
      );
    case 'sent':
      return (
        <span className="text-gray-400">
          <CheckCheck className="w-4 h-4" />
        </span>
      );
    case 'delivered':
      return (
        <span className="text-gray-600">
          <CheckCheck className="w-4 h-4" />
        </span>
      );
    case 'read':
      return (
        <span className="text-teal-500">
          <CheckCheck className="w-4 h-4" />
        </span>
      );
    case 'failed':
      return (
        <span className="text-red-500 text-xs">Failed</span>
      );
    default:
      return null;
  }
}