'use client';
import { ArrowClockwise, BookOpenText, Globe, PaperPlaneRight, ThumbsDown, ThumbsUp } from '@phosphor-icons/react';
import {
  Avatar,
  Badge,
  Button,
  CopyButton,
  SkeletonText,
  Spinner,
  Tag,
  Textarea,
  Toggle,
  Toolbar,
  ToolbarButton,
  ToolbarSeparator,
} from '@cyberskill/design';
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';

type Message =
  | { id: string; role: 'user'; text: string }
  | { id: string; role: 'assistant'; text: string; points?: string[]; sources?: string[]; pending?: boolean };

const first: Message[] = [
  { id: 'u1', role: 'user', text: 'A customer was charged twice for the Team plan in October. What should I do?' },
  {
    id: 'a1',
    role: 'assistant',
    text: 'Duplicate charges usually come from a retried card payment. Here is the fastest way to fix it:',
    points: [
      'Open the customer in Billing and confirm both charges show the same invoice number.',
      'Refund the second charge in full. Refunds under $500 need no approval.',
      'Reply with the refund ID and tell them it can take 5–10 business days to appear.',
    ],
    sources: ['Refund policy', 'Billing FAQ', 'Ticket #4821'],
  },
];

const suggestions = ['Draft the reply to the customer', 'Summarize this week’s refund requests', 'Which plan includes SSO?'];

const canned: Record<string, Omit<Extract<Message, { role: 'assistant' }>, 'id' | 'role'>> = {
  default: {
    text: 'Here is a reply you can send as is or edit first:',
    points: [
      'Hi Mai, sorry about the double charge on your October invoice.',
      'We refunded the extra $240.00 today (refund ID RF-20931).',
      'It should reach your card within 5–10 business days.',
    ],
    sources: ['Reply templates', 'Ticket #4821'],
  },
};

export function AiAssistantPattern() {
  const [messages, setMessages] = useState<Message[]>(first);
  const [draft, setDraft] = useState('');
  const [web, setWeb] = useState(false);
  const [rating, setRating] = useState<Record<string, 'up' | 'down'>>({});
  const logRef = useRef<HTMLDivElement>(null);
  const busy = messages.some((m) => m.role === 'assistant' && m.pending);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [messages]);

  function send(text: string) {
    if (!text.trim() || busy) return;
    const id = String(Date.now());
    setDraft('');
    setMessages((m) => [...m, { id: `u${id}`, role: 'user', text }, { id: `a${id}`, role: 'assistant', text: '', pending: true }]);
    // Stand-in for a streamed response
    setTimeout(() => {
      setMessages((m) => m.map((msg) => (msg.id === `a${id}` ? { ...msg, ...canned.default, pending: false } : msg)));
    }, 1800);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    send(draft);
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      send(draft);
    }
  }

  return (
    <div className="pt-app">
      <div className="pt-chat">
        <header className="pt-chat-header">
          <Avatar name="Support Copilot" initials="AI" size="md" aria-hidden />
          <div className="pt-chat-title">
            <strong>Support Copilot</strong>
            <span className="pt-muted" style={{ fontSize: 12 }}>Answers from 142 help-center articles</span>
          </div>
          <Badge tone="accent" size="sm">Beta</Badge>
        </header>

        {/* role="log" announces new messages politely; tabIndex lets keyboard users scroll it */}
        <div className="pt-chat-log" ref={logRef} role="log" aria-label="Conversation" aria-busy={busy} tabIndex={0}>
          {messages.map((m) =>
            m.role === 'user' ? (
              <p key={m.id} className="pt-msg-user" style={{ margin: 0 }}>
                <span className="cs-visually-hidden">You: </span>
                {m.text}
              </p>
            ) : (
              <article key={m.id} className="pt-msg-ai" aria-label="Support Copilot">
                <Avatar name="Support Copilot" initials="AI" size="sm" aria-hidden />
                <div className="pt-msg-ai-body">
                  {m.pending ? (
                    <>
                      <div className="pt-row">
                        <Spinner size="sm" label="Support Copilot is writing" />
                        <span className="pt-muted" aria-hidden>Searching 142 articles…</span>
                      </div>
                      <SkeletonText lines={3} />
                    </>
                  ) : (
                    <>
                      <p>{m.text}</p>
                      {m.points && (
                        <ol>
                          {m.points.map((p) => <li key={p}>{p}</li>)}
                        </ol>
                      )}
                      {m.sources && (
                        <div className="pt-row" role="group" aria-label="Sources">
                          <BookOpenText size={16} aria-hidden className="pt-muted" />
                          {m.sources.map((s) => <Tag key={s}>{s}</Tag>)}
                        </div>
                      )}
                      <Toolbar aria-label="Answer actions">
                        <ToolbarButton render={<CopyButton value={[m.text, ...(m.points ?? [])].join('\n')} label="Copy answer" copiedLabel="Answer copied" />} />
                        <ToolbarSeparator />
                        <ToolbarButton
                          icon={<ThumbsUp />} label="Good answer" aria-pressed={rating[m.id] === 'up'}
                          onClick={() => setRating((r) => ({ ...r, [m.id]: 'up' }))}
                        />
                        <ToolbarButton
                          icon={<ThumbsDown />} label="Bad answer" aria-pressed={rating[m.id] === 'down'}
                          onClick={() => setRating((r) => ({ ...r, [m.id]: 'down' }))}
                        />
                        <ToolbarSeparator />
                        <ToolbarButton icon={<ArrowClockwise />}>Regenerate</ToolbarButton>
                      </Toolbar>
                    </>
                  )}
                </div>
              </article>
            ),
          )}
        </div>

        <form className="pt-composer" onSubmit={onSubmit} aria-label="Ask Support Copilot">
          <div className="pt-prompts" role="group" aria-label="Suggested prompts">
            {suggestions.map((s) => (
              <Button key={s} variant="secondary" size="sm" onClick={() => send(s)} disabled={busy}>{s}</Button>
            ))}
          </div>
          <Textarea
            label="Message" hideLabel rows={2} placeholder="Ask about a customer, a policy or a ticket…"
            value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={onKeyDown}
            description="Enter to send, Shift+Enter for a new line"
          />
          <div className="pt-row">
            <Toggle size="sm" icon={<Globe />} pressed={web} onPressedChange={setWeb}>Search the web</Toggle>
            <span className="pt-spacer" />
            <Button type="submit" variant="accent" iconStart={<PaperPlaneRight />} loading={busy} disabled={!draft.trim() && !busy}>
              Send
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

/** The waiting state on its own: a spinner names the wait, skeleton lines hold the answer's place. */
export function AiAssistantStreaming() {
  return (
    <div className="pt-msg-ai" style={{ width: '100%' }}>
      <Avatar name="Support Copilot" initials="AI" size="sm" aria-hidden />
      <div className="pt-msg-ai-body" aria-busy="true">
        <div className="pt-row">
          <Spinner size="sm" label="Support Copilot is writing" />
          <span className="pt-muted" aria-hidden>Searching 142 articles…</span>
        </div>
        <SkeletonText lines={3} />
      </div>
    </div>
  );
}
