import Foundation

public enum CSQRCodeModel {
  public static func matrix(_ text: String) -> [[Bool]]? {
    let bytes = Array(text.utf8)
    let cap = [1: 17, 2: 32, 3: 53, 4: 78]
    let total = [1: 26, 2: 44, 3: 70, 4: 100]
    let ec = [1: 7, 2: 10, 3: 15, 4: 20]
    let align: [Int: [Int]] = [1: [], 2: [6, 18], 3: [6, 22], 4: [6, 26]]
    guard let version = [1, 2, 3, 4].first(where: { bytes.count <= cap[$0]! }) else { return nil }
    let dataLen = total[version]! - ec[version]!
    var bits: [Int] = []
    func push(_ value: Int, _ count: Int) {
      if count <= 0 { return }
      for shift in stride(from: count - 1, through: 0, by: -1) { bits.append((value >> shift) & 1) }
    }
    push(4, 4)
    push(bytes.count, 8)
    for byte in bytes { push(Int(byte), 8) }
    push(0, min(4, dataLen * 8 - bits.count))
    while bits.count % 8 != 0 { bits.append(0) }
    var codewords: [Int] = []
    var index = 0
    while index < bits.count {
      var word = 0
      for offset in 0..<8 { word = (word << 1) | bits[index + offset] }
      codewords.append(word)
      index += 8
    }
    let pads = [0xec, 0x11]
    var pad = 0
    while codewords.count < dataLen {
      codewords.append(pads[pad % 2])
      pad += 1
    }
    let all = codewords + reedSolomon(codewords, ec[version]!)
    let size = 17 + version * 4
    var grid = Array(repeating: Array<Int?>(repeating: nil, count: size), count: size)
    func set(_ x: Int, _ y: Int, _ value: Int) {
      if y >= 0 && y < size && x >= 0 && x < size { grid[y][x] = value }
    }
    func finder(_ originX: Int, _ originY: Int) {
      for y in -1...7 {
        for x in -1...7 {
          let inside = x >= 0 && x < 7 && y >= 0 && y < 7
          let on = inside && (x == 0 || x == 6 || y == 0 || y == 6 || (x >= 2 && x <= 4 && y >= 2 && y <= 4))
          set(originX + x, originY + y, on ? 1 : 0)
        }
      }
    }
    finder(0, 0)
    finder(size - 7, 0)
    finder(0, size - 7)
    if size > 16 {
      for i in 8..<(size - 8) {
        let on = i % 2 == 0 ? 1 : 0
        if grid[6][i] == nil { grid[6][i] = on }
        if grid[i][6] == nil { grid[i][6] = on }
      }
    }
    for ay in align[version]! {
      for ax in align[version]! {
        if grid[ay][ax] != nil { continue }
        for y in -2...2 {
          for x in -2...2 { set(ax + x, ay + y, max(abs(x), abs(y)) != 1 ? 1 : 0) }
        }
      }
    }
    grid[size - 8][8] = 1
    let format = (0..<15).map { (0x77c4 >> $0) & 1 }
    let first = [[8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 7], [8, 8], [7, 8], [5, 8], [4, 8], [3, 8], [2, 8], [1, 8], [0, 8]]
    let second = [[size - 1, 8], [size - 2, 8], [size - 3, 8], [size - 4, 8], [size - 5, 8], [size - 6, 8], [size - 7, 8], [size - 8, 8], [8, size - 7], [8, size - 6], [8, size - 5], [8, size - 4], [8, size - 3], [8, size - 2], [8, size - 1]]
    for i in 0..<15 {
      grid[first[i][1]][first[i][0]] = format[i]
      grid[second[i][1]][second[i][0]] = format[i]
    }
    var bitIndex = 0
    func bit(_ i: Int) -> Int {
      i < all.count * 8 ? (all[i >> 3] >> (7 - (i & 7))) & 1 : 0
    }
    var column = size - 1
    while column > 0 {
      var col = column
      if col == 6 { col -= 1 }
      for i in 0..<size {
        for dx in 0..<2 {
          let x = col - dx
          let y = ((col + 1) & 2) == 0 ? size - 1 - i : i
          if grid[y][x] != nil { continue }
          var value = bit(bitIndex)
          bitIndex += 1
          if (y + x) % 2 == 0 { value ^= 1 }
          grid[y][x] = value
        }
      }
      column = col - 2
    }
    return grid.map { row in row.map { $0 == 1 } }
  }

  public static func fingerprint(_ text: String) -> (size: Int, dark: Int, hash: UInt32)? {
    guard let grid = matrix(text) else { return nil }
    var hash: UInt32 = 0
    var dark = 0
    for row in grid {
      for cell in row {
        hash = hash &* 33 &+ (cell ? 49 : 48)
        if cell { dark += 1 }
      }
    }
    return (grid.count, dark, hash)
  }

  static func reedSolomon(_ data: [Int], _ ecLength: Int) -> [Int] {
    var exp = Array(repeating: 0, count: 512)
    var log = Array(repeating: 0, count: 256)
    var value = 1
    for i in 0..<255 {
      exp[i] = value
      log[value] = i
      value <<= 1
      if value & 0x100 != 0 { value ^= 0x11d }
    }
    for i in 255..<512 { exp[i] = exp[i - 255] }
    var generator = [1]
    for i in 0..<ecLength {
      var next = Array(repeating: 0, count: generator.count + 1)
      for j in 0..<generator.count {
        next[j] ^= generator[j]
        if generator[j] != 0 { next[j + 1] ^= exp[(log[generator[j]] + i) % 255] }
      }
      generator = next
    }
    var result = data + Array(repeating: 0, count: ecLength)
    for i in 0..<data.count {
      let factor = result[i]
      if factor == 0 { continue }
      for j in 0..<generator.count where generator[j] != 0 {
        result[i + j] ^= exp[(log[generator[j]] + log[factor]) % 255]
      }
    }
    return Array(result.dropFirst(data.count))
  }
}
