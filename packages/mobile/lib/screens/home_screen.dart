import 'dart:async';
import 'package:flutter/material.dart';
import '../core/ghs_converter.dart';

/// Displays the current GHS date and time, updating every second.
class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  late GhsDateResult _ghs;
  late Timer _timer;

  @override
  void initState() {
    super.initState();
    _ghs = getGhsDate();
    _timer = Timer.periodic(const Duration(seconds: 1), (_) {
      setState(() => _ghs = getGhsDate());
    });
  }

  @override
  void dispose() {
    _timer.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;

    return Scaffold(
      body: SafeArea(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.all(32),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Era + Month + Day
                Text(
                  _ghs.fullDate,
                  style: textTheme.displaySmall?.copyWith(
                    color: colors.primary,
                    fontFeatures: const [FontFeature.tabularFigures()],
                    letterSpacing: 2,
                  ),
                ),
                const SizedBox(height: 8),

                // Month name + weekday
                Text(
                  '${_ghs.weekday}, ${_ghs.monthName} ${_ghs.day}, ${_ghs.era}',
                  style: textTheme.titleMedium?.copyWith(
                    color: colors.onSurfaceVariant,
                  ),
                  textAlign: TextAlign.center,
                ),

                const SizedBox(height: 40),

                // @Beats — large display
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
                  decoration: BoxDecoration(
                    color: colors.primaryContainer,
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Text(
                    _ghs.beatsLong,
                    style: textTheme.displayMedium?.copyWith(
                      color: colors.onPrimaryContainer,
                      fontFeatures: const [FontFeature.tabularFigures()],
                    ),
                  ),
                ),

                const SizedBox(height: 16),

                if (_ghs.isAuroraWeek)
                  Chip(
                    label: const Text('Aurora Week'),
                    backgroundColor: colors.tertiaryContainer,
                    labelStyle: TextStyle(color: colors.onTertiaryContainer),
                  ),

                if (_ghs.isAuroraYearFlag && !_ghs.isAuroraWeek)
                  Chip(
                    label: const Text('Aurora Year'),
                    backgroundColor: colors.secondaryContainer,
                    labelStyle: TextStyle(color: colors.onSecondaryContainer),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
