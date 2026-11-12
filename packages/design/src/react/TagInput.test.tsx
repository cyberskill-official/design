import { render, screen } from '@testing-library/react';
import { userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { useState } from 'react';
import { TagInput } from './TagInput';
import { expectAccessibleInThemes } from '../test/a11y';

const chips = () => screen.queryAllByRole('button', { name: /^Remove / }).map(b => b.getAttribute('aria-label')!.slice('Remove '.length));
const paste = (input: HTMLElement, text: string) => {
  const clipboardData = new DataTransfer();
  clipboardData.setData('text/plain', text);
  input.dispatchEvent(new ClipboardEvent('paste', { clipboardData, bubbles: true, cancelable: true }));
};

describe('TagInput', () => {
  it('is a labelled text box with linked help and error text', () => {
    render(<TagInput label="Invite by email" description="Press Enter after each address." error="Add at least one address." />);
    const input = screen.getByRole('textbox', { name: 'Invite by email' });
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription(expect.stringContaining('Add at least one address.'));
  });

  it('Enter and comma add the trimmed text; empty text is ignored', async () => {
    const onValueChange = vi.fn();
    render(<TagInput label="Keywords" onValueChange={onValueChange} />);
    const input = screen.getByRole('textbox', { name: 'Keywords' });
    await userEvent.type(input, '  design  {Enter}');
    expect(onValueChange).toHaveBeenLastCalledWith(['design']);
    await userEvent.type(input, 'tokens,');
    expect(onValueChange).toHaveBeenLastCalledWith(['design', 'tokens']);
    expect(input).toHaveValue('');
    await userEvent.type(input, '   {Enter},');
    expect(onValueChange).toHaveBeenCalledTimes(2);
    expect(chips()).toEqual(['design', 'tokens']);
  });

  it('pasting text with commas or new lines adds several, keeping refused ones in the input', async () => {
    const onReject = vi.fn();
    render(<TagInput label="Emails" defaultValue={['an@acme.vn']} validate={t => t.includes('@')} onReject={onReject} />);
    const input = screen.getByRole('textbox', { name: 'Emails' });
    input.focus();
    paste(input, 'binh@acme.vn, oops\nAN@acme.vn\r\nchi@acme.vn,');
    await expect.poll(chips).toEqual(['an@acme.vn', 'binh@acme.vn', 'chi@acme.vn']);
    expect(onReject).toHaveBeenCalledWith('oops', 'invalid');
    expect(onReject).toHaveBeenCalledWith('AN@acme.vn', 'duplicate');
    expect(input).toHaveValue('oops, AN@acme.vn');
  });

  it('a paste without separators just inserts the text', async () => {
    render(<TagInput label="Emails" />);
    const input = screen.getByRole('textbox', { name: 'Emails' });
    await userEvent.type(input, 'an@');
    paste(input, 'acme.vn');
    expect(chips()).toEqual([]);
  });

  it('rejects duplicates ignoring case (and Unicode form), and keeps the text', async () => {
    const onReject = vi.fn();
    render(<TagInput label="Keywords" defaultValue={['Nguyễn']} onReject={onReject} />);
    const input = screen.getByRole('textbox', { name: 'Keywords' });
    await userEvent.type(input, `${'NGUYỄN'.normalize('NFD')}{Enter}`);
    expect(onReject).toHaveBeenCalledWith('NGUYỄN'.normalize('NFD'), 'duplicate');
    expect(chips()).toEqual(['Nguyễn']);
    expect(input).toHaveValue('NGUYỄN'.normalize('NFD'));
  });

  it('stops at max and reports it', async () => {
    const onReject = vi.fn();
    render(<TagInput label="Keywords" defaultValue={['a', 'b']} max={2} onReject={onReject} />);
    await userEvent.type(screen.getByRole('textbox', { name: 'Keywords' }), 'c{Enter}');
    expect(onReject).toHaveBeenCalledWith('c', 'max');
    expect(chips()).toEqual(['a', 'b']);
  });

  it('Backspace in the empty input removes the last tag; remove buttons remove one and keep focus in the field', async () => {
    render(<TagInput label="Keywords" defaultValue={['a', 'b', 'c']} removeLabel={t => `Remove ${t}`} />);
    const input = screen.getByRole('textbox', { name: 'Keywords' });
    input.focus();
    await userEvent.keyboard('{Backspace}');
    expect(chips()).toEqual(['a', 'b']);
    const remove = screen.getByRole('button', { name: 'Remove a' });
    expect(remove.getBoundingClientRect().width).toBeGreaterThanOrEqual(24);
    await userEvent.click(remove);
    expect(chips()).toEqual(['b']);
    expect(document.activeElement).toBe(input);
  });

  it('Enter with text adds a tag instead of submitting; with no text it submits', async () => {
    const onSubmit = vi.fn((e: SubmitEvent) => e.preventDefault());
    render(<form onSubmit={e => onSubmit(e.nativeEvent as SubmitEvent)}><TagInput label="Keywords" /><button type="submit">Save</button></form>);
    const input = screen.getByRole('textbox', { name: 'Keywords' });
    await userEvent.type(input, 'a{Enter}');
    expect(onSubmit).not.toHaveBeenCalled();
    await userEvent.keyboard('{Enter}');
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('name: a native form submits one value per tag, and not the half-typed text', async () => {
    const { container } = render(<form><TagInput label="Emails" name="emails" defaultValue={['an@acme.vn']} required /></form>);
    const form = container.querySelector('form')!;
    await userEvent.type(screen.getByRole('textbox', { name: 'Emails' }), 'binh@acme.vn{Enter}chi');
    expect(new FormData(form).getAll('emails')).toEqual(['an@acme.vn', 'binh@acme.vn']);
    expect(form.checkValidity()).toBe(true);
  });

  it('shows the placeholder only while empty', async () => {
    render(<TagInput label="Keywords" placeholder="Add keywords" />);
    const input = screen.getByRole('textbox', { name: 'Keywords' });
    expect(input).toHaveAttribute('placeholder', 'Add keywords');
    await userEvent.type(input, 'a{Enter}');
    expect(input).not.toHaveAttribute('placeholder');
  });

  it('a controlled value reset to undefined (React Hook Form reset()) removes every tag', async () => {
    function Form() {
      const [tags, setTags] = useState<string[] | undefined>(['a']);
      return (
        <>
          <TagInput label="Keywords" value={tags} onValueChange={setTags} />
          <button type="button" onClick={() => setTags(undefined)}>Reset</button>
        </>
      );
    }
    render(<Form />);
    await userEvent.type(screen.getByRole('textbox', { name: 'Keywords' }), 'b{Enter}');
    expect(chips()).toEqual(['a', 'b']);
    await userEvent.click(screen.getByRole('button', { name: 'Reset' }));
    expect(chips()).toEqual([]);
  });

  it('disabled: no typing, no removing, nothing submitted', async () => {
    const { container } = render(<form><TagInput label="Keywords" name="k" defaultValue={['a']} disabled /></form>);
    expect(screen.getByRole('textbox', { name: 'Keywords' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Remove a' })).toBeDisabled();
    expect(new FormData(container.querySelector('form')!).getAll('k')).toEqual([]);
  });

  it('a click in the box beside the chips focuses the input', async () => {
    render(<div style={{ width: 400 }}><TagInput label="Keywords" defaultValue={['a']} /></div>);
    const box = document.querySelector('.cs-tag-input')!;
    box.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(document.activeElement).toBe(screen.getByRole('textbox', { name: 'Keywords' }));
  });

  it('adds the typed text when focus leaves the field, so clicking Submit never loses it', async () => {
    const onValueChange = vi.fn();
    render(<><TagInput label="Emails" onValueChange={onValueChange} /><button>Submit</button></>);
    await userEvent.type(screen.getByRole('textbox', { name: 'Emails' }), 'an@cyberskill.world');
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
    expect(onValueChange).toHaveBeenLastCalledWith(['an@cyberskill.world']);
  });

  it('has no accessibility violations in light and dark', async () => {
    await expectAccessibleInThemes(
      <div style={{ display: 'grid', gap: 12, maxWidth: 360 }}>
        <TagInput label="Invite by email" placeholder="name@company.vn" description="Press Enter or comma after each address." />
        <TagInput label="Keywords" defaultValue={['design', 'tokens']} error="Add at most two keywords." />
        <TagInput label="Locked" defaultValue={['Hà Nội']} disabled size="sm" />
        <TagInput label="Large" defaultValue={['Ổn định']} size="lg" removeLabel={t => `Xoá ${t}`} />
      </div>,
    );
  });
});
