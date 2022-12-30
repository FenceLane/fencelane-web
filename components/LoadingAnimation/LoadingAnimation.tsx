import styles from "./LoadingAnimation.module.scss";

interface LoadingAnimationProps {
  size?: number;
  width?: number;
}

export const LoadingAnimation = ({
  size = 96,
  width = 8,
}: LoadingAnimationProps) => {
  return (
    <span
      className={styles.loader}
      style={{
        ["--loader-size" as string]: `${size}px`,
        ["--loader-width" as string]: `${width}px`,
      }}
      aria-label="loading..."
    />
  );
};
