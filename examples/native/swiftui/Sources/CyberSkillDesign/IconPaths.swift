import SwiftUI

public enum CSIconMark: Equatable {
  case path(String)
  case circle(cx: Double, cy: Double, r: Double)
  case rect(x: Double, y: Double, width: Double, height: Double, rx: Double)
}

public enum CSIconPaths {
  public static let glyphs: [String: [CSIconMark]] = [
    "close": [.path("M6 6l12 12M18 6L6 18")],
    "sun": [.circle(cx: 12, cy: 12, r: 4), .path("M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4")],
    "moon": [.path("M20 13.5A8 8 0 1 1 10.5 4a6.5 6.5 0 0 0 9.5 9.5z")],
    "arrow-right": [.path("M5 12h14M13 6l6 6-6 6")],
    "check": [.path("M4 12.5l5 5 11-11")],
    "sparkle": [.path("M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6z")],
    "chat": [.path("M4 5h16v11H8l-4 4z")],
    "sound-on": [.path("M5 9v6h3l4 4V5L8 9z"), .path("M15 9.5a4 4 0 0 1 0 5M17.6 7a8 8 0 0 1 0 10")],
    "sound-off": [.path("M5 9v6h3l4 4V5L8 9z"), .path("M16 9.5l4.5 5M20.5 9.5l-4.5 5")],
    "search": [.circle(cx: 11, cy: 11, r: 6), .path("M20 20l-4.2-4.2")],
    "sliders": [.path("M4 6h16M4 12h16M4 18h16"), .circle(cx: 9, cy: 6, r: 2), .circle(cx: 15, cy: 12, r: 2), .circle(cx: 7, cy: 18, r: 2)],
    "upload": [.path("M12 15V4M7 8.5L12 4l5 4.5"), .path("M4 19h16")],
    "download": [.path("M12 4v11M7 10.5L12 15l5-4.5"), .path("M4 19h16")],
    "calendar": [.rect(x: 4, y: 6, width: 16, height: 14, rx: 2), .path("M4 10.5h16M8 3.5v4M16 3.5v4")],
    "user": [.circle(cx: 12, cy: 8.5, r: 3.5), .path("M5 19.5c1.6-3.4 4-5 7-5s5.4 1.6 7 5")],
    "plus": [.path("M12 5v14M5 12h14")],
    "trash": [.path("M5 7h14M9.5 7V4.5h5V7"), .path("M7 7l.8 12.5h8.4L17 7M10 11v5M14 11v5")],
    "external": [.path("M14 4h6v6M20 4l-8 8"), .path("M18 13v6H5V6h6")],
    "menu": [.path("M4 7h16M4 12h16M4 17h16")],
    "chevron-down": [.path("M6 9l6 6 6-6")],
    "chevron-up": [.path("M6 15l6-6 6 6")],
    "chevron-left": [.path("M15 6l-6 6 6 6")],
    "chevron-right": [.path("M9 6l6 6-6 6")],
    "edit": [.path("M4 20h4L18.5 9.5a2.12 2.12 0 0 0-3-3L5 17z"), .path("M13.5 6.5l3 3")],
    "copy": [.rect(x: 8, y: 8, width: 12, height: 12, rx: 2), .path("M4 16V6a2 2 0 0 1 2-2h10")],
    "info": [.circle(cx: 12, cy: 12, r: 9), .path("M12 11v5M12 7.75v.01")],
    "alert-triangle": [.path("M12 3.5l9 16H3z"), .path("M12 10v4M12 17.5v.01")],
    "pin": [.path("M12 21v-7"), .path("M8.5 3.5h7l-1.2 6.5h2.7L12 14.5 6.999 10h2.7z")],
  ]

  public static func resolved(_ name: String) -> String {
    glyphs[name] == nil ? "sparkle" : name
  }

  public static func path(data: String) -> Path {
    var path = Path()
    append(data: data, to: &path)
    return path
  }

  public static func path(for name: String) -> Path {
    var path = Path()
    for mark in glyphs[resolved(name)] ?? glyphs["sparkle"]! {
      switch mark {
      case .path(let data):
        append(data: data, to: &path)
      case .circle(let cx, let cy, let r):
        path.addEllipse(in: CGRect(x: cx - r, y: cy - r, width: r * 2, height: r * 2))
      case .rect(let x, let y, let width, let height, let rx):
        path.addRoundedRect(in: CGRect(x: x, y: y, width: width, height: height), cornerSize: CGSize(width: rx, height: rx))
      }
    }
    return path
  }

  public static func bounds(for name: String) -> CGRect {
    path(for: name).boundingRect
  }

  static func append(data: String, to path: inout Path) {
    let chars = Array(data)
    var index = 0
    var command: Character = "M"
    var cx = 0.0
    var cy = 0.0
    var startX = 0.0
    var startY = 0.0
    func skip() {
      while index < chars.count, " \n\t,".contains(chars[index]) { index += 1 }
    }
    func number() -> Double? {
      skip()
      guard index < chars.count else { return nil }
      if chars[index].isLetter { return nil }
      var token = ""
      if chars[index] == "+" || chars[index] == "-" { token.append(chars[index]); index += 1 }
      var digits = false
      var dot = false
      while index < chars.count {
        let char = chars[index]
        if char.isNumber { token.append(char); digits = true; index += 1 }
        else if char == "." && !dot { token.append(char); dot = true; index += 1 }
        else { break }
      }
      guard digits else { return nil }
      return Double(token)
    }
    while index < chars.count {
      skip()
      guard index < chars.count else { break }
      if chars[index].isLetter {
        command = chars[index]
        index += 1
      }
      switch command {
      case "M", "L":
        guard let x = number(), let y = number() else { return }
        if command == "M" { path.move(to: CGPoint(x: x, y: y)); startX = x; startY = y; command = "L" }
        else { path.addLine(to: CGPoint(x: x, y: y)) }
        cx = x; cy = y
      case "m", "l":
        guard let dx = number(), let dy = number() else { return }
        let x = cx + dx
        let y = cy + dy
        if command == "m" { path.move(to: CGPoint(x: x, y: y)); startX = x; startY = y; command = "l" }
        else { path.addLine(to: CGPoint(x: x, y: y)) }
        cx = x; cy = y
      case "H":
        guard let x = number() else { return }
        path.addLine(to: CGPoint(x: x, y: cy)); cx = x
      case "h":
        guard let dx = number() else { return }
        cx += dx; path.addLine(to: CGPoint(x: cx, y: cy))
      case "V":
        guard let y = number() else { return }
        path.addLine(to: CGPoint(x: cx, y: y)); cy = y
      case "v":
        guard let dy = number() else { return }
        cy += dy; path.addLine(to: CGPoint(x: cx, y: cy))
      case "Z", "z":
        path.closeSubpath(); cx = startX; cy = startY
        command = "M"
      case "A", "a":
        guard let rx = number(), let ry = number(), let _ = number(), let large = number(), let sweep = number(), let ex = number(), let ey = number() else { return }
        let x = command == "a" ? cx + ex : ex
        let y = command == "a" ? cy + ey : ey
        addArc(from: CGPoint(x: cx, y: cy), to: CGPoint(x: x, y: y), rx: rx, ry: ry, large: large != 0, sweep: sweep != 0, path: &path)
        cx = x; cy = y
      case "C", "c":
        guard let x1 = number(), let y1 = number(), let x2 = number(), let y2 = number(), let ex = number(), let ey = number() else { return }
        let absolute = command == "C"
        path.addCurve(to: CGPoint(x: absolute ? ex : cx + ex, y: absolute ? ey : cy + ey), control1: CGPoint(x: absolute ? x1 : cx + x1, y: absolute ? y1 : cy + y1), control2: CGPoint(x: absolute ? x2 : cx + x2, y: absolute ? y2 : cy + y2))
        cx = absolute ? ex : cx + ex
        cy = absolute ? ey : cy + ey
      case "S", "s":
        guard let x2 = number(), let y2 = number(), let ex = number(), let ey = number() else { return }
        let absolute = command == "S"
        path.addQuadCurve(to: CGPoint(x: absolute ? ex : cx + ex, y: absolute ? ey : cy + ey), control: CGPoint(x: absolute ? x2 : cx + x2, y: absolute ? y2 : cy + y2))
        cx = absolute ? ex : cx + ex
        cy = absolute ? ey : cy + ey
      default:
        return
      }
    }
  }

  static func addArc(from start: CGPoint, to end: CGPoint, rx: Double, ry: Double, large: Bool, sweep: Bool, path: inout Path) {
    var rx = abs(rx)
    var ry = abs(ry)
    if rx == 0 || ry == 0 || start == end {
      path.addLine(to: end)
      return
    }
    let dx = (start.x - end.x) / 2
    let dy = (start.y - end.y) / 2
    var rx2 = rx * rx
    var ry2 = ry * ry
    let lambda = dx * dx / rx2 + dy * dy / ry2
    if lambda > 1 {
      let scale = lambda.squareRoot()
      rx *= scale
      ry *= scale
      rx2 = rx * rx
      ry2 = ry * ry
    }
    let sign = large == sweep ? -1.0 : 1.0
    let numer = max(0, rx2 * ry2 - rx2 * dy * dy - ry2 * dx * dx)
    let denom = rx2 * dy * dy + ry2 * dx * dx
    let coef = sign * (denom == 0 ? 0 : (numer / denom).squareRoot())
    let cxp = coef * rx * dy / ry
    let cyp = coef * -ry * dx / rx
    let center = CGPoint(x: cxp + (start.x + end.x) / 2, y: cyp + (start.y + end.y) / 2)
    let startVector = CGPoint(x: (dx - cxp) / rx, y: (dy - cyp) / ry)
    let endVector = CGPoint(x: (-dx - cxp) / rx, y: (-dy - cyp) / ry)
    let startAngle = atan2(startVector.y, startVector.x)
    var delta = atan2(startVector.x * endVector.y - startVector.y * endVector.x, startVector.x * endVector.x + startVector.y * endVector.y)
    if !sweep, delta > 0 { delta -= 2 * .pi }
    if sweep, delta < 0 { delta += 2 * .pi }
    path.addArc(center: center, radius: max(rx, ry), startAngle: Angle(radians: startAngle), endAngle: Angle(radians: startAngle + delta), clockwise: sweep)
  }
}

struct CSIconShape: Shape {
  let name: String

  func path(in rect: CGRect) -> Path {
    let source = CSIconPaths.path(for: name)
    let scale = min(rect.width, rect.height) / 24
    let transform = CGAffineTransform(scaleX: scale, y: scale)
    return source.applying(transform)
  }
}
