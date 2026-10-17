import 'package:flutter/material.dart';
import '../tokens/cs_tokens.dart';
import '../sample_theme.dart';
import '../sample_language.dart';

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
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Text(
                  sampleTheme.text(SampleText.signIn),
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.w800,
                    color: colors.colorTextPrimary,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  sampleTheme.text(SampleText.welcome),
                  style: TextStyle(fontSize: 15, color: colors.colorTextMuted),
                ),
                const SizedBox(height: 24),
                TextField(
                  controller: _email,
                  decoration: InputDecoration(
                    labelText: sampleTheme.text(SampleText.workEmail),
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
                    labelText: sampleTheme.text(SampleText.password),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                ),
                const SizedBox(height: 20),
                ConstrainedBox(
                  constraints: const BoxConstraints(
                      minHeight: CSTokens.componentButtonMdMinHeight),
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
                    child: Text(sampleTheme.text(SampleText.signIn)),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
