import { FileNodesResponse, FullStyleMetadata, StyleType } from 'figma-js';
import fs from 'fs';

import { getEffectStyles } from '../../lib/get-effect-styles';
import { getGradientStyles } from '../../lib/get-gradient-styles';
import { stringifyRecordsWithSort } from '../../lib/stringify';
import { writeStyleFile } from '../../lib/write-style-file';

// eslint-disable-next-line @typescript-eslint/naming-convention
type StyleTypePredicate = (item: { style_type: StyleType }) => boolean;

const getStyleTypePredicate = (styleType: StyleType): StyleTypePredicate => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  return ({ style_type }) => style_type === styleType;
};

const isStyleTypeFill = getStyleTypePredicate('FILL');
const isStyleTypeEffect = getStyleTypePredicate('EFFECT');

export const generateStyles = (
  config: Config,
  styleMetadata: readonly FullStyleMetadata[],
  fileNodes: FileNodesResponse,
) => {
  if (!fs.existsSync(config?.styles?.exportPath)) {
    fs.mkdirSync(config?.styles?.exportPath, { recursive: true });
  }

  const metaColors = styleMetadata.filter(isStyleTypeFill);

  if (!config?.styles?.gradients?.disabled) {
    const gradients = getGradientStyles(metaColors, fileNodes, config);
    const gradientsTemplate = `module.exports = ${stringifyRecordsWithSort(gradients)};`;
    writeStyleFile(gradientsTemplate, 'gradients.js', config);
  }

  if (!config?.styles?.effects?.disabled) {
    const metaEffects = styleMetadata.filter(isStyleTypeEffect);
    const effects = getEffectStyles(metaEffects, fileNodes, config);
    const effectTemplate = `module.exports = {boxShadow: ${stringifyRecordsWithSort(effects)}};`;
    writeStyleFile(effectTemplate, 'effects.js', config);
  }

  return false;
};
