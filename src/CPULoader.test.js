import { getAverages } from './utils';

test('computed average should be above 1', () => {
  const highAvg = [1.60986328125, 1.64111328125, 1.62411328125, 1.60411328125, 1.50927734375, 1.55975134375, 1.50927734375, 1.59927722375, 1.40127734375, 1.39927734375, 1.62890625, 1.64290625];
  const highResult = getAverages(highAvg);
  expect(highResult).toBe(1.560762797291667);
})

test('computed average should be below 1', () => {
  const lowAvg = [0.11669921875, 0.11669921875, 1.4489921875, 1.02685546875, 1.0085546875, 0.02115546875, 0.02685546875, 0.08285546875, 0.0004140625, 0.1244140625, 0.0144140625, 0.0901140625]
  const lowResult = getAverages(lowAvg)
  expect(lowResult).toBe(0.3398352864583334);
})