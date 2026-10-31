import 'dart:convert';

List<List<bool>>? csQrMatrix(String text) {
  final bytes = utf8.encode(text);
  const cap = {1: 17, 2: 32, 3: 53, 4: 78};
  const total = {1: 26, 2: 44, 3: 70, 4: 100};
  const ec = {1: 7, 2: 10, 3: 15, 4: 20};
  const align = {1: <int>[], 2: [6, 18], 3: [6, 22], 4: [6, 26]};
  var version = 0;
  for (final cand in [1, 2, 3, 4]) {
    if (bytes.length <= cap[cand]!) {
      version = cand;
      break;
    }
  }
  if (version == 0) return null;
  final dataLen = total[version]! - ec[version]!;
  final bits = <int>[];
  void push(int value, int count) {
    if (count <= 0) return;
    for (var shift = count - 1; shift >= 0; shift--) {
      bits.add((value >> shift) & 1);
    }
  }

  push(4, 4);
  push(bytes.length, 8);
  for (final byte in bytes) {
    push(byte, 8);
  }
  push(0, dataLen * 8 - bits.length < 4 ? dataLen * 8 - bits.length : 4);
  while (bits.length % 8 != 0) {
    bits.add(0);
  }
  final codewords = <int>[];
  for (var index = 0; index < bits.length; index += 8) {
    var word = 0;
    for (var offset = 0; offset < 8; offset++) {
      word = (word << 1) | bits[index + offset];
    }
    codewords.add(word);
  }
  const pads = [0xec, 0x11];
  var pad = 0;
  while (codewords.length < dataLen) {
    codewords.add(pads[pad % 2]);
    pad++;
  }
  final all = [...codewords, ..._reedSolomon(codewords, ec[version]!)];
  final size = 17 + version * 4;
  final grid = List<List<int?>>.generate(size, (_) => List<int?>.filled(size, null));
  void set(int x, int y, int value) {
    if (y >= 0 && y < size && x >= 0 && x < size) grid[y][x] = value;
  }

  void finder(int originX, int originY) {
    for (var y = -1; y <= 7; y++) {
      for (var x = -1; x <= 7; x++) {
        final inside = x >= 0 && x < 7 && y >= 0 && y < 7;
        final on = inside && (x == 0 || x == 6 || y == 0 || y == 6 || (x >= 2 && x <= 4 && y >= 2 && y <= 4));
        set(originX + x, originY + y, on ? 1 : 0);
      }
    }
  }

  finder(0, 0);
  finder(size - 7, 0);
  finder(0, size - 7);
  for (var i = 8; i < size - 8; i++) {
    final on = i % 2 == 0 ? 1 : 0;
    if (grid[6][i] == null) grid[6][i] = on;
    if (grid[i][6] == null) grid[i][6] = on;
  }
  for (final ay in align[version]!) {
    for (final ax in align[version]!) {
      if (grid[ay][ax] != null) continue;
      for (var y = -2; y <= 2; y++) {
        for (var x = -2; x <= 2; x++) {
          final distance = x.abs() > y.abs() ? x.abs() : y.abs();
          set(ax + x, ay + y, distance == 1 ? 0 : 1);
        }
      }
    }
  }
  grid[size - 8][8] = 1;
  final first = [
    [8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 7], [8, 8], [7, 8], [5, 8], [4, 8], [3, 8], [2, 8], [1, 8], [0, 8]
  ];
  final second = [
    [size - 1, 8], [size - 2, 8], [size - 3, 8], [size - 4, 8], [size - 5, 8], [size - 6, 8], [size - 7, 8], [size - 8, 8],
    [8, size - 7], [8, size - 6], [8, size - 5], [8, size - 4], [8, size - 3], [8, size - 2], [8, size - 1]
  ];
  for (var i = 0; i < 15; i++) {
    final bit = (0x77c4 >> i) & 1;
    grid[first[i][1]][first[i][0]] = bit;
    grid[second[i][1]][second[i][0]] = bit;
  }
  var bitIndex = 0;
  int bitAt(int i) => i < all.length * 8 ? (all[i >> 3] >> (7 - (i & 7))) & 1 : 0;
  var column = size - 1;
  while (column > 0) {
    var col = column;
    if (col == 6) col -= 1;
    for (var i = 0; i < size; i++) {
      for (var dx = 0; dx < 2; dx++) {
        final x = col - dx;
        final y = ((col + 1) & 2) == 0 ? size - 1 - i : i;
        if (grid[y][x] != null) continue;
        var value = bitAt(bitIndex);
        bitIndex++;
        if ((y + x) % 2 == 0) value ^= 1;
        grid[y][x] = value;
      }
    }
    column = col - 2;
  }
  return [for (final row in grid) [for (final cell in row) cell == 1]];
}

List<int> _reedSolomon(List<int> data, int ecLength) {
  final exp = List<int>.filled(512, 0);
  final log = List<int>.filled(256, 0);
  var value = 1;
  for (var i = 0; i < 255; i++) {
    exp[i] = value;
    log[value] = i;
    value <<= 1;
    if (value & 0x100 != 0) value ^= 0x11d;
  }
  for (var i = 255; i < 512; i++) {
    exp[i] = exp[i - 255];
  }
  var generator = <int>[1];
  for (var i = 0; i < ecLength; i++) {
    final next = List<int>.filled(generator.length + 1, 0);
    for (var j = 0; j < generator.length; j++) {
      next[j] ^= generator[j];
      if (generator[j] != 0) next[j + 1] ^= exp[(log[generator[j]] + i) % 255];
    }
    generator = next;
  }
  final result = <int>[...data, ...List<int>.filled(ecLength, 0)];
  for (var i = 0; i < data.length; i++) {
    final factor = result[i];
    if (factor == 0) continue;
    for (var j = 0; j < generator.length; j++) {
      if (generator[j] != 0) result[i + j] ^= exp[(log[generator[j]] + log[factor]) % 255];
    }
  }
  return result.sublist(data.length);
}
