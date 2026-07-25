import figma from '@figma/code-connect'
import { NativeSelect } from './NativeSelect.jsx'

/**
 * Code Connect stub — NativeSelect
 * Prop maps stay minimal until the matching Figma library component is published;
 * then set nodeId in code-connect/node-map.json and re-run generate-code-connect.
 */
figma.connect(NativeSelect, 'https://www.figma.com/design/CS_FIGMA_FILE_KEY/CyberSkill?node-id=9999-60', {
  example: () => <NativeSelect />,
  imports: ["import { NativeSelect } from '@cyberskill/design'"],
})
