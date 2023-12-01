import React from 'react';
import './styles.css';

export function Result(props) {
  const { gameResult } = props;
  const result = useRef(null);
  useEffect(() => {
    if (gameResult === "Victory") {
      result.current.className = "Victory_Text";
    } else if (gameResult === "Defeat") {
      result.current.className = "Defeat_Text";
    } else {
      result.current.className = "Tie_Text";
    }
  }, []);

  return (
    <div className="Overlay">
      <div ref={result}>{gameResult}</div>
    </div>
  );
};

export default Result;