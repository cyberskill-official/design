package world.cyberskill.design

fun csQrMatrix(text: String): List<List<Boolean>>? {
  val bytes = text.encodeToByteArray().map { it.toInt() and 0xFF }
  val cap = mapOf(1 to 17, 2 to 32, 3 to 53, 4 to 78)
  val total = mapOf(1 to 26, 2 to 44, 3 to 70, 4 to 100)
  val ec = mapOf(1 to 7, 2 to 10, 3 to 15, 4 to 20)
  val align = mapOf(1 to intArrayOf(), 2 to intArrayOf(6, 18), 3 to intArrayOf(6, 22), 4 to intArrayOf(6, 26))
  val version = (1..4).firstOrNull { bytes.size <= cap.getValue(it) } ?: return null
  val dataLen = total.getValue(version) - ec.getValue(version)
  val bits = mutableListOf<Int>()
  fun push(value: Int, count: Int) {
    if (count <= 0) return
    for (shift in count - 1 downTo 0) bits.add((value shr shift) and 1)
  }
  push(4, 4)
  push(bytes.size, 8)
  for (byte in bytes) push(byte, 8)
  push(0, minOf(4, dataLen * 8 - bits.size))
  while (bits.size % 8 != 0) bits.add(0)
  val codewords = mutableListOf<Int>()
  var index = 0
  while (index < bits.size) {
    var word = 0
    for (offset in 0 until 8) word = (word shl 1) or bits[index + offset]
    codewords.add(word)
    index += 8
  }
  val pads = intArrayOf(0xec, 0x11)
  var pad = 0
  while (codewords.size < dataLen) codewords.add(pads[pad++ % 2])
  val all = codewords + csQrReedSolomon(codewords, ec.getValue(version))
  val size = 17 + version * 4
  val grid = MutableList(size) { MutableList<Int?>(size) { null } }
  fun set(x: Int, y: Int, value: Int) {
    if (y in 0 until size && x in 0 until size) grid[y][x] = value
  }
  fun finder(originX: Int, originY: Int) {
    for (y in -1..7) for (x in -1..7) {
      val inside = x in 0..6 && y in 0..6
      val on = inside && (x == 0 || x == 6 || y == 0 || y == 6 || (x in 2..4 && y in 2..4))
      set(originX + x, originY + y, if (on) 1 else 0)
    }
  }
  finder(0, 0)
  finder(size - 7, 0)
  finder(0, size - 7)
  for (i in 8 until size - 8) {
    val on = if (i % 2 == 0) 1 else 0
    if (grid[6][i] == null) grid[6][i] = on
    if (grid[i][6] == null) grid[i][6] = on
  }
  for (ay in align.getValue(version)) for (ax in align.getValue(version)) {
    if (grid[ay][ax] != null) continue
    for (y in -2..2) for (x in -2..2) set(ax + x, ay + y, if (maxOf(kotlin.math.abs(x), kotlin.math.abs(y)) == 1) 0 else 1)
  }
  grid[size - 8][8] = 1
  val first = arrayOf(intArrayOf(8, 0), intArrayOf(8, 1), intArrayOf(8, 2), intArrayOf(8, 3), intArrayOf(8, 4), intArrayOf(8, 5), intArrayOf(8, 7), intArrayOf(8, 8), intArrayOf(7, 8), intArrayOf(5, 8), intArrayOf(4, 8), intArrayOf(3, 8), intArrayOf(2, 8), intArrayOf(1, 8), intArrayOf(0, 8))
  val second = arrayOf(intArrayOf(size - 1, 8), intArrayOf(size - 2, 8), intArrayOf(size - 3, 8), intArrayOf(size - 4, 8), intArrayOf(size - 5, 8), intArrayOf(size - 6, 8), intArrayOf(size - 7, 8), intArrayOf(size - 8, 8), intArrayOf(8, size - 7), intArrayOf(8, size - 6), intArrayOf(8, size - 5), intArrayOf(8, size - 4), intArrayOf(8, size - 3), intArrayOf(8, size - 2), intArrayOf(8, size - 1))
  for (i in 0 until 15) {
    val bit = (0x77c4 shr i) and 1
    grid[first[i][1]][first[i][0]] = bit
    grid[second[i][1]][second[i][0]] = bit
  }
  var bitIndex = 0
  fun bit(i: Int) = if (i < all.size * 8) (all[i shr 3] shr (7 - (i and 7))) and 1 else 0
  var column = size - 1
  while (column > 0) {
    var col = column
    if (col == 6) col -= 1
    for (i in 0 until size) for (dx in 0 until 2) {
      val x = col - dx
      val y = if (((col + 1) and 2) == 0) size - 1 - i else i
      if (grid[y][x] != null) continue
      var value = bit(bitIndex)
      bitIndex += 1
      if ((y + x) % 2 == 0) value = value xor 1
      grid[y][x] = value
    }
    column = col - 2
  }
  return grid.map { row -> row.map { it == 1 } }
}

private fun csQrReedSolomon(data: List<Int>, ecLength: Int): List<Int> {
  val exp = IntArray(512)
  val log = IntArray(256)
  var value = 1
  for (i in 0 until 255) {
    exp[i] = value
    log[value] = i
    value = value shl 1
    if (value and 0x100 != 0) value = value xor 0x11d
  }
  for (i in 255 until 512) exp[i] = exp[i - 255]
  var generator = mutableListOf(1)
  for (i in 0 until ecLength) {
    val next = IntArray(generator.size + 1)
    for (j in generator.indices) {
      next[j] = next[j] xor generator[j]
      if (generator[j] != 0) next[j + 1] = next[j + 1] xor exp[(log[generator[j]] + i) % 255]
    }
    generator = next.toMutableList()
  }
  val result = (data + List(ecLength) { 0 }).toMutableList()
  for (i in data.indices) {
    val factor = result[i]
    if (factor == 0) continue
    for (j in generator.indices) if (generator[j] != 0) result[i + j] = result[i + j] xor exp[(log[generator[j]] + log[factor]) % 255]
  }
  return result.drop(data.size)
}
