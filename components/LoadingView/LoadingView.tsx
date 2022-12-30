// @ts-nocheck
import styles from "./LoadingView.module.scss";
import { ReactNode } from "react";
import clsx from "clsx";
import FocusTrap from "focus-trap-react";
import { LoadingAnimation } from "../LoadingAnimation/LoadingAnimation";

interface LoadingViewProps {
  children: ReactNode;
  isLoading: boolean;
}

export const LoadingView = ({ children, isLoading }: LoadingViewProps) => {
  return (
    <>
      <FocusTrap active={isLoading}>
        <div
          className={clsx(styles.wrapper, isLoading && styles.wrapperLoading)}
        >
          {isLoading && <button className={styles.trapButton} aria-hidden />}
          <LoadingAnimation />
        </div>
      </FocusTrap>
      {children}
    </>
  );
};
