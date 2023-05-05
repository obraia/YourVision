/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as React from 'react';

export const useIsOverflow = (
  ref: React.RefObject<HTMLDivElement>,
  callback?: (hasOverflow: boolean) => void
) => {
  const [isOverflow, setIsOverflow] = React.useState<boolean>();

  React.useLayoutEffect(() => {
    const { current } = ref;

    const trigger = () => {
      const hasOverflow = current!.scrollHeight > current!.clientHeight;

      setIsOverflow(hasOverflow);

      if (callback) callback(hasOverflow);
    };

    if (current) {
      trigger();
    }
  });

  return isOverflow;
};
