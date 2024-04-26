// @deno-types="npm:@types/react@^18.2.0"
import * as React from 'react';

import { SideCarComponent, SideCarMedium } from './types.ts';

const SideCar = ({ sideCar, ...rest }: any) => {
  if (!sideCar) {
    throw new Error('Sidecar: please provide `sideCar` property to import the right car');
  }

  const Target = sideCar.read();

  if (!Target) {
    throw new Error('Sidecar medium not found');
  }

  return <Target {...rest} />;
};

SideCar.isSideCarExport = true;

export function exportSidecar<T>(medium: SideCarMedium<T>, exported: React.ComponentType<T>): SideCarComponent<T> {
  medium.useMedium(exported);

  return SideCar as any;
}
