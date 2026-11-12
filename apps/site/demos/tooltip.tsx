'use client';
import { ArrowClockwise, Copy, DownloadSimple, PencilSimple } from '@phosphor-icons/react';
import { Button, ButtonGroup, IconButton, Tooltip, TooltipProvider } from '@cyberskill/design';

export function IconTooltips() {
  return (
    <TooltipProvider delay={300}>
      <ButtonGroup label="Agent tools">
        <Tooltip content="Edit"><IconButton label="Edit" icon={<PencilSimple />} /></Tooltip>
        <Tooltip content="Retrain"><IconButton label="Retrain" icon={<ArrowClockwise />} /></Tooltip>
        <Tooltip content="Export transcripts"><IconButton label="Export transcripts" icon={<DownloadSimple />} /></Tooltip>
      </ButtonGroup>
      <Tooltip content="Copies the key once." side="bottom">
        <IconButton label="Copy API key" icon={<Copy />} variant="ghost" />
      </Tooltip>
    </TooltipProvider>
  );
}

export function TooltipSides() {
  return (
    <>
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <Tooltip key={side} side={side} content={`Opens on the ${side}`}>
          <Button variant="secondary" size="sm">{side}</Button>
        </Tooltip>
      ))}
    </>
  );
}
