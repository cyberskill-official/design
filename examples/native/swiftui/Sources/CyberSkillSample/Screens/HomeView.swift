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

  private let wishes: [WishRow] = [
    WishRow(id: "1", title: "Status hub refresh", status: "In build"),
    WishRow(id: "2", title: "VN labor contract pack", status: "Open"),
    WishRow(id: "3", title: "BOD investor update", status: "Done"),
  ]

  var body: some View {
    VStack(alignment: .leading, spacing: 16) {
      HStack {
        Text("Wishes")
          .font(.system(size: 24, weight: .heavy))
          .foregroundStyle(colors.colorTextPrimary)
        Spacer()
        Button("Settings", action: onOpenSettings)
          .foregroundStyle(colors.colorLink)
      }

      Text("List screen — token colours only, no hand hex.")
        .font(.system(size: 13))
        .foregroundStyle(colors.colorTextMuted)

      VStack(spacing: 0) {
        ForEach(wishes) { wish in
          HStack {
            VStack(alignment: .leading, spacing: 4) {
              Text(wish.title)
                .font(.system(size: 15, weight: .semibold))
                .foregroundStyle(colors.colorTextPrimary)
              Text(wish.status)
                .font(.system(size: 12))
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
      Button("Sign out", action: onSignOut)
        .foregroundStyle(colors.colorSemanticDanger)
    }
    .padding(24)
    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
    .background(colors.colorSurfacePage)
  }
}
