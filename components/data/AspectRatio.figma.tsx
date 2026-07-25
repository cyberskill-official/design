import figma from '@figma/code-connect'
import { AspectRatio } from './AspectRatio.jsx'

/**
 * Code Connect stub — AspectRatio
 * Prop maps stay minimal until the matching Figma library component is published;
 * then set nodeId in code-connect/node-map.json and re-run generate-code-connect.
 */
figma.connect(AspectRatio, 'https://www.figma.com/design/CS_FIGMA_FILE_KEY/CyberSkill?node-id=9999-5', {
  example: () => <AspectRatio />,
  imports: ["import { AspectRatio } from '@cyberskill/design'"],
})
