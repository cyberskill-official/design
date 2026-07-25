import figma from '@figma/code-connect'
import { Item } from './Item.jsx'

/**
 * Code Connect stub — Item
 * Prop maps stay minimal until the matching Figma library component is published;
 * then set nodeId in code-connect/node-map.json and re-run generate-code-connect.
 */
figma.connect(Item, 'https://www.figma.com/design/CS_FIGMA_FILE_KEY/CyberSkill?node-id=9999-50', {
  example: () => <Item />,
  imports: ["import { Item } from '@cyberskill/design'"],
})
