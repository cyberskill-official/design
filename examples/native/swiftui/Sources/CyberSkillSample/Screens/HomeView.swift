import SwiftUI
import CyberSkillDesign

struct WishRow: Identifiable {
  let id: String
  let title: String
  let status: String
}

struct HomeView: View {
  @EnvironmentObject private var preferences: SamplePreferences
  @Environment(\.dynamicTypeSize) private var dynamicTypeSize
  private var pack: CSTokenModePack { CSControlMode.pack(dark: preferences.dark, highContrast: preferences.contrast.resolve(systemHigh: preferences.systemHighContrast), compact: false) }
  var onOpenSettings: () -> Void
  var onSignOut: () -> Void

  private var wishes: [WishRow] { [
    WishRow(id: "1", title: preferences.text(.statusHub), status: preferences.text(.inBuild)),
    WishRow(id: "2", title: preferences.text(.laborContract), status: preferences.text(.open)),
    WishRow(id: "3", title: preferences.text(.investorUpdate), status: preferences.text(.done)),
  ] }

  var body: some View {
    ScrollView {
    VStack(alignment: .leading, spacing: 16) {
      if dynamicTypeSize.isAccessibilitySize {
        VStack(alignment: .leading, spacing: 8) {
          heading
          settingsButton
        }
      } else {
      HStack {
        heading
        Spacer()
        settingsButton
      }
      }

      Text(preferences.text(.listDescription))
        .font(SampleFonts.font(size: 13))
        .foregroundStyle(pack.mutedColor)
        .fixedSize(horizontal: false, vertical: true)

      CSCard(dark: preferences.dark, highContrast: preferences.contrast.resolve(systemHigh: preferences.systemHighContrast), compact: false) {
        ForEach(wishes) { wish in
          CSListRow(title: wish.title, subtitle: wish.status, dark: preferences.dark, highContrast: preferences.contrast.resolve(systemHigh: preferences.systemHighContrast), compact: false)
          CSDivider(dark: preferences.dark, highContrast: preferences.contrast.resolve(systemHigh: preferences.systemHighContrast), compact: false)
        }
      }

    }
    .padding(24)
    .frame(maxWidth: .infinity, alignment: .topLeading)
    }
    .safeAreaInset(edge: .bottom) {
      CSTextButton(title: preferences.text(.signOut), role: .danger, dark: preferences.dark, highContrast: preferences.contrast.resolve(systemHigh: preferences.systemHighContrast), compact: false, expand: true, action: onSignOut)
      .padding(24)
      .background(pack.pageColor)
    }
    .background(pack.pageColor)
  }

  private var heading: some View {
    Text(preferences.text(.wishes))
      .font(SampleFonts.font(size: 24, weight: .extraBold, relativeTo: .title))
        .foregroundStyle(pack.primaryTextColor)
      .fixedSize(horizontal: false, vertical: true)
  }

  private var settingsButton: some View {
    CSTextButton(title: preferences.text(.settings), dark: preferences.dark, highContrast: preferences.contrast.resolve(systemHigh: preferences.systemHighContrast), compact: false, action: onOpenSettings)
  }
}
