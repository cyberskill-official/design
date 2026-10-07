import SwiftUI

/// Multi-screen CyberSkill sample host: Sign in → Home (wish list) → Settings.
/// Uses generated `CSTokens` (synced from tokens/native/CSTokens.swift).
@main
struct CyberSkillSampleApp: App {
  var body: some Scene {
    WindowGroup {
      RootView()
    }
  }
}

enum AppScreen: Hashable {
  case signIn
  case home
  case settings
}

struct RootView: View {
  @StateObject private var preferences = SamplePreferences()
  @State private var path: [AppScreen] = []
  @State private var signedIn = false

  var body: some View {
    NavigationStack(path: $path) {
      Group {
        if signedIn {
          HomeView(
            onOpenSettings: { path.append(.settings) },
            onSignOut: {
              signedIn = false
              path = []
            }
          )
        } else {
          SignInView(onSuccess: {
            signedIn = true
            path = []
          })
        }
      }
      .navigationDestination(for: AppScreen.self) { screen in
        switch screen {
        case .signIn:
          SignInView(onSuccess: { signedIn = true; path = [] })
        case .home:
          HomeView(onOpenSettings: { path.append(.settings) }, onSignOut: { signedIn = false; path = [] })
        case .settings:
          SettingsView(onSignOut: { signedIn = false; path = [] })
        }
      }
    }
    .environmentObject(preferences)
    .environment(\.locale, preferences.language.locale)
    .preferredColorScheme(preferences.dark ? .dark : .light)
    .tint(preferences.colors.colorLink)
    .frame(minWidth: 360, minHeight: 520)
  }
}
