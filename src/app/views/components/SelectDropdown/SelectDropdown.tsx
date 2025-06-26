import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import css from './selectitems.module.scss';

interface SelectDropdownProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  triggerRef: RefObject<HTMLElement>;
}

export const SelectDropdown = ({ children, isOpen, onClose, triggerRef }: SelectDropdownProps) => {
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setPortalRoot(document.body);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, triggerRef]);

  useEffect(() => {
    if (isOpen && dropdownRef.current && triggerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const dropdownRect = dropdownRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      let top = triggerRect.bottom + window.scrollY;
      let transformOrigin = 'top';

      // Check if there's not enough space below
      if (triggerRect.bottom + dropdownRect.height > viewportHeight) {
        top = triggerRect.top - dropdownRect.height + window.scrollY;
        transformOrigin = 'bottom';
      }

      dropdownRef.current.style.top = `${top}px`;
      dropdownRef.current.style.left = `${triggerRect.left + window.scrollX}px`;
      dropdownRef.current.style.minWidth = `${triggerRect.width}px`;
      dropdownRef.current.style.transformOrigin = transformOrigin;

      // Set visibility after positioning
      setTimeout(() => setIsVisible(true), 0);
    } else {
      setIsVisible(false);
    }
  }, [isOpen, triggerRef]);

  if (!portalRoot) return null;

  return createPortal(
    <div
      className={`${css['select-dropdown']}  ${isOpen ? css['open'] : ''} ${isVisible ? css['visible'] : ''}`}
      ref={dropdownRef}>
      {children}
    </div>,
    portalRoot
  );
};
