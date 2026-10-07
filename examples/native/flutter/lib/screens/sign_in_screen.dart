import 'package:flutter/material.dart';
import '../tokens/cs_tokens.dart';
import '../sample_theme.dart';

class SignInScreen extends StatefulWidget {
  const SignInScreen({super.key});

  @override
  State<SignInScreen> createState() => _SignInScreenState();
}

class _SignInScreenState extends State<SignInScreen> {
  final _email = TextEditingController(text: 'you@cyberskill.world');
  final _password = TextEditingController();

  @override
  void dispose() {
    _email.dispose();
    _password.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final sampleTheme = SampleTheme.of(context);
    final colors = sampleTheme.colors;
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text(
                'Sign in',
                style: TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.w800,
                  color: colors.colorTextPrimary,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Welcome back. Đăng nhập để tiếp tục.',
                style: TextStyle(fontSize: 15, color: colors.colorTextMuted),
              ),
              const SizedBox(height: 24),
              TextField(
                controller: _email,
                decoration: InputDecoration(
                  labelText: 'Work email',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: _password,
                obscureText: true,
                decoration: InputDecoration(
                  labelText: 'Password',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
              ),
              const SizedBox(height: 20),
              SizedBox(
                height: CSTokens.componentButtonMdMinHeight,
                child: FilledButton(
                  style: FilledButton.styleFrom(
                    backgroundColor: colors.componentButtonPrimaryBg,
                    foregroundColor: colors.componentButtonPrimaryFg,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(
                        CSTokens.componentButtonRadius,
                      ),
                    ),
                  ),
                  onPressed: () {
                    Navigator.of(context).pushReplacementNamed('/home');
                  },
                  child: const Text('Sign in'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
