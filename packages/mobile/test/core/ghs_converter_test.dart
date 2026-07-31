import 'package:ghs_mobile/core/ghs_converter.dart';
import 'package:test/test.dart';

void main() {
  group('isAuroraYear', () {
    // Verified against TypeScript reference: packages/core/src
    // Aurora years near 12026: 12015, 12021, 12026, 12032
    test('known Aurora years return true', () {
      expect(isAuroraYear(12026), isTrue);
      expect(isAuroraYear(12021), isTrue);
      expect(isAuroraYear(12015), isTrue);
    });

    test('non-Aurora years return false', () {
      expect(isAuroraYear(12025), isFalse);
      expect(isAuroraYear(12020), isFalse);
      expect(isAuroraYear(12022), isFalse);
    });

    // Dart's `%` is euclidean, so negative eras are already handled. The
    // TypeScript core needed an explicit fix here (JS `%` truncates); this
    // test pins the behaviour so the two ports cannot drift apart again.
    test('negative eras use a non-negative modulo', () {
      for (var y = -2000; y <= 2000; y++) {
        final euclidean = (((71 * y + 156) % 400) + 400) % 400 < 71;
        expect(isAuroraYear(y), euclidean, reason: 'era $y');
      }
      expect(isAuroraYear(-1000), isFalse);
    });

    test('era is padded to five digits in fullDate', () {
      expect(getGhsDate(DateTime.utc(2026, 6, 15)).fullDate, startsWith('12026.'));
      expect(formatEra(12026), '12026');
      expect(formatEra(9999), '09999');
      expect(formatEra(500), '00500');
      expect(formatEra(1), '00001');
      // padLeft alone would produce "0-101".
      expect(formatEra(-101), '-00101');
    });

    test('short format does not throw for single-digit eras', () {
      final ghs = getGhsDate(parseGhsDate(1, 1, 15));
      expect(ghs.fullDate, '00001.01.15');
      expect(formatGhs(ghs, GhsFormat.short), "15 Mar '01");
    });

    test('400 consecutive years hold 71 Aurora Years, negative windows too', () {
      for (final windowStart in [-1200, -400, -3, 0, 500, 12000]) {
        var days = 0;
        for (var y = windowStart; y < windowStart + 400; y++) {
          days += getDaysInYear(y);
        }
        expect(days, cycleDays, reason: 'window $windowStart');
      }
    });
  });

  group('epoch calibration', () {
    test('10001.01.01 = 21 March 1 CE UTC', () {
      expect(DateTime.fromMillisecondsSinceEpoch(epochMs, isUtc: true),
          DateTime.utc(1, 3, 21));
      expect(getYearStartMs(epochYearHe), epochMs);
    });

    // Reference values from the TypeScript implementation (packages/core)
    test('modern-era year starts match the TypeScript reference', () {
      expect(getYearStartMs(12025),
          DateTime.utc(2025, 3, 19).millisecondsSinceEpoch);
      expect(getYearStartMs(12026),
          DateTime.utc(2026, 3, 18).millisecondsSinceEpoch);
      expect(getYearStartMs(12027),
          DateTime.utc(2027, 3, 24).millisecondsSinceEpoch);
    });

    test('any 400 consecutive years sum to 146,097 days', () {
      var days = 0;
      for (var y = 12000; y < 12400; y++) {
        days += getDaysInYear(y);
      }
      expect(days, cycleDays);
    });
  });

  group('getGhsDate — standard date', () {
    // Reference: node -e "getGHSDate(new Date('2026-04-16T00:00:00Z'))"
    // → 12026.02.02 (April, day 2)
    test('2026-04-16 UTC midnight converts correctly', () {
      final ghs = getGhsDate(DateTime.utc(2026, 4, 16));

      expect(ghs.era, 12026);
      expect(ghs.month, 2);
      expect(ghs.monthName, 'April');
      expect(ghs.day, 2);
      expect(ghs.beats, '@000');
      expect(ghs.isAuroraWeek, isFalse);
      expect(ghs.isAuroraYearFlag, isTrue); // 12026 is an Aurora year
    });

    test('GHS year start: 2026-03-18 = month 1, day 1', () {
      final ghs = getGhsDate(DateTime.utc(2026, 3, 18));

      expect(ghs.era, 12026);
      expect(ghs.month, 1);
      expect(ghs.monthName, 'March');
      expect(ghs.day, 1);
      expect(ghs.dayOfYear, 1);
      expect(ghs.weekOfYear, 1);
      expect(ghs.quarter, 1);
    });

    test('the moment before belongs to the previous GHS year (Luna 28)', () {
      final ghs = getGhsDate(DateTime.utc(2026, 3, 17, 23, 59, 59));

      expect(ghs.era, 12025);
      expect(ghs.month, 13);
      expect(ghs.monthName, 'Luna');
      expect(ghs.day, 28);
    });

    test('consecutive days map to distinct GHS dates (bijectivity)', () {
      // 12025 is a normal year: the day after Luna 28 is New Year — no
      // duplicated dates (the old fixed-anchor clamping bug).
      final luna28 = getGhsDate(DateTime.utc(2026, 3, 17));
      final newYear = getGhsDate(DateTime.utc(2026, 3, 18));
      expect(luna28.fullDate, '12025.13.28');
      expect(newYear.fullDate, '12026.01.01');
    });
  });

  group('getGhsDate — @Beats', () {
    // The ms-based calculation is exact: 43,200,000 ms / 86,400 = 500.0
    // (the old seconds/86.4 float path yielded 499.999… → @499).
    test('noon UTC = @500', () {
      final ghs = getGhsDate(DateTime.utc(2026, 4, 16, 12));
      expect(ghs.beats, '@500');
    });

    test('midnight UTC = @000', () {
      final ghs = getGhsDate(DateTime.utc(2026, 4, 16));
      expect(ghs.beats, '@000');
    });

    test('23:59:59.999 UTC does not overflow to @1000', () {
      final ghs = getGhsDate(DateTime.utc(2026, 4, 16, 23, 59, 59, 999));
      expect(ghs.beats, isNot('@1000'));
      expect(ghs.beats, '@999');
      expect(ghs.beatsLong, '@999.99');
    });

    test('truncates rather than rounds', () {
      // 172,481 ms into the day = 1.9963 beats. Rounding would show @002.00.
      final ghs = getGhsDate(
          DateTime.utc(2026, 4, 16).add(const Duration(milliseconds: 172481)));
      expect(ghs.beats, '@001');
      expect(ghs.beatsLong, '@001.99');
    });

    test('beats and beatsLong agree across a full day', () {
      final dayStart = DateTime.utc(2026, 4, 16);
      for (var msInDay = 0; msInDay < 86400000; msInDay += 997) {
        final ghs = getGhsDate(dayStart.add(Duration(milliseconds: msInDay)));
        expect(ghs.beatsLong.substring(0, 4), ghs.beats, reason: 'ms $msInDay');
      }
    });
  });

  group('getGhsDate — Aurora Week', () {
    // 12026 is an Aurora Year with 371 days; its Aurora Week spans
    // 2027-03-17 (A.1) through 2027-03-23 (A.7). 12027 begins 2027-03-24.
    test('Aurora Week day 1 (2027-03-17) is detected in GHS 12026', () {
      final ghs = getGhsDate(DateTime.utc(2027, 3, 17));

      expect(ghs.era, 12026);
      expect(ghs.isAuroraWeek, isTrue);
      expect(ghs.month, isNull);
      expect(ghs.monthName, 'Aurora');
      expect(ghs.day, 1);
      expect(ghs.weekOfYear, isNull);
      expect(ghs.quarter, isNull);
    });

    test('all seven Aurora days are reachable', () {
      for (var i = 0; i < 7; i++) {
        final ghs = getGhsDate(DateTime.utc(2027, 3, 17 + i));
        expect(ghs.isAuroraWeek, isTrue);
        expect(ghs.day, i + 1);
      }
      expect(getGhsDate(DateTime.utc(2027, 3, 24)).fullDate, '12027.01.01');
    });

    test('non-Aurora years contain no Aurora dates', () {
      final start = DateTime.utc(2025, 3, 19); // 12025.01.01
      for (var i = 0; i < getDaysInYear(12025); i++) {
        final ghs = getGhsDate(start.add(Duration(days: i)));
        expect(ghs.isAuroraWeek, isFalse);
        expect(ghs.era, 12025);
      }
    });
  });

  group('parseGhsDate — round-trip', () {
    test('round-trip: Gregorian → GHS → Gregorian', () {
      final original = DateTime.utc(2026, 6, 15, 12);
      final ghs = getGhsDate(original);
      final beatsNum = double.parse(ghs.beatsLong.substring(1));
      final restored = parseGhsDate(ghs.era, ghs.month, ghs.day, beatsNum);

      expect(restored.millisecondsSinceEpoch,
          closeTo(original.millisecondsSinceEpoch, 1000));
    });

    test('parseGhsDate: every Aurora day round-trips exactly', () {
      for (var day = 1; day <= 7; day++) {
        final date = parseGhsDate(12026, null, day);
        final ghs = getGhsDate(date);
        expect(ghs.era, 12026);
        expect(ghs.isAuroraWeek, isTrue);
        expect(ghs.day, day);
      }
    });

    test('throws RangeError for invalid components', () {
      expect(() => parseGhsDate(12026, 14, 1), throwsRangeError);
      expect(() => parseGhsDate(12026, 1, 29), throwsRangeError);
      expect(() => parseGhsDate(12026, null, 8), throwsRangeError);
      expect(() => parseGhsDate(12025, null, 1), throwsRangeError); // no Aurora
      expect(() => parseGhsDate(12026, 1, 1, 1000), throwsRangeError);
    });
  });

  group('formatGhs', () {
    late GhsDateResult aprilSample;
    late GhsDateResult marchSample;

    setUp(() {
      aprilSample = getGhsDate(DateTime.utc(2026, 4, 18, 17, 16)); // GHS April
      marchSample = getGhsDate(DateTime.utc(2026, 3, 25, 17, 16)); // GHS March
    });

    test('core format contains fullDate and beats', () {
      expect(formatGhs(marchSample, GhsFormat.core), startsWith('12026.01.'));
      expect(formatGhs(marchSample, GhsFormat.core), contains('@'));
    });

    test('ui format for April date contains Apr', () {
      final result = formatGhs(aprilSample, GhsFormat.ui);
      expect(result, contains('Apr'));
      expect(result, contains('12026'));
      expect(result, contains('@'));
    });

    test('text format omits beats, shows full month name', () {
      final result = formatGhs(aprilSample, GhsFormat.text);
      expect(result, isNot(contains('@')));
      expect(result, contains('April'));
    });

    test('short format uses 2-digit year', () {
      final result = formatGhs(marchSample, GhsFormat.short);
      expect(result, contains("'26"));
    });
  });
}
