'use client';
import { ArrowLeft, Key } from '@phosphor-icons/react';
import {
  Alert,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Form,
  Link,
  OtpField,
  PasswordField,
  Separator,
  TextField,
} from '@cyberskill/design';
import { useState } from 'react';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function SignInPattern() {
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <div className="pt-app">
      <div className="pt-auth">
        <Card className="pt-auth-card">
          <CardHeader>
            <CardTitle render={<h2 />}>Sign in to Northwind</CardTitle>
            <CardDescription>Welcome back. Use your work email.</CardDescription>
          </CardHeader>
          <CardContent>
            {failed && (
              <Alert
                tone="danger"
                title="Email or password is incorrect"
                description="Check both and try again. After 5 failed attempts we lock sign-in for 15 minutes."
              />
            )}
            <Form
              className="pt-stack"
              aria-label="Sign in"
              onFormSubmit={async () => {
                setLoading(true);
                setFailed(false);
                await wait(800);
                setLoading(false);
                setFailed(true); // the demo always fails, to show the error state
              }}
            >
              <TextField label="Work email" name="email" type="email" autoComplete="email" placeholder="name@company.com" required />
              <PasswordField label="Password" name="password" required minLength={8} />
              <div className="pt-auth-row">
                <Checkbox label="Remember me for 30 days" name="remember" />
                <Link href="#forgot">Forgot password?</Link>
              </div>
              <Button type="submit" fullWidth loading={loading}>Sign in</Button>
            </Form>
            <Separator label="or" />
            <Button variant="secondary" fullWidth iconStart={<Key />}>Continue with single sign-on</Button>
          </CardContent>
          <CardFooter>
            <span className="pt-muted">New to Northwind?</span>
            <Link href="#signup">Create an account</Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export function VerifyPattern() {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [checking, setChecking] = useState(false);
  const [verified, setVerified] = useState(false);

  async function verify(value: string) {
    setChecking(true);
    setError(undefined);
    await wait(700);
    setChecking(false);
    // demo rule: 123456 is the right code
    if (value === '123456') setVerified(true);
    else setError('That code is not valid. Check the latest email, or send a new code.');
  }

  return (
    <div className="pt-app">
      <div className="pt-auth">
        <Card className="pt-auth-card">
          <CardHeader>
            <CardTitle render={<h2 />}>Check your email</CardTitle>
            <CardDescription>We sent a 6-digit code to l•••@northwind.io. It expires in 10 minutes.</CardDescription>
          </CardHeader>
          <CardContent>
            {verified ? (
              <Alert tone="success" title="You are signed in" description="Taking you to your workspace…" />
            ) : (
              <form className="pt-stack" aria-label="Verify sign-in" onSubmit={(e) => { e.preventDefault(); void verify(code); }}>
                <OtpField
                  label="Verification code"
                  description="Try 123456."
                  value={code}
                  onValueChange={(v) => { setCode(v); setError(undefined); }}
                  onComplete={(v) => void verify(v)}
                  error={error}
                />
                <Button type="submit" fullWidth loading={checking} disabled={code.length < 6 && !checking}>Verify</Button>
              </form>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" iconStart={<ArrowLeft />}>Use another email</Button>
            <span className="pt-spacer" />
            <Button variant="link" size="sm">Send a new code</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
