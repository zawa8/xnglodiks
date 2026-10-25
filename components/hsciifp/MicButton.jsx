'use client';

export default function MicButton() {
  const handleClick = () => alert('mik kuming sun - @hscii/htrlib update in progres');
  return (
    <button onClick={handleClick} title="vois inpu (kuming sun)"
      style={{
        padding: '0.5rem 0.75rem', borderRadius: '6px',
        border: 'none', background: '#3b82f6', color: '#fff',
        fontSize: '0.9rem', cursor: 'pointer',
      }}>
      🎤
    </button>
  );
}
