import UIKit
import SwiftUI

final class ProbeAppDelegate: UIResponder, UIApplicationDelegate {
  func application(_ application: UIApplication, configurationForConnecting session: UISceneSession, options: UIScene.ConnectionOptions) -> UISceneConfiguration {
    let configuration = UISceneConfiguration(name: "Probe", sessionRole: session.role)
    configuration.delegateClass = ProbeSceneDelegate.self
    return configuration
  }
}

final class ProbeSceneDelegate: UIResponder, UIWindowSceneDelegate {
  var window: UIWindow?
  func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options: UIScene.ConnectionOptions) {
    guard let scene = scene as? UIWindowScene else { return }
    let window = UIWindow(windowScene: scene)
    let container = UIViewController()
    window.rootViewController = container
    self.window = window
    window.makeKeyAndVisible()
    Task { @MainActor in
      do { try await capture(in: container) }
      catch {
        let output = URL(fileURLWithPath: CommandLine.arguments[1])
        try? String(describing: error).write(to: output.appendingPathComponent("failure.txt"), atomically: true, encoding: .utf8)
      }
    }
  }

  func scrollViews(in view: UIView) -> [UIScrollView] {
    (view as? UIScrollView).map { [$0] } ?? view.subviews.flatMap { scrollViews(in: $0) }
  }

  @MainActor func capture(in container: UIViewController) async throws {
    let output = URL(fileURLWithPath: CommandLine.arguments[1])
    try FileManager.default.createDirectory(at: output, withIntermediateDirectories: true)
    var rows: [[String: Any]] = []
    for screen in ["font-control", "sign-in", "home", "settings"] {
      for dark in [false, true] {
        for language in SampleLanguage.allCases {
          for large in [false, true] {
            for width in [360.0, 800.0] {
              let height = width == 360 ? 800.0 : 600.0
              let preferences = SamplePreferences()
              preferences.dark = dark
              preferences.language = language
              let content: AnyView
              switch screen {
              case "home": content = AnyView(HomeView(onOpenSettings: {}, onSignOut: {}))
              case "settings": content = AnyView(SettingsView(onSignOut: {}))
              case "sign-in": content = AnyView(SignInView(onSuccess: {}))
              default: content = AnyView(Text("Be Vietnam Pro / Tiếng Việt").font(SampleFonts.font(size: 16)).fixedSize(horizontal: false, vertical: true))
              }
              let root = content.environmentObject(preferences)
                .environment(\.locale, language.locale)
                .environment(\.colorScheme, dark ? .dark : .light)
                .environment(\.dynamicTypeSize, large ? .accessibility5 : .large)
                .font(SampleFonts.font(size: CSTokens.fontSizeBase))
                .tint(preferences.colors.colorLink)
              let host = UIHostingController(rootView: root)
              host.safeAreaRegions = []
              host.overrideUserInterfaceStyle = dark ? .dark : .light
              container.addChild(host)
              container.view.addSubview(host.view)
              host.didMove(toParent: container)
              host.view.frame = CGRect(x: 0, y: 0, width: width, height: height)
              host.view.layoutIfNeeded()
              try await Task.sleep(nanoseconds: 150_000_000)
              host.view.layoutIfNeeded()
              let fitting = host.sizeThatFits(in: CGSize(width: width, height: height))
              let format = UIGraphicsImageRendererFormat()
              format.scale = 1
              var drew = false
              let rendered = UIGraphicsImageRenderer(size: CGSize(width: width, height: height), format: format).image { _ in
                drew = host.view.drawHierarchy(in: host.view.bounds, afterScreenUpdates: true)
              }
              guard drew, let png = rendered.pngData() else { throw NSError(domain: "ProbeDraw", code: 1) }
              let key = "\(screen)-\(dark ? "dark" : "light")-\(language)-\(large ? "a11y5" : "large")-\(Int(width))"
              try png.write(to: output.appendingPathComponent(key + ".png"))
              let scrolls = scrollViews(in: host.view)
              rows.append(["key": key, "screen": screen, "dark": dark,
                "language": language.rawValue, "dynamicType": large ? "accessibility5" : "large",
                "width": width, "height": height, "fittingWidth": Double(fitting.width),
                "fittingHeight": Double(fitting.height), "pngBytes": png.count, "drawSucceeded": drew, "snapshot": "top",
                "scrollViews": scrolls.map { ["contentHeight": Double($0.contentSize.height), "viewportHeight": Double($0.bounds.height)] }])
              if screen != "font-control" {
                if screen != "sign-in" && scrolls.isEmpty { throw NSError(domain: "ProbeMissingScroll", code: 2) }
                for scroll in scrolls {
                  scroll.setContentOffset(CGPoint(x: 0, y: max(0, scroll.contentSize.height - scroll.bounds.height + scroll.adjustedContentInset.bottom)), animated: false)
                }
                try await Task.sleep(nanoseconds: 100_000_000)
                let bottom = UIGraphicsImageRenderer(size: CGSize(width: width, height: height), format: format).image { _ in
                  host.view.drawHierarchy(in: host.view.bounds, afterScreenUpdates: true)
                }
                guard let bottomPNG = bottom.pngData() else { throw NSError(domain: "ProbeBottomPNG", code: 3) }
                try bottomPNG.write(to: output.appendingPathComponent(key + "-bottom.png"))
                rows.append(["key": key + "-bottom", "screen": screen, "dark": dark, "language": language.rawValue,
                  "dynamicType": large ? "accessibility5" : "large", "width": width, "height": height, "snapshot": "bottom",
                  "scrollViews": scrolls.map { ["contentHeight": Double($0.contentSize.height), "viewportHeight": Double($0.bounds.height), "offsetY": Double($0.contentOffset.y)] }])
              }
              host.willMove(toParent: nil)
              host.view.removeFromSuperview()
              host.removeFromParent()
            }
          }
        }
      }
    }
    try JSONSerialization.data(withJSONObject: rows, options: [.prettyPrinted, .sortedKeys])
      .write(to: output.appendingPathComponent("render-contexts.json"))
  }
}

UIApplicationMain(CommandLine.argc, CommandLine.unsafeArgv, nil, NSStringFromClass(ProbeAppDelegate.self))
