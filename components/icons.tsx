// Centralized SVG icon components for reuse across the app
import React from "react";

type IconProps = {
  className?: string;
  size?: number;
};

export function BoltIcon({ className = "", size = 16 }: IconProps) {
  return (
    <svg className={className} width={size} height={size * 1.25} viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 0L0 11.5H7L5 20L16 8.5H9L11 0H9Z" fill="currentColor" />
    </svg>
  );
}

export function DashboardIcon({ className = "", size = 18 }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="7.5" height="7.5" rx="2" fill="currentColor" />
      <rect x="10.5" y="0" width="7.5" height="7.5" rx="2" fill="currentColor" />
      <rect x="0" y="10.5" width="7.5" height="7.5" rx="2" fill="currentColor" />
      <rect x="10.5" y="10.5" width="7.5" height="7.5" rx="2" fill="currentColor" />
    </svg>
  );
}

export function CalendarIcon({ className = "", size = 18 }: IconProps) {
  return (
    <svg className={className} width={size} height={size * 1.11} viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 0V2H14V0H16V2H17C17.5523 2 18 2.44772 18 3V19C18 19.5523 17.5523 20 17 20H1C0.44772 20 0 19.5523 0 19V3C0 2.44772 0.44772 2 1 2H2V0H4ZM16 8H2V18H16V8ZM6 10V12H4V10H6ZM10 10V12H8V10H10ZM14 10V12H12V10H14Z" fill="currentColor" />
    </svg>
  );
}

export function AppliancesIcon({ className = "", size = 18 }: IconProps) {
  return (
    <svg className={className} width={size} height={size * 1.11} viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 0H17C17.5523 0 18 0.44772 18 1V19C18 19.5523 17.5523 20 17 20H1C0.44772 20 0 19.5523 0 19V1C0 0.44772 0.44772 0 1 0ZM2 2V18H16V2H2ZM5 4H13V8H5V4ZM7 6V6.5H11V6H7ZM5 10H7V12H5V10ZM5 14H7V16H5V14Z" fill="currentColor" />
    </svg>
  );
}

export function AnalyticsIcon({ className = "", size = 16 }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="9" width="3" height="7" rx="0.5" fill="currentColor" />
      <rect x="4.5" y="5" width="3" height="11" rx="0.5" fill="currentColor" />
      <rect x="9" y="7" width="3" height="9" rx="0.5" fill="currentColor" />
      <rect x="13" y="0" width="3" height="16" rx="0.5" fill="currentColor" />
    </svg>
  );
}

export function SettingsIcon({ className = "", size = 20 }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.68 0.04C8.88 0 9.14 0 9.66 0H10.34C10.86 0 11.12 0 11.32 0.04C11.9 0.16 12.38 0.52 12.64 1.02L12.84 1.42C12.98 1.7 13.16 1.92 13.4 2.06C13.64 2.2 13.92 2.26 14.22 2.28L14.66 2.3C15.22 2.32 15.52 2.36 15.72 2.44C16.28 2.66 16.72 3.1 16.94 3.66C17.02 3.86 17.06 4.16 17.08 4.72L17.1 5.16C17.12 5.46 17.18 5.74 17.32 5.98C17.46 6.22 17.68 6.4 17.96 6.54L18.36 6.74C18.86 7 19.22 7.48 19.34 8.06C19.38 8.26 19.38 8.52 19.38 9.04V9.96C19.38 10.48 19.38 10.74 19.34 10.94C19.22 11.52 18.86 12 18.36 12.26L17.96 12.46C17.68 12.6 17.46 12.78 17.32 13.02C17.18 13.26 17.12 13.54 17.1 13.84L17.08 14.28C17.06 14.84 17.02 15.14 16.94 15.34C16.72 15.9 16.28 16.34 15.72 16.56C15.52 16.64 15.22 16.68 14.66 16.7L14.22 16.72C13.92 16.74 13.64 16.8 13.4 16.94C13.16 17.08 12.98 17.3 12.84 17.58L12.64 17.98C12.38 18.48 12 18.84 11.32 18.96C11.12 19 10.86 19 10.34 19H9.66C9.14 19 8.88 19 8.68 18.96C8 18.84 7.62 18.48 7.36 17.98L7.16 17.58C7.02 17.3 6.84 17.08 6.6 16.94C6.36 16.8 6.08 16.74 5.78 16.72L5.34 16.7C4.78 16.68 4.48 16.64 4.28 16.56C3.72 16.34 3.28 15.9 3.06 15.34C2.98 15.14 2.94 14.84 2.92 14.28L2.9 13.84C2.88 13.54 2.82 13.26 2.68 13.02C2.54 12.78 2.32 12.6 2.04 12.46L1.64 12.26C1.14 12 0.78 11.52 0.66 10.94C0.62 10.74 0.62 10.48 0.62 9.96V9.04C0.62 8.52 0.62 8.26 0.66 8.06C0.78 7.48 1.14 7 1.64 6.74L2.04 6.54C2.32 6.4 2.54 6.22 2.68 5.98C2.82 5.74 2.88 5.46 2.9 5.16L2.92 4.72C2.94 4.16 2.98 3.86 3.06 3.66C3.28 3.1 3.72 2.66 4.28 2.44C4.48 2.36 4.78 2.32 5.34 2.3L5.78 2.28C6.08 2.26 6.36 2.2 6.6 2.06C6.84 1.92 7.02 1.7 7.16 1.42L7.36 1.02C7.62 0.52 8 0.16 8.68 0.04ZM10 13C11.6569 13 13 11.6569 13 10C13 8.34315 11.6569 7 10 7C8.34315 7 7 8.34315 7 10C7 11.6569 8.34315 13 10 13Z" fill="currentColor" />
    </svg>
  );
}

export function NotificationIcon({ className = "", size = 16 }: IconProps) {
  return (
    <svg className={className} width={size} height={size * 1.25} viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 0C11.3137 0 14 2.68629 14 6V9.5858L15.7071 11.2929C15.8946 11.4804 16 11.7348 16 12V13C16 13.5523 15.5523 14 15 14H1C0.44772 14 0 13.5523 0 13V12C0 11.7348 0.10536 11.4804 0.29289 11.2929L2 9.5858V6C2 2.68629 4.68629 0 8 0ZM8 18C6.34315 18 5 16.6569 5 15H11C11 16.6569 9.65685 18 8 18Z" fill="currentColor" />
    </svg>
  );
}

export function UserIcon({ className = "", size = 20 }: IconProps) {
  return (
    <svg className={className} width={size} height={size * 0.8} viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="4" r="4" fill="currentColor" />
      <path d="M2 16C2 12.6863 5.58172 10 10 10C14.4183 10 18 12.6863 18 16H2Z" fill="currentColor" />
    </svg>
  );
}

export function ChevronRightIcon({ className = "", size = 12 }: IconProps) {
  return (
    <svg className={className} width={size} height={size * 1.67} viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 1L10 10L1 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function TrendUpIcon({ className = "", size = 12 }: IconProps) {
  return (
    <svg className={className} width={size} height={size * 0.6} viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 6L4 3L6.5 5.5L11 1M11 1H7.5M11 1V4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function TrendDownIcon({ className = "", size = 12 }: IconProps) {
  return (
    <svg className={className} width={size} height={size * 0.6} viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 1L4 4L6.5 1.5L11 6M11 6H7.5M11 6V2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function TrendNeutralIcon({ className = "", size = 12 }: IconProps) {
  return (
    <svg className={className} width={size} height={size * 0.78} viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 5L4 2L6.5 5L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SearchIcon({ className = "", size = 14 }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="2" />
      <path d="M10 10L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function PlusIcon({ className = "", size = 12 }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 0V12M0 6H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function CalendarSmallIcon({ className = "", size = 15 }: IconProps) {
  return (
    <svg className={className} width={size} height={size * 1.11} viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.5 0V1.5H11.5V0H13V1.5H14C14.5523 1.5 15 1.94772 15 2.5V15.5C15 16.0523 14.5523 16.5 14 16.5H1C0.44772 16.5 0 16.0523 0 15.5V2.5C0 1.94772 0.44772 1.5 1 1.5H2V0H3.5ZM13 6.5H2V15H13V6.5ZM5 8V10H3V8H5Z" fill="currentColor" />
    </svg>
  );
}

export function MoreVertIcon({ className = "", size = 4 }: IconProps) {
  return (
    <svg className={className} width={size} height={size * 4} viewBox="0 0 4 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="2" cy="2" r="2" fill="currentColor" />
      <circle cx="2" cy="8" r="2" fill="currentColor" />
      <circle cx="2" cy="14" r="2" fill="currentColor" />
    </svg>
  );
}

export function MoneyIcon({ className = "", size = 22 }: IconProps) {
  return (
    <svg className={className} width={size} height={size * 0.73} viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="22" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="11" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

export function WarningIcon({ className = "", size = 22 }: IconProps) {
  return (
    <svg className={className} width={size} height={size * 0.86} viewBox="0 0 22 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 0L22 19H0L11 0Z" fill="currentColor" />
      <rect x="10" y="7" width="2" height="6" rx="1" fill="white" />
      <circle cx="11" cy="15.5" r="1" fill="white" />
    </svg>
  );
}

export function LoadingIcon({ className = "", size = 20 }: IconProps) {
  return (
    <svg className={`animate-spin ${className}`} width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" opacity="0.3" />
      <path d="M18 10C18 5.58172 14.4183 2 10 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function EnergyIcon({ className = "", size = 18 }: IconProps) {
  return (
    <svg className={className} width={size} height={size * 1.11} viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 0L0 11H8L6 20L18 9H10L12 0H10Z" fill="currentColor" />
    </svg>
  );
}

export function CurrencyIcon({ className = "", size = 18 }: IconProps) {
  return (
    <svg className={className} width={size} height={size * 0.73} viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="11" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

export function CloseIcon({ className = "", size = 14 }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronDownIcon({ className = "", size = 12 }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronUpIcon({ className = "", size = 12 }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.5 7.5L6 4L9.5 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronLeftIcon({ className = "", size = 12 }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.5 9.5L4 6L7.5 2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
