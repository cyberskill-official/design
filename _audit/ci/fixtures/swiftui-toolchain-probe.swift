import SwiftUI
struct Probe: View {
  @State private var value = false
  var body: some View { Text(value ? "On" : "Off") }
}
