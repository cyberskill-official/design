import figma from '@figma/code-connect'
import { AlertDialog } from './AlertDialog.jsx'

/**
 * Code Connect stub — AlertDialog
 * Prop maps stay minimal until the matching Figma library component is published;
 * then set nodeId in code-connect/node-map.json and re-run generate-code-connect.
 */
figma.connect(AlertDialog, 'https://www.figma.com/design/CS_FIGMA_FILE_KEY/CyberSkill?node-id=9999-4', {
  example: () => <AlertDialog />,
  imports: ["import { AlertDialog } from '@cyberskill/design'"],
})
