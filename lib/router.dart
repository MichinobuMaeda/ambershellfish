import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'blocs/user_bloc.dart';
import 'config/l10n.dart';
import 'views/layout.dart';

const String routeLoading = '/loading';
const String routeSignin = '/signin';
const String routeHome = '/';
const String routeAdmin = '/admin';
const String routePrefs = '/prefs';
const String routeInfo = '/info';

List<String> authorizedRoutes(UserState userState) {
  if (userState.confReceived && userState.authStateChecked) {
    if (userState.authUser == null || userState.me == null) {
      return [
        routeSignin,
        routeInfo,
      ];
    } else {
      return [
        routeHome,
        routePrefs,
        if (userState.me!.admin) routeAdmin,
        routeInfo,
      ];
    }
  } else {
    return [
      routeLoading,
      routeInfo,
    ];
  }
}

class PageItem {
  final Icon icon;
  final String label;

  const PageItem({
    required this.icon,
    required this.label,
  });
}

PageItem getPage(BuildContext context, String route) {
  const PageItem errorPage = PageItem(
    icon: Icon(Icons.error),
    label: 'Error',
  );

  try {
    switch (route) {
      case routeLoading:
        return PageItem(
          icon: const Icon(Icons.autorenew),
          label: L10n.of(context)!.connecting,
        );
      case routeSignin:
        return PageItem(
          icon: const Icon(Icons.login),
          label: L10n.of(context)!.signIn,
        );
      case routeHome:
        return PageItem(
          icon: const Icon(Icons.home),
          label: L10n.of(context)!.home,
        );
      case routeAdmin:
        return PageItem(
          icon: const Icon(Icons.handyman),
          label: L10n.of(context)!.admin,
        );
      case routePrefs:
        return PageItem(
          icon: const Icon(Icons.settings),
          label: L10n.of(context)!.settings,
        );
      case routeInfo:
        return PageItem(
          icon: const Icon(Icons.info),
          label: L10n.of(context)!.aboutApp,
        );
      default:
        return errorPage;
    }
  } catch (e) {
    return errorPage;
  }
}

final List<GoRoute> routes = [
  GoRoute(
    path: routeLoading,
    pageBuilder: (context, state) => const NoTransitionPage<void>(
      child: Layout(title: 'Amber Shellfish'),
    ),
  ),
  GoRoute(
    path: routeSignin,
    pageBuilder: (context, state) => const NoTransitionPage<void>(
      child: Layout(title: 'Amber Shellfish'),
    ),
  ),
  GoRoute(
    path: routeHome,
    pageBuilder: (context, state) => const NoTransitionPage<void>(
      child: Layout(title: 'Amber Shellfish'),
    ),
  ),
  GoRoute(
    path: routeAdmin,
    pageBuilder: (context, state) => const NoTransitionPage<void>(
      child: Layout(title: 'Amber Shellfish'),
    ),
  ),
  GoRoute(
    path: routePrefs,
    pageBuilder: (context, state) => const NoTransitionPage<void>(
      child: Layout(title: 'Amber Shellfish'),
    ),
  ),
  GoRoute(
    path: routeInfo,
    pageBuilder: (context, state) => const NoTransitionPage<void>(
      child: Layout(title: 'Amber Shellfish'),
    ),
  ),
];

Widget routeErrorBuilder(BuildContext context, GoRouterState state) =>
    const Layout(title: 'Amber Shellfish');

String? Function(GoRouterState) guard(UserBloc userBloc) =>
    (GoRouterState state) {
      final List<String> activeRoutes = authorizedRoutes(userBloc.state);
      if (!activeRoutes.contains(state.subloc)) {
        return activeRoutes[0];
      }
      return null;
    };
