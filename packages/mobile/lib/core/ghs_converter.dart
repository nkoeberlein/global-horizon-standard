/// GHS - Global Horizon Standard Converter (Dart port)
///
/// Converts Gregorian dates to the GHS calendar system:
/// - Era:      Human Era (HE) — Gregorian year + 10,000
/// - Calendar: 13 months × 28 days = 364 days/year
/// - Time:     @Beats (decimal time, 1 day = 1,000 beats, anchored to UTC)
/// - Leap:     Aurora Week — 71 full weeks inserted per 400-year cycle
/// - Epoch:    12000.01.01 = Unix day 11,036 (March equinox of 2000, UTC)
///
/// Ported from: packages/core/src (epoch-based implementation)

const List<String> monthNamesGhs = [
  'March', 'April', 'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December', 'January', 'February', 'Luna',
];

const List<String> weekdaysGhs = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
];

const int _dayMs = 86400000;
const int _daysPerNormalYear = 364;

/// Minimum and maximum Human Era years whose every instant is a valid
/// JavaScript Date (within ±8.64e15 ms of the Unix epoch).
const int minEra = -261820;
const int maxEra = 285759;

/// Phase constant calibrating the 400-year Aurora cycle so year starts stay
/// centered on the March equinox (±3.5 days) from the anchor
/// `12000.01.01 = Unix day 11,036`.
const int epsilon = 286;

/// GHS year 12000 HE begins on Unix day 11,036 (2000-03-20T00:00:00Z, the UTC
/// day of the March equinox of 2000 — a Monday). Because every GHS year is a
/// multiple of 7 days (364 or 371), GHS weekdays coincide with the existing
/// seven-day week on every day, forever. Year starts stay within 17–25 March;
/// e.g. 12026.01.01 = 2026-03-23.
const int epochYearHe = 12000;
const int epochUnixDay = 11036;
const int epochMs = epochUnixDay * _dayMs;

/// Years per leap cycle.
const int cycleYears = 400;

/// Days per 400-year cycle: 400 × 364 + 71 × 7 = 146,097 (matches Gregorian).
const int cycleDays = 146097;

/// Validates that [era] is within the supported Human Era range [minEra]…[maxEra].
void assertEra(int era) {
  if (era < minEra || era > maxEra) {
    throw RangeError('Invalid era: $era. Must be an integer in $minEra…$maxEra.');
  }
}

/// Formats a Human Era year for machine-readable output.
///
/// spec/timestamp-format.md requires the full 5-digit year in the core format,
/// so GHS timestamps sort lexicographically and round-trip through the string
/// parser. The sign is handled separately: padLeft on "-101" would yield
/// "0-101".
String formatEra(int yearHE) {
  final sign = yearHE < 0 ? '-' : '';
  return '$sign${yearHE.abs().toString().padLeft(5, '0')}';
}

/// Returns true if [yearHE] is an Aurora Year (53-week leap year).
///
/// Formula: (71 × Y + 286) mod 400 < 71
///
/// Dart's `%` is already euclidean (always non-negative for a positive
/// divisor), so this stays correct for eras <= 0. The TypeScript core needs an
/// explicit `((x % 400) + 400) % 400` because JavaScript's `%` truncates.
bool isAuroraYear(int yearHE) {
  assertEra(yearHE);
  return (71 * yearHE + epsilon) % 400 < 71;
}

/// Returns the number of days in a GHS year: 364 (normal) or 371 (Aurora).
int getDaysInYear(int yearHE) {
  return isAuroraYear(yearHE) ? 371 : _daysPerNormalYear;
}

int _leapsThrough(int y) => ((71 * y + epsilon) / cycleYears).floor();

int _computeYearStartMs(int yearHE) {
  final auroraYears = _leapsThrough(yearHE - 1) - _leapsThrough(epochYearHe - 1);
  return epochMs +
      ((yearHE - epochYearHe) * _daysPerNormalYear + auroraYears * 7) * _dayMs;
}

/// Returns the UTC timestamp (ms) of 00:00 on day 1 of GHS year [yearHE].
int getYearStartMs(int yearHE) {
  assertEra(yearHE);
  return _computeYearStartMs(yearHE);
}

/// Resolves the GHS year containing [ms] and that year's start timestamp.
({int yearHE, int yearStartMs}) _resolveYear(int ms) {
  final days = ((ms - epochMs) / _dayMs).floor();
  var yearHE = epochYearHe + ((days * cycleYears) / cycleDays).floor();
  while (_computeYearStartMs(yearHE) > ms) {
    yearHE--;
  }
  while (_computeYearStartMs(yearHE + 1) <= ms) {
    yearHE++;
  }
  return (yearHE: yearHE, yearStartMs: _computeYearStartMs(yearHE));
}

/// Immutable result object for a converted GHS date.
class GhsDateResult {
  /// Human Era year, e.g. 12026
  final int era;

  /// GHS month number 1–13, or null during the Aurora Week
  final int? month;

  /// Full month name, or "Aurora" during the Aurora Week
  final String monthName;

  /// Day of the month (1–28) or day within the Aurora Week (1–7)
  final int day;

  /// Day of the year, 1-based (1–364, Aurora Week: 365–371)
  final int dayOfYear;

  /// Week of the year (1–52), or null during the Aurora Week
  final int? weekOfYear;

  /// Financial quarter (1–4), or null during the Aurora Week
  final int? quarter;

  /// GHS weekday name
  final String weekday;

  /// True when the date falls in the Aurora Week
  final bool isAuroraWeek;

  /// True when the current GHS year is an Aurora Year
  final bool isAuroraYearFlag;

  /// Whole-beat value, e.g. "@045"
  final String beats;

  /// Centibeat-precision value, e.g. "@045.23"
  final String beatsLong;

  /// Centibeat-precision numeric beat value in [0, 999.99], e.g. 45.23
  final double beatsExact;

  /// ISO-style compact notation, e.g. "12026.01.15" or "12026.A.03"
  final String fullDate;

  const GhsDateResult({
    required this.era,
    required this.month,
    required this.monthName,
    required this.day,
    required this.dayOfYear,
    required this.weekOfYear,
    required this.quarter,
    required this.weekday,
    required this.isAuroraWeek,
    required this.isAuroraYearFlag,
    required this.beats,
    required this.beatsLong,
    required this.beatsExact,
    required this.fullDate,
  });
}

/// Converts a [DateTime] (defaults to now) to a [GhsDateResult].
///
/// All calculations use UTC so the result is timezone-independent. Year
/// starts derive from the epoch by chaining 364/371-day year lengths, so
/// the day ↔ GHS-date mapping is bijective.
GhsDateResult getGhsDate([DateTime? inputDate]) {
  final date = (inputDate ?? DateTime.now()).toUtc();
  final ms = date.millisecondsSinceEpoch;
  final resolved = _resolveYear(ms);
  final yearHE = resolved.yearHE;

  // Whole days elapsed since the start of this GHS year (0-indexed).
  final dayIndex = ((ms - resolved.yearStartMs) / _dayMs).floor();

  final aurora = isAuroraYear(yearHE);
  final auroraWeek = aurora && dayIndex >= _daysPerNormalYear;
  final monthIndex = auroraWeek ? -1 : dayIndex ~/ 28;
  final dayOfMonth =
      auroraWeek ? dayIndex - _daysPerNormalYear + 1 : (dayIndex % 28) + 1;
  final weekday = weekdaysGhs[dayIndex % 7];

  // Weeks and quarters (spec §4); the Aurora Week sits outside both.
  final weekOfYear = auroraWeek ? null : dayIndex ~/ 7 + 1;
  final quarter = weekOfYear == null ? null : (weekOfYear - 1) ~/ 13 + 1;

  // @Beats — 1 beat = 86,400 ms (86.4 SI seconds), 1 centibeat = 864 ms.
  // [msInDay] is always an integer in [0, 86_399_999], so this is exact integer
  // math. Truncating (never rounding) keeps the display from showing a beat
  // that has not happened yet, and makes beats and beatsLong agree by
  // construction.
  final msInDay = ms - resolved.yearStartMs - dayIndex * _dayMs;
  final wholeBeats = msInDay ~/ 86400; // 0–999
  final centibeats = msInDay ~/ 864; // 0–99,999
  final beatsStr = wholeBeats.toString().padLeft(3, '0');

  final month = auroraWeek ? null : monthIndex + 1;
  final monthName = auroraWeek ? 'Aurora' : monthNamesGhs[monthIndex];
  final monthStr = auroraWeek ? 'A' : month.toString().padLeft(2, '0');
  final dayStr = dayOfMonth.toString().padLeft(2, '0');

  final beatsFormatted = '@$beatsStr';
  final beatsLong = '@$beatsStr.${(centibeats % 100).toString().padLeft(2, '0')}';

  return GhsDateResult(
    era: yearHE,
    month: month,
    monthName: monthName,
    day: dayOfMonth,
    dayOfYear: dayIndex + 1,
    weekOfYear: weekOfYear,
    quarter: quarter,
    weekday: weekday,
    isAuroraWeek: auroraWeek,
    isAuroraYearFlag: aurora,
    beats: beatsFormatted,
    beatsLong: beatsLong,
    beatsExact: centibeats / 100.0,
    fullDate: '${formatEra(yearHE)}.$monthStr.$dayStr',
  );
}

/// Computes the approximate @Beat (0–999) of local solar noon for a given
/// [longitude] in degrees east of Greenwich (`[-180, 360]`).
int getSolarNoonBeat(num longitude) {
  if (!longitude.isFinite || longitude < -180 || longitude > 360) {
    throw RangeError(
        'Invalid longitude: $longitude. Must be in the range [-180, 360].');
  }
  final raw = (((500 - (longitude / 360) * 1000) % 1000) + 1000) % 1000;
  return raw.round() % 1000;
}

/// Converts a GHS date back to a UTC [DateTime].
///
/// [era]   — Human Era year, e.g. 12026
/// [month] — GHS month 1–13, or null for the Aurora Week
/// [day]   — Day of month (1–28) or Aurora day (1–7)
/// [beats] — Optional decimal @Beats (0 ≤ beats < 1000). Default: 0
///
/// Throws [RangeError] when a component is out of range or the Aurora Week
/// is requested in a year that is not an Aurora Year.
DateTime parseGhsDate(int era, int? month, int day, [double beats = 0]) {
  assertEra(era);
  if (beats < 0 || beats >= 1000 || !beats.isFinite) {
    throw RangeError('Invalid beats: $beats. Must be in the range [0, 1000).');
  }

  int dayOffset;
  if (month == null) {
    if (!isAuroraYear(era)) {
      throw RangeError(
          '$era HE is not an Aurora Year — it has no Aurora Week (A.1–A.7).');
    }
    if (day < 1 || day > 7) {
      throw RangeError('Invalid Aurora day: $day. Must be 1–7.');
    }
    dayOffset = _daysPerNormalYear + (day - 1);
  } else {
    if (month < 1 || month > 13) {
      throw RangeError('Invalid month: $month. Must be 1–13 or null (Aurora).');
    }
    if (day < 1 || day > 28) {
      throw RangeError('Invalid day: $day. Must be 1–28.');
    }
    dayOffset = (month - 1) * 28 + (day - 1);
  }

  // 1 beat = 86.4 seconds = 86,400 ms; clamp at _dayMs - 1 so beats near 1000
  // never roll over into the next day.
  final rawMs = (beats * 86400).round();
  final msOffset = rawMs < _dayMs ? rawMs : _dayMs - 1;

  return DateTime.fromMillisecondsSinceEpoch(
    getYearStartMs(era) + dayOffset * _dayMs + msOffset,
    isUtc: true,
  );
}

/// Components extracted from a GHS timestamp string, plus the resolved UTC [DateTime].
class ParsedGhsDate {
  final int era;
  final int? month;
  final int day;
  final double beats;
  final DateTime date;

  const ParsedGhsDate({
    required this.era,
    required this.month,
    required this.day,
    required this.beats,
    required this.date,
  });
}

final RegExp _ghsStringRe = RegExp(
  r'^(?:GHS\s+)?(\d{5})\.(A|\d{2})\.(\d{2})(?:\s*@(\d{1,3}(?:\.\d{1,2})?))?$',
  caseSensitive: false,
);

/// Parses a GHS timestamp string (`YYYYY.MM.DD` or `YYYYY.A.DD`, optionally
/// prefixed with `GHS ` and optionally followed by `[@BBB]` beats).
///
/// Returns `null` when [input] is not shaped like a GHS timestamp.
/// Throws [RangeError] when [input] is GHS-shaped but a component is out of range.
ParsedGhsDate? parseGhsString(String input) {
  final match = _ghsStringRe.firstMatch(input.trim());
  if (match == null) return null;

  final era = int.parse(match.group(1)!);
  final monthStr = match.group(2)!.toUpperCase();
  final int? month = monthStr == 'A' ? null : int.parse(monthStr);
  final day = int.parse(match.group(3)!);
  final beatsStr = match.group(4);
  final beats = beatsStr == null ? 0.0 : double.parse(beatsStr);

  return ParsedGhsDate(
    era: era,
    month: month,
    day: day,
    beats: beats,
    date: parseGhsDate(era, month, day, beats),
  );
}

/// Parses raw text-field components (`era`, `month` as `1`–`13` or `A`, `day`,
/// and optional `beats`) into a UTC [DateTime].
DateTime parseGhsComponents({
  required String era,
  required String month,
  required String day,
  String beats = '0',
}) {
  final parsedEra = int.parse(era.trim());
  final monthRaw = month.trim().toUpperCase();
  final int? parsedMonth = monthRaw == 'A' ? null : int.parse(monthRaw);
  final parsedDay = int.parse(day.trim());
  final beatsRaw = beats.trim();
  final parsedBeats = beatsRaw.isEmpty ? 0.0 : double.parse(beatsRaw);
  return parseGhsDate(parsedEra, parsedMonth, parsedDay, parsedBeats);
}

/// Available output formats for [formatGhs].
enum GhsFormat { core, ui, text, short }

/// Formats a [GhsDateResult] into an official human-readable string.
///
/// | Format | Example              | Use           |
/// |--------|----------------------|---------------|
/// | core   | 12026.01.15 @685     | Logs/machines |
/// | ui     | 15 Mar 12026 @685    | Dashboards    |
/// | text   | 15 March 12026       | Formal        |
/// | short  | 15 Mar '26           | Everyday      |
String formatGhs(GhsDateResult ghs, [GhsFormat format = GhsFormat.core]) {
  // Pad first: substring(len - 2) throws for single-digit eras, and "'1" would
  // be wrong anyway.
  final eraStr = formatEra(ghs.era);
  final shortYear = eraStr.substring(eraStr.length - 2);
  final shortMonth = ghs.isAuroraWeek ? 'Aur' : ghs.monthName.substring(0, 3);

  switch (format) {
    case GhsFormat.core:
      return '${ghs.fullDate} ${ghs.beats}';
    case GhsFormat.ui:
      return ghs.isAuroraWeek
          ? 'A${ghs.day} $shortMonth ${ghs.era} ${ghs.beats}'
          : '${ghs.day} $shortMonth ${ghs.era} ${ghs.beats}';
    case GhsFormat.text:
      return ghs.isAuroraWeek
          ? 'Aurora ${ghs.day}, ${ghs.era}'
          : '${ghs.day} ${ghs.monthName} ${ghs.era}';
    case GhsFormat.short:
      return ghs.isAuroraWeek
          ? "A${ghs.day} '$shortYear"
          : "${ghs.day} $shortMonth '$shortYear";
  }
}
