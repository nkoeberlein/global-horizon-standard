/// GHS - Global Horizon Standard Converter (Dart port)
///
/// Converts Gregorian dates to the GHS calendar system:
/// - Era:      Human Era (HE) — Gregorian year + 10,000
/// - Calendar: 13 months × 28 days = 364 days/year
/// - Time:     @Beats (decimal time, 1 day = 1,000 beats, anchored to UTC)
/// - Leap:     Aurora Week — 71 full weeks inserted per 400-year cycle
/// - Epoch:    10001.01.01 = 21 March 1 CE (proleptic Gregorian, UTC)
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

/// GHS year 10001 HE (= 1 CE) begins on 21 March of year 1, 00:00 UTC.
/// All other year starts derive from this single calibration point by
/// chaining year lengths (364/371). Year starts drift within 16–24 March,
/// centered on the spring equinox; e.g. 12026.01.01 = 2026-03-18.
const int epochYearHe = 10001;
final int epochMs = DateTime.utc(1, 3, 21).millisecondsSinceEpoch;

/// Years per leap cycle.
const int cycleYears = 400;

/// Days per 400-year cycle: 400 × 364 + 71 × 7 = 146,097 (matches Gregorian).
const int cycleDays = 146097;

/// Returns true if [yearHE] is an Aurora Year (53-week leap year).
///
/// Formula: (71 × Y + 156) mod 400 < 71
bool isAuroraYear(int yearHE) {
  return (71 * yearHE + 156) % 400 < 71;
}

/// Returns the number of days in a GHS year: 364 (normal) or 371 (Aurora).
int getDaysInYear(int yearHE) {
  return isAuroraYear(yearHE) ? 371 : _daysPerNormalYear;
}

/// Returns the UTC timestamp (ms) of 00:00 on day 1 of GHS year [yearHE].
int getYearStartMs(int yearHE) {
  final cycles = ((yearHE - epochYearHe) / cycleYears).floor();
  var ms = epochMs + cycles * cycleDays * _dayMs;
  for (var y = epochYearHe + cycles * cycleYears; y < yearHE; y++) {
    ms += getDaysInYear(y) * _dayMs;
  }
  return ms;
}

/// Resolves the GHS year containing [ms] and that year's start timestamp.
({int yearHE, int yearStartMs}) _resolveYear(int ms) {
  final daysSinceEpoch = ((ms - epochMs) / _dayMs).floor();
  final cycles = (daysSinceEpoch / cycleDays).floor();
  var yearHE = epochYearHe + cycles * cycleYears;
  var yearStartMs = epochMs + cycles * cycleDays * _dayMs;

  while (true) {
    final yearLengthMs = getDaysInYear(yearHE) * _dayMs;
    if (ms < yearStartMs + yearLengthMs) {
      return (yearHE: yearHE, yearStartMs: yearStartMs);
    }
    yearStartMs += yearLengthMs;
    yearHE++;
  }
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

  // @Beats — ms within the day / 86,400 (1 beat = 86.4 SI seconds).
  // Clamp to [0, 999.99] to prevent floating-point rounding to "@1000.00".
  final msInDay = ms - resolved.yearStartMs - dayIndex * _dayMs;
  final beatsValue = (msInDay / 86400).clamp(0.0, 999.99);

  final month = auroraWeek ? null : monthIndex + 1;
  final monthName = auroraWeek ? 'Aurora' : monthNamesGhs[monthIndex];
  final monthStr = auroraWeek ? 'A' : month.toString().padLeft(2, '0');
  final dayStr = dayOfMonth.toString().padLeft(2, '0');

  final beatsFormatted = '@${beatsValue.floor().toString().padLeft(3, '0')}';
  final beatsLong = '@${beatsValue.toStringAsFixed(2).padLeft(6, '0')}';

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
    fullDate: '$yearHE.$monthStr.$dayStr',
  );
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

  // 1 beat = 86.4 seconds = 86,400 ms
  final msOffset = (beats * 86400).round();

  return DateTime.fromMillisecondsSinceEpoch(
    getYearStartMs(era) + dayOffset * _dayMs + msOffset,
    isUtc: true,
  );
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
  final shortYear = ghs.era.toString().substring(ghs.era.toString().length - 2);
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
