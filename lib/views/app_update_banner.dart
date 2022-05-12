import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../config/l10n.dart';
import '../blocs/platform_bloc.dart';

class AppUpdateBanner extends StatelessWidget {
  const AppUpdateBanner({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final Color colorError = Theme.of(context).colorScheme.error;
    final Color colorOnError = Theme.of(context).colorScheme.onError;

    return SliverToBoxAdapter(
      child: SizedBox(
        height: 54,
        child: MaterialBanner(
          content: Text(
            L10n.of(context)!.updateApp,
            style: TextStyle(color: colorOnError),
          ),
          actions: [
            ElevatedButton(
              onPressed: () => context.read<PlatformBloc>().add(AppReloaded()),
              child: Text(L10n.of(context)!.update),
              style: ButtonStyle(
                backgroundColor: MaterialStateProperty.all<Color>(colorOnError),
                foregroundColor: MaterialStateProperty.all<Color>(colorError),
              ),
            ),
          ],
          backgroundColor: colorError,
        ),
      ),
    );
  }
}
