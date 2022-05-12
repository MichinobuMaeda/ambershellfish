import 'package:ambershellfish/config/theme.dart';
import 'package:flutter/material.dart';

import '../config/app_info.dart';
import '../config/l10n.dart';

class AboutAppPanel extends StatelessWidget {
  const AboutAppPanel({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SliverPadding(
      padding: paddingNarrow(context),
      sliver: SliverToBoxAdapter(
        child: OutlinedButton.icon(
          onPressed: () {
            showAboutDialog(
              context: context,
              applicationIcon: const Image(
                image: assetLogo,
                width: baseWidth / 20,
                height: baseWidth / 20,
              ),
              applicationName: appName,
              applicationVersion: version,
              applicationLegalese: copyright,
            );
          },
          icon: const Icon(Icons.copyright),
          label: Text(L10n.of(context)!.copyrightAndLicenses),
        ),
      ),
    );
  }
}
