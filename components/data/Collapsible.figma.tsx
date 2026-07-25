import figma from '@figma/code-connect'
import { Collapsible } from './Collapsible.jsx'

/**
 * Code Connect stub — Collapsible
 * Prop maps stay minimal until the matching Figma library component is published;
 * then set nodeId in code-connect/node-map.json and re-run generate-code-connect.
 */
figma.connect(Collapsible, 'https://www.figma.com/design/CS_FIGMA_FILE_KEY/CyberSkill?node-id=9999-21', {
  example: () => <Collapsible />,
  imports: ["import { Collapsible } from '@cyberskill/design'"],
})
