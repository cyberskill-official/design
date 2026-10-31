import 'package:cyberskill_design/controls.dart';
import 'package:flutter/material.dart';
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
                CsTextField(
                  label: sampleTheme.text(SampleText.workEmail),
                  controller: _email,
                  dark: sampleTheme.dark,
                  highContrast: sampleTheme.highContrast,
                  compact: false,
                ),
                const SizedBox(height: 12),
                CsTextField(
                  label: sampleTheme.text(SampleText.password),
                  controller: _password,
                  dark: sampleTheme.dark,
                  highContrast: sampleTheme.highContrast,
                  compact: false,
                  secure: true,
                ),
                const SizedBox(height: 20),
                CsButton(
                  title: sampleTheme.text(SampleText.signIn),
                  dark: sampleTheme.dark,
                  highContrast: sampleTheme.highContrast,
                  compact: false,
                  onPressed: () {
                    Navigator.of(context).pushReplacementNamed('/home');
                  },
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
