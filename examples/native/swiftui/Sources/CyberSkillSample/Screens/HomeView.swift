import SwiftUI

struct WishRow: Identifiable {
  let id: String
  let title: String
  let status: String
}

struct HomeView: View {
  @EnvironmentObject private var preferences: SamplePreferences
  private var colors: SampleColors { preferences.colors }
  var onOpenSettings: () -> Void
  var onSignOut: () -> Void

  private var wishes: [WishRow] { [
    WishRow(id: "1", title: preferences.text(.statusHub), status: preferences.text(.inBuild)),
    WishRow(id: "2", title: preferences.text(.laborContract), status: preferences.text(.open)),
    WishRow(id: "3", title: preferences.text(.investorUpdate), status: preferences.text(.done)),
  ] }

  var body: some View {
    VStack(alignment: .leading, spacing: 16) {
      HStack {
        Text(preferences.text(.wishes))
          .font(SampleFonts.font(size: 24, weight: .extraBold, relativeTo: .title))
          .foregroundStyle(colors.colorTextPrimary)
        Spacer()
        Button(preferences.text(.settings), action: onOpenSettings)
          .foregroundStyle(colors.colorLink)
      }

      Text(preferences.text(.listDescription))
        .font(SampleFonts.font(size: 13))
        .foregroundStyle(colors.colorTextMuted)

      VStack(spacing: 0) {
        ForEach(wishes) { wish in
          HStack {
            VStack(alignment: .leading, spacing: 4) {
              Text(wish.title)
                .font(SampleFonts.font(size: 15, weight: .semibold))
                .foregroundStyle(colors.colorTextPrimary)
              Text(wish.status)
                .font(SampleFonts.font(size: 12))
                .foregroundStyle(colors.colorTextMuted)
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

      Spacer()
      Button(preferences.text(.signOut), action: onSignOut)
        .foregroundStyle(colors.colorSemanticDanger)
    }
    .padding(24)
    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
    .background(colors.colorSurfacePage)
  }
}
