import figma from '@figma/code-connect'
import { ScrollArea } from './ScrollArea.jsx'

/**
 * Code Connect stub — ScrollArea
 * Prop maps stay minimal until the matching Figma library component is published;
 * then set nodeId in code-connect/node-map.json and re-run generate-code-connect.
 */
figma.connect(ScrollArea, 'https://www.figma.com/design/CS_FIGMA_FILE_KEY/CyberSkill?node-id=9999-70', {
  example: () => <ScrollArea />,
  imports: ["import { ScrollArea } from '@cyberskill/design'"],
})
