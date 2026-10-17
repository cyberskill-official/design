import SwiftUI

struct WishRow: Identifiable {
  let id: String
  let title: String
  let status: String
}

struct HomeView: View {
  @EnvironmentObject private var preferences: SamplePreferences
  @Environment(\.dynamicTypeSize) private var dynamicTypeSize
  private var colors: SampleColors { preferences.colors }
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
        .foregroundStyle(colors.colorTextMuted)
        .fixedSize(horizontal: false, vertical: true)

      VStack(spacing: 0) {
        ForEach(wishes) { wish in
          HStack {
            VStack(alignment: .leading, spacing: 4) {
              Text(wish.title)
                .font(SampleFonts.font(size: 15, weight: .semibold))
                .foregroundStyle(colors.colorTextPrimary)
                .fixedSize(horizontal: false, vertical: true)
              Text(wish.status)
                .font(SampleFonts.font(size: 12))
                .foregroundStyle(colors.colorTextMuted)
                .fixedSize(horizontal: false, vertical: true)
            }
            Spacer()
            Circle()
              .fill(CSTokens.colorBrandOchre)
              .frame(width: 10, height: 10)
          }
          .padding(14)
          .background(colors.colorSurfacePanel)
          Divider().overlay(colors.colorBorderDefault)
        }
      }
      .clipShape(RoundedRectangle(cornerRadius: 12))
      .overlay(
        RoundedRectangle(cornerRadius: 12)
          .stroke(colors.colorBorderDefault, lineWidth: 1)
      )

    }
    .padding(24)
    .frame(maxWidth: .infinity, alignment: .topLeading)
    }
    .safeAreaInset(edge: .bottom) {
      Button(action: onSignOut) {
        Text(preferences.text(.signOut))
          .fixedSize(horizontal: false, vertical: true)
          .frame(maxWidth: .infinity, minHeight: CSTokens.componentButtonMdMinHeight, alignment: .leading)
          .contentShape(Rectangle())
      }
      .buttonStyle(.plain)
      .foregroundStyle(colors.colorSemanticDangerText)
      .padding(24)
      .background(colors.colorSurfacePage)
    }
    .background(colors.colorSurfacePage)
  }

  private var heading: some View {
    Text(preferences.text(.wishes))
      .font(SampleFonts.font(size: 24, weight: .extraBold, relativeTo: .title))
      .foregroundStyle(colors.colorTextPrimary)
      .fixedSize(horizontal: false, vertical: true)
  }

  private var settingsButton: some View {
    Button(action: onOpenSettings) {
      Text(preferences.text(.settings))
        .fixedSize(horizontal: false, vertical: true)
        .frame(minWidth: CSTokens.componentButtonMdMinHeight, minHeight: CSTokens.componentButtonMdMinHeight)
        .contentShape(Rectangle())
    }
    .buttonStyle(.plain)
    .foregroundStyle(colors.colorLink)
  }
}
