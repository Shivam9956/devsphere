import React from 'react';
import { FiLock, FiShield } from 'react-icons/fi';

export default function PaymentBadges({ showText = true, align = 'center' }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center',
        gap: '10px'
      }}
    >
      {/* Logos Strip */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap',
          justifyContent: align === 'left' ? 'flex-start' : 'center'
        }}
      >
        {/* PayPal */}
        <div
          title="PayPal"
          style={{
            height: '28px',
            padding: '4px 10px',
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
          }}
        >
          <svg width="60" height="18" viewBox="0 0 100 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.6 3.2H4.8C4.3 3.2 3.9 3.6 3.8 4.1L1.2 20.7C1.1 21.1 1.4 21.5 1.8 21.5H5.4C5.9 21.5 6.3 21.1 6.4 20.6L7.3 14.8C7.4 14.3 7.8 13.9 8.3 13.9H10.6C14.7 13.9 17.5 11.8 18.2 7.7C18.5 5.8 17.8 4.5 16.5 3.9C15.3 3.4 13.6 3.2 11.6 3.2Z" fill="#003087"/>
            <path d="M12.4 8.7C12.1 10.8 10.4 10.8 8.9 10.8H7.9L8.7 5.7H9.9C11.3 5.7 12.1 5.7 12.5 6.4C12.7 6.8 12.7 7.6 12.4 8.7Z" fill="#0079C1"/>
            <path d="M43.6 8.5H39.8C39.4 8.5 39.1 8.8 39 9.2L38.8 10.4C38.1 9.3 36.6 8.5 34.6 8.5C30.2 8.5 26.5 11.8 25.8 16.3C25.1 20.7 28.1 24.3 32.5 24.3C35.9 24.3 37.7 22.4 37.7 22.4L37.4 24.1C37.3 24.5 37.6 24.9 38 24.9H41.4C41.9 24.9 42.3 24.5 42.4 24L44.8 9.2C44.8 8.8 44.5 8.5 43.6 8.5ZM35.4 20.8C33.2 20.8 31.6 19 32 16.5C32.4 14 34.5 12.2 36.7 12.2C38.9 12.2 40.5 14 40.1 16.5C39.7 19.1 37.6 20.8 35.4 20.8Z" fill="#003087"/>
            <path d="M52.3 8.5L46.8 16.4L44.5 8.9C44.4 8.5 44 8.2 43.6 8.2H40.2C39.8 8.2 39.5 8.6 39.7 9L43.8 22.5L40.2 27.5C39.9 27.9 40.2 28.5 40.7 28.5H44.1C44.5 28.5 44.9 28.3 45.1 28L55.7 9.2C56 8.7 55.6 8.2 55.1 8.2L52.3 8.5Z" fill="#003087"/>
            <path d="M68.5 3.2H61.7C61.2 3.2 60.8 3.6 60.7 4.1L58.1 20.7C58 21.1 58.3 21.5 58.7 21.5H62.3C62.8 21.5 63.2 21.1 63.3 20.6L64.2 14.8C64.3 14.3 64.7 13.9 65.2 13.9H67.5C71.6 13.9 74.4 11.8 75.1 7.7C75.4 5.8 74.7 4.5 73.4 3.9C72.2 3.4 70.5 3.2 68.5 3.2Z" fill="#003087"/>
            <path d="M69.3 8.7C69 10.8 67.3 10.8 65.8 10.8H64.8L65.6 5.7H66.8C68.2 5.7 69 5.7 69.4 6.4C69.6 6.8 69.6 7.6 69.3 8.7Z" fill="#0079C1"/>
            <path d="M100.5 8.5H96.7C96.3 8.5 96 8.8 95.9 9.2L95.7 10.4C95 9.3 93.5 8.5 91.5 8.5C87.1 8.5 83.4 11.8 82.7 16.3C82 20.7 85 24.3 89.4 24.3C92.8 24.3 94.6 22.4 94.6 22.4L94.3 24.1C94.2 24.5 94.5 24.9 94.9 24.9H98.3C98.8 24.9 99.2 24.5 99.3 24L101.7 9.2C101.7 8.8 101.4 8.5 100.5 8.5ZM92.3 20.8C90.1 20.8 88.5 19 88.9 16.5C89.3 14 91.4 12.2 93.6 12.2C95.8 12.2 97.4 14 97 16.5C96.6 19.1 94.5 20.8 92.3 20.8Z" fill="#003087"/>
            <path d="M80.8 3.2H77.2C76.8 3.2 76.4 3.5 76.3 3.9L73.6 20.8C73.5 21.2 73.8 21.6 74.2 21.6H77.6C78 21.6 78.4 21.3 78.5 20.9L81.2 4C81.3 3.5 81 3.2 80.8 3.2Z" fill="#003087"/>
          </svg>
        </div>

        {/* Visa */}
        <div
          title="Visa"
          style={{
            height: '28px',
            padding: '4px 10px',
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
          }}
        >
          <svg width="44" height="15" viewBox="0 0 60 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M23.9 19.3L27.1 0.7H32.2L29 19.3H23.9Z" fill="#1A1F71"/>
            <path d="M44.4 1.2C43.4 0.8 41.8 0.4 39.8 0.4C34.9 0.4 31.4 3 31.4 6.8C31.4 9.6 33.9 11.1 35.8 12.1C37.8 13.1 38.5 13.7 38.5 14.6C38.5 16 36.8 16.6 35.2 16.6C32.8 16.6 31.3 16.2 30.2 15.7L29.5 15.4L28.8 19.8C30.1 20.4 32.4 20.8 34.8 20.8C40.1 20.8 43.6 18.2 43.6 14.2C43.6 11 41.6 9.4 39.1 8.2C37.6 7.4 36.6 6.8 36.6 5.8C36.6 4.9 37.7 4 39.8 4C41.6 4 42.9 4.4 43.7 4.8L44.2 5L44.4 1.2Z" fill="#1A1F71"/>
            <path d="M51.1 14.9C51.6 13.5 53.6 7.9 53.6 7.9C53.6 7.9 54 6.8 54.3 5.9L54.7 7.7C54.7 7.7 55.9 13.4 56.2 14.9H51.1ZM58.3 0.7H54.4C53.2 0.7 52.2 1.1 51.7 2.3L44.2 19.3H49.5C49.5 19.3 50.4 16.9 50.6 16.3H56.8C57 17 57.5 19.3 57.5 19.3H62.2L58.3 0.7Z" fill="#1A1F71"/>
            <path d="M16.8 0.7L11.9 13.4L11.4 10.7C10.5 7.6 7.6 4.2 4.3 2.5L8.8 19.3H14.1L22.1 0.7H16.8Z" fill="#1A1F71"/>
            <path d="M5.8 0.7H0.1L0 1.1C4.4 2.2 7.7 5.2 9.5 7.6L7.9 0.7H5.8Z" fill="#F7B600"/>
          </svg>
        </div>

        {/* Mastercard */}
        <div
          title="Mastercard"
          style={{
            height: '28px',
            padding: '4px 8px',
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
          }}
        >
          <svg width="34" height="20" viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="14" cy="12" r="11" fill="#EB001B"/>
            <circle cx="26" cy="12" r="11" fill="#F79E1B"/>
            <path d="M20 4.2C22.4 6.2 24 9.1 24 12.4C24 15.7 22.4 18.6 20 20.6C17.6 18.6 16 15.7 16 12.4C16 9.1 17.6 6.2 20 4.2Z" fill="#FF5F00"/>
          </svg>
        </div>

        {/* American Express */}
        <div
          title="American Express"
          style={{
            height: '28px',
            padding: '4px 8px',
            background: '#006FCF',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
          }}
        >
          <span style={{ color: '#ffffff', fontWeight: 900, fontSize: '0.68rem', letterSpacing: '0.04em', fontFamily: 'sans-serif' }}>
            AMEX
          </span>
        </div>
      </div>

      {/* Security Micro-copy */}
      {showText && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.78rem',
            color: 'var(--text3)',
            fontWeight: 500
          }}
        >
          <FiLock size={12} style={{ color: '#10b981', flexShrink: 0 }} />
          <span>Secure Global Payments via PayPal & Credit/Debit Cards</span>
        </div>
      )}
    </div>
  );
}
