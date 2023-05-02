import { useEffect, useState } from 'react';

const formatCountdown = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const minutesText = minutes < 10 ? '0' + minutes : `${minutes}`;
  const secondsText = seconds < 10 ? '0' + seconds : `${seconds}`;

  return { minutesText, secondsText };
};

const useCountdown = (countdownSeconds: number) => {
  const [totalSeconds, setTotalSeconds] = useState(countdownSeconds);
  const [isCountdownFinished, setIsCountdownFinished] = useState(false);

  const resetCountdown = () => setTotalSeconds(countdownSeconds);

  useEffect(() => {
    const interval = setInterval(() => {
      if (totalSeconds > 0) {
        setTotalSeconds(totalSeconds - 1);
      } else {
        setIsCountdownFinished(true);
      }
    }, 1000);
    return () => clearInterval(interval);
  });

  const { minutesText, secondsText } = formatCountdown(totalSeconds);
  return { minutesText, secondsText, isCountdownFinished, resetCountdown };
};

export { useCountdown };
