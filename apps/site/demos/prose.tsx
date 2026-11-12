import { Prose } from '@cyberskill/design';

// Stand-in for Markdown rendered to HTML (by marked, remark or your CMS), sanitised before it reaches the page.
const html = `
<h2>Refund a duplicate charge</h2>
<p>Duplicate charges usually come from a <strong>retried</strong> card payment. Check the <a href="#policy">refund policy</a> first.</p>
<ol>
  <li>Open the customer in <em>Billing</em> and confirm both charges show the same invoice.
    <ul><li>Same amount, same day.</li><li>Different charge IDs, e.g. <code>ch_3PqR</code> and <code>ch_3PqS</code>.</li></ul>
  </li>
  <li>Refund the second charge in full.</li>
  <li>Reply with the refund ID.</li>
</ol>
<blockquote><p>Refunds under $500 need no approval.</p></blockquote>
<h3>From the API</h3>
<pre><code>curl https://api.example.com/v1/refunds \\
  -d charge=ch_3PqS -d reason=duplicate</code></pre>
<h4>Limits</h4>
<table tabindex="0">
  <thead><tr><th>Plan</th><th>Refund window</th><th>Approval</th><th>Contact</th></tr></thead>
  <tbody>
    <tr><td>Team</td><td>30 days</td><td>Under $500: none</td><td>billing-approvals@example.com</td></tr>
    <tr><td>Business</td><td>60 days</td><td>Under $2,000: none</td><td>finance-approvals@example.com</td></tr>
  </tbody>
</table>
<hr />
<p>Questions? Write to <a href="mailto:billing@example.com">billing@example.com</a>.</p>
`;

export function ProseDocs() {
  return <Prose style={{ width: '100%', maxWidth: 640 }} dangerouslySetInnerHTML={{ __html: html }} />;
}

export function ProseSmall() {
  return (
    <Prose size="sm" style={{ width: '100%', maxWidth: 420 }}>
      <p>Here is a reply you can send as is:</p>
      <ol>
        <li>Hi Mai, sorry about the double charge on your October invoice.</li>
        <li>We refunded the extra $240.00 today (refund ID <code>RF-20931</code>).</li>
      </ol>
      <p>
        Sources: <a href="#refund-policy">Refund policy</a>, <a href="#ticket">Ticket #4821</a>.
      </p>
    </Prose>
  );
}
