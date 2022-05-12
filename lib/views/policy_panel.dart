import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_markdown/flutter_markdown.dart';
import 'package:url_launcher/url_launcher.dart';

import '../blocs/conf_bloc.dart';
import '../config/theme.dart';

class PolicyPanel extends StatelessWidget {
  const PolicyPanel({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SliverPadding(
      padding: paddingNarrow(context),
      sliver: SliverToBoxAdapter(
        child: MarkdownBody(
          data: context.watch<ConfBloc>().state?.policy ?? '',
          selectable: true,
          styleSheet: markdownStyleSheet(context),
          onTapLink: (String text, String? href, String title) {
            if (href != null) launchUrl(Uri.parse(href));
          },
        ),
      ),
    );
  }
}
