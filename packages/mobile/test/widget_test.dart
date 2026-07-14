import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:ghs_mobile/main.dart';

void main() {
  testWidgets('GhsApp renders the app shell', (WidgetTester tester) async {
    await tester.pumpWidget(const GhsApp());

    expect(find.byType(MaterialApp), findsOneWidget);
    expect(find.byType(NavigationBar), findsOneWidget);

    // Unmount so the home screen's live-clock timer is disposed before the
    // test ends (pending timers fail the test otherwise).
    await tester.pumpWidget(const SizedBox());
  });
}
