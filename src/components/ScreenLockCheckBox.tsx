import { useEffect, useState } from 'react';

// Display screen lock checkbox when available
export default function ScreenLockCheckbox() {
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    // Check if the Wake Lock API is supported
    if ('wakeLock' in navigator) {
      setIsSupported(true);
    }
  }, []);

  useEffect(() => {
    // Release the lock when component unmounts
    return () => {
      if (wakeLock) {
        wakeLock.release().catch(() => {
          console.error('Failed to release screen lock on unmount');
        });
      }
    };
  }, [wakeLock]);

  const handleToggle = async () => {
    if (isLocked) {
      // Release the wake lock
      if (wakeLock) {
        await wakeLock.release();
        setIsLocked(false);
        setWakeLock(null);
      }
    } else {
      // Request the wake lock
      try {
        const lock = await navigator.wakeLock.request('screen');
        setWakeLock(lock);
        setIsLocked(true);

        lock.addEventListener('release', () => {
          setIsLocked(false);
        });
      } catch (err) {
        console.error('Error requesting wake lock:', err);
      }
    }
  };

  return (
    <div className="w-60 m-4 p-4 bg-gray-100 rounded-lg shadow-md">
      {
        !isSupported ?
          (<div className="text-zinc-700">Browser Screen Lock is not supported.<br/>Use your device Auto-Lock settings instead.</div>) :
          (<label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isLocked}
              onChange={handleToggle}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span>Screen Lock {isLocked ? 'On' : 'Off'}</span>
          </label>)
      }
    </div>
  );
}
