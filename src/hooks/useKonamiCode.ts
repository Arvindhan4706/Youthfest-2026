import { useEffect, useRef } from 'react';
import { useStore } from '../lib/useStore';

const KONAMI_CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

export function useKonamiCode() {
  const setSecretMode = useStore((state) => state.setSecretMode);
  const inputRef = useRef<string[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      inputRef.current.push(key);
      
      // Keep only the length of the Konami code
      if (inputRef.current.length > KONAMI_CODE.length) {
        inputRef.current.shift();
      }

      // Check match
      const matches = inputRef.current.length === KONAMI_CODE.length && 
        inputRef.current.every((val, index) => {
          const expected = KONAMI_CODE[index];
          return expected && val && val.toLowerCase() === expected.toLowerCase();
        });
      
      if (matches && inputRef.current.length === KONAMI_CODE.length) {
        setSecretMode(true);
        inputRef.current = [];
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [setSecretMode]);
}
