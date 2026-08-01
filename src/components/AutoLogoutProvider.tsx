'use client';
import { useAutoLogout } from '../hooks/useAutoLogout';

export default function AutoLogoutProvider() {
  useAutoLogout();
  return null;
}

