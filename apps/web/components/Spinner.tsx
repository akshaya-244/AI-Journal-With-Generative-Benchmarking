import { clsx } from "clsx";
import { CSSProperties } from "react";
import './styles.css';
const bars = Array(12).fill(0);



interface SpinnerProps {
    color?: string;
    size?: number;
  }
  
export function Spinner({
  color="black",
  size = 20,
}: SpinnerProps) {
  return (
    <div
      className="wrapper"
      style={{
        ["--spinner-size"]: `${size}px`,
        ["--spinner-color"]: color,
      } as CSSProperties}
    >
      <div className="spinner">
        {bars.map((_, i) => (
          <div className="bar" key={`spinner-bar-${i}`} />
        ))}
      </div>
    </div>
  );
}