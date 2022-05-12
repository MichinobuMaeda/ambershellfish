import 'package:flutter/material.dart';
import 'package:flutter_markdown/flutter_markdown.dart';
import 'dart:math';

const Color colorSchemeSeed = Colors.amber;

Color stripedPattern(int index) =>
    index.isEven ? Colors.black12 : Colors.white10;

const double baseWidth = 960.0;
const fontFamilySansSerif = 'NotoSansJP';
const fontFamilyMonoSpace = 'RobotoMono';

const buttonMinimumSize = Size(baseWidth / 8, baseWidth / 20);

const AssetImage assetLogo = AssetImage('images/logo.png');

double spacing(BuildContext context) =>
    baseWidth / (isMobile(context) ? 120 : 60);

bool isMobile(BuildContext context) =>
    MediaQuery.of(context).size.width < baseWidth / 2;

double horizontalPadding(BuildContext context, double width) => max(
      (MediaQuery.of(context).size.width - width) / 2,
      spacing(context),
    );

EdgeInsets paddingNarrow(BuildContext context) => EdgeInsets.symmetric(
      vertical: spacing(context),
      horizontal: horizontalPadding(context, baseWidth / 4 * 3),
    );

EdgeInsets paddingMiddle(BuildContext context) => EdgeInsets.symmetric(
      vertical: spacing(context),
      horizontal: horizontalPadding(context, baseWidth),
    );

EdgeInsets paddingWide(BuildContext context) => EdgeInsets.symmetric(
      vertical: spacing(context),
      horizontal: spacing(context),
    );

// const fieldWidth = 480.0;

// Color listOddEvenItemColor(BuildContext context) =>
//     Theme.of(context).colorScheme.shadow.withOpacity(1 / 20);

List<ThemeMode> supportedThemeModes = [
  ThemeMode.system,
  ThemeMode.light,
  ThemeMode.dark,
];

final buttonStyle = ButtonStyle(
  minimumSize: MaterialStateProperty.all<Size>(buttonMinimumSize),
);

SnackBarThemeData snackBarTheme(BuildContext context) => SnackBarThemeData(
      contentTextStyle: TextStyle(
        fontFamily: fontFamilySansSerif,
        fontSize: Theme.of(context).textTheme.bodyMedium?.fontSize,
      ),
    );

MarkdownStyleSheet markdownStyleSheet(BuildContext context) =>
    MarkdownStyleSheet(
      h1: Theme.of(context).textTheme.headlineLarge,
      h2: Theme.of(context).textTheme.headlineMedium,
      h3: Theme.of(context).textTheme.headlineSmall,
      h4: Theme.of(context).textTheme.titleLarge,
      h5: Theme.of(context).textTheme.titleMedium,
      h6: Theme.of(context).textTheme.bodyLarge,
      p: Theme.of(context).textTheme.bodyMedium,
      code: Theme.of(context).textTheme.bodyMedium?.copyWith(
            height: 1.2,
            fontFamily: fontFamilyMonoSpace,
            color: Theme.of(context).colorScheme.secondary,
          ),
    );
